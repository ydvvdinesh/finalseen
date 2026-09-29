import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit, getClientIp } from '@/lib/rate-limiter'
import { getAuthenticatedCaller } from '@/lib/auth-util'
import { archiveCreatedTeam } from '@/lib/audit-logger'

// Use service role key to bypass RLS for inserts
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey)
}

// Generate unique team code: BK-XXXXXX
function generateTeamCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `BK-${code}`
}

// GET — Fetch teams (or single team by ?code=...)
export async function GET(req: Request) {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')

    // Fetch open teams (or by specific team code)
    let query = supabase
      .from('buddykid_teams')
      .select('*')

    if (code) {
      query = query.ilike('team_code', code.trim())
    } else {
      query = query.eq('status', 'open').order('created_at', { ascending: false })
    }

    const { data: teams, error: teamsError } = await query

    if (teamsError) {
      console.error('Fetch teams error:', teamsError)
      if (teamsError.code === '42P01' || teamsError.message?.includes('does not exist')) {
        return NextResponse.json({
          error: 'Database table "buddykid_teams" does not exist yet. Please run the SQL migration script in Supabase SQL Editor.',
        }, { status: 500 })
      }
      return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
    }

    // Fetch member counts for each team
    const teamIds = (teams || []).map((t: any) => t.id)
    let memberCounts: Record<string, number> = {}
    let membersByTeam: Record<string, any[]> = {}

    if (teamIds.length > 0) {
      const { data: members } = await supabase
        .from('buddykid_members')
        .select('id, team_id, member_name, member_email, member_linkedin, member_skills, member_college, status')
        .in('team_id', teamIds)
        .or('status.eq.approved,status.is.null')

      if (members) {
        for (const m of members) {
          memberCounts[m.team_id] = (memberCounts[m.team_id] || 0) + 1
          if (!membersByTeam[m.team_id]) membersByTeam[m.team_id] = []
          membersByTeam[m.team_id].push({
            id: m.id,
            name: m.member_name,
            skills: m.member_skills,
            college: m.member_college,
            email: m.member_email,
            linkedin: m.member_linkedin,
          })
        }
      }
    }

    // Combine teams with member counts
    const result = (teams || []).map((t: any) => ({
      id: t.id,
      team_code: t.team_code,
      hackathon_name: t.hackathon_name,
      team_name: t.team_name,
      creator_name: t.creator_name,
      creator_email: t.creator_email,
      creator_linkedin: t.creator_linkedin,
      creator_skills: t.creator_skills,
      creator_college: t.creator_college,
      looking_for: t.looking_for,
      max_members: t.max_members,
      member_count: (memberCounts[t.id] || 0) + 1, // +1 for creator
      members: membersByTeam[t.id] || [],
      created_at: t.created_at,
    }))

    return NextResponse.json({ teams: result, team: result[0] || null })
  } catch (err) {
    console.error('BuddyKid GET error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// POST — Create a new team
export async function POST(req: Request) {
  // Rate limiting: 20 team creations per 10 minutes per IP
  const rateLimit = checkRateLimit(req, {
    windowMs: 10 * 60 * 1000,
    maxRequests: 20,
    keyPrefix: 'buddykid-create-team',
    message: 'Too many team creation attempts. Please try again in a few minutes.',
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
      hackathon_name,
      team_name,
      creator_name,
      creator_email,
      creator_linkedin,
      creator_skills,
      creator_college,
      looking_for,
      max_members,
    } = body

    // Validate required fields
    if (!hackathon_name || !creator_name || !creator_email || !creator_linkedin || !creator_skills || !creator_college) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 })
    }

    // Verify caller identity if signed in
    const caller = await getAuthenticatedCaller(req)
    if (caller && creator_email && caller.email !== creator_email.trim().toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized: cannot create a team under an email other than your signed-in account' }, { status: 403 })
    }

    // Input length limits
    if (
      hackathon_name.length > 200 ||
      (team_name && team_name.length > 200) ||
      creator_name.length > 100 ||
      creator_email.length > 100 ||
      creator_linkedin.length > 300 ||
      creator_skills.length > 500 ||
      creator_college.length > 200 ||
      (looking_for && looking_for.length > 500)
    ) {
      return NextResponse.json({ error: 'Input exceeds maximum allowed length' }, { status: 413 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(creator_email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate LinkedIn URL
    if (!creator_linkedin.includes('linkedin.com')) {
      return NextResponse.json({ error: 'Please provide a valid LinkedIn profile URL' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Generate unique team code (retry if collision)
    let teamCode = generateTeamCode()
    let retries = 5
    while (retries > 0) {
      const { data: existingCode } = await supabase
        .from('buddykid_teams')
        .select('id')
        .eq('team_code', teamCode)
        .maybeSingle()
      if (!existingCode) break
      teamCode = generateTeamCode()
      retries--
    }

    // Get IP for safety logging
    const ipAddress = getClientIp(req)

    // Insert team
    const teamPayload = {
      team_code: teamCode,
      hackathon_name: hackathon_name.trim(),
      team_name: (team_name || '').trim(),
      creator_name: creator_name.trim(),
      creator_email: creator_email.trim().toLowerCase(),
      creator_linkedin: creator_linkedin.trim(),
      creator_skills: creator_skills.trim(),
      creator_college: creator_college.trim(),
      looking_for: (looking_for || '').trim(),
      max_members: Math.min(Math.max(Number(max_members) || 4, 2), 10),
      status: 'open',
      ip_address: ipAddress,
    }

    const { data: newTeam, error: insertError } = await supabase
      .from('buddykid_teams')
      .insert(teamPayload)
      .select()
      .maybeSingle()

    if (insertError) {
      console.error('Insert team error:', insertError)
      if (insertError.code === '42P01' || insertError.message?.includes('does not exist')) {
        return NextResponse.json({
          error: 'Database table "buddykid_teams" does not exist yet. Please run the SQL migration script in Supabase SQL Editor.',
        }, { status: 500 })
      }
      return NextResponse.json({ error: `Team creation failed: ${insertError.message || 'Please try again.'}` }, { status: 500 })
    }

    // Legal & Government Audit Archive: Record immutable copy of squad creation
    await archiveCreatedTeam(supabase, newTeam || { ...teamPayload, id: teamCode }, {
      req,
      ip: ipAddress,
      actorEmail: creator_email.trim().toLowerCase(),
      actionType: 'team_created',
      reason: 'Team Leader created new squad',
    })

    return NextResponse.json({ ok: true, team_code: teamCode })
  } catch (err) {
    console.error('BuddyKid POST error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
