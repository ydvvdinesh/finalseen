"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { AlertCircle, CheckCircle, XCircle } from "lucide-react"

export default function SupabaseStatus() {
  const [status, setStatus] = useState<{
    configured: boolean
    url: string | null
    key: string | null
    error?: string
  }>({
    configured: false,
    url: null,
    key: null,
  })

  useEffect(() => {
    const checkConfig = () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      setStatus({
        configured: !!(url && key),
        url,
        key,
        error: !url || !key ? "Missing Supabase credentials" : undefined
      })
    }

    checkConfig()
  }, [])

  if (status.configured) {
    return null // Don't show anything if properly configured
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-red-900/90 backdrop-blur-xl border border-red-800/50 rounded-xl p-4 max-w-sm">
        <div className="flex items-center gap-3 mb-2">
          <XCircle className="w-5 h-5 text-red-400" />
          <h3 className="text-red-300 font-semibold">Configuration Issue</h3>
        </div>
        <p className="text-red-200 text-sm mb-3">
          Supabase credentials are missing. Authentication features will not work.
        </p>
        <div className="text-xs text-red-300 space-y-1">
          <div>URL: {status.url ? "✅ Set" : "❌ Missing"}</div>
          <div>Key: {status.key ? "✅ Set" : "❌ Missing"}</div>
        </div>
      </div>
    </div>
  )
} 