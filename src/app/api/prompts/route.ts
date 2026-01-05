import { NextRequest, NextResponse } from 'next/server'
import { getPrompts } from '@/lib/prompts'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || undefined
    const tier = searchParams.get('tier') || undefined
    const featured = searchParams.get('featured') === 'true' ? true : undefined
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const result = await getPrompts({
      category,
      search,
      tier,
      featured,
      limit,
      offset,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching prompts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    )
  }
}
