# India Exporter Buyer Search MVP

A comprehensive platform for finding verified exporters and buyers in India. Built with Next.js, PostgreSQL, Typesense, and Stripe.

## 🎯 Overview

This platform provides a searchable database of Indian importers and exporters with:
- Advanced search capabilities (product name, HSN code, category, country)
- Verified company information and contact details
- Freemium model with subscription-based access
- Admin dashboard for data verification
- Automated data ingestion from DGFT and other sources

## 🏗️ Architecture

### Tech Stack

- **Frontend & Backend**: Next.js 15 with App Router
- **Database**: PostgreSQL (via Supabase)
- **Search Engine**: Typesense
- **Authentication**: Supabase Auth (Email + Google OAuth)
- **Payments**: Stripe
- **Hosting**: Vercel
- **Infrastructure**: Terraform (optional)
- **CI/CD**: GitHub Actions

### Project Structure

```
india-exporter-search/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── search/               # Search endpoint
│   │   ├── companies/            # Company CRUD
│   │   ├── subscriptions/        # Stripe checkout
│   │   ├── webhooks/             # Stripe webhooks
│   │   └── admin/                # Admin endpoints
│   ├── (auth)/                   # Auth pages (login, signup)
│   ├── dashboard/                # User dashboard
│   ├── search/                   # Search interface
│   ├── admin/                    # Admin panel
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   ├── layout/                   # Layout components
│   └── features/                 # Feature-specific components
├── lib/                          # Core libraries
│   ├── prisma.ts                 # Database client
│   ├── supabase/                 # Supabase clients
│   ├── typesense.ts              # Search client
│   ├── stripe.ts                 # Payment processing
│   └── rate-limit.ts             # Rate limiting
├── utils/                        # Utility functions
│   ├── verification.ts           # Auto-verification checks
│   └── csv-parser.ts             # Data ingestion helpers
├── types/                        # TypeScript types
├── prisma/                       # Database schema & migrations
│   └── schema.prisma
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── 6-WEEK-PLAN.md
└── terraform/                    # Infrastructure as code
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Typesense server
- Supabase account
- Stripe account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd india-exporter-search
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start Typesense** (if running locally)
   ```bash
   docker run -d -p 8108:8108 \
     -v /tmp/typesense-data:/data typesense/typesense:27.1 \
     --data-dir /data --api-key=xyz
   ```

6. **Initialize Typesense collection**
   ```bash
   npm run init:typesense
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔑 Features

### User Features

✅ **Authentication**
- Email/password registration and login
- Google OAuth integration
- Email verification
- Password reset

✅ **Search System**
- Full-text search across company names and products
- Filter by HSN code, category, country, import/export value
- Relevance ranking
- Pagination
- Freemium limits (3 results for free users)

✅ **Company Profiles**
- Company name, address, country
- Contact information (email, phone, website, contact person)
- Imported/exported products
- Trade values and quantities
- HSN codes and categories
- Verification status badge
- Report/flag functionality

✅ **Subscription Management**
- Free tier: 3 results per search, no contact info
- Monthly subscription: Unlimited access
- Yearly subscription: Unlimited access + savings
- Credit packages: Pay-as-you-go
- Stripe-powered payments
- Customer portal for subscription management

### Admin Features

✅ **Company Verification**
- Review pending companies
- Approve or reject companies
- View verification history
- Auto-verification results (website, email, phone)

✅ **Data Ingestion**
- Import data from DGFT CSV
- Automated data cleaning and deduplication
- Batch processing
- Ingestion logs and statistics
- Error tracking

✅ **Report Management**
- Review user-submitted reports
- Investigate flagged companies
- Resolve or dismiss reports
- Track resolution status

✅ **Analytics Dashboard**
- User statistics
- Search analytics
- Revenue metrics
- Data quality metrics

## 📊 Database Schema

### Core Models

- **User**: User accounts with role and subscription info
- **Company**: Company profiles with verification status
- **Search**: Search history for analytics
- **Report**: User-submitted reports for flagged companies
- **Subscription**: Stripe subscription tracking
- **Payment**: Payment history
- **DataIngestionLog**: Data import tracking
- **AuditLog**: System-wide audit trail

See `prisma/schema.prisma` for full schema details.

## 🔐 Security

### Implemented Security Measures

✅ **Authentication & Authorization**
- JWT-based authentication via Supabase
- Role-based access control (Exporter, Buyer, Admin)
- Protected API routes
- Session management

✅ **Rate Limiting**
- API rate limits (100 requests/15 minutes)
- Per-user and per-IP limits
- LRU cache-based implementation

✅ **Data Protection**
- Encrypted passwords (bcrypt)
- Environment variables for secrets
- HTTPS required in production
- SQL injection prevention (Prisma)

✅ **Input Validation**
- Zod schema validation
- Sanitized user inputs
- Type-safe API contracts

✅ **Audit Logging**
- All sensitive actions logged
- User action tracking
- IP and user agent capture

✅ **Compliance**
- GDPR-ready (data export/deletion)
- Privacy policy and terms of service
- Data Processing Agreement template

## 💳 Payment Integration

### Subscription Plans

1. **Free Tier**
   - 3 results per search
   - No contact information
   - Basic search features

2. **Monthly Subscription** - $49/month
   - Unlimited search results
   - Full contact details
   - Export to CSV
   - Priority support

3. **Yearly Subscription** - $499/year
   - All Monthly features
   - Save 15%
   - Advanced analytics
   - API access

