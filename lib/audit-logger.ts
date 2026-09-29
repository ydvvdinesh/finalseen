/**
 * lib/audit-logger.ts
 * Legal Compliance & Government Audit Logging Utility for CodeNeuraX.
 * Preserves immutable audit records when sensitive entities (teams, squad members,
 * campus ambassador profiles) are CREATED, APPLIED, or DELETED, ensuring compliance with
 * IT Act, CERT-In, and cyber investigation disclosure requirements.
 */

import { SupabaseClient } from '@supabase/supabase-js'
import { getClientIp } from '@/lib/rate-limiter'
import { resolveGeoLocation } from '@/lib/geo-util'

interface AuditRequestContext {
  req?: Request
  actorEmail?: string
  deletedByEmail?: string
  ip?: string
  userAgent?: string
  actionType?: string
  reason?: string
  metadata?: Record<string, any>
}

/**
 * Archive a created BuddyKid team immediately upon registration.
 */
export async function archiveCreatedTeam(
  supabase: SupabaseClient,
  team: Record<string, any>,
  context: AuditRequestContext
): Promise<boolean> {
  const ipAddress = context.ip || (context.req ? getClientIp(context.req) : 'unknown')
  const userAgent = context.userAgent || (context.req ? context.req.headers.get('user-agent') || 'unknown' : 'unknown')
  const actor = context.actorEmail || context.deletedByEmail || team.creator_email || 'unknown'
  const now = new Date().toISOString()

  const auditRecord = {
    team_id: team.id,
    team_name: team.team_name,
    hackathon_name: team.hackathon_name,
    team_code: team.team_code,
    max_members: team.max_members,
    creator_name: team.creator_name,
    creator_email: team.creator_email,
    creator_college: team.creator_college,
    creator_linkedin: team.creator_linkedin,
    creator_skills: team.creator_skills,
    team_created_at: team.created_at || now,
    members_snapshot: [],
    recorded_at: now,
    deleted_at: now,
    actor_email: actor,
    deleted_by_email: actor,
    ip_address: ipAddress,
    user_agent: userAgent,
    action_type: context.actionType || 'team_created',
    metadata: {
      reason: context.reason || 'Leader registered new squad',
      ...context.metadata,
    },
  }

  console.info('[LEGAL_AUDIT_LOG_TEAM_CREATED]', JSON.stringify(auditRecord))

  try {
    const { error } = await supabase
      .from('buddykid_audit_archive')
      .insert(auditRecord)

    if (error) {
      console.warn('[LEGAL_AUDIT_WARNING] buddykid_audit_archive insert error:', error.message)
      return false
    }
    return true
  } catch (err: any) {
    console.warn('[LEGAL_AUDIT_WARNING] buddykid_audit_archive exception:', err?.message)
    return false
  }
}

/**
 * Archive a deleted BuddyKid team and all its members before removal from active tables.
 */
export async function archiveDeletedTeam(
  supabase: SupabaseClient,
  team: Record<string, any>,
  members: Record<string, any>[] = [],
  context: AuditRequestContext
): Promise<boolean> {
  const ipAddress = context.ip || (context.req ? getClientIp(context.req) : 'unknown')
  const userAgent = context.userAgent || (context.req ? context.req.headers.get('user-agent') || 'unknown' : 'unknown')
  const actor = context.actorEmail || context.deletedByEmail || team.creator_email || 'unknown'
  const now = new Date().toISOString()

  const membersSnapshot = members.map((m) => ({
    id: m.id,
    member_name: m.member_name || m.name,
    member_email: m.member_email || m.email,
    member_college: m.member_college || m.college,
    member_skills: m.member_skills || m.skills,
    member_linkedin: m.member_linkedin || m.linkedin,
    status: m.status || 'approved',
    joined_at: m.joined_at,
  }))

  const auditRecord = {
    team_id: team.id,
    team_name: team.team_name,
    hackathon_name: team.hackathon_name,
    team_code: team.team_code,
    max_members: team.max_members,
    creator_name: team.creator_name,
    creator_email: team.creator_email,
    creator_college: team.creator_college,
    creator_linkedin: team.creator_linkedin,
    creator_skills: team.creator_skills,
    team_created_at: team.created_at,
    members_snapshot: membersSnapshot,
    recorded_at: now,
    deleted_at: now,
    actor_email: actor,
    deleted_by_email: actor,
    ip_address: ipAddress,
    user_agent: userAgent,
    action_type: context.actionType || 'team_deleted',
    metadata: {
      reason: context.reason || 'Leader disbanded squad',
      member_count: membersSnapshot.length + 1,
      ...context.metadata,
    },
  }

  console.info('[LEGAL_AUDIT_LOG_TEAM_DELETED]', JSON.stringify(auditRecord))

  try {
    const { error } = await supabase
      .from('buddykid_audit_archive')
      .insert(auditRecord)

    if (error) {
      console.warn('[LEGAL_AUDIT_WARNING] buddykid_audit_archive insert error:', error.message)
      return false
    }
    return true
  } catch (err: any) {
    console.warn('[LEGAL_AUDIT_WARNING] buddykid_audit_archive exception:', err?.message)
    return false
  }
}

/**
 * Archive a new Campus Ambassador application immediately upon submission.
 */
