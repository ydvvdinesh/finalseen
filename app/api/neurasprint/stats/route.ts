import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"
export const revalidate = 0

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const MAX_SLOTS = 250

export async function GET() {
  try {
    const { data: rows, error } = await supabaseAdmin
      .from("neurasprint_registrations")
      .select("payment_status, status, prior_hackathons")

    if (error) {
      console.error("[NeuraSprint Stats] Supabase query error:", error)
      return NextResponse.json({
        totalRegistered: 0,
        paidCount: 0,
        pendingCount: 0,
        maxSlots: MAX_SLOTS,
        slotsRemaining: MAX_SLOTS,
        tracks: {
          "ai-agents": 0,
          "realtime-saas": 0,
          "devtools-dx": 0,
          "open-innovation": 0,
        },
      })
    }

    const totalRegistered = rows ? rows.length : 0
    let paidCount = 0
    let pendingCount = 0

    const tracks: Record<string, number> = {
      "ai-agents": 0,
      "realtime-saas": 0,
      "devtools-dx": 0,
      "open-innovation": 0,
    }

    if (rows && rows.length > 0) {
      for (const row of rows) {
        if (row.payment_status === "paid" || row.status === "confirmed") {
          paidCount++
        } else if (row.payment_status === "pending") {
          pendingCount++
        }

        const prior = (row.prior_hackathons || "").toLowerCase()
        if (prior.includes("ai-agents")) {
          tracks["ai-agents"]++
        } else if (prior.includes("realtime-saas")) {
          tracks["realtime-saas"]++
        } else if (prior.includes("devtools-dx")) {
          tracks["devtools-dx"]++
        } else if (prior.includes("open-innovation")) {
          tracks["open-innovation"]++
        }
      }
    }

    const slotsRemaining = Math.max(0, MAX_SLOTS - paidCount)

    return NextResponse.json({
      totalRegistered,
      paidCount,
      pendingCount,
      maxSlots: MAX_SLOTS,
      slotsRemaining,
      tracks,
      status: slotsRemaining > 0 ? "open" : "sold_out",
    }, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    })
  } catch (err: any) {
    console.error("[NeuraSprint Stats] Unexpected error:", err)
    return NextResponse.json({
      totalRegistered: 0,
      paidCount: 0,
      pendingCount: 0,
      maxSlots: MAX_SLOTS,
      slotsRemaining: MAX_SLOTS,
      tracks: {
        "ai-agents": 0,
        "realtime-saas": 0,
        "devtools-dx": 0,
        "open-innovation": 0,
      },
    }, { status: 200 })
  }
}