4. **Credit Package** - $19 for 50 credits
   - Pay-as-you-go
   - 1 credit per search result
   - Never expires

### Stripe Integration

- Checkout sessions for subscriptions
- Webhook handling for payment events
- Customer portal for self-service
- Subscription lifecycle management
- Payment retry logic

## 🔍 Search System

### Typesense Configuration

- Full-text search on company names, products
- Faceted search on country, categories, HSN codes
- Relevance ranking by import value
- Filter by verification status
- Pagination support
- Sub-50ms search latency

### Search Workflow

1. User submits search query
2. Check user subscription status
3. Execute Typesense search
4. Apply freemium limits if applicable
5. Log search for analytics
6. Return results with pagination

## 📥 Data Ingestion Pipeline

### Ingestion Process

1. **Fetch**: Download CSV from DGFT or other sources
2. **Parse**: Parse CSV with PapaParse
3. **Clean**: Sanitize and normalize data
4. **Validate**: Check required fields
5. **Deduplicate**: Skip existing companies
6. **Verify**: Run auto-verification checks
7. **Store**: Save to PostgreSQL
8. **Index**: Index in Typesense
9. **Log**: Record ingestion statistics

### Auto-Verification Checks

- **Website**: HTTP HEAD request to verify accessibility
- **Email**: DNS MX record check for domain
- **Phone**: Format validation (international format)

### Deduplication Strategy

Companies are matched by:
- Company name (normalized)
- Country
- Data source

## 📈 6-Week Development Plan

### Week 1: Foundation
- ✅ Database schema design
- ✅ Authentication setup (Supabase)
- ✅ Basic API structure
- ✅ Landing page

### Week 2: Data Ingestion
- ✅ DGFT CSV parser
- ✅ Data cleaning and validation
- ✅ Deduplication logic
- ✅ Auto-verification system
- [ ] Cron job setup

### Week 3: Search System
- ✅ Typesense integration
- ✅ Search API endpoint
- [ ] Search UI components
- [ ] Filters and pagination
- [ ] Result display

### Week 4: Verification & Admin
- ✅ Admin verification endpoints
- [ ] Admin dashboard UI
- [ ] Company review interface
- [ ] Report management
- ✅ Audit logging

### Week 5: Payments
- ✅ Stripe integration
- ✅ Subscription endpoints
- ✅ Webhook handling
- [ ] Pricing page
- [ ] Checkout flow
- ✅ Freemium logic

### Week 6: Launch Prep
- [ ] Security audit
- [ ] Performance optimization
- [ ] Monitoring setup (Sentry, LogRocket)
- [ ] CI/CD pipeline
- [ ] Documentation finalization
- [ ] Legal documents
- [ ] Deployment

## 🧪 Testing

### Test Coverage

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage

# Run E2E tests
npm run test:e2e
```

### Test Structure

- Unit tests for utilities and services
- Integration tests for API routes
- E2E tests for critical user flows
- Load tests for search performance

## 🚀 Deployment

### Vercel Deployment

1. **Connect repository**
   ```bash
   vercel
   ```

2. **Configure environment variables**
   - Add all `.env` variables in Vercel dashboard

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Database Migration

```bash
# Generate migration
npx prisma migrate dev --name init

# Apply migration in production
npx prisma migrate deploy
```

### Typesense Cloud

1. Sign up at typesense.org/cloud
2. Create a cluster
3. Update environment variables with cloud credentials

## 📚 API Documentation

### Authentication

```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
```

### Search

```
GET /api/search
  ?query=textile
  &hsnCode=5201
  &category=Cotton
  &country=India
  &minValue=10000
  &maxValue=1000000
  &verified=true
  &page=1
  &perPage=20
```

### Companies

```
GET /api/companies/:id
POST /api/companies/:id/report
```

### Admin (requires ADMIN role)

```
POST /api/admin/companies/:id/verify
POST /api/admin/ingest
GET /api/admin/reports
```

### Subscriptions

```
POST /api/subscriptions/checkout
POST /api/webhooks/stripe
```

See `docs/API.md` for full API documentation.

## 📋 Environment Variables

Required environment variables (see `.env.example`):

```env
# Database
DATABASE_URL=
DIRECT_URL=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Typesense
TYPESENSE_API_KEY=
TYPESENSE_HOST=
TYPESENSE_PORT=
TYPESENSE_PROTOCOL=
NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# App
NEXT_PUBLIC_APP_URL=
NODE_ENV=

# Data Sources
DGFT_DATA_URL=
```

## 🔧 Maintenance

### Database Backups

```bash
# Backup database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
```

### Typesense Maintenance

```bash
# Reindex all companies
npm run reindex:companies
```

### Monitoring

- **Error tracking**: Sentry
- **Performance**: Vercel Analytics
- **Logs**: Vercel Logs / Datadog
- **Uptime**: UptimeRobot

## 📝 Legal Documents

See `docs/legal/` for templates:
- Privacy Policy
- Terms of Service
- Data Processing Agreement
- Cookie Policy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## 📄 License

This project is proprietary. All rights reserved.

## 🆘 Support

For support:
- Email: support@exportersearch.com
- Documentation: `/docs`
- GitHub Issues: For bug reports

## 🎯 Success Metrics

### Technical KPIs
- Search latency < 100ms
- API response time < 200ms
- Uptime > 99.9%
- Zero critical security issues

### Business KPIs
- User sign-ups
- Conversion rate (free → paid)
- Monthly recurring revenue (MRR)
- Customer lifetime value (LTV)
- Churn rate

---

**Built with ❤️ for exporters and buyers in India**
