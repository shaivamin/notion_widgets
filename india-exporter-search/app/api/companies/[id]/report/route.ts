import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

const reportSchema = z.object({
  reason: z.string().min(1),
  description: z.string().optional(),
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

    // Validate input
    const body = await request.json()
    const validatedData = reportSchema.parse(body)

    // Check if company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    })

    if (!company) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      )
    }

    // Create report
    const report = await prisma.report.create({
      data: {
        companyId,
        userId: user.id,
        reason: validatedData.reason,
        description: validatedData.description,
        status: 'PENDING',
      },
    })

    // Flag the company
    await prisma.company.update({
      where: { id: companyId },
      data: {
        verificationStatus: 'FLAGGED',
      },
    })

    // Log audit event
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'REPORT_CREATED',
        entityType: 'Report',
        entityId: report.id,
        metadata: { companyId, reason: validatedData.reason },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully',
      data: report,
    })
  } catch (error: any) {
    console.error('Report company error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid input data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'An error occurred while submitting report' },
      { status: 500 }
    )
  }
}
