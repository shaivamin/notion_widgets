import dns from 'dns'
import { promisify } from 'util'

const resolveMx = promisify(dns.resolveMx)

export async function verifyWebsite(website: string): Promise<boolean> {
  try {
    const url = website.startsWith('http') ? website : `https://${website}`
    const response = await fetch(url, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(5000) 
    })
    return response.ok
  } catch {
    return false
  }
}

export async function verifyEmail(email: string): Promise<boolean> {
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return false
  }

  try {
    // Check if domain has MX records
    const domain = email.split('@')[1]
    const mxRecords = await resolveMx(domain)
    return mxRecords && mxRecords.length > 0
  } catch {
    return false
  }
}

export function verifyPhoneFormat(phone: string): boolean {
  // Basic phone format validation (international format)
  // Supports formats like: +91-9876543210, +1-555-123-4567, etc.
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export async function runAutoVerificationChecks(company: {
  website?: string
  email?: string
  phone?: string
}) {
  const [websiteVerified, emailVerified, phoneVerified] = await Promise.all([
    company.website ? verifyWebsite(company.website) : Promise.resolve(false),
    company.email ? verifyEmail(company.email) : Promise.resolve(false),
    company.phone ? Promise.resolve(verifyPhoneFormat(company.phone)) : Promise.resolve(false),
  ])

  return {
    websiteVerified,
    emailVerified,
    phoneVerified,
  }
}
