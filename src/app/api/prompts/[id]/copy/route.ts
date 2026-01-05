import { NextRequest, NextResponse } from 'next/server'
import { incrementPromptCopy } from '@/lib/prompts'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await incrementPromptCopy(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking copy:', error)
    return NextResponse.json(
      { error: 'Failed to track copy' },
      { status: 500 }
    )
  }
}
