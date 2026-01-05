# PromptVault Complete Setup Checklist

**Goal**: Get PromptVault running locally and deploy to production

---

## 📋 PART 1: LOCAL DEVELOPMENT SETUP

### Step 1: Database Setup (Choose ONE option)

#### Option A: Supabase (Recommended - Easiest, Free)

1. **Create Account & Project**
   - Go to: https://supabase.com
   - Click "Sign Up" (use GitHub for quick signup)
   - Click "New Project"
   - Fill in:
     - **Project Name**: `promptvault`
     - **Database Password**: Create a strong password (save it!)
     - **Region**: Choose closest to you
     - **Pricing Plan**: Free
   - Click "Create new project" (takes ~2 minutes)

2. **Get Connection String**
   - Once created, go to **Settings** (gear icon in sidebar)
   - Click **Database** in the left menu
   - Scroll to "Connection string" section
   - Click **URI** tab
   - Find "Connection pooling" and select **Transaction mode** (important!)
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your database password

3. **Add to .env**
   ```bash
   ./setup-env.sh DATABASE_URL 'postgresql://postgres.xxxxx:YOUR-PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres'
   ```

#### Option B: Neon (Alternative Free Option)

1. Go to: https://neon.tech
2. Sign up with GitHub
3. Click "Create Project"
4. Copy the connection string shown
5. Add to .env:
   ```bash
   ./setup-env.sh DATABASE_URL 'your-neon-connection-string'
   ```

#### Option C: Local PostgreSQL

1. Install PostgreSQL:
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql

   # Create database
   createdb promptvault
   ```

2. Add to .env:
   ```bash
   ./setup-env.sh DATABASE_URL 'postgresql://localhost:5432/promptvault'
   ```

---

### Step 2: GitHub OAuth Setup (Required)

1. **Create OAuth Application**
   - Go to: https://github.com/settings/developers
   - Click **"OAuth Apps"** in left sidebar
   - Click **"New OAuth App"** button

2. **Fill in the form:**
   ```
   Application name:            PromptVault Local
   Homepage URL:                http://localhost:3000
   Application description:     (optional)
   Authorization callback URL:  http://localhost:3000/api/auth/callback/github
   ```

3. **Click "Register application"**

4. **Get Credentials**
   - You'll see **Client ID** - copy this
   - Click **"Generate a new client secret"**
   - Copy the **Client secret** (you won't see it again!)

5. **Add to .env**
   ```bash
   ./setup-env.sh GITHUB_ID 'your-client-id-here'
   ./setup-env.sh GITHUB_SECRET 'your-client-secret-here'
   ```

---

### Step 3: Initialize Database

```bash
# Create database tables
npm run db:push

# Seed with 50+ prompts
npm run db:seed
```

You should see:
```
✅ Created prompt packs
✅ Created 42 prompts
📊 Seed Summary:
  Free prompts: 10
  Starter Pack: 9 prompts
  ...
🎉 Database seeded successfully!
```

---

### Step 4: Run Locally

```bash
npm run dev
```

Open: http://localhost:3000

**✅ You should see:**
- Landing page with prompts
- Can browse and filter prompts
- Can sign in with GitHub
- Can view free prompts

---

## 📋 PART 2: OPTIONAL SERVICES (Add Later)

### Google OAuth (Optional - For Google Sign-in)

1. **Create Google Cloud Project**
   - Go to: https://console.cloud.google.com
   - Click "Select a project" → "New Project"
   - Name: `PromptVault`
   - Click "Create"

2. **Enable Google+ API**
   - In the search bar, type "Google+ API"
   - Click on it and click "Enable"

3. **Configure OAuth Consent Screen**
   - Go to: https://console.cloud.google.com/apis/credentials/consent
   - Click "Create" or "Configure Consent Screen"
   - Choose **"External"**
   - Fill in:
     - **App name**: PromptVault
     - **User support email**: your-email@gmail.com
     - **Developer contact**: your-email@gmail.com
   - Click "Save and Continue" through all steps

4. **Create OAuth Client ID**
   - Go to: https://console.cloud.google.com/apis/credentials
   - Click **"Create Credentials"** → **"OAuth client ID"**
   - Choose **"Web application"**
   - Fill in:
     - **Name**: PromptVault Local
     - **Authorized redirect URIs**:
       - `http://localhost:3000/api/auth/callback/google`
   - Click "Create"

5. **Get Credentials**
   - Copy **Client ID**
   - Copy **Client secret**

