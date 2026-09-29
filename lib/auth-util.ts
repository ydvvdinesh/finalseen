import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export interface AuthenticatedUser {
  id: string
  email: string
}

/**
 * Validates caller identity on the server side using either:
 * 1. Supabase HTTP-only session cookies
 * 2. Authorization Bearer token header
 */
export async function getAuthenticatedCaller(req?: Request): Promise<AuthenticatedUser | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return null

  // 1. Try resolving session from request cookies
  try {
    const cookieStore = cookies()
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user?.email) {
      return { id: user.id, email: user.email.toLowerCase().trim() }
    }
  } catch {
    // Cookie store may fail or be unavailable
  }

  // 2. Try resolving from Authorization header
  if (req) {
    try {
      const authHeader = req.headers.get("authorization")
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.substring(7).trim()
        const { createClient } = await import("@supabase/supabase-js")
        const supabase = createClient(url, anonKey)
        const {
          data: { user: tokenUser },
        } = await supabase.auth.getUser(token)

        if (tokenUser?.email) {
          return { id: tokenUser.id, email: tokenUser.email.toLowerCase().trim() }
        }
      }
    } catch {
      // Token resolution failed
    }
  }

  return null
}
