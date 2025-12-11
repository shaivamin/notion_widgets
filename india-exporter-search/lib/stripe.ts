import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
  typescript: true,
})

export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    name: 'Monthly Subscription',
    price: 4900, // $49/month in cents
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly',
    features: [
      'Unlimited search results',
      'Full company contact details',
      'Email and phone numbers',
      'Export to CSV',
      'Priority support',
    ],
  },
  YEARLY: {
    name: 'Yearly Subscription',
    price: 49900, // $499/year in cents (save ~15%)
    priceId: process.env.STRIPE_YEARLY_PRICE_ID || 'price_yearly',
    features: [
      'All Monthly features',
      'Save 15% vs monthly',
      'Advanced analytics',
      'API access',
      'Dedicated account manager',
    ],
  },
  CREDITS: {
    name: 'Credit Package',
    price: 1900, // $19 for 50 credits
    priceId: process.env.STRIPE_CREDITS_PRICE_ID || 'price_credits',
    features: [
      '50 search credits',
      'View full company details',
      'Never expires',
      'Pay as you go',
    ],
  },
}

export async function createCheckoutSession({
  userId,
  email,
  priceId,
  successUrl,
  cancelUrl,
}: {
  userId: string
  email: string
  priceId: string
  successUrl: string
  cancelUrl: string
}) {
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    client_reference_id: userId,
    payment_method_types: ['card'],
    mode: priceId === SUBSCRIPTION_PLANS.CREDITS.priceId ? 'payment' : 'subscription',
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
  })

  return session
}

export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

export async function handleWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      // Handle successful subscription or payment
      const session = event.data.object as Stripe.Checkout.Session
      return { type: 'checkout.completed', session }
      
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      // Handle subscription updates
      const subscription = event.data.object as Stripe.Subscription
      return { type: 'subscription.updated', subscription }
      
    case 'customer.subscription.deleted':
      // Handle subscription cancellation
      const deletedSubscription = event.data.object as Stripe.Subscription
      return { type: 'subscription.deleted', subscription: deletedSubscription }
      
    case 'invoice.payment_succeeded':
      // Handle successful payment
      const invoice = event.data.object as Stripe.Invoice
      return { type: 'payment.succeeded', invoice }
      
    case 'invoice.payment_failed':
      // Handle failed payment
      const failedInvoice = event.data.object as Stripe.Invoice
      return { type: 'payment.failed', invoice: failedInvoice }
      
    default:
      return { type: 'unhandled', event: event.type }
  }
}
