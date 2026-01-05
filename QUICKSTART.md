# Quick Start Guide

Get PromptVault running locally in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running (or use free cloud option)
- GitHub account (for OAuth)

## 1. Clone & Install

```bash
git clone <your-repo>
cd prompt-vault
npm install
```

## 2. Set Up Database

**Option A: Use Supabase (Free, Easiest)**

1. Go to [supabase.com](https://supabase.com) → Sign up → New Project
2. Copy connection string from Settings → Database
3. Paste into `.env` as `DATABASE_URL`

**Option B: Local PostgreSQL**

```bash
createdb promptvault
```

## 3. Create `.env` File

```bash
cp .env.example .env
```

Edit `.env` and add:

```env
DATABASE_URL="postgresql://..." # From Step 2
NEXTAUTH_SECRET="your-secret-here" # Generate: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth (Get from github.com/settings/developers)
GITHUB_ID="your-github-id"
GITHUB_SECRET="your-github-secret"

# For now, use placeholder values for these:
GOOGLE_CLIENT_ID="placeholder"
GOOGLE_CLIENT_SECRET="placeholder"
STRIPE_SECRET_KEY="sk_test_placeholder"
STRIPE_PUBLISHABLE_KEY="pk_test_placeholder"
STRIPE_WEBHOOK_SECRET="whsec_placeholder"
```

## 4. Set Up GitHub OAuth

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Name: `PromptVault Local`
   - Homepage: `http://localhost:3000`
   - Callback: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID → `GITHUB_ID` in `.env`
5. Generate secret → `GITHUB_SECRET` in `.env`

## 5. Initialize Database

```bash
npm run db:push    # Create tables
npm run db:seed    # Add 50+ prompts
```

## 6. Run!

```bash
npm run dev
```

Open http://localhost:3000 🎉

## What You Can Do Now

✅ Browse 50+ AI prompts
✅ Sign in with GitHub
✅ View free prompts
✅ Copy prompts to clipboard
✅ Search and filter prompts

## To Enable Full Features

### Google OAuth (Optional)
1. Get credentials from Google Cloud Console
2. Add to `.env`

### Stripe Payments
1. Create Stripe account
2. Get test API keys
3. Create products/prices
4. Add to `.env`
5. Install Stripe CLI: `brew install stripe/stripe-cli/stripe`
6. Forward webhooks: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

## Common Issues

**"Database connection failed"**
- Check DATABASE_URL is correct
- Verify database is running

**"OAuth error"**
- Check GitHub OAuth app callback URL
- Verify GITHUB_ID and GITHUB_SECRET are correct

**"No prompts showing"**
- Run `npm run db:seed`

**Build errors**
- Delete `node_modules` and `.next`
- Run `npm install` again

## Next Steps

1. Read [README.md](README.md) for full documentation
2. See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
3. Start customizing prompts in `src/data/seed-prompts.json`
4. Modify branding in `src/components/navbar.tsx`

Need help? Check the troubleshooting section in README.md
