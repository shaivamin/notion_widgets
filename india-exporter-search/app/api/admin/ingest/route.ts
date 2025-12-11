import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { indexCompany } from '@/lib/typesense'
import { parseCSVFromURL, cleanCSVValue, parseNumberFromCSV, parseArrayFromCSV } from '@/utils/csv-parser'
import { runAutoVerificationChecks } from '@/utils/verification'

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

    const startTime = new Date()

    // Create ingestion log
    const log = await prisma.dataIngestionLog.create({
      data: {
        source: 'DGFT',
        status: 'PROCESSING',
        startedAt: startTime,
      },
    })

    try {
      const body = await request.json()
      const csvUrl = body.csvUrl || process.env.DGFT_DATA_URL

      if (!csvUrl) {
        throw new Error('CSV URL is required')
      }

      // Parse CSV data
      const csvData = await parseCSVFromURL(csvUrl)

      let recordsProcessed = 0
      let recordsInserted = 0
      let recordsUpdated = 0
      let recordsFailed = 0
      let duplicatesSkipped = 0

      // Process each row
      for (const row of csvData) {
        try {
          recordsProcessed++

          // Map CSV columns to database fields (adjust based on actual DGFT format)
          const companyName = cleanCSVValue(row['Company Name'] || row['Importer Name'])
          
          if (!companyName) {
            recordsFailed++
            continue
          }

          const companyData = {
            companyName,
            fullAddress: cleanCSVValue(row['Address']),
            country: cleanCSVValue(row['Country']) || 'India',
            city: cleanCSVValue(row['City']),
            state: cleanCSVValue(row['State']),
            postalCode: cleanCSVValue(row['PIN Code'] || row['Postal Code']),
            contactPerson: cleanCSVValue(row['Contact Person']),
            email: cleanCSVValue(row['Email']),
            phone: cleanCSVValue(row['Phone'] || row['Mobile']),
            website: cleanCSVValue(row['Website']),
            importedProducts: parseArrayFromCSV(row['Products'] || row['Import Products']),
            exportedProducts: parseArrayFromCSV(row['Export Products']),
            quantity: parseNumberFromCSV(row['Quantity']),
            importValue: parseNumberFromCSV(row['Import Value']),
            exportValue: parseNumberFromCSV(row['Export Value']),
            currency: cleanCSVValue(row['Currency']) || 'USD',
            categories: parseArrayFromCSV(row['Categories']),
            hsnCodes: parseArrayFromCSV(row['HSN Codes'] || row['HSN Code']),
            lastSupplier: cleanCSVValue(row['Supplier']),
            dataSource: 'DGFT' as const,
            sourceReference: cleanCSVValue(row['Reference ID'] || row['IEC Code']),
          }

          // Check for duplicates
          const existingCompany = await prisma.company.findFirst({
            where: {
              companyName: companyData.companyName,
              country: companyData.country,
              dataSource: 'DGFT',
            },
          })

          if (existingCompany) {
            duplicatesSkipped++
            continue
          }

          // Run auto-verification checks
          const verificationResults = await runAutoVerificationChecks({
            website: companyData.website,
            email: companyData.email,
            phone: companyData.phone,
          })

          // Create company
          const company = await prisma.company.create({
            data: {
              ...companyData,
              ...verificationResults,
            },
          })

          // Index in Typesense
          await indexCompany(company)

          recordsInserted++
        } catch (error) {
          console.error('Error processing row:', error)
          recordsFailed++
        }
      }

      // Update ingestion log
      await prisma.dataIngestionLog.update({
        where: { id: log.id },
        data: {
          status: 'SUCCESS',
          recordsFetched: csvData.length,
          recordsProcessed,
          recordsInserted,
          recordsUpdated,
          recordsFailed,
          duplicatesSkipped,
          completedAt: new Date(),
        },
      })

      // Log audit event
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'DATA_INGESTION',
          entityType: 'DataIngestionLog',
          entityId: log.id,
          metadata: {
            recordsInserted,
            recordsFailed,
            duplicatesSkipped,
          },
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Data ingestion completed successfully',
        data: {
          recordsFetched: csvData.length,
          recordsProcessed,
          recordsInserted,
          recordsUpdated,
          recordsFailed,
          duplicatesSkipped,
        },
      })
    } catch (error: any) {
      // Update log with error
      await prisma.dataIngestionLog.update({
        where: { id: log.id },
        data: {
          status: 'FAILED',
          errorMessage: error.message,
          completedAt: new Date(),
        },
      })

      throw error
    }
  } catch (error: any) {
    console.error('Data ingestion error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'An error occurred during data ingestion' },
      { status: 500 }
    )
  }
}
