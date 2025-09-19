import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/'

  if (code) {
    const supabase = createClient()
    try {
      // Exchange the code from the provider for a Supabase session
      const { error } = await (supabase as any).auth.exchangeCodeForSession(code)
      if (error) {
        console.error('OAuth exchange error:', error)
      }
    } catch (err) {
      console.error('OAuth exchange exception:', err)
    }
  } else {
    console.warn('OAuth callback missing code parameter')
  }

  return NextResponse.redirect(new URL(next, request.url))
}
