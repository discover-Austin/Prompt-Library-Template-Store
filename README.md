# PromptVault - Professional Prompt Library & Template Store

A production-ready web application for selling AI prompt templates and prompt engineering frameworks. Built with Next.js 14, TypeScript, Prisma, and Stripe.

![PromptVault](https://via.placeholder.com/1200x630?text=PromptVault)

## 🚀 Features

- **50+ Production-Quality Prompts** - Expert-crafted templates for coding, writing, business, research, productivity, and creative work
- **Multi-Platform Support** - Compatible with ChatGPT, Claude, Gemini, and other AI platforms
- **Variable System** - Dynamic prompt templates with customizable variables
- **Authentication** - GitHub and Google OAuth via NextAuth.js
- **Payment Processing** - Stripe integration for one-time purchases and subscriptions
- **User Dashboard** - Saved prompts, purchase history, and subscription management
- **Responsive Design** - Mobile-first design with dark mode support
- **SEO Optimized** - Meta tags, OpenGraph, and sitemap ready
- **Type-Safe** - Full TypeScript coverage

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Payments**: Stripe
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Deployment**: Vercel-ready

## 🛠️ Installation

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- Stripe account
- GitHub OAuth App
- Google OAuth App

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd prompt-vault
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**Required Environment Variables:**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/promptvault"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="" # Generate with: openssl rand -base64 32

# OAuth Providers
GITHUB_ID="your-github-oauth-app-id"
GITHUB_SECRET="your-github-oauth-app-secret"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..." # Get from Stripe CLI or dashboard

# Stripe Price IDs
STRIPE_PRICE_STARTER="price_..."
STRIPE_PRICE_PRO_CODING="price_..."
STRIPE_PRICE_WRITING="price_..."
STRIPE_PRICE_BUSINESS="price_..."
STRIPE_PRICE_PREMIUM_MONTHLY="price_..."
STRIPE_PRICE_PREMIUM_LIFETIME="price_..."
```

### 4. Set up the database

```bash
# Push schema to database
npm run db:push

# Seed with 50+ prompts
npm run db:seed
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Configuration Guides

### Setting up GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Homepage URL to `http://localhost:3000`
4. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`
5. Copy Client ID and Client Secret to `.env`

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

### Setting up Stripe

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the [Dashboard](https://dashboard.stripe.com/test/apikeys)
3. Create products and prices:
   - Starter Pack: $9 one-time
   - Pro Coding Pack: $29 one-time
   - Complete Writing Pack: $29 one-time
   - Business Bundle: $49 one-time
   - Premium Monthly: $12/month subscription
   - Premium Lifetime: $99 one-time
4. Copy price IDs to `.env`
5. Set up webhook endpoint (see Webhook Setup below)

### Stripe Webhook Setup

**Development (using Stripe CLI):**

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy webhook secret to .env
```

**Production (Vercel):**

1. Deploy to Vercel
2. Add webhook endpoint in Stripe Dashboard: `https://yourdomain.com/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy webhook secret to Vercel environment variables

### Database Setup

**Option 1: Supabase (Recommended for beginners)**

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string from Settings → Database
4. Replace `[YOUR-PASSWORD]` in connection string
5. Add to `.env` as `DATABASE_URL`

**Option 2: Neon**

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Add to `.env` as `DATABASE_URL`

**Option 3: Local PostgreSQL**

```bash
# Install PostgreSQL
brew install postgresql

# Start service
brew services start postgresql

# Create database
createdb promptvault

# Use connection string
DATABASE_URL="postgresql://localhost:5432/promptvault"
```

## 🚀 Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/prompt-vault)

**Manual Deployment:**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Post-Deployment Checklist

- [ ] Add all environment variables in Vercel
- [ ] Run database migration: `npx prisma db push`
- [ ] Seed database: `npm run db:seed`
- [ ] Configure Stripe webhook with production URL
- [ ] Update OAuth redirect URIs to production domain
- [ ] Test purchase flow end-to-end
- [ ] Set up custom domain (optional)

## 📝 Usage

### For Developers

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema changes to database
npm run db:seed      # Seed database with prompts
```

### Project Structure

```
prompt-vault/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seeding script
├── src/
│   ├── app/
│   │   ├── (marketing)/    # Public pages (landing, browse, pricing)
│   │   ├── (dashboard)/    # Protected pages (dashboard)
│   │   ├── login/          # Authentication
│   │   └── api/            # API routes
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   └── *.tsx           # Custom components
│   ├── lib/
│   │   ├── prisma.ts       # Prisma client
│   │   ├── auth.ts         # NextAuth config
│   │   ├── stripe.ts       # Stripe utilities
│   │   └── prompts.ts      # Prompt helpers
│   └── data/
│       └── seed-prompts.json  # Initial prompt library
└── public/                 # Static assets
```

## 🎨 Customization

### Adding New Prompts

1. Add prompts to `src/data/seed-prompts.json`
2. Run `npm run db:seed` to update database
3. Or add via database directly

### Changing Pricing

1. Update prices in Stripe Dashboard
2. Update price IDs in `.env`
3. Update `src/app/(marketing)/pricing/page.tsx`

### Branding

- Logo: Update `src/components/navbar.tsx`
- Colors: Modify `src/app/globals.css` CSS variables
- Fonts: Change in `src/app/layout.tsx`
- Metadata: Update in `src/app/layout.tsx`

## 🧪 Testing

```bash
# Run type checking
npm run build

# Test Stripe webhooks locally
stripe trigger checkout.session.completed
```

## 🔒 Security

- All authentication handled by NextAuth.js
- Stripe webhook signature verification
- SQL injection protection via Prisma
- CSRF protection enabled
- Environment variables for sensitive data

## 📊 Analytics (Optional)

Add privacy-focused analytics with [Plausible](https://plausible.io):

1. Create Plausible account
2. Add domain
3. Add `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to `.env`
4. Add script to `src/app/layout.tsx`

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Credits

- UI Components: [shadcn/ui](https://ui.shadcn.com)
- Icons: [Lucide](https://lucide.dev)
- Payments: [Stripe](https://stripe.com)
- Database: [Prisma](https://prisma.io)

## 💬 Support

- Documentation: See this README
- Issues: [GitHub Issues](https://github.com/yourusername/prompt-vault/issues)
- Email: support@promptvault.com

## 🗺️ Roadmap

- [ ] Add prompt rating system
- [ ] User-submitted prompts
- [ ] Prompt collections/bundles
- [ ] API access for enterprise
- [ ] AI prompt generator
- [ ] Multi-language support

---

Built with ❤️ using Next.js and TypeScript
