import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/client"
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js"
import nodemailer from "nodemailer"

import crypto from "crypto"
import { checkRateLimit } from "@/lib/rate-limiter"

export const dynamic = "force-dynamic"

function safeCompareStrings(a: string, b: string): boolean {
  try {
    const hashA = crypto.createHash("sha256").update(a).digest()
    const hashB = crypto.createHash("sha256").update(b).digest()
    return crypto.timingSafeEqual(hashA, hashB)
  } catch {
    return false
  }
}

function getValidAdminKeys(): string[] {
  const keys = new Set<string>()

  // Configured Master Admin Key
  keys.add("mitali@admincnx")

  // Server-side environment variables
  const envVars = [
    process.env.ADMIN_BROADCAST_KEY,
    process.env.ADMIN_KEY,
  ]

  for (const envVal of envVars) {
    if (envVal) {
      const sanitized = envVal.trim().replace(/^["']|["']$/g, "")
      if (sanitized) {
        keys.add(sanitized)
      }
    }
  }

  return Array.from(keys)
}

function isValidAdmin(request: NextRequest, bodyKey?: string): boolean {
  const headerKey = request.headers.get("x-admin-key")?.trim()
  const cleanBodyKey = typeof bodyKey === "string" ? bodyKey.trim() : undefined
  const validKeys = getValidAdminKeys()

  if (validKeys.length === 0) {
    console.error("[Admin Auth] No ADMIN_BROADCAST_KEY or ADMIN_KEY configured on server.")
    return false
  }

  if (headerKey) {
    for (const validKey of validKeys) {
      if (safeCompareStrings(headerKey, validKey)) return true
    }
  }

  if (cleanBodyKey) {
    for (const validKey of validKeys) {
      if (safeCompareStrings(cleanBodyKey, validKey)) return true
    }
  }

  return false
}

// ────────────────────────────────────────────────────────────────
// Email Blast Utilities
// ────────────────────────────────────────────────────────────────

interface BroadcastData {
  id?: string
  category: string
  title: string
  organizer?: string
  description: string
  link_url: string
  badge?: string
  deadline?: string
  location?: string
  stipend_or_prize?: string
}

function getCategoryConfig(category: string) {
  switch (category) {
    case "internship":
      return { emoji: "🎓", label: "INTERNSHIP / JOB", color: "#818cf8", bgColor: "#312e81" }
    case "hackathon":
      return { emoji: "🏆", label: "HACKATHON / EVENT", color: "#fbbf24", bgColor: "#78350f" }
    case "news":
      return { emoji: "⚡", label: "TECH NEWS", color: "#34d399", bgColor: "#064e3b" }
    default:
      return { emoji: "📢", label: "UPDATE", color: "#a78bfa", bgColor: "#3b0764" }
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function ensureValidUrl(url: string): string {
  const trimmed = (url || "").trim()
  if (!trimmed) return "https://www.codeneurax.in"
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed
  }
  return `https://${trimmed}`
}

function getCtaButtonText(category: string): string {
  switch (category) {
    case "internship":
      return "Apply Now →"
    case "hackathon":
      return "Register / Apply Now →"
    case "news":
      return "Read Full Article →"
    default:
      return "Apply / View Opportunity →"
  }
}

function buildEmailHtml(data: BroadcastData): string {
  const cat = getCategoryConfig(data.category)
  const year = new Date().getFullYear()
  const ctaText = getCtaButtonText(data.category)
  const safeTitle = escapeHtml(data.title)
  const safeDescription = escapeHtml(data.description).replace(/\r?\n/g, "<br/>")

  // CodeNeuraX live opportunity URL (matches WhatsApp share link)
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://www.codeneurax.in").replace(/\/$/, "")
  const opportunityUrl = data.id ? `${baseUrl}/?opp=${data.id}#feed` : `${baseUrl}/#feed`

  // Dynamic tags matching the macOS card style
  const pills: string[] = []
  if (data.location) {
    pills.push(`<span style="display:inline-block;padding:6px 14px;border-radius:20px;background:#14151d;border:1px solid rgba(255,255,255,0.08);color:#9ca3af;font-size:12px;margin:0 6px 8px 0;">📍 ${escapeHtml(data.location)}</span>`)
  }
  if (data.badge) {
    pills.push(`<span style="display:inline-block;padding:6px 14px;border-radius:20px;background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.25);color:#fbbf24;font-size:12px;font-family:monospace;margin:0 6px 8px 0;">🏷️ ${escapeHtml(data.badge)}</span>`)
  }
  if (data.stipend_or_prize) {
    pills.push(`<span style="display:inline-block;padding:6px 14px;border-radius:20px;background:rgba(52,211,153,0.08);border:1px solid rgba(52,211,153,0.25);color:#34d399;font-size:12px;font-family:monospace;margin:0 6px 8px 0;">💰 ${escapeHtml(data.stipend_or_prize)}</span>`)
  }
  if (data.deadline) {
    pills.push(`<span style="display:inline-block;padding:6px 14px;border-radius:20px;background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.25);color:#f87171;font-size:12px;font-family:monospace;margin:0 6px 8px 0;">📅 ${escapeHtml(data.deadline)}</span>`)
  }

  const pillsSection = pills.length > 0
    ? `<div style="margin:4px 0 16px 0;">${pills.join("")}</div>`
    : ""

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta name="color-scheme" content="dark"/>
  <title>${safeTitle} — CodeNeuraX</title>
</head>
<body style="margin:0;padding:0;background-color:#050505;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Outer Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#050505;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">

          <!-- Brand Header -->
          <tr>
            <td align="center" style="padding:0 0 24px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:24px;font-weight:800;letter-spacing:-0.5px;">
                    <span style="color:#ffffff;">Code</span><span style="color:#fbbf24;">NeuraX</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- macOS Window Card -->
          <tr>
            <td style="background:#0c0d12;border-radius:18px;border:1px solid rgba(255,255,255,0.09);overflow:hidden;box-shadow:0 24px 48px rgba(0,0,0,0.6);">

              <!-- macOS Top Header Bar with 3 Colored Dots -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#13141b;border-bottom:1px solid rgba(255,255,255,0.06);padding:14px 20px;">
                <tr>
                  <td align="left" style="vertical-align:middle;">
                    <!-- Red, Yellow, Green Mac Buttons -->
                    <span style="display:inline-block;width:11px;height:11px;border-radius:50%;background-color:#ff5f56;margin-right:6px;"></span>
                    <span style="display:inline-block;width:11px;height:11px;border-radius:50%;background-color:#ffbd2e;margin-right:6px;"></span>
                    <span style="display:inline-block;width:11px;height:11px;border-radius:50%;background-color:#27c93f;"></span>
                  </td>
                  <td align="right" style="vertical-align:middle;font-size:11px;font-family:monospace;color:#52525b;">
                    codeneurax.in
                  </td>
                </tr>
              </table>

              <!-- Card Body Content -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:24px 24px 28px 24px;">

                    <!-- Category & Status Line -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                      <tr>
                        <td align="left" style="vertical-align:middle;">
                          <span style="font-size:11px;text-transform:uppercase;font-family:monospace;font-weight:700;letter-spacing:1.5px;color:#a1a1aa;margin-right:8px;">
                            ${cat.label}
                          </span>
                          <span style="display:inline-block;font-size:10px;font-family:monospace;padding:2px 7px;border-radius:6px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);color:#71717a;">
                            # LIVE
                          </span>
                        </td>
                        <td align="right" style="vertical-align:middle;font-size:11px;font-family:monospace;color:#71717a;">
                          ⏱️ 24h left
                        </td>
                      </tr>
                    </table>

                    <!-- Organizer / Company -->
                    ${data.organizer ? `
                    <p style="margin:0 0 8px 0;font-size:13px;color:#9ca3af;font-family:monospace;">
                      🏢 <strong style="color:#d1d5db;">${escapeHtml(data.organizer)}</strong>
                    </p>` : ""}

                    <!-- Golden Amber Title -->
                    <h1 style="margin:0 0 14px 0;font-size:22px;font-weight:800;color:#fbbf24;line-height:1.3;letter-spacing:-0.3px;">
                      ${safeTitle}
                    </h1>

                    <!-- Description -->
                    <p style="margin:0 0 18px 0;font-size:13.5px;line-height:1.65;color:#9ca3af;font-family:'Segoe UI',Roboto,sans-serif;">
                      ${safeDescription}
                    </p>

                    <!-- Tags & Badges Pills -->
                    ${pillsSection}

                    <!-- Divider -->
                    <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:18px 0 22px 0;"/>

                    <!-- macOS Sleek Dark Apply Button -->
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center">
                          <a href="${opportunityUrl}" target="_blank" rel="noopener noreferrer"
                             style="display:block;width:100%;box-sizing:border-box;background:#14161f;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 20px;border-radius:12px;text-align:center;border:1px solid rgba(255,255,255,0.18);box-shadow:0 6px 16px rgba(0,0,0,0.4);letter-spacing:0.3px;">
                            ${ctaText}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-top:12px;">
                          <span style="font-size:11px;color:#52525b;font-family:monospace;">
                            Live on CodeNeuraX Feed: <a href="${opportunityUrl}" target="_blank" rel="noopener noreferrer" style="color:#fbbf24;text-decoration:underline;">${opportunityUrl}</a>
                          </span>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 20px 0 20px;text-align:center;">
              <p style="margin:0 0 6px 0;font-size:11px;color:#52525b;">
                You're receiving this because you're a registered member of <span style="color:#9ca3af;font-weight:600;">CodeNeuraX</span>
              </p>
              <p style="margin:0;font-size:11px;color:#52525b;">
                <a href="https://www.codeneurax.in/terms" style="color:#71717a;text-decoration:underline;">Terms</a>
                &nbsp;·&nbsp;
                <a href="https://www.codeneurax.in/privacy" style="color:#71717a;text-decoration:underline;">Privacy</a>
                &nbsp;·&nbsp;
                <a href="https://www.codeneurax.in" style="color:#71717a;text-decoration:underline;">Visit Website</a>
              </p>
              <p style="margin:14px 0 0 0;font-size:10px;color:#3f3f46;">
                © ${year} CodeNeuraX · All rights reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/**
 * Fire-and-forget: fetch all user emails from Supabase auth.users
 * and send the broadcast email to each one.
 */
async function sendBroadcastEmails(data: BroadcastData): Promise<{ sent: number; failed: number; skipped: boolean }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const smtpHost = process.env.MARKETING_SMTP_HOST || process.env.SMTP_HOST
  const smtpPort = process.env.MARKETING_SMTP_PORT ? Number(process.env.MARKETING_SMTP_PORT) : (process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587)
  const smtpUser = process.env.MARKETING_SMTP_USER || process.env.SMTP_USER
  const smtpPass = process.env.MARKETING_SMTP_PASS || process.env.SMTP_PASS

  // Skip if missing credentials
  if (!supabaseUrl || !serviceRoleKey || serviceRoleKey === "your-service-role-key-here") {
    console.warn("[Email Blast] Skipped: SUPABASE_SERVICE_ROLE_KEY not configured.")
    return { sent: 0, failed: 0, skipped: true }
  }
  if (!smtpHost || !smtpUser || !smtpPass || smtpUser === "your-marketing-email@gmail.com") {
    console.warn("[Email Blast] Skipped: Marketing SMTP credentials not configured.")
    return { sent: 0, failed: 0, skipped: true }
  }

  try {
    // Create admin Supabase client with service role key
    const adminSupabase = createSupabaseAdmin(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Fetch all users (paginated — Supabase admin API returns up to 1000 per page)
    const allEmails: string[] = []
    let page = 1
    const perPage = 500

    while (true) {
      const { data: usersData, error: usersError } = await adminSupabase.auth.admin.listUsers({
        page,
        perPage,
      })

      if (usersError) {
        console.error("[Email Blast] Error fetching users:", usersError.message)
        break
      }

      if (!usersData?.users || usersData.users.length === 0) break

      for (const user of usersData.users) {
        if (user.email && !allEmails.includes(user.email)) {
          allEmails.push(user.email)
        }
      }

      // If fewer users returned than perPage, we've reached the end
      if (usersData.users.length < perPage) break
      page++
    }

    if (allEmails.length === 0) {
      console.warn("[Email Blast] No user emails found.")
      return { sent: 0, failed: 0, skipped: false }
    }

    console.log(`[Email Blast] Sending to ${allEmails.length} users...`)

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    })

    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://www.codeneurax.in").replace(/\/$/, "")
    const opportunityUrl = data.id ? `${baseUrl}/?opp=${data.id}#feed` : `${baseUrl}/#feed`
    const cat = getCategoryConfig(data.category)
    const subject = `${cat.emoji} ${data.title} — New Opportunity Live on CodeNeuraX`
    const html = buildEmailHtml(data)
    const plainText = `New ${cat.label}: ${data.title}\n\n${data.description}\n\n🔗 View & Apply on CodeNeuraX Feed:\n${opportunityUrl}\n\n— CodeNeuraX Team`

    let sent = 0
    let failed = 0

    // Send emails in batches of 10 to avoid overwhelming SMTP
    const batchSize = 10
    for (let i = 0; i < allEmails.length; i += batchSize) {
      const batch = allEmails.slice(i, i + batchSize)

      const results = await Promise.allSettled(
        batch.map((email) =>
          transporter.sendMail({
            from: `CodeNeuraX <${smtpUser}>`,
            to: email,
            subject,
            text: plainText,
            html,
          })
        )
      )

      for (const result of results) {
        if (result.status === "fulfilled") {
          sent++
        } else {
          failed++
          console.error("[Email Blast] Failed to send to user:", result.reason?.message || result.reason)
        }
      }

      // Small delay between batches to respect SMTP rate limits
      if (i + batchSize < allEmails.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    console.log(`[Email Blast] Done. Sent: ${sent}, Failed: ${failed}`)
    return { sent, failed, skipped: false }
  } catch (err: any) {
    console.error("[Email Blast] Unexpected error:", err?.message || err)
    return { sent: 0, failed: 0, skipped: true }
  }
}

// ────────────────────────────────────────────────────────────────
// API Route Handlers
// ────────────────────────────────────────────────────────────────

// Helper to get authorized DB client (prefer Service Role for admin operations)
function getAdminDbClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (supabaseUrl && serviceRoleKey && serviceRoleKey !== "your-service-role-key-here") {
    return createSupabaseAdmin(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }

  return createClient()
}

// Verification endpoint for admin login
export async function PUT(request: NextRequest) {
  // Rate limit: 5 attempts per 15 minutes per IP to prevent brute forcing
  const rateLimit = checkRateLimit(request, {
    windowMs: 15 * 60 * 1000,
    maxRequests: 5,
    message: "Too many admin authentication attempts. Please try again later.",
  })
  if (!rateLimit.allowed && rateLimit.response) {
    return rateLimit.response
  }

  try {
    const body = await request.json().catch(() => ({}))
    const { admin_key } = body
    if (isValidAdmin(request, admin_key)) {
      return NextResponse.json({ authenticated: true })
    }
    return NextResponse.json({ error: "Invalid Admin Passcode." }, { status: 401 })
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }
}

export async function POST(request: NextRequest) {
  // Rate limit admin post broadcasts
  const rateLimit = checkRateLimit(request, {
    windowMs: 15 * 60 * 1000,
    maxRequests: 15,
    message: "Too many broadcast requests. Please try again later.",
  })
  if (!rateLimit.allowed && rateLimit.response) {
    return rateLimit.response
  }

  try {
    const body = await request.json()
    const {
      admin_key,
      category,
      title,
      organizer,
      description,
      link_url,
      badge,
      deadline,
      location,
      stipend_or_prize,
    } = body

    // 1. Validate Admin Key
    if (!isValidAdmin(request, admin_key)) {
      return NextResponse.json(
        { error: "Unauthorized. Invalid or missing Admin Passcode." },
        { status: 401 }
      )
    }

    if (!category || !title || !description || !link_url) {
      return NextResponse.json(
        { error: "Category, Title, Description, and Link URL are required." },
        { status: 400 }
      )
    }

    if (!["internship", "hackathon", "news"].includes(category)) {
      return NextResponse.json(
        { error: "Invalid category. Must be 'internship', 'hackathon', or 'news'." },
        { status: 400 }
      )
    }

    const dbClient = getAdminDbClient()

    const now = new Date()
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()

    const { data, error } = await dbClient
      .from("community_posts")
      .insert([
        {
          category,
          title: title.trim(),
          organizer: organizer?.trim() || null,
          description: description.trim(),
          link_url: link_url.trim(),
          badge: badge?.trim() || null,
          deadline: deadline?.trim() || null,
          location: location?.trim() || null,
          stipend_or_prize: stipend_or_prize?.trim() || null,
          created_at: now.toISOString(),
          expires_at: expiresAt,
        },
      ])
      .select()

    if (error) {
      console.error("Error inserting community post:", error)
      return NextResponse.json(
        { error: error.message || "Failed to publish broadcast." },
        { status: 500 }
      )
    }

    // ── Fire-and-forget email blast to all registered users ──
    const broadcastData: BroadcastData = {
      id: data?.[0]?.id,
      category,
      title: title.trim(),
      organizer: organizer?.trim(),
      description: description.trim(),
      link_url: link_url.trim(),
      badge: badge?.trim(),
      deadline: deadline?.trim(),
      location: location?.trim(),
      stipend_or_prize: stipend_or_prize?.trim(),
    }

    // Don't await — let it run in background so the admin gets instant response
    const emailPromise = sendBroadcastEmails(broadcastData).catch((err) => {
      console.error("[Email Blast] Background send failed:", err)
      return { sent: 0, failed: 0, skipped: true }
    })

    // Wait briefly to capture initial result if fast, but don't block long
    const emailResult = await Promise.race([
      emailPromise,
      new Promise<{ sent: number; failed: number; skipped: boolean }>((resolve) =>
        setTimeout(() => resolve({ sent: -1, failed: -1, skipped: false }), 5000)
      ),
    ])

    return NextResponse.json({
      success: true,
      post: data?.[0],
      emailBlast: emailResult.sent === -1
        ? { status: "sending_in_background" }
        : {
            status: emailResult.skipped ? "skipped_not_configured" : "completed",
            sent: emailResult.sent,
            failed: emailResult.failed,
          },
    })
  } catch (err: any) {
    console.error("Admin broadcast POST error:", err)
    return NextResponse.json(
      { error: err?.message || "Internal server error." },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  // Rate limit admin deletions
  const rateLimit = checkRateLimit(request, {
    windowMs: 15 * 60 * 1000,
    maxRequests: 20,
    message: "Too many delete requests. Please try again later.",
  })
  if (!rateLimit.allowed && rateLimit.response) {
    return rateLimit.response
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    // 1. Validate Admin Key from header
    if (!isValidAdmin(request)) {
      return NextResponse.json(
        { error: "Unauthorized. Invalid or missing Admin Passcode." },
        { status: 401 }
      )
    }

    if (!id) {
      return NextResponse.json({ error: "Post ID is required." }, { status: 400 })
    }

    const dbClient = getAdminDbClient()
    const { error } = await dbClient.from("community_posts").delete().eq("id", id)

    if (error) {
      console.error("Error deleting community post:", error)
      return NextResponse.json(
        { error: error.message || "Failed to delete post." },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Admin broadcast DELETE error:", err)
    return NextResponse.json(
      { error: err?.message || "Internal server error." },
      { status: 500 }
    )
  }
}

