import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey)
}

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function GET(req: Request) {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('campus_ambassadors')
      .select('ref_no, name, college, photo_url, linkedin_url')
      .eq('status', 'approved')
      .order('approved_at', { ascending: false })

    if (error) {
      console.error('Fetch approved ambassadors error:', error)
      return NextResponse.json({ error: 'Failed to fetch ambassadors' }, { status: 500 })
    }

    return NextResponse.json(
      { ambassadors: data || [] },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'CDN-Cache-Control': 'no-store',
          'Vercel-CDN-Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (err) {
    console.error('Campus Ambassador List error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
