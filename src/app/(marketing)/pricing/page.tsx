'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const PRICING_TIERS = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for trying out PromptVault',
    features: [
      '10 free prompts',
      'Basic prompt categories',
      'Variable input system',
      'Copy to clipboard',
      'Community support',
    ],
    cta: 'Get Started',
    href: '/browse',
  },
  {
    name: 'Starter Pack',
    price: 900,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER,
    description: 'Essential prompts for getting started',
    features: [
      'All free prompts',
      '15 premium prompts',
      'Priority support',
      'Lifetime access',
      'Free updates',
    ],
    cta: 'Buy Once',
  },
  {
    name: 'Premium',
    price: 1200,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTHLY,
    interval: 'month',
    popular: true,
    description: 'Full access to everything',
    features: [
      'All 50+ prompts',
      'New prompts every month',
      'Priority support',
      'Early access to new features',
      'Custom prompt requests',
      'Cancel anytime',
    ],
    cta: 'Subscribe',
  },
  {
    name: 'Premium Lifetime',
    price: 9900,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_LIFETIME,
    description: 'One-time payment, lifetime access',
    features: [
      'Everything in Premium',
      'Lifetime access',
      'All future prompts',
      'VIP support',
      'No recurring fees',
    ],
    cta: 'Buy Lifetime',
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handlePurchase = async (priceId?: string) => {
    if (!priceId) return

    setLoading(priceId)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error creating checkout:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="container py-20">
      <div className="text-center mb-12">
        <Badge className="mb-4">Pricing</Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start free, upgrade when you need more. All plans include commercial usage rights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {PRICING_TIERS.map((tier) => (
          <Card
            key={tier.name}
            className={tier.popular ? 'border-primary shadow-lg scale-105' : ''}
          >
            {tier.popular && (
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-1 text-sm font-medium rounded-t-lg">
                Most Popular
              </div>
            )}
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  {tier.price === 0 ? 'Free' : formatPrice(tier.price)}
                </span>
                {tier.interval && (
                  <span className="text-muted-foreground">/{tier.interval}</span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {tier.href ? (
                <Button
                  className="w-full"
                  variant={tier.popular ? 'default' : 'outline'}
                  onClick={() => router.push(tier.href!)}
                >
                  {tier.cta}
                </Button>
              ) : (
                <Button
                  className="w-full"
                  variant={tier.popular ? 'default' : 'outline'}
                  onClick={() => handlePurchase(tier.priceId)}
                  disabled={loading === tier.priceId}
                >
                  {loading === tier.priceId ? 'Loading...' : tier.cta}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Can I use these prompts commercially?</h3>
            <p className="text-muted-foreground">
              Yes! All prompts include commercial usage rights. Use them in your work, client projects, or business.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What AI platforms are supported?</h3>
            <p className="text-muted-foreground">
              Our prompts work with ChatGPT, Claude, Gemini, and most other major AI platforms. Each prompt specifies compatible platforms.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
            <p className="text-muted-foreground">
              Yes, we offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, contact us for a full refund.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">How often do you add new prompts?</h3>
            <p className="text-muted-foreground">
              Premium members get access to new prompts every month. We're constantly refining and adding to our library based on user feedback.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
