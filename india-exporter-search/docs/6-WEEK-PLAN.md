# 6-Week Development Plan
## India Exporter Buyer Search MVP

This document outlines a detailed 6-week plan to build and launch the MVP.

---

## Week 1: Foundation & Authentication

### Goals
- Set up project infrastructure
- Implement authentication system
- Design and create database schema
- Build landing page

### Tasks

#### Day 1-2: Project Setup
- [x] Initialize Next.js project with TypeScript
- [x] Configure Tailwind CSS
- [x] Set up Git repository
- [x] Configure ESLint and Prettier
- [x] Set up Supabase project
- [x] Configure environment variables
- [ ] Set up development/staging/production environments

#### Day 3-4: Database & Authentication
- [x] Design database schema (Prisma)
- [x] Create all models (User, Company, Search, etc.)
- [x] Set up Prisma Client
- [x] Configure Supabase Auth
- [x] Implement email/password authentication
- [ ] Implement Google OAuth
- [ ] Set up email verification
- [ ] Create password reset flow

#### Day 5-7: Landing Page & Basic Layout
- [x] Create landing page with hero section
- [x] Build responsive navigation
- [x] Design and implement footer
- [ ] Create pricing page mockup
- [ ] Set up layout components
- [ ] Implement dark mode (optional)
- [ ] Add SEO metadata

### Deliverables
- ✅ Functional landing page
- ✅ User registration and login
- ✅ Database schema deployed
- Working authentication flow

---

## Week 2: Data Ingestion & Cleaning

### Goals
- Build DGFT data connector
- Implement data cleaning pipeline
- Create deduplication logic
- Implement auto-verification system

### Tasks

#### Day 8-9: CSV Parser & Data Model Mapping
- [x] Set up PapaParse for CSV parsing
- [x] Map DGFT CSV columns to database schema
- [x] Create data transformation utilities
- [x] Implement data validation (Zod schemas)
- [ ] Handle multiple CSV formats
- [ ] Create CSV upload interface for admin

#### Day 10-11: Data Cleaning & Deduplication
- [x] Implement data sanitization functions
- [x] Build deduplication algorithm
- [x] Handle missing/invalid data gracefully
- [ ] Create data quality scoring
- [ ] Log data quality issues
- [ ] Build admin interface for reviewing flagged records

#### Day 12-14: Auto-Verification System
- [x] Implement website verification (HEAD request)
- [x] Implement email verification (MX record check)
- [x] Implement phone format validation
- [x] Create verification status workflow
- [ ] Add retry logic for failed verifications
- [ ] Schedule periodic re-verification
- [ ] Build verification history tracking

### Deliverables
- ✅ Working data ingestion API endpoint
- ✅ CSV parser that handles DGFT format
- ✅ Deduplication logic preventing duplicates
- ✅ Auto-verification checks running on import
- Ingestion logs and error tracking

---

## Week 3: Search System

### Goals
- Set up Typesense search engine
- Implement search API
- Build search UI with filters
- Implement pagination and relevance ranking

### Tasks

#### Day 15-16: Typesense Setup
- [x] Set up Typesense server (Docker/Cloud)
- [x] Create collection schema
- [x] Implement indexing function
- [ ] Index existing companies from database
- [ ] Set up search-only API key
- [ ] Configure relevance tuning

#### Day 17-18: Search API
- [x] Build search API endpoint (`/api/search`)
- [x] Implement query parsing
- [x] Add filter support (HSN, category, country, value range)
- [x] Implement pagination
- [x] Add sorting by relevance/value
- [ ] Implement search analytics tracking

#### Day 19-21: Search UI
- [ ] Build search page layout
- [ ] Create search input with autocomplete
- [ ] Implement filter sidebar
- [ ] Build results list component
- [ ] Add pagination controls
- [ ] Create company detail modal/page
- [ ] Implement "no results" state
- [ ] Add loading skeletons

