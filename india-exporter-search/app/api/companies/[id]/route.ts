import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

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

    // Get company
    const company = await prisma.company.findUnique({
      where: { id },
    })

    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      )
    }

    // Check user subscription for full details
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        subscriptionPlan: true,
        subscriptionStatus: true,
        creditsRemaining: true,
      },
    })

    const hasPaidAccess = 
      dbUser?.subscriptionStatus === 'ACTIVE' || 
      (dbUser?.subscriptionPlan === 'CREDITS' && dbUser?.creditsRemaining > 0)

    let companyData = { ...company }

    if (!hasPaidAccess) {
      // Hide contact details for free users
      companyData = {
        ...companyData,
        email: null,
        phone: null,
        contactPerson: null,
        website: null,
      }
    }

    return NextResponse.json({
      success: true,
      data: companyData,
      limited: !hasPaidAccess,
    })
  } catch (error) {
    console.error('Get company error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred while fetching company' },
      { status: 500 }
    )
  }
}
