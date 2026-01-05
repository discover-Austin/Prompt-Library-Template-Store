import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { getSavedPrompts } from '@/lib/prompts'
import { PromptCard } from '@/components/prompt-card'
import { formatPrice, formatDate } from '@/lib/utils'
import { Bookmark, ShoppingBag, CreditCard, Zap } from 'lucide-react'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  // Fetch user data
  const [savedPrompts, purchases, user] = await Promise.all([
    getSavedPrompts(session.user.id),
    prisma.purchase.findMany({
      where: { userId: session.user.id },
      include: { pack: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        subscriptionStatus: true,
        subscriptionTier: true,
        stripeCustomerId: true,
      },
    }),
  ])

  const hasActiveSubscription = user?.subscriptionStatus === 'active' && user?.subscriptionTier === 'premium'

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session.user.name || session.user.email}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Prompts</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedPrompts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Purchases</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchases.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasActiveSubscription ? (
                <Badge>Premium</Badge>
              ) : (
                <span className="text-sm text-muted-foreground">Free</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="saved" className="space-y-4">
        <TabsList>
          <TabsTrigger value="saved">
            <Bookmark className="h-4 w-4 mr-2" />
            Saved Prompts
          </TabsTrigger>
          <TabsTrigger value="purchases">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Purchases
          </TabsTrigger>
          <TabsTrigger value="subscription">
            <CreditCard className="h-4 w-4 mr-2" />
            Subscription
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="space-y-4">
          {savedPrompts.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No saved prompts yet</CardTitle>
                <CardDescription>
                  Start browsing and save your favorite prompts for quick access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <a href="/browse">Browse Prompts</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPrompts.map((prompt) => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  hasAccess={prompt.tier === 'free' || hasActiveSubscription}
                  isSaved
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="purchases" className="space-y-4">
          {purchases.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No purchases yet</CardTitle>
                <CardDescription>
                  Unlock premium prompts by purchasing packs or subscribing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <a href="/pricing">View Pricing</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <Card key={purchase.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>
                          {purchase.pack?.name || purchase.subscriptionType}
                        </CardTitle>
                        <CardDescription>
                          Purchased {formatDate(purchase.createdAt)}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">
                        {formatPrice(purchase.amount)}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="subscription" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>
                Manage your subscription and billing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current Plan</p>
                  <p className="text-sm text-muted-foreground">
                    {hasActiveSubscription ? 'Premium' : 'Free'}
                  </p>
                </div>
                {hasActiveSubscription && (
                  <Badge className="bg-green-500">Active</Badge>
                )}
              </div>

              <Separator />

              {hasActiveSubscription && user?.stripeCustomerId ? (
                <form
                  action={async () => {
                    'use server'
                    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/stripe/portal`, {
                      method: 'POST',
                    })
                    const data = await response.json()
                    if (data.url) {
                      redirect(data.url)
                    }
                  }}
                >
                  <Button type="submit">
                    Manage Subscription
                  </Button>
                </form>
              ) : (
                <Button asChild>
                  <a href="/pricing">Upgrade to Premium</a>
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