export async function archiveAmbassadorApplication(
  supabase: SupabaseClient,
  ambassador: Record<string, any>,
  context: AuditRequestContext
): Promise<boolean> {
  const ipAddress = context.ip || (context.req ? getClientIp(context.req) : 'unknown')
  const userAgent = context.userAgent || (context.req ? context.req.headers.get('user-agent') || 'unknown' : 'unknown')
  const actor = context.actorEmail || context.deletedByEmail || ambassador.email || 'applicant'
  const now = new Date().toISOString()

  const auditRecord = {
    ambassador_id: ambassador.id,
    ref_no: ambassador.ref_no,
    name: ambassador.name,
    email: ambassador.email,
    phone: ambassador.phone,
    college: ambassador.college,
    address: ambassador.address,
    linkedin_url: ambassador.linkedin_url,
    photo_url: ambassador.photo_url,
    status: ambassador.status || 'pending',
    ambassador_created_at: ambassador.created_at || now,
    approved_at: ambassador.approved_at || null,
    recorded_at: now,
    deleted_at: now,
    actor: actor,
    deleted_by: actor,
    ip_address: ipAddress,
    user_agent: userAgent,
    action_type: context.actionType || 'ambassador_applied',
    metadata: {
      reason: context.reason || 'Candidate submitted new Campus Ambassador application',
      ...context.metadata,
    },
  }

  console.info('[LEGAL_AUDIT_LOG_AMBASSADOR_APPLIED]', JSON.stringify(auditRecord))

  try {
    const { error } = await supabase
      .from('campus_ambassadors_audit_archive')
      .insert(auditRecord)

    if (error) {
      console.warn('[LEGAL_AUDIT_WARNING] campus_ambassadors_audit_archive insert error:', error.message)
      return false
    }
    return true
  } catch (err: any) {
    console.warn('[LEGAL_AUDIT_WARNING] campus_ambassadors_audit_archive exception:', err?.message)
    return false
  }
}

/**
 * Archive a deleted Campus Ambassador profile before removal from active tables.
 */
export async function archiveDeletedAmbassador(
  supabase: SupabaseClient,
  ambassador: Record<string, any>,
  context: AuditRequestContext
): Promise<boolean> {
  const ipAddress = context.ip || (context.req ? getClientIp(context.req) : 'unknown')
  const userAgent = context.userAgent || (context.req ? context.req.headers.get('user-agent') || 'unknown' : 'unknown')
  const actor = context.actorEmail || context.deletedByEmail || 'admin'
  const now = new Date().toISOString()

  const auditRecord = {
    ambassador_id: ambassador.id,
    ref_no: ambassador.ref_no,
    name: ambassador.name,
    email: ambassador.email,
    phone: ambassador.phone,
    college: ambassador.college,
    address: ambassador.address,
    linkedin_url: ambassador.linkedin_url,
    photo_url: ambassador.photo_url,
    status: ambassador.status,
    ambassador_created_at: ambassador.created_at,
    approved_at: ambassador.approved_at,
    recorded_at: now,
    deleted_at: now,
    actor: actor,
    deleted_by: actor,
    ip_address: ipAddress,
    user_agent: userAgent,
    action_type: context.actionType || 'ambassador_deleted',
    metadata: {
      reason: context.reason || 'Admin deleted ambassador record',
      ...context.metadata,
    },
  }

  console.info('[LEGAL_AUDIT_LOG_AMBASSADOR_DELETED]', JSON.stringify(auditRecord))

  try {
    const { error } = await supabase
      .from('campus_ambassadors_audit_archive')
      .insert(auditRecord)

    if (error) {
      console.warn('[LEGAL_AUDIT_WARNING] campus_ambassadors_audit_archive insert error:', error.message)
      return false
    }
    return true
  } catch (err: any) {
    console.warn('[LEGAL_AUDIT_WARNING] campus_ambassadors_audit_archive exception:', err?.message)
    return false
  }
}

/**
 * Record an immutable audit log entry whenever a user logs in.
 * Captures user identity, IP address, City, Region, Country, Geo-coordinates, and User-Agent.
 */
export async function recordUserLoginAudit(
  supabase: SupabaseClient,
  user: { id?: string; email: string; name?: string },
  context: {
    req: Request
    loginMethod?: string
    metadata?: Record<string, any>
  }
): Promise<boolean> {
  const geo = await resolveGeoLocation(context.req)
  const userAgent = context.req.headers.get('user-agent') || 'unknown'
  const now = new Date().toISOString()

  const loginAuditRecord = {
    user_id: user.id || null,
    email: user.email.toLowerCase().trim(),
    name: user.name || null,
    ip_address: geo.ip,
    city: geo.city,
    region: geo.region,
    country: geo.country,
    country_code: geo.countryCode,
    latitude: geo.latitude,
    longitude: geo.longitude,
    timezone: geo.timezone,
    user_agent: userAgent,
    login_method: context.loginMethod || 'google_oauth',
    login_at: now,
    metadata: {
      geo_source: geo.source,
      isp: geo.isp,
      ...context.metadata,
    },
  }

  console.info('[LEGAL_AUDIT_LOG_USER_LOGIN]', JSON.stringify(loginAuditRecord))

  try {
    const { error } = await supabase
      .from('user_login_audit')
      .insert(loginAuditRecord)

    if (error) {
      console.warn('[LEGAL_AUDIT_WARNING] user_login_audit insert error (ensure table exists):', error.message)
      return false
    }
    return true
  } catch (err: any) {
    console.warn('[LEGAL_AUDIT_WARNING] user_login_audit exception:', err?.message)
    return false
  }
}

