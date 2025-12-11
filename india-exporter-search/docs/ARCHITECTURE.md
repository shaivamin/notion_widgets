# Architecture Documentation
## India Exporter Buyer Search MVP

## System Overview

The India Exporter Buyer Search platform is a full-stack web application built with a modern serverless architecture. The system enables users to search and discover verified exporters and buyers in India with a freemium subscription model.

## Architecture Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │◄───────►│  Vercel CDN  │◄───────►│  Next.js    │
│  (Client)   │         │   (Static)   │         │  App Router │
└─────────────┘         └──────────────┘         └──────┬──────┘
                                                        │
                        ┌───────────────────────────────┼───────────────────────┐
                        │                               │                       │
                        ▼                               ▼                       ▼
                ┌───────────────┐             ┌─────────────────┐     ┌────────────────┐
                │   Supabase    │             │   PostgreSQL    │     │   Typesense    │
                │     Auth      │             │    Database     │     │  Search Engine │
                └───────────────┘             └─────────────────┘     └────────────────┘
                        │                               │                       │
                        │                               │                       │
                        ▼                               ▼                       ▼
                ┌───────────────┐             ┌─────────────────┐     ┌────────────────┐
                │    Stripe     │             │     Prisma      │     │  Search Index  │
                │   Payments    │             │      ORM        │     │   (Companies)  │
                └───────────────┘             └─────────────────┘     └────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS
- **State Management**: React Context + Hooks
- **HTTP Client**: Native Fetch API
- **Form Handling**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js 20+ (Serverless)
- **API**: Next.js API Routes
- **Database ORM**: Prisma
- **Authentication**: Supabase Auth
- **Search**: Typesense Client

### Database
- **Primary Database**: PostgreSQL 14+ (Supabase)
- **Search Index**: Typesense 27+
- **Caching**: LRU Cache (in-memory)

### External Services
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Hosting**: Vercel
- **Monitoring**: Sentry (optional)
- **Analytics**: Vercel Analytics

## Data Flow

### User Authentication Flow

```
1. User submits login credentials
2. Next.js API route receives request
3. Supabase Auth validates credentials
4. JWT token generated and returned
5. Token stored in HTTP-only cookie
6. Middleware validates token on protected routes
7. User data fetched from PostgreSQL via Prisma
```

### Search Flow

```
1. User submits search query with filters
2. API checks user authentication (JWT)
3. Fetch user subscription status from PostgreSQL
4. Execute search query in Typesense
5. Apply freemium limits based on subscription
6. Log search to PostgreSQL
7. Return results to client
8. Client renders results with pagination
```

### Data Ingestion Flow

```
1. Admin triggers ingestion from DGFT CSV
2. API downloads and parses CSV file
3. Validate and clean each row
4. Check for duplicates in PostgreSQL
5. Run auto-verification checks (website, email, phone)
6. Insert new company records
7. Index companies in Typesense
8. Log ingestion statistics
```

### Payment Flow

```
1. User selects subscription plan
2. API creates Stripe checkout session
3. User redirected to Stripe checkout
4. User completes payment
5. Stripe sends webhook to API
6. API verifies webhook signature
7. Update user subscription in PostgreSQL
8. Create payment record
9. Log audit event
10. Redirect user to success page
```

## Database Schema

### Core Tables

**users**
- User accounts with authentication and subscription data
- Links to Supabase Auth
- Tracks subscription status and credits

**companies**
- Company profiles with all business data
- Verification status and audit trail
- Indexed in Typesense for search

**searches**
- Search history for analytics
- Tracks query parameters and result counts

**reports**
- User-submitted reports on companies
- Admin review workflow

**subscriptions**
- Stripe subscription tracking
- Links to users and payments

**payments**
- Payment history from Stripe
- Transaction records

**data_ingestion_logs**
- Tracks all data import operations
- Success/failure statistics

**audit_logs**
- System-wide audit trail
- All sensitive operations logged

## API Architecture

### API Routes Structure

```
/api
├── auth/
│   ├── signup           POST   - User registration
│   ├── login            POST   - User login
│   └── logout           POST   - User logout
├── search               GET    - Search companies
├── companies/
│   ├── [id]             GET    - Get company details
│   └── [id]/report      POST   - Report a company
├── subscriptions/
│   └── checkout         POST   - Create Stripe checkout
├── webhooks/
│   └── stripe           POST   - Stripe webhook handler
└── admin/
    ├── companies/
    │   └── [id]/verify  POST   - Verify company
    ├── ingest           POST   - Trigger data ingestion
    └── reports          GET    - List reports
```

### API Security

1. **Authentication**: JWT tokens via Supabase
2. **Authorization**: Role-based access control
3. **Rate Limiting**: LRU cache-based (100 req/15min)
4. **Input Validation**: Zod schemas on all endpoints
5. **CORS**: Configured for same-origin only
6. **CSRF**: Next.js built-in protection

