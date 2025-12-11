import { UserRole, SubscriptionPlan, SubscriptionStatus, VerificationStatus, ReportStatus } from '@prisma/client'

export type { UserRole, SubscriptionPlan, SubscriptionStatus, VerificationStatus, ReportStatus }

export interface User {
  id: string
  email: string
  name?: string
  role: UserRole
  subscriptionPlan: SubscriptionPlan
  subscriptionStatus: SubscriptionStatus
  creditsRemaining: number
  profileImage?: string
}

export interface Company {
  id: string
  companyName: string
  fullAddress?: string
  country: string
  city?: string
  state?: string
  postalCode?: string
  contactPerson?: string
  email?: string
  phone?: string
  website?: string
  importedProducts: string[]
  exportedProducts: string[]
  quantity?: number
  importValue?: number
  exportValue?: number
  currency: string
  categories: string[]
  hsnCodes: string[]
  lastSupplier?: string
  lastBuyer?: string
  verificationStatus: VerificationStatus
  verifiedAt?: Date
  websiteVerified: boolean
  emailVerified: boolean
  phoneVerified: boolean
  dataSource: string
  sourceReference?: string
  createdAt: Date
  updatedAt: Date
}

export interface SearchParams {
  query?: string
  hsnCode?: string
  category?: string
  country?: string
  minValue?: number
  maxValue?: number
  verified?: boolean
  page?: number
  perPage?: number
}

export interface SearchResult {
  hits: Company[]
  found: number
  page: number
  out_of: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page: number
  perPage: number
  total: number
  totalPages: number
}
