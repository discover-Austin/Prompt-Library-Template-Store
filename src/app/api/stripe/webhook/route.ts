import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        const userId = session.metadata?.userId
        const packId = session.metadata?.packId
        const subscriptionType = session.metadata?.subscriptionType

        if (!userId) {
          throw new Error('No userId in session metadata')
        }

        // Create purchase record
        await prisma.purchase.create({
          data: {
            userId,
            packId: packId || null,
            subscriptionType: subscriptionType || null,
            stripePaymentId: session.payment_intent as string,
            amount: session.amount_total || 0,
          },
        })

        // Update user with Stripe customer ID
        if (session.customer) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              stripeCustomerId: session.customer as string,
              ...(subscriptionType && {
                subscriptionStatus: 'active',
                subscriptionTier: 'premium',
              }),
            },
          })
        }

        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: subscription.customer as string },
        })

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: subscription.status,
              subscriptionTier: subscription.status === 'active' ? 'premium' : null,
            },
          })
        }

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
