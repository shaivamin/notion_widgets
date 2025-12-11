import Typesense from 'typesense'

export const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || 'localhost',
      port: parseInt(process.env.TYPESENSE_PORT || '8108'),
      protocol: process.env.TYPESENSE_PROTOCOL || 'http',
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY || '',
  connectionTimeoutSeconds: 10,
})

export const COMPANIES_COLLECTION = 'companies'

export const companiesSchema: any = {
  name: COMPANIES_COLLECTION,
  fields: [
    { name: 'companyName', type: 'string', facet: false },
    { name: 'country', type: 'string', facet: true },
    { name: 'city', type: 'string', facet: true, optional: true },
    { name: 'categories', type: 'string[]', facet: true },
    { name: 'hsnCodes', type: 'string[]', facet: true },
    { name: 'importedProducts', type: 'string[]', facet: false },
    { name: 'exportedProducts', type: 'string[]', facet: false },
    { name: 'importValue', type: 'float', facet: false, optional: true },
    { name: 'exportValue', type: 'float', facet: false, optional: true },
    { name: 'verificationStatus', type: 'string', facet: true },
    { name: 'email', type: 'string', facet: false, optional: true },
    { name: 'phone', type: 'string', facet: false, optional: true },
    { name: 'website', type: 'string', facet: false, optional: true },
    { name: 'contactPerson', type: 'string', facet: false, optional: true },
    { name: 'fullAddress', type: 'string', facet: false, optional: true },
    { name: 'dataSource', type: 'string', facet: true },
  ],
  default_sorting_field: 'importValue',
}

export async function initializeTypesenseCollection() {
  try {
    // Try to retrieve the collection
    await typesenseClient.collections(COMPANIES_COLLECTION).retrieve()
    console.log('Typesense collection already exists')
  } catch (error: any) {
    if (error.httpStatus === 404) {
      // Collection doesn't exist, create it
      await typesenseClient.collections().create(companiesSchema)
      console.log('Typesense collection created successfully')
    } else {
      console.error('Error checking Typesense collection:', error)
      throw error
    }
  }
}

export async function indexCompany(company: any) {
  return await typesenseClient
    .collections(COMPANIES_COLLECTION)
    .documents()
    .upsert({
      id: company.id,
      companyName: company.companyName,
      country: company.country,
      city: company.city || '',
      categories: company.categories || [],
      hsnCodes: company.hsnCodes || [],
      importedProducts: company.importedProducts || [],
      exportedProducts: company.exportedProducts || [],
      importValue: company.importValue ? parseFloat(company.importValue.toString()) : 0,
      exportValue: company.exportValue ? parseFloat(company.exportValue.toString()) : 0,
      verificationStatus: company.verificationStatus,
      email: company.email || '',
      phone: company.phone || '',
      website: company.website || '',
      contactPerson: company.contactPerson || '',
      fullAddress: company.fullAddress || '',
      dataSource: company.dataSource,
    })
}

export async function searchCompanies(params: {
  query?: string
  hsnCode?: string
  category?: string
  country?: string
  minValue?: number
  maxValue?: number
  verified?: boolean
  page?: number
  perPage?: number
}) {
  const { query, hsnCode, category, country, minValue, maxValue, verified, page = 1, perPage = 20 } = params

  let filterBy: string[] = []
  
  if (hsnCode) {
    filterBy.push(`hsnCodes:=${hsnCode}`)
  }
  if (category) {
    filterBy.push(`categories:=${category}`)
  }
  if (country) {
    filterBy.push(`country:=${country}`)
  }
  if (minValue !== undefined) {
    filterBy.push(`importValue:>=${minValue}`)
  }
  if (maxValue !== undefined) {
    filterBy.push(`importValue:<=${maxValue}`)
  }
  if (verified !== undefined) {
    filterBy.push(`verificationStatus:=${verified ? 'VERIFIED' : 'PENDING'}`)
  }

  const searchParameters = {
    q: query || '*',
    query_by: 'companyName,importedProducts,exportedProducts,city,contactPerson',
    filter_by: filterBy.length > 0 ? filterBy.join(' && ') : undefined,
    page,
    per_page: perPage,
    sort_by: 'importValue:desc',
  }

  return await typesenseClient
    .collections(COMPANIES_COLLECTION)
    .documents()
    .search(searchParameters)
}
