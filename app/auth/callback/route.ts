import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { recordUserLoginAudit } from '@/lib/audit-logger'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createAdminClient(url, serviceKey)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const rawNext = searchParams.get('next') || '/'
  // Prevent open redirect: strictly enforce safe internal relative path
  const next = (rawNext.startsWith('/') && !rawNext.startsWith('//') && !rawNext.includes('\\')) ? rawNext : '/'

  if (code) {
    const supabase = createClient()
    try {
      // Exchange the code from the provider for a Supabase session
      const { data, error } = await (supabase as any).auth.exchangeCodeForSession(code)
      if (error) {
        console.error('OAuth exchange error:', error)
      } else if (data?.session?.user) {
        const user = data.session.user
        const adminClient = getSupabaseAdmin()
        if (adminClient && user.email) {
          await recordUserLoginAudit(
            adminClient,
            {
              id: user.id,
              email: user.email,
              name: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0] || '',
            },
            {
              req: request,
              loginMethod: 'google_oauth_callback',
              metadata: {
                provider: user.app_metadata?.provider || 'google',
              },
            }
          )
        }
      }
    } catch (err) {
      console.error('OAuth exchange exception:', err)
    }
  } else {
    console.warn('OAuth callback missing code parameter')
  }

  return NextResponse.redirect(new URL(next, request.url))
}
