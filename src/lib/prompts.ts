import { Prompt, Prisma } from '@prisma/client'
import { prisma } from './prisma'

export type PromptWithPack = Prisma.PromptGetPayload<{
  include: { pack: true }
}>

export async function getPrompts({
  category,
  search,
  tier,
  featured,
  limit = 50,
  offset = 0,
}: {
  category?: string
  search?: string
  tier?: string
  featured?: boolean
  limit?: number
  offset?: number
} = {}) {
  const where: Prisma.PromptWhereInput = {
    published: true,
  }

  if (category) {
    where.category = category
  }

  if (tier) {
    where.tier = tier
  }

  if (featured !== undefined) {
    where.featured = featured
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { hasSome: [search] } },
    ]
  }

  const [prompts, total] = await Promise.all([
    prisma.prompt.findMany({
      where,
      include: {
        pack: true,
      },
      orderBy: [
        { featured: 'desc' },
        { rating: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
      skip: offset,
    }),
    prisma.prompt.count({ where }),
  ])

  return { prompts, total }
}

export async function getPromptById(id: string) {
  return prisma.prompt.findUnique({
    where: { id },
    include: {
      pack: true,
    },
  })
}

export async function getFeaturedPrompts(limit = 6) {
  return prisma.prompt.findMany({
    where: {
      featured: true,
      published: true,
    },
    include: {
      pack: true,
    },
    orderBy: {
      rating: 'desc',
    },
    take: limit,
  })
}

export async function getPromptsByCategory(category: string, limit = 10) {
  return prisma.prompt.findMany({
    where: {
      category,
      published: true,
    },
    include: {
      pack: true,
    },
    orderBy: {
      rating: 'desc',
    },
    take: limit,
  })
}

export async function incrementPromptCopy(promptId: string) {
  return prisma.prompt.update({
    where: { id: promptId },
    data: {
      copyCount: {
        increment: 1,
      },
    },
  })
}

export async function incrementPromptView(promptId: string) {
  return prisma.prompt.update({
    where: { id: promptId },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  })
}

export async function savePrompt(userId: string, promptId: string) {
  return prisma.savedPrompt.create({
    data: {
      userId,
      promptId,
    },
  })
}

export async function unsavePrompt(userId: string, promptId: string) {
  return prisma.savedPrompt.delete({
    where: {
      userId_promptId: {
        userId,
        promptId,
      },
    },
  })
}

export async function getSavedPrompts(userId: string) {
  const saved = await prisma.savedPrompt.findMany({
    where: { userId },
    include: {
      prompt: {
        include: {
          pack: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return saved.map((s) => s.prompt)
}

export async function checkUserHasAccess(
  userId: string | undefined,
  prompt: PromptWithPack
): Promise<boolean> {
  // Free prompts are accessible to everyone
  if (prompt.tier === 'free') {
    return true
  }

  // Not logged in users can't access premium content
  if (!userId) {
    return false
  }

  // Check if user has premium subscription
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true, subscriptionStatus: true },
  })

  if (user?.subscriptionTier === 'premium' && user?.subscriptionStatus === 'active') {
    return true
  }

  // Check if user purchased the pack
  if (prompt.packId) {
    const purchase = await prisma.purchase.findFirst({
      where: {
        userId,
        packId: prompt.packId,
      },
    })

    if (purchase) {
      return true
    }
  }

  return false
}

export const CATEGORIES = [
  { value: 'coding', label: 'Coding', icon: '💻' },
  { value: 'writing', label: 'Writing', icon: '✍️' },
  { value: 'business', label: 'Business', icon: '📊' },
  { value: 'research', label: 'Research', icon: '🔬' },
  { value: 'productivity', label: 'Productivity', icon: '⚡' },
  { value: 'creative', label: 'Creative', icon: '🎨' },
]

export const PLATFORMS = [
  { value: 'chatgpt', label: 'ChatGPT', color: '#10a37f' },
  { value: 'claude', label: 'Claude', color: '#cc785c' },
  { value: 'gemini', label: 'Gemini', color: '#4285f4' },
  { value: 'llama', label: 'Llama', color: '#0467df' },
]
