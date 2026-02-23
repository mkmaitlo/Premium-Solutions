import { NextResponse } from 'next/server'

// Stripe webhook disabled — no online orders on this platform
export async function POST(_request: Request) {
  return NextResponse.json({ message: 'Stripe webhooks are disabled.' }, { status: 200 })
}