6. **Add to .env**
   ```bash
   ./setup-env.sh GOOGLE_CLIENT_ID 'your-client-id.apps.googleusercontent.com'
   ./setup-env.sh GOOGLE_CLIENT_SECRET 'your-secret'
   ```

---

### Stripe Setup (Optional - For Payments)

#### Part A: Get Stripe Account & Keys

1. **Create Stripe Account**
   - Go to: https://stripe.com
   - Click "Sign up"
   - Complete registration

2. **Get Test API Keys**
   - Go to: https://dashboard.stripe.com/test/apikeys
   - Copy **Publishable key** (starts with `pk_test_`)
   - Copy **Secret key** (starts with `sk_test_`)

3. **Add to .env**
   ```bash
   ./setup-env.sh STRIPE_SECRET_KEY 'sk_test_...'
   ./setup-env.sh STRIPE_PUBLISHABLE_KEY 'pk_test_...'
   ```

#### Part B: Create Products & Prices

1. **Go to Products**
   - Dashboard: https://dashboard.stripe.com/test/products
   - Click **"Add product"**

2. **Create Each Product:**

   **Product 1: Starter Pack**
   ```
   Name: Starter Pack
   Description: 15 essential prompts for getting started
   Pricing:
     - Price: $9.00
     - Billing period: One time
     - Price description: One-time purchase
   ```
   → Click "Save product"
   → Copy the **Price ID** (starts with `price_`)
   → Add to .env: `./setup-env.sh STRIPE_PRICE_STARTER 'price_...'`

   **Product 2: Pro Coding Pack**
   ```
   Name: Pro Coding Pack
   Description: Advanced coding prompts
   Pricing: $29.00 one-time
   ```
   → Save, copy Price ID
   → `./setup-env.sh STRIPE_PRICE_PRO_CODING 'price_...'`

   **Product 3: Complete Writing Pack**
   ```
   Name: Complete Writing Pack
   Description: Professional writing prompts
   Pricing: $29.00 one-time
   ```
   → Save, copy Price ID
   → `./setup-env.sh STRIPE_PRICE_WRITING 'price_...'`

   **Product 4: Business Bundle**
   ```
   Name: Business Bundle
   Description: Strategic business prompts
   Pricing: $49.00 one-time
   ```
   → Save, copy Price ID
   → `./setup-env.sh STRIPE_PRICE_BUSINESS 'price_...'`

   **Product 5: Premium Monthly**
   ```
   Name: Premium Subscription
   Description: Full access to all prompts
   Pricing:
     - Price: $12.00
     - Billing period: Monthly
     - Type: Recurring
   ```
   → Save, copy Price ID
   → `./setup-env.sh STRIPE_PRICE_PREMIUM_MONTHLY 'price_...'`

   **Product 6: Premium Lifetime**
   ```
   Name: Premium Lifetime Access
   Description: One-time payment for lifetime access
   Pricing: $99.00 one-time
   ```
   → Save, copy Price ID
   → `./setup-env.sh STRIPE_PRICE_PREMIUM_LIFETIME 'price_...'`

#### Part C: Webhook Setup (For Local Testing)

1. **Install Stripe CLI**
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows (with Scoop)
   scoop install stripe

   # Or download from: https://github.com/stripe/stripe-cli/releases
   ```

2. **Login to Stripe CLI**
   ```bash
   stripe login
   ```
   - Browser will open to authorize
   - Return to terminal

3. **Forward Webhooks to Local**
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   - Keep this running in a separate terminal
   - Copy the webhook signing secret (starts with `whsec_`)

4. **Add to .env**
   ```bash
   ./setup-env.sh STRIPE_WEBHOOK_SECRET 'whsec_...'
   ```

5. **Test Payment**
   - Go to http://localhost:3000/pricing
   - Click "Buy" on any pack
   - Use test card: `4242 4242 4242 4242`
   - Any future date, any CVC
   - Complete purchase
   - Check your terminal with Stripe CLI - you should see webhook events!

---

## 📋 PART 3: DEPLOY TO VERCEL

### Step 1: Prepare for Deployment

1. **Create Vercel Account**
   - Go to: https://vercel.com/signup
   - Sign up with GitHub (easiest)

### Step 2: Deploy

**Option A: One-Click Deploy**

1. Go to: https://vercel.com/new
2. Import your GitHub repository: `Prompt-Library-Template-Store`
3. Vercel auto-detects Next.js settings ✅
4. Click **"Deploy"** (don't add env vars yet)
5. Wait for deployment (~2 minutes)
6. You'll get a URL like: `https://prompt-library-template-store.vercel.app`

