import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { indexCompany } from '@/lib/typesense'
import { z } from 'zod'

const verifySchema = z.object({
  status: z.enum(['VERIFIED', 'REJECTED']),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: companyId } = await params

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

    // Check if user is admin
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    })

    if (dbUser?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    // Validate input
    const body = await request.json()
    const validatedData = verifySchema.parse(body)

    // Update company verification status
    const company = await prisma.company.update({
      where: { id: companyId },
      data: {
        verificationStatus: validatedData.status,
        verifiedAt: new Date(),
        verifiedBy: user.id,
      },
    })

    // Update Typesense index
    await indexCompany(company)

    // Log audit event
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'COMPANY_VERIFIED',
        entityType: 'Company',
        entityId: company.id,
        metadata: { status: validatedData.status },
      },
    })

    return NextResponse.json({
      success: true,
      message: `Company ${validatedData.status.toLowerCase()} successfully`,
      data: company,
    })
  } catch (error: any) {
    console.error('Verify company error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'An error occurred while verifying company' },
      { status: 500 }
    )
  }
}