### Deliverables
- ✅ Fully functional search API
- ✅ Indexed companies in Typesense
- Search UI with filters and pagination
- Sub-100ms search latency
- Search result page with company cards

---

## Week 4: Verification Workflow & Admin Dashboard

### Goals
- Build admin dashboard
- Implement company verification workflow
- Create report management system
- Build analytics views

### Tasks

#### Day 22-23: Admin Authentication & Layout
- [ ] Create admin-only routes
- [ ] Build admin dashboard layout
- [ ] Implement role-based access control
- [ ] Create admin navigation menu
- [ ] Add admin middleware

#### Day 24-26: Verification Interface
- [x] Build company review API endpoint
- [ ] Create pending companies list
- [ ] Build company detail review page
- [ ] Implement approve/reject actions
- [ ] Show auto-verification results
- [ ] Add bulk approval functionality
- [ ] Create verification history log

#### Day 27-28: Report Management & Analytics
- [x] Build report submission API
- [ ] Create reports dashboard
- [ ] Implement report review workflow
- [ ] Build user analytics dashboard
- [ ] Create search analytics charts
- [ ] Add data quality metrics
- [ ] Implement revenue tracking

### Deliverables
- Admin dashboard with authentication
- Company verification interface
- Report management system
- Basic analytics and metrics
- Audit log viewer

---

## Week 5: Payments & Subscription System

### Goals
- Integrate Stripe payments
- Implement subscription plans
- Build paywall logic
- Create pricing page and checkout flow

### Tasks

#### Day 29-30: Stripe Integration
- [x] Set up Stripe account
- [x] Create Stripe products and prices
- [x] Implement Stripe client library
- [x] Build checkout session API
- [x] Implement webhook handler
- [ ] Set up Stripe CLI for local testing
- [ ] Configure webhook signing

#### Day 31-32: Subscription Management
- [x] Implement subscription creation
- [x] Handle subscription updates
- [x] Implement cancellation flow
- [ ] Build customer portal link
- [ ] Add subscription status checks
- [ ] Implement credit system
- [ ] Handle failed payments

#### Day 33-35: Pricing Page & Checkout UI
- [ ] Design pricing page
- [ ] Build plan comparison cards
- [ ] Create checkout flow
- [ ] Add payment success/failure pages
- [ ] Implement upgrade/downgrade UI
- [ ] Build billing history page
- [ ] Add invoice download

### Deliverables
- ✅ Stripe integration with test mode working
- ✅ Subscription plans configured
- ✅ Webhook handling payment events
- ✅ Freemium limits enforced in search
- Pricing page with checkout
- Customer portal for subscription management

---

## Week 6: Security, Testing & Launch Prep

### Goals
- Perform security audit
- Optimize performance
- Set up monitoring and logging
- Deploy to production
- Write final documentation

### Tasks

#### Day 36-37: Security Audit
- [ ] Run OWASP ZAP security scan
- [ ] Review and fix any vulnerabilities
- [ ] Implement CSP headers
- [ ] Add CSRF protection
- [ ] Review rate limiting
- [ ] Test authentication edge cases
- [ ] Audit logging for sensitive actions
- [ ] Review environment variable security

#### Day 38-39: Performance & Monitoring
- [ ] Set up Sentry for error tracking
- [ ] Configure Vercel Analytics
- [ ] Optimize database queries
- [ ] Add Redis caching (if needed)
- [ ] Optimize image loading
- [ ] Run Lighthouse audits
- [ ] Test search performance under load
- [ ] Set up uptime monitoring

#### Day 40-41: Testing & CI/CD
- [ ] Write unit tests for critical utilities
- [ ] Write integration tests for API routes
- [ ] Set up GitHub Actions workflow
- [ ] Configure automated testing
- [ ] Add test coverage reporting
- [ ] Set up staging environment
- [ ] Configure automatic deployments

