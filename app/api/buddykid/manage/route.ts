import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit } from '@/lib/rate-limiter'
import { getAuthenticatedCaller } from '@/lib/auth-util'
import { archiveDeletedTeam } from '@/lib/audit-logger'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey)
}

// GET — Fetch team management data for a user
export async function GET(req: Request) {
  // Rate limiting: 60 management queries per 15 minutes per IP
  const rateLimit = checkRateLimit(req, {
    windowMs: 15 * 60 * 1000,
    maxRequests: 60,
    keyPrefix: 'buddykid-manage-get',
    message: 'Too many requests. Please try again later.',
  })
  if (!rateLimit.allowed && rateLimit.response) {
    return rateLimit.response
  }

  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')?.trim().toLowerCase()

    if (!email) {
      return NextResponse.json({ error: 'Email parameter required' }, { status: 400 })
    }

    // Verify authenticated user identity (anti-IDOR)
    const caller = await getAuthenticatedCaller(req)
    if (caller && caller.email !== email) {
      return NextResponse.json({ error: 'Unauthorized: cannot access squads for another account' }, { status: 403 })
    }

    // 1. Fetch teams led by this user
    const { data: teamsLed, error: ledError } = await supabase
      .from('buddykid_teams')
      .select('*')
      .eq('creator_email', email)
      .order('created_at', { ascending: false })

    if (ledError) {
      console.error('Error fetching led teams:', ledError)
      return NextResponse.json({ error: 'Failed to fetch led teams' }, { status: 500 })
    }

    // For teams led, fetch all members (approved & pending)
    const ledTeamIds = (teamsLed || []).map(t => t.id)
    let pendingByTeam: Record<string, any[]> = {}
    let approvedByTeam: Record<string, any[]> = {}

    if (ledTeamIds.length > 0) {
      const { data: allMembers, error: membersError } = await supabase
        .from('buddykid_members')
        .select('*')
        .in('team_id', ledTeamIds)
        .order('joined_at', { ascending: true })

      if (!membersError && allMembers) {
        for (const m of allMembers) {
          if (m.status === 'pending') {
            if (!pendingByTeam[m.team_id]) pendingByTeam[m.team_id] = []
            pendingByTeam[m.team_id].push(m)
          } else if (m.status === 'approved' || !m.status) {
            if (!approvedByTeam[m.team_id]) approvedByTeam[m.team_id] = []
            approvedByTeam[m.team_id].push(m)
          }
        }
      }
    }

    const enhancedTeamsLed = (teamsLed || []).map(team => {
      const approvedList = approvedByTeam[team.id] || []
      const squadContacts = [
        {
          id: `leader-${team.id}`,
          name: team.creator_name,
          email: team.creator_email,
          linkedin: team.creator_linkedin,
          college: team.creator_college,
          skills: team.creator_skills,
          is_leader: true,
          role: 'Team Leader',
        },
        ...approvedList.map((m: any) => ({
          id: m.id,
          name: m.member_name,
          email: m.member_email,
          linkedin: m.member_linkedin,
          college: m.member_college,
          skills: m.member_skills,
          is_leader: false,
          role: 'Squad Member',
        }))
      ]

      return {
        ...team,
        member_count: approvedList.length + 1, // +1 for creator
        pending_applicants: pendingByTeam[team.id] || [],
        approved_members: approvedList,
        squad_contacts: squadContacts,
      }
    })

    // 2. Fetch memberships for this user
    const { data: userMemberships, error: memError } = await supabase
      .from('buddykid_members')
      .select('*')
      .eq('member_email', email)
      .order('joined_at', { ascending: false })

    if (memError) {
      console.error('Error fetching memberships:', memError)
      return NextResponse.json({ error: 'Failed to fetch memberships' }, { status: 500 })
    }

    const membershipTeamIds = (userMemberships || []).map(m => m.team_id).filter(Boolean)
    let teamsMap: Record<string, any> = {}

    if (membershipTeamIds.length > 0) {
      const { data: mTeams } = await supabase
        .from('buddykid_teams')
        .select('*')
        .in('id', membershipTeamIds)

      // Fetch approved members for all these teams so members and member_count are always available
      const { data: allMembershipMembers } = await supabase
        .from('buddykid_members')
        .select('*')
        .in('team_id', membershipTeamIds)
        .or('status.eq.approved,status.is.null')
        .order('joined_at', { ascending: true })

      const membersByTeamId: Record<string, any[]> = {}
      if (allMembershipMembers) {
        for (const m of allMembershipMembers) {
          if (!membersByTeamId[m.team_id]) membersByTeamId[m.team_id] = []
          membersByTeamId[m.team_id].push({
            id: m.id,
            name: m.member_name,
            email: m.member_email,
            college: m.member_college,
            skills: m.member_skills,
            linkedin: m.member_linkedin,
            joined_at: m.joined_at,
          })
        }
      }

      if (mTeams) {
        for (const t of mTeams) {
          const tMembers = membersByTeamId[t.id] || []
          teamsMap[t.id] = {
            ...t,
            members: tMembers,
            member_count: tMembers.length + 1,
          }
        }
      }
    }

    const teamsJoinedRaw: any[] = []
    const pendingApplications: any[] = []

    if (userMemberships) {
      for (const item of userMemberships) {
        const teamObj = teamsMap[item.team_id]
        if (!teamObj) continue
        if (item.status === 'approved' || !item.status) {
          teamsJoinedRaw.push({
            membership_id: item.id,
            joined_at: item.joined_at,
            my_skills: item.member_skills,
            team: teamObj,
          })
        } else if (item.status === 'pending') {
          pendingApplications.push({
            application_id: item.id,
            applied_at: item.joined_at,
            my_skills: item.member_skills,
            team: teamObj,
          })
        }
      }
    }

    // For all joined teams, fetch all approved teammates so members can contact each other!
    const joinedTeamIds = teamsJoinedRaw.map(tj => tj.team.id)
    let fellowMembersMap: Record<string, any[]> = {}

    if (joinedTeamIds.length > 0) {
      const { data: allFellows } = await supabase
        .from('buddykid_members')
        .select('*')
        .in('team_id', joinedTeamIds)
        .or('status.eq.approved,status.is.null')
        .order('joined_at', { ascending: true })

      if (allFellows) {
        for (const fm of allFellows) {
          if (!fellowMembersMap[fm.team_id]) fellowMembersMap[fm.team_id] = []
          fellowMembersMap[fm.team_id].push(fm)
        }
      }
    }

    const teamsJoined = teamsJoinedRaw.map(tj => {
      const fellowList = fellowMembersMap[tj.team.id] || []
      const squadContacts = [
        {
          id: `leader-${tj.team.id}`,
          name: tj.team.creator_name,
          email: tj.team.creator_email,
          linkedin: tj.team.creator_linkedin,
          college: tj.team.creator_college,
          skills: tj.team.creator_skills,
          is_leader: true,
          role: 'Team Leader',
        },
        ...fellowList.map((m: any) => ({
          id: m.id,
          name: m.member_name,
          email: m.member_email,
          linkedin: m.member_linkedin,
          college: m.member_college,
          skills: m.member_skills,
          is_leader: false,
          role: 'Squad Member',
        }))
      ]

      return {
        ...tj,
        fellow_members: fellowList,
        squad_contacts: squadContacts,
      }
    })

    return NextResponse.json({
      teamsLed: enhancedTeamsLed,
      teamsJoined,
      pendingApplications,
      totalPendingToReview: enhancedTeamsLed.reduce((acc, t) => acc + t.pending_applicants.length, 0),
    })
  } catch (err) {
    console.error('Manage GET error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}

// POST — Team Leader Actions & Member Self-Removal
export async function POST(req: Request) {
  // Rate limiting: 30 management actions per 15 minutes per IP
  const rateLimit = checkRateLimit(req, {
    windowMs: 15 * 60 * 1000,
    maxRequests: 30,
    keyPrefix: 'buddykid-manage-post',
    message: 'Too many squad actions. Please try again later.',
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

    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const body = await req.json()
    const { action, team_id, member_id, user_email } = body

    if (!action || !team_id || !user_email) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const ALLOWED_ACTIONS = ['approve', 'reject', 'remove_member', 'leave_team', 'cancel_application', 'delete_team']
    if (!ALLOWED_ACTIONS.includes(action)) {
      return NextResponse.json({ error: 'Invalid management action' }, { status: 400 })
    }

    const email = user_email.trim().toLowerCase()

    // Verify authenticated user identity (anti-IDOR)
    const caller = await getAuthenticatedCaller(req)
    if (caller && caller.email !== email) {
      return NextResponse.json({ error: 'Unauthorized: cannot perform actions as another account' }, { status: 403 })
    }

    // Fetch team to verify ownership
    const { data: team, error: teamError } = await supabase
      .from('buddykid_teams')
      .select('*')
      .eq('id', team_id)
      .maybeSingle()

    if (teamError || !team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    // ─── ACTION 1: LEADER APPROVES APPLICANT ──────────────────
    if (action === 'approve') {
      if (team.creator_email !== email) {
        return NextResponse.json({ error: 'Only the Team Leader can approve applicants' }, { status: 403 })
      }

      if (!member_id) {
        return NextResponse.json({ error: 'Applicant ID required' }, { status: 400 })
      }

      // Check current approved count
      const { count: approvedCount } = await supabase
        .from('buddykid_members')
        .select('id', { count: 'exact', head: true })
        .eq('team_id', team_id)
        .or('status.eq.approved,status.is.null')

      const totalMembers = (approvedCount || 0) + 1 // +1 for creator
      if (totalMembers >= team.max_members) {
        return NextResponse.json({ error: 'Team is already at maximum member capacity' }, { status: 400 })
      }

      // Update applicant to approved
      const { error: approveError } = await supabase
        .from('buddykid_members')
        .update({ status: 'approved' })
        .eq('id', member_id)
        .eq('team_id', team_id)

      if (approveError) {
        console.error('Approve member error:', approveError)
        return NextResponse.json({ error: 'Failed to approve applicant' }, { status: 500 })
      }

      // If team is now full, auto-close it
      if (totalMembers + 1 >= team.max_members) {
        await supabase
          .from('buddykid_teams')
          .update({ status: 'closed' })
          .eq('id', team_id)
      }

      return NextResponse.json({ ok: true, message: 'Applicant successfully approved and added to squad!' })
    }

    // ─── ACTION 2: LEADER REJECTS APPLICANT ───────────────────
    if (action === 'reject') {
      if (team.creator_email !== email) {
        return NextResponse.json({ error: 'Only the Team Leader can reject applicants' }, { status: 403 })
      }

      if (!member_id) {
        return NextResponse.json({ error: 'Applicant ID required' }, { status: 400 })
      }

      const { error: rejectError } = await supabase
        .from('buddykid_members')
        .update({ status: 'rejected' })
        .eq('id', member_id)
        .eq('team_id', team_id)

      if (rejectError) {
        console.error('Reject member error:', rejectError)
        return NextResponse.json({ error: 'Failed to reject applicant' }, { status: 500 })
      }

      return NextResponse.json({ ok: true, message: 'Application rejected.' })
    }

    // ─── ACTION 3: LEADER REMOVES A MEMBER ────────────────────
    if (action === 'remove_member') {
      if (team.creator_email !== email) {
        return NextResponse.json({ error: 'Only the Team Leader can remove team members' }, { status: 403 })
      }

      if (!member_id) {
        return NextResponse.json({ error: 'Member ID required' }, { status: 400 })
      }

      // Delete member from team
      const { error: deleteError } = await supabase
        .from('buddykid_members')
        .delete()
        .eq('id', member_id)
        .eq('team_id', team_id)

      if (deleteError) {
        console.error('Remove member error:', deleteError)
        return NextResponse.json({ error: 'Failed to remove member' }, { status: 500 })
      }

      // Re-open team if it was closed
      if (team.status === 'closed') {
        await supabase
          .from('buddykid_teams')
          .update({ status: 'open' })
          .eq('id', team_id)
      }

      return NextResponse.json({ ok: true, message: 'Member removed from team.' })
    }

    // ─── ACTION 4: MEMBER LEAVES TEAM (SELF-REMOVAL) ──────────
    if (action === 'leave_team') {
      // Cannot leave if creator
      if (team.creator_email === email) {
        return NextResponse.json({ error: 'Team creator cannot leave. You can manage members or delete the team.' }, { status: 400 })
      }

      // Delete member matching caller's email
      const { error: leaveError } = await supabase
        .from('buddykid_members')
        .delete()
        .eq('team_id', team_id)
        .eq('member_email', email)

      if (leaveError) {
        console.error('Leave team error:', leaveError)
        return NextResponse.json({ error: 'Failed to leave team' }, { status: 500 })
      }

      // Re-open team if it was closed
      if (team.status === 'closed') {
        await supabase
          .from('buddykid_teams')
          .update({ status: 'open' })
          .eq('id', team_id)
      }

      return NextResponse.json({ ok: true, message: 'You have left the team.' })
    }

    // ─── ACTION 5: CANCEL PENDING APPLICATION ─────────────────
    if (action === 'cancel_application') {
      const { error: cancelError } = await supabase
        .from('buddykid_members')
        .delete()
        .eq('team_id', team_id)
        .eq('member_email', email)
        .eq('status', 'pending')

      if (cancelError) {
        console.error('Cancel application error:', cancelError)
        return NextResponse.json({ error: 'Failed to cancel application' }, { status: 500 })
      }

      return NextResponse.json({ ok: true, message: 'Application withdrawn.' })
    }

    // ─── ACTION 6: LEADER DELETES TEAM (ANY TIME) ─────────────
    if (action === 'delete_team') {
      if (team.creator_email !== email) {
        return NextResponse.json({ error: 'Only the Team Leader can delete this squad' }, { status: 403 })
      }

      // Legal & Government Audit Archive: preserve full squad history and members
      const { data: teamMembers } = await supabase
        .from('buddykid_members')
        .select('*')
        .eq('team_id', team_id)

      await archiveDeletedTeam(supabase, team, teamMembers || [], {
        req,
        deletedByEmail: email,
        actionType: 'leader_disbanded_squad',
        reason: 'Leader initiated squad deletion',
      })

      // 1. Delete all members and applications associated with this team
      const { error: deleteMembersError } = await supabase
        .from('buddykid_members')
        .delete()
        .eq('team_id', team_id)

      if (deleteMembersError) {
        console.error('Delete team members error:', deleteMembersError)
        return NextResponse.json({ error: 'Failed to remove squad members' }, { status: 500 })
      }

      // 2. Delete the team record itself
      const { error: deleteTeamError } = await supabase
        .from('buddykid_teams')
        .delete()
        .eq('id', team_id)

      if (deleteTeamError) {
        console.error('Delete team error:', deleteTeamError)
        return NextResponse.json({ error: 'Failed to delete squad' }, { status: 500 })
      }

      return NextResponse.json({ ok: true, message: 'Squad successfully deleted and disbanded.' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    console.error('Manage POST error:', err)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
