'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { PromptCard } from '@/components/prompt-card'
import { Search, Filter } from 'lucide-react'
import { CATEGORIES } from '@/lib/prompts'
import { PromptWithPack } from '@/lib/prompts'
import { cn } from '@/lib/utils'

export default function BrowsePage() {
  const [prompts, setPrompts] = useState<PromptWithPack[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  useEffect(() => {
    fetchPrompts()
  }, [selectedCategory, selectedTier, search])

  const fetchPrompts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory) params.append('category', selectedCategory)
      if (selectedTier) params.append('tier', selectedTier)
      if (search) params.append('search', search)

      const response = await fetch(`/api/prompts?${params}`)
      const data = await response.json()
      setPrompts(data.prompts)
    } catch (error) {
      console.error('Error fetching prompts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Browse Prompts</h1>
        <p className="text-muted-foreground">
          Discover {prompts.length}+ professional AI prompts for every workflow
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Categories
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedCategory === null ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Badge>
              {CATEGORIES.map((category) => (
                <Badge
                  key={category.value}
                  variant={selectedCategory === category.value ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.icon} {category.label}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Access Tier</p>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={selectedTier === null ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedTier(null)}
              >
                All
              </Badge>
              <Badge
                variant={selectedTier === 'free' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedTier('free')}
              >
                Free
              </Badge>
              <Badge
                variant={selectedTier === 'starter' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedTier('starter')}
              >
                Starter
              </Badge>
              <Badge
                variant={selectedTier === 'pro' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedTier('pro')}
              >
                Pro
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No prompts found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              hasAccess={prompt.tier === 'free'}
            />
          ))}
        </div>
      )}
    </div>
  )
}
