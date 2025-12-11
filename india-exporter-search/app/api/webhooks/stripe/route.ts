import { NextRequest, NextResponse } from 'next/server'
import { stripe, handleWebhookEvent } from '@/lib/stripe'
import prisma from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    // Handle the event
    const result = await handleWebhookEvent(event)

    switch (result.type) {
      case 'checkout.completed':
        const session = result.session as Stripe.Checkout.Session
        const userId = session.metadata?.userId || session.client_reference_id

        if (!userId) {
          console.error('No user ID found in checkout session')
          break
        }

        if (session.mode === 'subscription') {
          // Handle subscription purchase
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionStatus: 'ACTIVE',
              customerId: session.customer as string,
            },
          })

          await prisma.subscription.create({
            data: {
              userId,
              plan: session.metadata?.plan as any || 'MONTHLY',
              status: 'ACTIVE',
              stripeSubscriptionId: session.subscription as string,
              stripeCustomerId: session.customer as string,
              stripePriceId: session.line_items?.data[0]?.price?.id,
            },
          })
        } else {
          // Handle one-time credit purchase
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionPlan: 'CREDITS',
              creditsRemaining: { increment: 50 },
            },
          })
        }

        // Log payment
        await prisma.payment.create({
          data: {
            userId,
            amount: (session.amount_total || 0) / 100,
            currency: session.currency || 'usd',
            stripePaymentId: session.payment_intent as string,
            stripeStatus: session.payment_status,
            description: session.line_items?.data[0]?.description || 'Subscription payment',
          },
        })

        break

      case 'subscription.updated':
        const subscription = result.subscription as Stripe.Subscription
        
        // Type cast to access properties
        const sub = subscription as any
        
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: subscription.status === 'active' ? 'ACTIVE' : 'INACTIVE',
            currentPeriodStart: sub.current_period_start ? new Date(sub.current_period_start * 1000) : null,
            currentPeriodEnd: sub.current_period_end ? new Date(sub.current_period_end * 1000) : null,
            cancelAtPeriodEnd: sub.cancel_at_period_end || false,
          },
        })

        // Update user subscription status
        await prisma.user.updateMany({
          where: {
            subscriptions: {
              some: {
                stripeSubscriptionId: subscription.id,
              },
            },
          },
          data: {
            subscriptionStatus: subscription.status === 'active' ? 'ACTIVE' : 'INACTIVE',
          },
        })

        break

      case 'subscription.deleted':
        const deletedSubscription = result.subscription as Stripe.Subscription
        
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: deletedSubscription.id },
          data: {
            status: 'CANCELLED',
            canceledAt: new Date(),
          },
        })

        await prisma.user.updateMany({
          where: {
            subscriptions: {
              some: {
                stripeSubscriptionId: deletedSubscription.id,
              },
            },
          },
          data: {
            subscriptionStatus: 'CANCELLED',
            subscriptionPlan: 'FREE',
          },
        })

        break

      case 'payment.failed':
        const failedInvoice = result.invoice as Stripe.Invoice
        const failedInv = failedInvoice as any
        
        if (failedInv.subscription) {
          await prisma.user.updateMany({
            where: {
              subscriptions: {
                some: {
                  stripeSubscriptionId: failedInv.subscription as string,
                },
              },
            },
            data: {
              subscriptionStatus: 'PAST_DUE',
            },
          })
        }

        break
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}
