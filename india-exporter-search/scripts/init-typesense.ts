import { initializeTypesenseCollection } from '../lib/typesense'

async function main() {
  try {
    console.log('Initializing Typesense collection...')
    await initializeTypesenseCollection()
    console.log('Typesense collection initialized successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error initializing Typesense collection:', error)
    process.exit(1)
  }
}

main()
