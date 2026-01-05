# Deployment Guide - PromptVault

This guide will walk you through deploying PromptVault to production.

## Prerequisites Checklist

Before deploying, ensure you have:

- [ ] PostgreSQL database (Supabase, Neon, or other)
- [ ] GitHub OAuth App credentials
- [ ] Google OAuth App credentials
- [ ] Stripe account with products/prices created
- [ ] Vercel account (recommended) or other hosting

## Step 1: Database Setup

### Option A: Supabase (Recommended)

1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project
3. Go to Settings → Database
4. Copy connection string (make sure to use "Transaction" pooling mode for Prisma)
5. Replace `[YOUR-PASSWORD]` with your actual password
6. Save as `DATABASE_URL` environment variable

### Option B: Neon

1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Save as `DATABASE_URL`

### Option C: Railway/Render

Similar process - create PostgreSQL instance and get connection string.

## Step 2: OAuth Setup

### GitHub OAuth

1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - Application name: `PromptVault`
   - Homepage URL: `https://yourdomain.com`
   - Authorization callback URL: `https://yourdomain.com/api/auth/callback/github`
4. Click "Register application"
5. Copy Client ID → save as `GITHUB_ID`
6. Generate new client secret → save as `GITHUB_SECRET`

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth client ID
5. Choose "Web application"
6. Add authorized redirect URI: `https://yourdomain.com/api/auth/callback/google`
7. Copy Client ID → save as `GOOGLE_CLIENT_ID`
8. Copy Client Secret → save as `GOOGLE_CLIENT_SECRET`

## Step 3: Stripe Setup

### Create Products

In Stripe Dashboard, create these products with one-time or recurring prices:

1. **Starter Pack** - $9.00 one-time payment
   - Save price ID as `STRIPE_PRICE_STARTER`

2. **Pro Coding Pack** - $29.00 one-time payment
   - Save price ID as `STRIPE_PRICE_PRO_CODING`

3. **Complete Writing Pack** - $29.00 one-time payment
   - Save price ID as `STRIPE_PRICE_WRITING`

4. **Business Bundle** - $49.00 one-time payment
   - Save price ID as `STRIPE_PRICE_BUSINESS`

5. **Premium Monthly** - $12.00/month recurring
   - Save price ID as `STRIPE_PRICE_PREMIUM_MONTHLY`

6. **Premium Lifetime** - $99.00 one-time payment
   - Save price ID as `STRIPE_PRICE_PREMIUM_LIFETIME`

### Get API Keys

1. Go to Stripe Dashboard → Developers → API keys
2. Copy "Secret key" → save as `STRIPE_SECRET_KEY`
3. Copy "Publishable key" → save as `STRIPE_PUBLISHABLE_KEY`

## Step 4: Deploy to Vercel

### Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### Add Environment Variables in Vercel

Go to Project Settings → Environment Variables and add:

```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
GITHUB_ID=...
GITHUB_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (add after Step 5)
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_PRO_CODING=price_...
STRIPE_PRICE_WRITING=price_...
STRIPE_PRICE_BUSINESS=price_...
STRIPE_PRICE_PREMIUM_MONTHLY=price_...
STRIPE_PRICE_PREMIUM_LIFETIME=price_...
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## Step 5: Database Migration & Seeding

After deploying to Vercel:

```bash
# Push database schema
npx prisma db push

# Seed with 50+ prompts
npm run db:seed
```

Or via Vercel CLI:
```bash
vercel env pull .env.local
npx prisma db push
npm run db:seed
```

## Step 6: Stripe Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-domain.vercel.app/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Reveal webhook signing secret
7. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`
8. Redeploy: `vercel --prod`

## Step 7: Update OAuth Redirect URLs

Now that you have your production domain:

1. **GitHub OAuth App**:
   - Update Homepage URL to `https://your-domain.vercel.app`
   - Update callback to `https://your-domain.vercel.app/api/auth/callback/github`

2. **Google OAuth**:
   - Update authorized redirect URI to `https://your-domain.vercel.app/api/auth/callback/google`

## Step 8: Test Everything

### Test Authentication
1. Visit your site
2. Click "Sign in"
3. Test GitHub OAuth
4. Test Google OAuth
5. Verify you're redirected to dashboard

### Test Free Prompts
1. Browse prompts
2. Click on a free prompt
3. Verify you can view and copy

### Test Purchase Flow
1. Go to Pricing page
2. Click "Buy" on a pack
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete purchase
5. Verify redirect to dashboard
6. Check purchase appears in dashboard
7. Verify access to purchased prompts

### Test Subscription
1. Subscribe to Premium
2. Verify access to all prompts
3. Test customer portal (Manage Subscription button)
4. Verify you can update payment method

## Step 9: Custom Domain (Optional)

1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` to your custom domain
6. Update OAuth redirect URLs
7. Update Stripe webhook URL
8. Redeploy

## Step 10: Production Checklist

Before launching:

- [ ] All environment variables set correctly
- [ ] Database migrated and seeded
- [ ] Stripe webhook configured and tested
- [ ] OAuth providers tested (GitHub & Google)
- [ ] Test purchase flow end-to-end
- [ ] Test subscription flow
- [ ] Verify email in Stripe is correct
- [ ] Check error monitoring (optional: add Sentry)
- [ ] Test on mobile devices
- [ ] Run accessibility check
- [ ] Test dark mode
- [ ] Set up domain (if using custom)
- [ ] Add privacy policy page
- [ ] Add terms of service page
- [ ] Configure analytics (optional)

## Troubleshooting

### "Invalid environment variables"
- Check `.env` file has all required variables
- Verify no trailing spaces in values
- Regenerate secrets if needed

### "Database connection failed"
- Verify DATABASE_URL is correct
- Check database is accessible from Vercel IP ranges
- For Supabase: use Transaction pooling mode

### "OAuth error"
- Verify redirect URLs exactly match (including https)
- Check OAuth app is not suspended
- Verify client ID and secret are correct

### "Stripe webhook failing"
- Verify webhook secret is correct
- Check webhook URL is accessible
- Verify events are selected correctly
- Check webhook logs in Stripe dashboard

### "Prompts not showing"
- Verify database was seeded: `npm run db:seed`
- Check database connection
- Look for errors in Vercel logs

## Monitoring

### Vercel Logs
```bash
vercel logs your-project-name
```

### Stripe Webhooks
Check Stripe Dashboard → Developers → Webhooks → [Your endpoint] → Attempts

### Database
Use Prisma Studio to inspect database:
```bash
npx prisma studio
```

## Scaling Considerations

As you grow:

1. **Database**: Upgrade to production tier with connection pooling
2. **Stripe**: Switch to live mode keys
3. **Caching**: Add Redis for session storage
4. **CDN**: Vercel handles this automatically
5. **Monitoring**: Add Sentry or similar
6. **Analytics**: Add Plausible, Umami, or similar

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Stripe webhook logs
3. Check browser console for errors
4. Verify all environment variables
5. Test locally first: `npm run dev`

---

## Quick Start Commands

```bash
# Generate auth secret
openssl rand -base64 32

# Push database schema
npx prisma db push

# Seed database
npm run db:seed

# Deploy to Vercel
vercel --prod

# View logs
vercel logs

# Test locally
npm run dev
```

## Next Steps After Deployment

1. Submit to Product Hunt
2. Share on social media
3. Add to marketplace directories
4. Set up email marketing (if applicable)
5. Monitor analytics and iterate
6. Gather user feedback
7. Add more prompts regularly

Congratulations on deploying PromptVault! 🎉