## Search Architecture

### Typesense Configuration

**Collection**: `companies`

**Fields**:
- companyName (string, searchable)
- country (string, facet)
- categories (string[], facet)
- hsnCodes (string[], facet)
- importedProducts (string[], searchable)
- exportedProducts (string[], searchable)
- importValue (float, sortable)
- verificationStatus (string, facet)

**Search Features**:
- Full-text search with typo tolerance
- Faceted filtering
- Relevance ranking
- Geo-search (future)
- Synonyms support (future)

### Search Performance

- Target: < 100ms latency
- Optimization: Proper field weighting
- Caching: Client-side result caching
- Pagination: 20 results per page default

## Security Architecture

### Authentication & Authorization

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ Login Request
       ▼
┌─────────────────┐
│   Next.js API   │
└──────┬──────────┘
       │ Validate
       ▼
┌─────────────────┐
│  Supabase Auth  │ ──► JWT Token
└──────┬──────────┘
       │
       ▼
┌─────────────────┐
│   PostgreSQL    │ ──► User Data
└─────────────────┘
```

### Security Layers

1. **Network**: HTTPS/TLS 1.3
2. **Application**: Input validation, XSS protection
3. **API**: Rate limiting, authentication
4. **Database**: Parameterized queries (Prisma)
5. **Secrets**: Environment variables only

### Security Checklist

- [x] Input validation with Zod
- [x] SQL injection prevention (Prisma ORM)
- [ ] XSS prevention (Content Security Policy)
- [ ] CSRF protection (Next.js built-in)
- [x] Rate limiting
- [x] Secure password hashing (Supabase)
- [x] JWT token validation
- [x] Role-based access control
- [x] Audit logging
- [ ] Regular security audits
- [ ] Dependency scanning

## Scalability

### Current Architecture Limits

- **Database**: PostgreSQL can handle millions of records
- **Search**: Typesense scales horizontally
- **API**: Vercel scales automatically
- **Storage**: Supabase provides 500MB free

### Scaling Strategy

**Phase 1** (0-10K users)
- Current architecture sufficient
- Single database instance
- Typesense single node

**Phase 2** (10K-100K users)
- Add database read replicas
- Typesense cluster (3 nodes)
- Redis for caching
- CDN for static assets

**Phase 3** (100K+ users)
- Database sharding
- Typesense multi-cluster
- Queue system for async jobs
- Microservices for heavy operations

## Monitoring & Observability

### Metrics to Track

**Application**:
- API response times
- Error rates
- Successful/failed requests
- Search performance

**Business**:
- User sign-ups
- Conversion rates
- Revenue (MRR, ARR)
- Churn rate

**Infrastructure**:
- Database query performance
- Typesense indexing speed
- Memory usage
- CPU utilization

### Tools

- **Error Tracking**: Sentry
- **Performance**: Vercel Analytics
- **Logs**: Vercel Logs
- **Uptime**: UptimeRobot
- **Business**: Custom dashboard

## Disaster Recovery

### Backup Strategy

**Database**:
- Supabase automatic daily backups
- Point-in-time recovery (7 days)
- Manual backup before major changes

**Search Index**:
- Can be rebuilt from PostgreSQL
- Document rebuild script

**Code**:
- Git version control
- Branch protection
- Regular commits

### Recovery Procedures

1. Database failure: Restore from Supabase backup
2. Search failure: Rebuild index from database
3. API failure: Rollback deployment on Vercel
4. Complete outage: Follow runbook in docs/RUNBOOK.md

## Future Enhancements

### Technical Improvements

1. **Caching Layer**: Redis for frequently accessed data
2. **Queue System**: Bull for async jobs
3. **API Gateway**: Rate limiting, API versioning
4. **GraphQL API**: More flexible data fetching
5. **WebSockets**: Real-time notifications
6. **Mobile App**: React Native
7. **Elasticsearch**: More advanced search features

### Feature Additions

1. **Advanced Analytics**: Trade insights, market trends
2. **Recommendations**: AI-powered matching
3. **Messaging**: In-app communication
4. **CRM Integration**: Export to Salesforce, HubSpot
5. **API Access**: Public API for developers
6. **Multi-language**: i18n support
7. **Mobile Apps**: iOS and Android

## Conclusion

This architecture provides a solid foundation for the MVP while allowing for future scalability. The serverless approach on Vercel combined with managed services (Supabase, Typesense) minimizes operational overhead while providing enterprise-grade reliability and performance.

Key architectural decisions:
- ✅ Serverless for automatic scaling
- ✅ Managed services for reduced maintenance
- ✅ PostgreSQL for data integrity
- ✅ Typesense for fast search
- ✅ Stripe for secure payments
- ✅ Modular design for easy feature additions