#### Day 42: Final Documentation & Launch
- [x] Finalize README
- [ ] Complete API documentation
- [ ] Write deployment guide
- [x] Create legal documents (Privacy, Terms)
- [ ] Prepare launch checklist
- [ ] Deploy to production
- [ ] Verify all features working
- [ ] Set up analytics tracking

### Deliverables
- Security audit completed with fixes
- Monitoring and logging set up
- CI/CD pipeline configured
- Full test coverage for critical paths
- Complete documentation
- Production deployment
- Launch checklist completed

---

## Post-Launch Tasks

### Week 7+: Iteration & Growth

#### Immediate Post-Launch
- [ ] Monitor error rates and fix critical issues
- [ ] Gather user feedback
- [ ] Track conversion metrics
- [ ] Optimize search relevance based on usage
- [ ] Add missing features based on feedback

#### Short Term (1-3 months)
- [ ] Add more data sources beyond DGFT
- [ ] Implement advanced search features
- [ ] Build export to CSV/Excel functionality
- [ ] Add email notifications for saved searches
- [ ] Create API access for enterprise users
- [ ] Add company comparison feature
- [ ] Implement saved searches/favorites

#### Medium Term (3-6 months)
- [ ] Build mobile app (React Native)
- [ ] Add AI-powered recommendations
- [ ] Implement trade analytics dashboard
- [ ] Add multi-language support
- [ ] Create marketplace for verified suppliers
- [ ] Add messaging system between buyers/exporters
- [ ] Implement advanced reporting tools

---

## Risk Mitigation

### Technical Risks
| Risk | Mitigation |
|------|------------|
| Typesense performance issues | Use Typesense Cloud, implement caching, optimize queries |
| Data quality problems | Implement robust validation, manual review workflow |
| API rate limiting hits | Implement proper rate limiting, queue system for batch operations |
| Stripe webhook failures | Implement retry logic, log all webhook events |

### Business Risks
| Risk | Mitigation |
|------|------------|
| Low conversion rate | A/B test pricing, improve onboarding, add free trial |
| Poor data quality | Manual curation, user reporting, incentivize corrections |
| High churn rate | Improve product value, add retention features, email campaigns |
| Competition | Focus on unique features, better UX, verified data quality |

---

## Success Criteria

### MVP Launch Criteria
- [ ] All core features working (auth, search, payment, admin)
- [ ] At least 10,000 verified companies in database
- [ ] Search returns results in < 100ms
- [ ] Zero critical security vulnerabilities
- [ ] 99% uptime over 7 days
- [ ] Payment processing working end-to-end
- [ ] Mobile responsive design
- [ ] Legal documents published

### Post-Launch Metrics (30 days)
- 500+ user registrations
- 50+ paid subscribers
- 5,000+ searches performed
- < 5% error rate
- < 10% churn rate
- Average search latency < 100ms

---

## Resource Requirements

### Team
- **Full-stack Developer**: 1 (primary)
- **Designer**: 0.5 (part-time, weeks 1-3)
- **QA Tester**: 0.5 (part-time, week 6)

### Services & Tools
- Vercel Pro: ~$20/month
- Supabase Pro: ~$25/month
- Typesense Cloud: ~$49/month
- Stripe: Transaction fees only
- Domain & Email: ~$20/year
- Monitoring tools: Free tiers initially

### Total Monthly Cost (MVP)
- ~$100-150/month for infrastructure
- Scale up as usage grows

---

## Conclusion

This 6-week plan provides a structured approach to building and launching the India Exporter Buyer Search MVP. The plan is aggressive but achievable with focused execution. Regular check-ins and adjustments should be made throughout the process based on progress and learnings.

**Key Success Factors:**
1. Start simple, iterate quickly
2. Focus on core value proposition (verified search)
3. Ensure data quality from day one
4. Don't over-engineer - ship fast
5. Listen to early users and adapt

Good luck! 🚀
