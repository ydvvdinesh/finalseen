import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ posts: [] }, { status: 200 })
    }

    const supabase = createClient()

    // 1. Calculate 24-hour cutoff
    const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    // 2. Fetch only posts created in the last 24 hours
    const { data: posts, error } = await supabase
      .from("community_posts")
      .select("*")
      .gte("created_at", cutoffDate)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching community posts:", error)
      return NextResponse.json({ posts: [] }, { status: 200 })
    }

    // 3. Fire-and-forget purge of stale posts older than 24 hours to keep DB lightweight
    try {
      await supabase
        .from("community_posts")
        .delete()
        .lt("created_at", cutoffDate)
    } catch {
      // Non-critical background cleanup
    }

    return NextResponse.json({ posts: posts || [] })
  } catch (err: any) {
    console.error("Feed error:", err)
    return NextResponse.json({ posts: [] }, { status: 200 })
  }
}
