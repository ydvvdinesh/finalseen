import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { archiveDeletedAmbassador } from '@/lib/audit-logger'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey)
}

function verifyAdminKey(req: Request): boolean {
  const adminKey = process.env.ADMIN_BROADCAST_KEY?.trim()
  if (!adminKey) return false
  const key = req.headers.get('x-admin-key')?.trim() || ''
  if (!key) return false
  try {
    const hashA = crypto.createHash('sha256').update(key).digest()
    const hashB = crypto.createHash('sha256').update(adminKey).digest()
    return crypto.timingSafeEqual(hashA, hashB)
  } catch {
    return false
  }
}

// PUT — Verify admin key (authentication check)
export async function PUT(req: Request) {
  try {
    const { admin_key } = await req.json()
    const adminKey = process.env.ADMIN_BROADCAST_KEY?.trim()
    if (!adminKey || !admin_key) {
      return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 })
    }
    const hashA = crypto.createHash('sha256').update(String(admin_key).trim()).digest()
    const hashB = crypto.createHash('sha256').update(adminKey).digest()
    if (crypto.timingSafeEqual(hashA, hashB)) {
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'Invalid admin key' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

// GET — Fetch all ambassador profiles (admin only)
export async function GET(req: Request) {
  if (!verifyAdminKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('campus_ambassadors')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Admin fetch ambassadors error:', error)
      return NextResponse.json({ error: 'Failed to fetch ambassadors' }, { status: 500 })
    }

    return NextResponse.json({ ambassadors: data || [] })
  } catch (err) {
    console.error('Admin Campus Ambassador GET error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// PATCH — Approve or reject an ambassador
export async function PATCH(req: Request) {
  if (!verifyAdminKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, action } = await req.json()
    if (!id || !action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid request. Provide id and action (approve/reject).' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const updateData: any = {
      status: action === 'approve' ? 'approved' : 'rejected',
    }
    if (action === 'approve') {
      updateData.approved_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('campus_ambassadors')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error('Admin update ambassador error:', error)
      return NextResponse.json({ error: 'Failed to update ambassador status' }, { status: 500 })
    }

    // Invalidate public page and list cache immediately
    try {
      revalidatePath('/campus-ambassadors')
      revalidatePath('/api/campus-ambassador/list')
    } catch (e) {
      console.error('Revalidate error:', e)
    }

    return NextResponse.json({ ok: true, status: updateData.status })
  } catch (err) {
    console.error('Admin Campus Ambassador PATCH error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// DELETE — Remove an ambassador profile
export async function DELETE(req: Request) {
  if (!verifyAdminKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing ambassador id' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Get full ambassador profile before deletion for legal compliance archive
    const { data: ambassador } = await supabase
       .from('campus_ambassadors')
       .select('*')
       .eq('id', id)
       .maybeSingle()

    if (ambassador) {
      // Legal & Government Audit Archive: preserve full ambassador history
      await archiveDeletedAmbassador(supabase, ambassador, {
        req,
        deletedByEmail: 'admin',
        actionType: 'admin_delete_ambassador',
        reason: 'Admin deleted ambassador profile from dashboard',
      })
    }

    if (ambassador?.photo_url) {
      // Try to delete the photo from storage
      const fileName = ambassador.photo_url.split('/').pop()
      if (fileName) {
        await supabase.storage.from('ambassador-photos').remove([fileName])
      }
    }

    const { error } = await supabase
      .from('campus_ambassadors')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Admin delete ambassador error:', error)
      return NextResponse.json({ error: 'Failed to delete ambassador' }, { status: 500 })
    }

    // Invalidate public page and list cache immediately
    try {
      revalidatePath('/campus-ambassadors')
      revalidatePath('/api/campus-ambassador/list')
    } catch (e) {
      console.error('Revalidate error:', e)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Admin Campus Ambassador DELETE error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
