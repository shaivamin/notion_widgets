# Entity Relationship Diagram (ERD)

## Database Schema Visualization

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                 USER                                     │
├─────────────────────────────────────────────────────────────────────────┤
│ PK │ id (cuid)                                                          │
│    │ email (unique)                                                     │
│    │ password (nullable)                                                │
│    │ name                                                               │
│    │ role (EXPORTER | BUYER | ADMIN)                                   │
│    │ googleId (unique, nullable)                                        │
│    │ subscriptionPlan (FREE | MONTHLY | YEARLY | CREDITS)              │
│    │ subscriptionStatus (ACTIVE | INACTIVE | CANCELLED | PAST_DUE)     │
│    │ creditsRemaining (int)                                             │
│    │ emailVerified (boolean)                                            │
│    │ createdAt, updatedAt, lastLoginAt                                  │
└─────────────────────────────────────────────────────────────────────────┘
         │                 │                 │                 │
         │                 │                 │                 │
         ▼                 ▼                 ▼                 ▼
   ┌─────────┐      ┌────────────┐   ┌──────────────┐  ┌─────────┐
   │ SEARCH  │      │   REPORT   │   │ SUBSCRIPTION │  │ PAYMENT │
   └─────────┘      └────────────┘   └──────────────┘  └─────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                COMPANY                                   │
├─────────────────────────────────────────────────────────────────────────┤
│ PK │ id (cuid)                                                          │
│    │ companyName                                                        │
│    │ fullAddress, city, state, country, postalCode                      │
│    │ contactPerson, email, phone, website                               │
│    │ importedProducts (array)                                           │
│    │ exportedProducts (array)                                           │
│    │ quantity, importValue, exportValue, currency                       │
│    │ categories (array), hsnCodes (array)                               │
│    │ lastSupplier, lastBuyer                                            │
│    │ verificationStatus (PENDING | VERIFIED | REJECTED | FLAGGED)      │
│    │ websiteVerified, emailVerified, phoneVerified (boolean)            │
│    │ dataSource, sourceReference                                        │
│    │ verifiedAt, verifiedBy                                             │
│    │ createdAt, updatedAt                                               │
└─────────────────────────────────────────────────────────────────────────┘
         │
         │ (1 to many)
         ▼
   ┌────────────┐
   │   REPORT   │
   └────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                SEARCH                                    │
├─────────────────────────────────────────────────────────────────────────┤
│ PK │ id (cuid)                                                          │
│ FK │ userId → USER                                                      │
│    │ query, hsnCode, category, country                                  │
│    │ minValue, maxValue, verified                                       │
│    │ resultCount (int)                                                  │
│    │ createdAt                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                                REPORT                                    │
├─────────────────────────────────────────────────────────────────────────┤
│ PK │ id (cuid)                                                          │
│ FK │ companyId → COMPANY                                                │
│ FK │ userId → USER                                                      │
│    │ reason, description                                                │
│    │ status (PENDING | REVIEWED | RESOLVED | DISMISSED)                │
│    │ reviewedBy, reviewedAt, resolution                                 │
│    │ createdAt, updatedAt                                               │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                             SUBSCRIPTION                                 │
├─────────────────────────────────────────────────────────────────────────┤
│ PK │ id (cuid)                                                          │
│ FK │ userId → USER                                                      │
│    │ plan (FREE | MONTHLY | YEARLY | CREDITS)                           │
│    │ status (ACTIVE | INACTIVE | CANCELLED | PAST_DUE)                 │
│    │ stripeSubscriptionId (unique), stripeCustomerId, stripePriceId     │
│    │ currentPeriodStart, currentPeriodEnd                               │
│    │ cancelAtPeriodEnd (boolean), canceledAt                            │
│    │ createdAt, updatedAt                                               │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                               PAYMENT                                    │
├─────────────────────────────────────────────────────────────────────────┤
│ PK │ id (cuid)                                                          │
│ FK │ userId → USER                                                      │
│    │ amount (decimal), currency                                         │
│    │ stripePaymentId (unique), stripeStatus                             │
│    │ description                                                        │
│    │ createdAt                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA_INGESTION_LOG                               │
├─────────────────────────────────────────────────────────────────────────┤
│ PK │ id (cuid)                                                          │
│    │ source (e.g., "DGFT")                                              │
│    │ status (SUCCESS | FAILED | PARTIAL)                                │
│    │ recordsFetched, recordsProcessed, recordsInserted                  │
│    │ recordsUpdated, recordsFailed, duplicatesSkipped                   │
│    │ errorMessage, metadata (JSON)                                      │
│    │ startedAt, completedAt, createdAt                                  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                              AUDIT_LOG                                   │
├─────────────────────────────────────────────────────────────────────────┤
│ PK │ id (cuid)                                                          │
│    │ userId (nullable)                                                  │
│    │ action (e.g., "USER_LOGIN", "COMPANY_VERIFIED")                   │
│    │ entityType, entityId                                               │
│    │ ipAddress, userAgent                                               │
│    │ metadata (JSON)                                                    │
│    │ createdAt                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Relationships

