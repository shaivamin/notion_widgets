# Deployment Guide
## India Exporter Buyer Search MVP

This guide covers deploying the application to production using Vercel, Supabase, and Typesense Cloud.

## Prerequisites

Before deploying, ensure you have:
- [x] Vercel account
- [x] Supabase account and project
- [x] Typesense Cloud account (or self-hosted server)
- [x] Stripe account
- [x] Domain name (optional)
- [x] GitHub repository

## Step 1: Database Setup (Supabase)

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose a name and region
4. Set a secure database password
5. Wait for project to be provisioned

### 1.2 Configure Database

```bash
# Install Prisma CLI
npm install -g prisma

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 1.3 Get Connection Strings

1. Go to Project Settings → Database
2. Copy the connection string
3. Update `.env`:
   ```
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   ```

### 1.4 Configure Auth

1. Go to Authentication → Providers
2. Enable Email provider
3. Enable Google OAuth:
   - Create Google OAuth app
   - Add credentials to Supabase
4. Configure redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

## Step 2: Search Engine Setup (Typesense)

### Option A: Typesense Cloud (Recommended)

1. Go to [cloud.typesense.org](https://cloud.typesense.org)
2. Create a new cluster
3. Choose a region close to your users
4. Select a plan (start with smallest)
5. Copy the API key and host
6. Update `.env`:
   ```
   TYPESENSE_API_KEY="your-admin-key"
   TYPESENSE_HOST="xxx.a1.typesense.net"
   TYPESENSE_PORT="443"
   TYPESENSE_PROTOCOL="https"
   ```

### Option B: Self-Hosted Typesense

```bash
# Using Docker
docker run -d \
  -p 8108:8108 \
  -v /tmp/typesense-data:/data \
  typesense/typesense:27.1 \
  --data-dir /data \
  --api-key=your-secret-key \
  --enable-cors
```

### Initialize Collection

```bash
# Create Typesense collection
npm run init:typesense
```

Or manually:
```bash
curl "http://localhost:8108/collections" \
  -X POST \
  -H "X-TYPESENSE-API-KEY: ${TYPESENSE_API_KEY}" \
  -d @prisma/typesense-schema.json
```

## Step 3: Payment Setup (Stripe)

### 3.1 Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Create account
3. Complete business verification

### 3.2 Create Products

1. Go to Products
2. Create three products:
   - Monthly Subscription ($49/mo)
   - Yearly Subscription ($499/yr)
   - Credit Package ($19 for 50 credits)
3. Copy the price IDs

### 3.3 Configure Webhooks

1. Go to Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the webhook signing secret

### 3.4 Update Environment Variables

```env
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
```

## Step 4: Vercel Deployment

### 4.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework: Next.js
   - Build command: `npm run build`
   - Output directory: `.next`

### 4.2 Configure Environment Variables

Add all environment variables from `.env.example`:

```
DATABASE_URL
DIRECT_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
TYPESENSE_API_KEY
TYPESENSE_HOST
TYPESENSE_PORT
TYPESENSE_PROTOCOL
NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_APP_URL
NODE_ENV=production
```

### 4.3 Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Verify deployment at Vercel URL

### 4.4 Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as shown
4. Wait for DNS propagation

## Step 5: Post-Deployment Configuration

### 5.1 Update Redirect URLs

Update in Supabase Auth:
```
https://yourdomain.com/auth/callback
https://yourdomain.com/*
```

Update in Stripe:
```
https://yourdomain.com/dashboard?checkout=success
https://yourdomain.com/pricing?checkout=cancelled
```

### 5.2 Create Admin User

```bash
# Connect to database
psql $DATABASE_URL

# Update user role to ADMIN
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@yourdomain.com';
```

### 5.3 Initial Data Import

```bash
# Trigger first data ingestion
curl -X POST https://yourdomain.com/api/admin/ingest \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"csvUrl": "https://path-to-dgft-data.csv"}'
```

## Step 6: Monitoring Setup

### 6.1 Sentry (Error Tracking)

1. Create Sentry account
2. Create new project
3. Get DSN
4. Add to environment variables:
   ```
   SENTRY_DSN="https://..."
   ```
5. Install Sentry SDK:
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

### 6.2 Vercel Analytics

1. Go to Project Settings → Analytics
2. Enable Vercel Analytics
3. Add to `app/layout.tsx`:
   ```tsx
   import { Analytics } from '@vercel/analytics/react'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     )
   }
   ```

### 6.3 Uptime Monitoring

1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Add HTTP monitor
3. Set URL to: `https://yourdomain.com/api/health`
4. Set check interval: 5 minutes
5. Configure alert email

## Step 7: Security Hardening

### 7.1 Content Security Policy

Add to `next.config.ts`:
```typescript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
```

### 7.2 Rate Limiting

Already implemented in code. Verify it's working:
```bash
# Test rate limit
for i in {1..150}; do
  curl https://yourdomain.com/api/search
done
# Should return 429 after 100 requests
```

### 7.3 Environment Variable Security

1. Never commit `.env` files
2. Use Vercel's environment variable encryption
3. Rotate secrets regularly
4. Use different keys for dev/staging/prod

## Step 8: Backup Configuration

### 8.1 Database Backups

Supabase provides automatic daily backups. To create manual backup:

```bash
# Export database
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore database
psql $DATABASE_URL < backup-20240101.sql
```

### 8.2 Typesense Backup

Typesense data can be rebuilt from PostgreSQL:

```bash
# Run reindex script
npm run reindex:companies
```

## Step 9: CI/CD Pipeline

### 9.1 GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 9.2 Vercel Integration

Vercel automatically deploys on:
- `main` branch → Production
- Other branches → Preview deployments

## Step 10: Launch Checklist

### Pre-Launch
- [ ] All environment variables set
- [ ] Database schema deployed
- [ ] Typesense collection created
- [ ] Initial data imported
- [ ] Admin user created
- [ ] Payment test completed
- [ ] All pages load correctly
- [ ] Mobile responsive verified
- [ ] SEO meta tags added
- [ ] Legal pages published
- [ ] Analytics configured
- [ ] Error tracking setup

### Security
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting tested
- [ ] Authentication working
- [ ] Authorization working
- [ ] Webhook signature verification
- [ ] Input validation active
- [ ] SQL injection protection
- [ ] XSS protection

### Performance
- [ ] Lighthouse score > 90
- [ ] Search latency < 100ms
- [ ] API response time < 200ms
- [ ] Images optimized
- [ ] Caching configured

### Monitoring
- [ ] Uptime monitoring active
- [ ] Error tracking active
- [ ] Analytics tracking
- [ ] Log aggregation
- [ ] Alert notifications configured

## Rollback Procedure

If something goes wrong:

1. **Immediate Rollback (Vercel)**
   ```bash
   vercel rollback
   ```

2. **Database Rollback**
   ```bash
   psql $DATABASE_URL < last-known-good-backup.sql
   ```

3. **Typesense Rollback**
   ```bash
   npm run reindex:companies
   ```

## Support

For deployment issues:
- Vercel: https://vercel.com/support
- Supabase: https://supabase.com/support  
- Typesense: https://typesense.org/support

## Maintenance Windows

Schedule maintenance during low-traffic hours:
- Database migrations: Sunday 2-4 AM IST
- Search reindexing: Daily at 3 AM IST
- Dependency updates: Monthly

---

**Deployment Status Dashboard**: Create at `/admin/status`
