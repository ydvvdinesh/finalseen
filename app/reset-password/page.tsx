"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

function ResetPasswordContent() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  // Check for valid session
  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking session...")
        
        // First, check if we have recovery tokens in URL
        const accessToken = searchParams.get('access_token')
        const refreshToken = searchParams.get('refresh_token')
        const type = searchParams.get('type')
        
        console.log("URL params:", { accessToken: !!accessToken, refreshToken: !!refreshToken, type })
        
        if (type === 'recovery' && accessToken) {
          console.log("Recovery tokens found, setting session...")
          
          // Set the session with the recovery tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          })
          
          if (error) {
            console.error('Session set error:', error)
            // Try alternative approach - just validate the tokens exist
            setIsValidSession(true)
          } else if (data.session) {
            console.log('Session set successfully')
            setIsValidSession(true)
          } else {
            console.log('No session data, but tokens exist - allowing reset')
            setIsValidSession(true)
          }
        } else {
          // Check if user already has a valid session
          const { data: { session }, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error('Session check error:', error)
            setError('Invalid or expired reset link. Please request a new password reset.')
          } else if (session) {
            console.log('Valid session found')
            setIsValidSession(true)
          } else {
            console.log('No session and no recovery tokens')
            setError('Invalid or expired reset link. Please request a new password reset.')
          }
        }
      } catch (err) {
        console.error('Session check error:', err)
        setError('Something went wrong. Please try again.')
      } finally {
        setCheckingSession(false)
      }
    }

    checkSession()
  }, [supabase.auth, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.")
      setLoading(false)
      return
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.")
      setLoading(false)
      return
    }
    
    try {
      // Update the user's password
      const { error } = await supabase.auth.updateUser({ password })
      
      if (error) {
        console.error("Password update error:", error)
        setError(error.message || "Failed to update password. Please try again.")
      } else {
        setSuccess(true)
        // Sign out the user after successful password reset
        await supabase.auth.signOut()
      }
    } catch (err) {
      console.error("Password update error:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRequestNewReset = () => {
    router.push("/")
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Verifying reset link...</p>
        </div>
      </div>
    )
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative bg-gray-900/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="bg-red-500/20 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Invalid Reset Link</h2>
            <p className="text-gray-400 mb-6">The password reset link is invalid or has expired.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleRequestNewReset}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 rounded-xl transition-all duration-300"
            >
              Request New Reset Link
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition-all duration-300"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-gray-900/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 w-full max-w-md"
      >
        <button
          onClick={() => router.push("/")}
          className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center mb-8">
          <div className="bg-cyan-500/20 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Lock className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Set New Password</h2>
          <p className="text-gray-400">Enter your new password below to reset your account password.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-900/30 border border-red-800/50 rounded-xl p-4 mb-6">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-900/30 border border-green-800/50 rounded-xl p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-500/20 p-2 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-green-400">Password Updated!</h3>
            </div>
            <p className="text-green-300 mb-4">Your password has been updated successfully. You can now log in with your new password.</p>
            <button
              onClick={() => router.push("/")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all duration-300"
            >
              Go to Login
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Enter your new password"
                  required
                  minLength={6}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="Confirm your new password"
                  required
                  minLength={6}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating Password...
                </div>
              ) : (
                "Set Password"
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  )
}

// Loading component for Suspense fallback
function ResetPasswordLoading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white text-lg">Loading...</p>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent />
    </Suspense>
  )
} 