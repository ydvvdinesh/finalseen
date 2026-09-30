import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit } from '@/lib/rate-limiter'
import { getAuthenticatedCaller } from '@/lib/auth-util'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey)
}

// GET — Fetch notifications for a user
export async function GET(req: Request) {
  const rateLimit = checkRateLimit(req, {
    windowMs: 5 * 60 * 1000,
    maxRequests: 120,
    keyPrefix: 'notifications-get',
  })
  if (!rateLimit.allowed && rateLimit.response) {
    return rateLimit.response
  }

  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ notifications: [], unread_count: 0 })
    }

    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')?.trim().toLowerCase()

    if (!email) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 })
    }

    // Verify caller identity if signed in (anti-IDOR)
    const caller = await getAuthenticatedCaller(req)
    if (caller && caller.email !== email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Fetch recent 25 notifications
    const { data: notifications, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('recipient_email', email)
      .order('created_at', { ascending: false })
      .limit(25)

    if (error) {
      // If table doesn't exist yet, return empty list gracefully without throwing
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json({ notifications: [], unread_count: 0, pendingMigration: true })
      }
      console.warn('Notifications fetch error:', error.message)
      return NextResponse.json({ notifications: [], unread_count: 0 })
    }

    const unread_count = (notifications || []).filter((n: any) => !n.is_read).length

    return NextResponse.json({
      notifications: notifications || [],
      unread_count,
    })
  } catch (err) {
    console.error('Notifications GET error:', err)
    return NextResponse.json({ notifications: [], unread_count: 0 })
  }
}

// POST — Mark notifications as read or delete
export async function POST(req: Request) {
  const rateLimit = checkRateLimit(req, {
    windowMs: 5 * 60 * 1000,
    maxRequests: 60,
    keyPrefix: 'notifications-post',
  })
  if (!rateLimit.allowed && rateLimit.response) {
    return rateLimit.response
  }

  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const body = await req.json()
    const { action, email, notification_id } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Verify caller identity if signed in
    const caller = await getAuthenticatedCaller(req)
    if (caller && caller.email !== normalizedEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (action === 'mark_all_read') {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('recipient_email', normalizedEmail)
        .eq('is_read', false)

      if (error) {
        console.warn('Mark all read error:', error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ ok: true, message: 'All notifications marked as read' })
    }

    if (action === 'mark_read' && notification_id) {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notification_id)
        .eq('recipient_email', normalizedEmail)

      if (error) {
        console.warn('Mark read error:', error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ ok: true, message: 'Notification marked as read' })
    }

    if (action === 'delete' && notification_id) {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notification_id)
        .eq('recipient_email', normalizedEmail)

      if (error) {
        console.warn('Delete notification error:', error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ ok: true, message: 'Notification removed' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    console.error('Notifications POST error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
