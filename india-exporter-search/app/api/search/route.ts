import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { searchCompanies } from '@/lib/typesense'
import prisma from '@/lib/prisma'
import { limiter } from '@/lib/rate-limit'

const FREE_SEARCH_LIMIT = 3

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous'
    try {
      await limiter.check(10, ip)
    } catch {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

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

    // Get user details from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        subscriptionPlan: true,
        subscriptionStatus: true,
        creditsRemaining: true,
      },
    })

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Parse search parameters
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query') || undefined
    const hsnCode = searchParams.get('hsnCode') || undefined
    const category = searchParams.get('category') || undefined
    const country = searchParams.get('country') || undefined
    const minValue = searchParams.get('minValue') ? parseFloat(searchParams.get('minValue')!) : undefined
    const maxValue = searchParams.get('maxValue') ? parseFloat(searchParams.get('maxValue')!) : undefined
    const verified = searchParams.get('verified') === 'true' ? true : undefined
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('perPage') || '20')

    // Perform search
    const searchResult = await searchCompanies({
      query,
      hsnCode,
      category,
      country,
      minValue,
      maxValue,
      verified,
      page,
      perPage,
    })

    // Log search
    await prisma.search.create({
      data: {
        userId: user.id,
        query,
        hsnCode,
        category,
        country,
        minValue,
        maxValue,
        verified,
        resultCount: searchResult.found,
      },
    })

    // Apply freemium limits
    const isFreeTier = dbUser.subscriptionPlan === 'FREE' && dbUser.subscriptionStatus !== 'ACTIVE'
    const hasPaidAccess = 
      dbUser.subscriptionStatus === 'ACTIVE' || 
      (dbUser.subscriptionPlan === 'CREDITS' && dbUser.creditsRemaining > 0)

    let results = searchResult.hits || []
    let limited = false

    if (isFreeTier) {
      // Free users can only see first 3 results with limited info
      results = results.slice(0, FREE_SEARCH_LIMIT).map(company => ({
        ...company,
        // Hide contact details for free users
        email: null,
        phone: null,
        contactPerson: null,
        website: null,
      }))
      limited = true
    } else if (dbUser.subscriptionPlan === 'CREDITS' && hasPaidAccess) {
      // Deduct credit for viewing results
      await prisma.user.update({
        where: { id: user.id },
        data: {
          creditsRemaining: {
            decrement: 1,
          },
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        results,
        pagination: {
          page,
          perPage,
          total: searchResult.found,
          totalPages: Math.ceil(searchResult.found / perPage),
        },
        limited,
        message: limited
          ? 'Upgrade to see all results and contact information'
          : undefined,
      },
    })
  } catch (error: any) {
    console.error('Search error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred during search' },
      { status: 500 }
    )
  }
}