**Option B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts
# Set up and deploy: Y
# Which scope: (select your account)
# Link to existing project: N
# Project name: promptvault
# Directory: ./
# Override settings: N

# Deploy to production
vercel --prod
```

### Step 3: Configure Production Database

**If using Supabase** (same database for dev and prod):
- Use the same `DATABASE_URL` from your local .env

**If you want separate production database**:
- Create a new Supabase project for production
- Use its connection string in Vercel

### Step 4: Add Environment Variables to Vercel

1. **Go to Project Settings**
   - Dashboard: https://vercel.com/dashboard
   - Select your project
   - Click **"Settings"** tab
   - Click **"Environment Variables"** in left sidebar

2. **Add ALL variables** (one by one):

   Click **"Add New"** for each:

   ```
   Key: DATABASE_URL
   Value: (your Supabase connection string)
   Environment: Production, Preview, Development (select all)

   Key: NEXTAUTH_URL
   Value: https://your-app.vercel.app
   Environment: Production

   Key: NEXTAUTH_SECRET
   Value: (same secret from local .env)
   Environment: Production, Preview, Development

   Key: GITHUB_ID
   Value: (your GitHub client ID)
   Environment: Production, Preview, Development

   Key: GITHUB_SECRET
   Value: (your GitHub client secret)
   Environment: Production, Preview, Development

   Key: GOOGLE_CLIENT_ID
   Value: (if you have it)
   Environment: Production, Preview, Development

   Key: GOOGLE_CLIENT_SECRET
   Value: (if you have it)
   Environment: Production, Preview, Development

   Key: STRIPE_SECRET_KEY
   Value: sk_test_... (or sk_live_... for production)
   Environment: Production, Preview, Development

   Key: STRIPE_PUBLISHABLE_KEY
   Value: pk_test_... (or pk_live_... for production)
   Environment: Production

   Key: STRIPE_WEBHOOK_SECRET
   Value: (will add after webhook setup)
   Environment: Production

   (Add all STRIPE_PRICE_* variables the same way)
   ```

3. **Click "Save"** after each variable

### Step 5: Redeploy

After adding environment variables:

```bash
vercel --prod
```

Or in Vercel Dashboard:
- Go to Deployments
- Click "Redeploy" on latest deployment

### Step 6: Update OAuth Apps

**GitHub OAuth:**
1. Go to: https://github.com/settings/developers
2. Click on your OAuth App
3. Scroll to "Authorization callback URL"
4. **Add** (don't replace): `https://your-app.vercel.app/api/auth/callback/github`
5. Click "Update application"

**Google OAuth (if using):**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth client
3. Add to "Authorized redirect URIs":
   - `https://your-app.vercel.app/api/auth/callback/google`
4. Click "Save"

### Step 7: Initialize Production Database

**Option A: Using Vercel CLI**
```bash
# Pull production environment variables
vercel env pull .env.production

# Use production env
DATABASE_URL="..." npm run db:push
DATABASE_URL="..." npm run db:seed
```

**Option B: Using Prisma Studio**
```bash
# Run migrations
npx prisma db push

# Seed database
npm run db:seed
```

### Step 8: Configure Production Stripe Webhook

1. **Go to Stripe Webhooks**
   - Dashboard: https://dashboard.stripe.com/test/webhooks
   - Click **"Add endpoint"**

2. **Configure Endpoint**
   ```
   Endpoint URL: https://your-app.vercel.app/api/stripe/webhook

   Events to send:
     ✓ checkout.session.completed
     ✓ customer.subscription.created
     ✓ customer.subscription.updated
     ✓ customer.subscription.deleted
   ```

3. **Click "Add endpoint"**

4. **Get Webhook Secret**
   - Click on the webhook you just created
   - Click "Reveal" under "Signing secret"
   - Copy it (starts with `whsec_`)

5. **Add to Vercel**
   - Go back to Vercel project settings
   - Environment Variables
   - Add `STRIPE_WEBHOOK_SECRET` with the production webhook secret
   - Select "Production" environment only

6. **Redeploy**
   ```bash
   vercel --prod
   ```

### Step 9: Test Production Site

1. **Visit your site**: `https://your-app.vercel.app`

2. **Test Authentication**
   - Click "Sign in"
   - Try GitHub OAuth
   - Try Google OAuth (if configured)

3. **Test Browsing**
   - Browse prompts
   - Search and filter
   - View free prompts