### User Relationships
- **User → Search**: One-to-Many (A user can perform many searches)
- **User → Report**: One-to-Many (A user can submit many reports)
- **User → Subscription**: One-to-Many (A user can have multiple subscriptions over time)
- **User → Payment**: One-to-Many (A user can make many payments)

### Company Relationships
- **Company → Report**: One-to-Many (A company can have many reports)

### Indexes

**User Table:**
- `email` (unique index)
- `googleId` (unique index)
- `role` (index for filtering by role)

**Company Table:**
- `country` (index for filtering by country)
- `verificationStatus` (index for filtering verified companies)
- `companyName` (index for search)
- `email` (index for deduplication)
- `dataSource` (index for filtering by source)
- `hsnCodes` (GIN index for array search)
- `categories` (GIN index for array search)

**Search Table:**
- `userId` (foreign key index)
- `createdAt` (index for analytics)

**Report Table:**
- `companyId` (foreign key index)
- `userId` (foreign key index)
- `status` (index for filtering pending reports)

**Subscription Table:**
- `userId` (foreign key index)
- `status` (index for active subscriptions)
- `stripeSubscriptionId` (unique index)

**Payment Table:**
- `userId` (foreign key index)
- `stripePaymentId` (unique index)
- `createdAt` (index for history queries)

**DataIngestionLog Table:**
- `source` (index for filtering by source)
- `status` (index for filtering success/failure)
- `createdAt` (index for chronological queries)

**AuditLog Table:**
- `userId` (index for user action history)
- `action` (index for filtering by action type)
- `createdAt` (index for chronological queries)

## Data Types

- **cuid**: Collision-resistant unique identifier
- **String**: Variable length text
- **Int**: Integer number
- **Decimal**: Precise decimal number for monetary values
- **Boolean**: True/false
- **DateTime**: Timestamp with timezone
- **String[]**: Array of strings
- **Json**: JSON object for flexible data

## Enums

```typescript
enum UserRole {
  EXPORTER, BUYER, ADMIN
}

enum SubscriptionPlan {
  FREE, MONTHLY, YEARLY, CREDITS
}

enum SubscriptionStatus {
  ACTIVE, INACTIVE, CANCELLED, PAST_DUE
}

enum VerificationStatus {
  PENDING, VERIFIED, REJECTED, FLAGGED
}

enum ReportStatus {
  PENDING, REVIEWED, RESOLVED, DISMISSED
}
```

## Key Design Decisions

1. **CUID for IDs**: Collision-resistant, URL-safe, sortable
2. **Soft Deletes**: Not implemented initially (can add `deletedAt` field)
3. **Array Fields**: PostgreSQL arrays for categories and HSN codes
4. **JSON Fields**: For flexible metadata in logs
5. **Timestamps**: CreatedAt/UpdatedAt tracked automatically
6. **Verification**: Separate boolean fields for each verification type
7. **Audit Trail**: Comprehensive logging of all sensitive actions
8. **Foreign Keys**: Cascade deletes for related records

## Migration Strategy

```bash
# Create initial migration
npx prisma migrate dev --name init

# Apply to production
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

## Backup & Recovery

- Daily automated backups via Supabase
- Point-in-time recovery (7 days)
- Manual backups before major schema changes
- Restore procedure documented in DEPLOYMENT.md
