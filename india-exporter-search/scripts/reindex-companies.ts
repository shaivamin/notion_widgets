import prisma from '../lib/prisma'
import { indexCompany } from '../lib/typesense'

async function main() {
  try {
    console.log('Starting reindex of all companies...')
    
    const companies = await prisma.company.findMany()
    console.log(`Found ${companies.length} companies to index`)

    let indexed = 0
    let failed = 0

    for (const company of companies) {
      try {
        await indexCompany(company)
        indexed++
        if (indexed % 100 === 0) {
          console.log(`Indexed ${indexed}/${companies.length} companies`)
        }
      } catch (error) {
        console.error(`Failed to index company ${company.id}:`, error)
        failed++
      }
    }

    console.log(`Reindex complete: ${indexed} indexed, ${failed} failed`)
    process.exit(0)
  } catch (error) {
    console.error('Error reindexing companies:', error)
    process.exit(1)
  }
}

main()
