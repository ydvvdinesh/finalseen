import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// ─── Supabase admin client ───
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ADMIN_KEY = process.env.ADMIN_BROADCAST_KEY

// ─── Auth helper ───
function verifyAdmin(request: Request): boolean {
  const authHeader = request.headers.get("x-admin-key")
  return authHeader === ADMIN_KEY
}

// ─── GET: Fetch all registrations (admin) ───
export async function GET(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") // "all", "paid", "pending", "failed"
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = (page - 1) * limit

    let query = supabaseAdmin
      .from("neurasprint_registrations")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== "all") {
      query = query.eq("payment_status", status)
    }

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,registration_id.ilike.%${search}%,phone.ilike.%${search}%,college.ilike.%${search}%`
      )
    }

    const { data, error, count } = await query

    if (error) {
      console.error("Admin fetch error:", error)
      return NextResponse.json(
        { error: "Failed to fetch registrations" },
        { status: 500 }
      )
    }

    // Stats
    const { data: stats } = await supabaseAdmin.rpc("neurasprint_stats").single()

    // If RPC doesn't exist, compute manually
    let statsData = stats
    if (!stats) {
      const { count: totalCount } = await supabaseAdmin
        .from("neurasprint_registrations")
        .select("*", { count: "exact", head: true })

      const { count: paidCount } = await supabaseAdmin
        .from("neurasprint_registrations")
        .select("*", { count: "exact", head: true })
        .eq("payment_status", "paid")

      const { count: pendingCount } = await supabaseAdmin
        .from("neurasprint_registrations")
        .select("*", { count: "exact", head: true })
        .eq("payment_status", "pending")

      const { count: failedCount } = await supabaseAdmin
        .from("neurasprint_registrations")
        .select("*", { count: "exact", head: true })
        .eq("payment_status", "failed")

      statsData = {
        total: totalCount || 0,
        paid: paidCount || 0,
        pending: pendingCount || 0,
        failed: failedCount || 0,
        revenue: (paidCount || 0) * 99,
      }
    }

    return NextResponse.json({
      registrations: data,
      total: count,
      page,
      limit,
      stats: statsData,
    })
  } catch (error: any) {
    console.error("Admin registrations error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// ─── PATCH: Update registration status (admin) ───
export async function PATCH(request: Request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { registrationId, updates } = body

    if (!registrationId || !updates) {
      return NextResponse.json(
        { error: "Missing registrationId or updates" },
        { status: 400 }
      )
    }

    // Only allow specific fields to be updated
    const allowedFields = ["status", "payment_status", "notes"]
    const safeUpdates: Record<string, any> = {}
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        safeUpdates[key] = updates[key]
      }
    }

    if (Object.keys(safeUpdates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from("neurasprint_registrations")
      .update(safeUpdates)
      .eq("registration_id", registrationId)
      .select()
      .single()

    if (error) {
      console.error("Admin update error:", error)
      return NextResponse.json(
        { error: "Failed to update registration" },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error("Admin update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
