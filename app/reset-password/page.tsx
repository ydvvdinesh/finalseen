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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black px-4">
      <div className="w-full max-w-md bg-gray-900/80 border border-gray-800/60 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Reset your password</h1>
        <p className="text-gray-400 mb-6">Enter a new password for your account.</p>

        {hasSession === false && (
          <div className="flex items-start gap-2 bg-amber-900/20 border border-amber-800/40 text-amber-200 rounded-lg p-3 mb-6">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <div>
              <p className="text-sm">We couldn't detect a recovery session.</p>
              <p className="text-xs text-amber-300">Please use the password reset link from your email again.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 bg-red-900/30 border border-red-800/50 text-red-200 rounded-lg p-3 mb-4">
            <AlertCircle className="w-5 h-5 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 text-green-400 mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-1">Password updated</h2>
            <p className="text-gray-400 mb-6">You can now close this page and sign in with your new password.</p>
            <a
              href="/"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              Go to home
            </a>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-4 pr-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Enter new password"
                  minLength={6}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <input
                type={show ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-4 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="Re-enter new password"
                minLength={6}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || hasSession === false}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
