import { NextRequest, NextResponse } from 'next/server'
import { fetchMetaInsights } from '@/lib/meta'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-sync-secret')
  if (secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const since = searchParams.get('since') || new Date(Date.now() - 1000*60*60*24*7).toISOString().slice(0,10)
  const until = searchParams.get('until') || new Date().toISOString().slice(0,10)

  try {
    const result = await fetchMetaInsights(since, until)
    return NextResponse.json({ ok: true, ...result })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Sync failed' }, { status: 500 })
  }
}
