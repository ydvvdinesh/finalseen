import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { recordUserLoginAudit } from '@/lib/audit-logger'
import { checkRateLimit } from '@/lib/rate-limiter'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey)
}

export async function POST(req: Request) {
  // Rate limit: max 30 login audit pings per 15 mins per IP
  const rateLimit = checkRateLimit(req, {
    windowMs: 15 * 60 * 1000,
    maxRequests: 30,
    keyPrefix: 'auth-record-login',
  })
  if (!rateLimit.allowed && rateLimit.response) {
    return rateLimit.response
  }

  try {
    const body = await req.json()
    const { user_id, email, name, login_method } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    await recordUserLoginAudit(
      supabase,
      {
        id: user_id,
        email: email.trim().toLowerCase(),
        name: name || undefined,
      },
      {
        req,
        loginMethod: login_method || 'client_auth',
        metadata: {
          client_reported: true,
        },
      }
    )

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('record-login error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
