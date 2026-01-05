import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Zap, Code, TrendingUp, Star } from 'lucide-react'
import { getFeaturedPrompts, CATEGORIES } from '@/lib/prompts'
import { PromptCard } from '@/components/prompt-card'

export const revalidate = 3600 // Revalidate every hour

export default async function Home() {
  const featuredPrompts = await getFeaturedPrompts(6)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="gradient-bg py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              <Star className="h-3 w-3 mr-1" />
              50+ Professional AI Prompts
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Professional AI Prompts for
              <span className="gradient-text"> Every Workflow</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Boost productivity with expert-crafted prompt templates for ChatGPT, Claude, and Gemini.
              From coding to content creation, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/browse">
                  Browse Prompts <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              10 prompts free • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold gradient-text">50+</div>
              <p className="text-sm text-muted-foreground mt-1">Expert Prompts</p>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">6</div>
              <p className="text-sm text-muted-foreground mt-1">Categories</p>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">4</div>
              <p className="text-sm text-muted-foreground mt-1">AI Platforms</p>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">100%</div>
              <p className="text-sm text-muted-foreground mt-1">Production Ready</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Prompts organized by use case to help you find exactly what you need
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CATEGORIES.map((category) => (
              <Card key={category.value} className="group hover:shadow-lg transition-all cursor-pointer">
                <CardHeader>
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <CardTitle>{category.label}</CardTitle>
                  <CardDescription>
                    Professional prompts for {category.label.toLowerCase()} workflows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full group-hover:translate-x-1 transition-transform" asChild>
                    <Link href={`/browse?category=${category.value}`}>
                      Explore {category.label} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Prompts Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Prompts</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hand-picked templates that deliver exceptional results
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                hasAccess={prompt.tier === 'free'}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/browse">
                View All Prompts <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why PromptVault?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built by AI experts for professionals who demand quality
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Code className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Production Ready</CardTitle>
                <CardDescription>
                  Every prompt is tested and refined for real-world use. No fluff, just results.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Variable System</CardTitle>
                <CardDescription>
                  Fill in variables and preview your customized prompt before copying.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <TrendingUp className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Multi-Platform</CardTitle>
                <CardDescription>
                  Compatible with ChatGPT, Claude, Gemini, and other major AI platforms.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to level up your AI workflows?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of professionals using PromptVault to work smarter with AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/browse">
                  Start Browsing <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
