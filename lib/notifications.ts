import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return createClient(url, serviceKey)
}

export interface NotificationPayload {
  recipient_email: string
  sender_name?: string
  sender_email?: string
  type: 'team_join_request' | 'team_accepted' | 'team_rejected' | 'team_removed' | 'team_left' | 'system'
  title: string
  message: string
  team_id?: string | null
  team_name?: string | null
  link_url?: string
}

/**
 * Creates an in-app notification in Supabase.
 * Fails silently with a console warning so core business logic is never blocked.
 */
export async function createNotification(payload: NotificationPayload): Promise<boolean> {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) return false

    const recipient = payload.recipient_email?.trim().toLowerCase()
    if (!recipient) return false

    const record: any = {
      recipient_email: recipient,
      sender_name: payload.sender_name || 'CodeNeuraX',
      sender_email: payload.sender_email?.trim().toLowerCase() || null,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      team_id: payload.team_id || null,
      team_name: payload.team_name || null,
      link_url: payload.link_url || '/buddykid',
      is_read: false,
    }

    const { error } = await supabase.from('notifications').insert(record)

    if (error) {
      // If link_url column does not exist in user's schema, retry without it
      if (error.message?.includes('link_url')) {
        delete record.link_url
        const { error: retryError } = await supabase.from('notifications').insert(record)
        if (retryError) {
          console.warn('Failed to insert notification (retry):', retryError.message)
          return false
        }
        return true
      }
      console.warn('Failed to insert notification:', error.message)
      return false
    }

    return true
  } catch (err) {
    console.warn('Notification creation error:', err)
    return false
  }
}
