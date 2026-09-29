"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState(false)
  const [hasSession, setHasSession] = useState<boolean | null>(null)

  useEffect(() => {
    // When user clicks the recovery email link, Supabase signs them in with a short-lived session
    // We check for that session here.
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      setHasSession(!!data.session)
    }
    checkSession()
  }, [supabase])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }

    try {
      setLoading(true)
      const { error } = await supabase.auth.updateUser({ password })
      if (error) {
        console.error("Update password error:", error)
        setError(error.message || "Failed to update password. Please try again.")
        return
      }
      setSuccess(true)
    } catch (err) {
      console.error("Update password exception:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="ambient-glow w-96 h-96 -top-20 -left-20" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.08), transparent 70%)' }} />
      <div className="ambient-glow w-96 h-96 -bottom-20 -right-20" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.06), transparent 70%)' }} />

      <div className="w-full max-w-md mac-window relative z-10">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-serif)" }}>
            Reset your password
          </h1>
          <p className="text-white/40 mb-6 text-sm">Enter a new password for your account.</p>

          {hasSession === false && (
            <div className="flex items-start gap-2 bg-amber-500/5 border border-amber-500/15 text-amber-300/80 rounded-xl p-3 mb-6">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm">We couldn't detect a recovery session.</p>
                <p className="text-xs text-amber-400/60">Please use the password reset link from your email again.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 bg-red-500/5 border border-red-500/15 text-red-300/80 rounded-xl p-3 mb-4">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-1">Password updated</h2>
              <p className="text-white/40 mb-6 text-sm">You can now close this page and sign in with your new password.</p>
              <a href="/" className="btn-premium btn-green justify-center w-full">
                Go to home
              </a>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-mac pr-12"
                    placeholder="Enter new password"
                    minLength={6}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/40 mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
                  Confirm Password
                </label>
                <input
                  type={show ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="input-mac"
                  placeholder="Re-enter new password"
                  minLength={6}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || hasSession === false}
                className="w-full btn-premium justify-center disabled:opacity-40"
              >
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