4. **Test Purchase** (use test mode first!)
   - Go to Pricing
   - Click "Buy" on a pack
   - Use test card: `4242 4242 4242 4242`
   - Complete purchase
   - Check Stripe dashboard for payment
   - Check database for purchase record

---

## 📋 PART 4: GO LIVE CHECKLIST

When ready to accept real payments:

### Switch Stripe to Live Mode

1. **Get Live API Keys**
   - Go to: https://dashboard.stripe.com/apikeys (without /test)
   - Toggle to "Live mode" (top right)
   - Copy live keys

2. **Update Vercel Environment Variables**
   - Replace `STRIPE_SECRET_KEY` with `sk_live_...`
   - Replace `STRIPE_PUBLISHABLE_KEY` with `pk_live_...`

3. **Create Live Products**
   - Create same products in Live mode
   - Update all `STRIPE_PRICE_*` variables with live price IDs

4. **Update Live Webhook**
   - Create new webhook endpoint in Live mode
   - Update `STRIPE_WEBHOOK_SECRET` with live secret

### Production OAuth Apps (Recommended)

Create separate production OAuth apps:

**GitHub:**
- Name: `PromptVault` (not "Local")
- URL: `https://your-domain.com`
- Callback: `https://your-domain.com/api/auth/callback/github`

**Google:**
- Name: `PromptVault Production`
- Redirect: `https://your-domain.com/api/auth/callback/google`

Update Vercel with production credentials.

### Custom Domain (Optional)

1. **In Vercel Dashboard**
   - Project → Settings → Domains
   - Add your domain
   - Follow DNS instructions

2. **Update Environment Variables**
   - Change `NEXTAUTH_URL` to `https://yourdomain.com`

3. **Update OAuth Callbacks**
   - Update GitHub callback
   - Update Google callback
   - Update Stripe webhook URL

---

## 🔍 VERIFICATION CHECKLIST

After deployment, verify:

- [ ] Site loads at production URL
- [ ] Landing page displays correctly
- [ ] Can browse prompts
- [ ] Search and filter work
- [ ] Sign in with GitHub works
- [ ] Sign in with Google works (if configured)
- [ ] Can view free prompts when logged out
- [ ] Can view free prompts when logged in
- [ ] Dashboard loads for logged-in users
- [ ] Can save prompts to library
- [ ] Pricing page displays correctly
- [ ] Checkout redirects to Stripe
- [ ] Test payment completes successfully
- [ ] Purchase appears in dashboard
- [ ] Webhook events show in Stripe logs
- [ ] Premium prompts unlock after purchase
- [ ] Can access customer portal
- [ ] Mobile responsive design works
- [ ] Dark mode works

---

## 📚 IMPORTANT LINKS SUMMARY

**Services to Sign Up For:**
- Database: https://supabase.com or https://neon.tech
- GitHub OAuth: https://github.com/settings/developers
- Google OAuth: https://console.cloud.google.com
- Stripe: https://stripe.com
- Vercel: https://vercel.com/signup

**Documentation:**
- Supabase Docs: https://supabase.com/docs
- NextAuth Docs: https://next-auth.js.org
- Stripe Docs: https://stripe.com/docs
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://prisma.io/docs

**Your Project:**
- GitHub Repo: https://github.com/discover-Austin/Prompt-Library-Template-Store
- Local: http://localhost:3000
- Production: https://your-app.vercel.app (after deploy)

---

## 💡 QUICK START (Minimum to Run Locally)

**Just want to see it work? Do this:**

1. Set up Supabase database (2 min) → Get `DATABASE_URL`
2. Create GitHub OAuth app (2 min) → Get `GITHUB_ID` and `GITHUB_SECRET`
3. Update .env with those 3 values
4. Run:
   ```bash
   npm run db:push
   npm run db:seed
   npm run dev
   ```
5. Open http://localhost:3000

**Everything else (Google, Stripe, Vercel) can be added later!**

---

## 🆘 TROUBLESHOOTING

**Database connection failed:**
- Check DATABASE_URL is correct
- For Supabase, ensure "Transaction" pooling mode
- Test connection: `npx prisma db push`

**OAuth not working:**
- Verify callback URLs match exactly
- Check client ID and secret are correct
- Make sure OAuth app is not suspended

**Stripe webhook failing:**
- Check webhook URL is accessible
- Verify webhook secret is correct
- Look at webhook logs in Stripe dashboard

**Build failing on Vercel:**
- Check all environment variables are set
- Look at deployment logs in Vercel
- Ensure database is accessible from Vercel

---

Need help with any specific step? Let me know!
