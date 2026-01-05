export interface PromptVariable {
  name: string
  description: string
  default?: string
}

export interface PromptFilters {
  category?: string
  search?: string
  tier?: string
  platform?: string
}

export interface PricingTier {
  id: string
  name: string
  price: number
  interval?: 'month' | 'lifetime'
  features: string[]
  popular?: boolean
  stripePriceId?: string
}
