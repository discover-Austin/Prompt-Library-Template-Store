import { PrismaClient } from '@prisma/client'
import seedPrompts from '../src/data/seed-prompts.json'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create Prompt Packs
  const starterPack = await prisma.promptPack.upsert({
    where: { slug: 'starter-pack' },
    update: {},
    create: {
      name: 'Starter Pack',
      description: '15 essential prompts for developers and content creators',
      slug: 'starter-pack',
      price: 900, // $9.00
      featured: true,
      published: true,
    },
  })

  const proCodePack = await prisma.promptPack.upsert({
    where: { slug: 'pro-coding-pack' },
    update: {},
    create: {
      name: 'Pro Coding Pack',
      description: 'Advanced prompts for software development, architecture, and code quality',
      slug: 'pro-coding-pack',
      price: 2900, // $29.00
      featured: true,
      published: true,
    },
  })

  const writingPack = await prisma.promptPack.upsert({
    where: { slug: 'complete-writing-pack' },
    update: {},
    create: {
      name: 'Complete Writing Pack',
      description: 'Professional writing prompts for blogs, emails, social media, and more',
      slug: 'complete-writing-pack',
      price: 2900, // $29.00
      featured: true,
      published: true,
    },
  })

  const businessPack = await prisma.promptPack.upsert({
    where: { slug: 'business-bundle' },
    update: {},
    create: {
      name: 'Business Bundle',
      description: 'Strategic business prompts for planning, analysis, and decision making',
      slug: 'business-bundle',
      price: 4900, // $49.00
      featured: true,
      published: true,
    },
  })

  console.log('✅ Created prompt packs')

  // Map pack slugs to pack IDs
  const packMap: Record<string, string> = {
    'starter': starterPack.id,
    'pro-coding': proCodePack.id,
    'writing': writingPack.id,
    'business': businessPack.id,
  }

  // Delete existing prompts (for clean re-seeding)
  await prisma.prompt.deleteMany({})

  // Create prompts from JSON
  let createdCount = 0

  for (const promptData of seedPrompts) {
    // Determine which pack this prompt belongs to
    let packId: string | null = null

    if (promptData.tier === 'starter') {
      packId = packMap['starter']
    } else if (promptData.tier === 'pro') {
      if (promptData.category === 'coding') {
        packId = packMap['pro-coding']
      } else if (promptData.category === 'writing') {
        packId = packMap['writing']
      } else if (promptData.category === 'business' || promptData.category === 'research') {
        packId = packMap['business']
      }
    }

    await prisma.prompt.create({
      data: {
        title: promptData.title,
        description: promptData.description,
        content: promptData.content,
        variables: promptData.variables || [],
        category: promptData.category,
        subcategory: promptData.subcategory || null,
        tags: promptData.tags,
        platforms: promptData.platforms,
        tier: promptData.tier,
        packId,
        featured: promptData.featured,
        published: true,
        copyCount: Math.floor(Math.random() * 100), // Random initial copy counts
        viewCount: Math.floor(Math.random() * 500), // Random initial view counts
        rating: promptData.featured ? 4.5 + Math.random() * 0.5 : 4.0 + Math.random() * 1.0,
      },
    })

    createdCount++
  }

  console.log(`✅ Created ${createdCount} prompts`)

  // Get pack stats
  const starterCount = await prisma.prompt.count({
    where: { packId: starterPack.id },
  })
  const proCodeCount = await prisma.prompt.count({
    where: { packId: proCodePack.id },
  })
  const writingCount = await prisma.prompt.count({
    where: { packId: writingPack.id },
  })
  const businessCount = await prisma.prompt.count({
    where: { packId: businessPack.id },
  })
  const freeCount = await prisma.prompt.count({
    where: { tier: 'free' },
  })

  console.log('\n📊 Seed Summary:')
  console.log(`  Free prompts: ${freeCount}`)
  console.log(`  Starter Pack (${starterPack.slug}): ${starterCount} prompts`)
  console.log(`  Pro Coding Pack (${proCodePack.slug}): ${proCodeCount} prompts`)
  console.log(`  Complete Writing Pack (${writingPack.slug}): ${writingCount} prompts`)
  console.log(`  Business Bundle (${businessPack.slug}): ${businessCount} prompts`)
  console.log(`\n🎉 Database seeded successfully!`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
