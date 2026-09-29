import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

/**
 * Authentication middleware for CodeNeuraX website.
 * - First-time / Unauthenticated visitors without guest session land on /login.
 * - On /login, users can choose "Continue with Google" or "Continue as Guest".
 * - In Guest Mode (cnx_guest=true), users can access general pages (home, feed, events, aispark, etc.).
 * - BUT /econtent, /services, and /buddykid strictly require a full authenticated login.
 */
export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options)
        })
      },
    },
  })

  // Get current authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isGuest =
    request.cookies.get("cnx_guest_active")?.value === "true" ||
    request.cookies.get("cnx_guest")?.value === "true"

  // Public system / auth routes
  const isPublicAuthPath =
    pathname === "/login" ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify-registration") ||
    pathname.startsWith("/api/")

  // Strictly protected paths requiring full Google login (even guest cannot access)
  const isFullLoginRequired =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/econtent") ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/buddykid")

  // 1. If user is fully authenticated and tries to visit /login -> redirect to home or destination
  if (user && pathname === "/login") {
    const rawNext = request.nextUrl.searchParams.get("next") || "/"
    const safeNext =
      rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.includes("\\")
        ? rawNext
        : "/"
    return NextResponse.redirect(new URL(safeNext, request.url))
  }

  // 2. If user accesses strictly protected pages (/econtent, /services, /buddykid) without full login -> redirect to /login
  if (!user && isFullLoginRequired) {
    const nextUrl = new URL("/login", request.url)
    const currentPathWithQuery = pathname + request.nextUrl.search
    nextUrl.searchParams.set("next", currentPathWithQuery)
    return NextResponse.redirect(nextUrl)
  }

  // 3. If visitor is NOT signed in AND has NOT explicitly clicked Guest mode in this session -> ALWAYS redirect to /login first
  if (!user && !isGuest && !isPublicAuthPath) {
    const nextUrl = new URL("/login", request.url)
    const currentPathWithQuery = pathname + request.nextUrl.search
    if (pathname !== "/") {
      nextUrl.searchParams.set("next", currentPathWithQuery)
    }
    return NextResponse.redirect(nextUrl)
  }

  return supabaseResponse
}