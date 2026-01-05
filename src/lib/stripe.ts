import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export const STRIPE_PRICE_IDS = {
  starter: process.env.STRIPE_PRICE_STARTER || '',
  proCoding: process.env.STRIPE_PRICE_PRO_CODING || '',
  writing: process.env.STRIPE_PRICE_WRITING || '',
  business: process.env.STRIPE_PRICE_BUSINESS || '',
  premiumMonthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || '',
  premiumLifetime: process.env.STRIPE_PRICE_PREMIUM_LIFETIME || '',
}

export async function createCheckoutSession({
  priceId,
  userId,
  userEmail,
  metadata,
}: {
  priceId: string
  userId?: string
  userEmail?: string
  metadata?: Record<string, string>
}) {
  const session = await stripe.checkout.sessions.create({
    mode: priceId === STRIPE_PRICE_IDS.premiumMonthly ? 'subscription' : 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer_email: userEmail,
    client_reference_id: userId,
    metadata,
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
  })

  return session
}

export async function createCustomerPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
  })

  return session
}
