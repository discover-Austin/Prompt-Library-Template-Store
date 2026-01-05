import { NextRequest, NextResponse } from 'next/server'
import { incrementPromptCopy } from '@/lib/prompts'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await incrementPromptCopy(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error tracking copy:', error)
    return NextResponse.json(
      { error: 'Failed to track copy' },
      { status: 500 }
    )
  }
}
