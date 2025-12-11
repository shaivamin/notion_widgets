import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { createCheckoutSession, SUBSCRIPTION_PLANS } from '@/lib/stripe'
import { z } from 'zod'

const checkoutSchema = z.object({
  planId: z.enum(['MONTHLY', 'YEARLY', 'CREDITS']),
})

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { email: true },
    })

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Validate input
    const body = await request.json()
    const validatedData = checkoutSchema.parse(body)

    // Get plan details
    const plan = SUBSCRIPTION_PLANS[validatedData.planId]

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      userId: user.id,
      email: dbUser.email,
      priceId: plan.priceId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?checkout=cancelled`,
    })

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    })
  } catch (error: any) {
    console.error('Checkout error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'An error occurred during checkout' },
      { status: 500 }
    )
  }
}
