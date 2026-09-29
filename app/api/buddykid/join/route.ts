import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter'
import { getAuthenticatedCaller } from '@/lib/auth-util'

// Use service role key to bypass RLS for inserts
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey)
}

// POST — Join an existing team
export async function POST(req: Request) {
  // Rate limiting: 30 join requests per 10 minutes per IP
  const rateLimit = checkRateLimit(req, {
    windowMs: 10 * 60 * 1000,
    maxRequests: 30,
    keyPrefix: 'buddykid-join-request',
    message: 'Too many join requests. Please try again later.',
  })
  if (!rateLimit.allowed && rateLimit.response) {
    return rateLimit.response
  }

  try {
    // CSRF Protection
    const origin = req.headers.get('origin')
    const referer = req.headers.get('referer')
    const allowedDomains = ['http://localhost:3000', 'https://www.codeneurax.in', 'https://codeneurax.in']
    const isAllowedOrigin = origin && (allowedDomains.some(domain => origin.startsWith(domain)) || origin.endsWith('.vercel.app'))
    const isAllowedReferer = referer && (allowedDomains.some(domain => referer.startsWith(domain)) || referer.includes('.vercel.app'))

    if (process.env.NODE_ENV === 'production' && origin && !isAllowedOrigin && !isAllowedReferer) {
      return NextResponse.json({ error: 'Unauthorized request origin' }, { status: 403 })
    }

    const body = await req.json()
    const {
      team_id,
      member_name,
      member_email,
      member_linkedin,
      member_skills,
      member_college,
    } = body

    // Verify caller identity if signed in
    const caller = await getAuthenticatedCaller(req)
    if (caller && member_email && caller.email !== member_email.trim().toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized: cannot submit an application under an email other than your signed-in account' }, { status: 403 })
    }

    // Validate required fields
    if (!team_id || !member_name || !member_email || !member_linkedin || !member_skills || !member_college) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Input length limits
    if (
      member_name.length > 100 ||
      member_email.length > 100 ||
      member_linkedin.length > 300 ||
      member_skills.length > 500 ||
      member_college.length > 200
    ) {
      return NextResponse.json({ error: 'Input exceeds maximum allowed length' }, { status: 413 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(member_email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate LinkedIn URL
    if (!member_linkedin.includes('linkedin.com')) {
      return NextResponse.json({ error: 'Please provide a valid LinkedIn profile URL' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Verify team exists and is open
    const { data: team, error: teamError } = await supabase
      .from('buddykid_teams')
      .select('id, max_members, status, creator_email')
      .eq('id', team_id)
      .maybeSingle()

    if (teamError || !team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    if (team.status !== 'open') {
      return NextResponse.json({ error: 'This team is no longer accepting members' }, { status: 400 })
    }

    // Check if creator is trying to join their own team
    if (team.creator_email === member_email.trim().toLowerCase()) {
      return NextResponse.json({ error: 'You are already the creator of this team!' }, { status: 409 })
    }

    // Check current approved member count
    const { count } = await supabase
      .from('buddykid_members')
      .select('id', { count: 'exact', head: true })
      .eq('team_id', team_id)
      .or('status.eq.approved,status.is.null')

    const currentMembers = (count || 0) + 1 // +1 for creator
    if (currentMembers >= team.max_members) {
      return NextResponse.json({ error: 'This team is already full' }, { status: 400 })
    }

    // Get IP for safety logging
    const ipAddress = getClientIp(req)

    // Check if user already applied or joined this team
    const { data: existingMember } = await supabase
      .from('buddykid_members')
      .select('id, status')
      .eq('team_id', team_id)
      .eq('member_email', member_email.trim().toLowerCase())
      .maybeSingle()

    if (existingMember) {
      if (existingMember.status === 'pending') {
        return NextResponse.json({
          error: 'You have already submitted an application to this team. Please wait for the Team Leader to review it.'
        }, { status: 409 })
      }
      if (existingMember.status === 'approved' || !existingMember.status) {
        return NextResponse.json({ error: 'You are already an approved member of this team!' }, { status: 409 })
      }

      // If previously rejected or left, allow re-applying with 'pending' status
      const { error: updateError } = await supabase
        .from('buddykid_members')
        .update({
          member_name: member_name.trim(),
          member_linkedin: member_linkedin.trim(),
          member_skills: member_skills.trim(),
          member_college: member_college.trim(),
          status: 'pending',
          ip_address: ipAddress,
        })
        .eq('id', existingMember.id)

      if (updateError) {
        console.error('Re-apply error:', updateError)
        return NextResponse.json({ error: 'Failed to submit application. Please try again.' }, { status: 500 })
      }

      return NextResponse.json({
        ok: true,
        status: 'pending',
        message: 'Your application has been sent to the Team Leader for approval!'
      })
    }

    // Insert new application with status 'pending'
    const insertPayload: any = {
      team_id,
      member_name: member_name.trim(),
      member_email: member_email.trim().toLowerCase(),
      member_linkedin: member_linkedin.trim(),
      member_skills: member_skills.trim(),
      member_college: member_college.trim(),
      status: 'pending',
      ip_address: ipAddress,
    }

    const { error: insertError } = await supabase
      .from('buddykid_members')
      .insert(insertPayload)

    if (insertError) {
      // Fallback if status column does not exist yet in Supabase schema
      if (insertError.message?.includes('status')) {
        delete insertPayload.status
        const { error: fallbackError } = await supabase
          .from('buddykid_members')
          .insert(insertPayload)
        if (fallbackError) {
          return NextResponse.json({ error: `Failed to apply: ${fallbackError.message}` }, { status: 500 })
        }
      } else {
        console.error('Insert member error:', insertError)
        return NextResponse.json({ error: `Failed to apply: ${insertError.message || 'Please try again.'}` }, { status: 500 })
      }
    }

    return NextResponse.json({
      ok: true,
      status: 'pending',
      message: 'Application submitted! The Team Leader will review your request.'
    })
  } catch (err) {
    console.error('BuddyKid Join error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
