"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface AuthModalProps {
  type: "login" | "signup"
  onClose: () => void
}

export default function AuthModal({ type, onClose }: AuthModalProps) {
  const [authType, setAuthType] = useState(type)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const supabase = createClient()

  // Check for redirect after login
  useEffect(() => {
    const handleAuthSuccess = () => {
      const redirectPath = localStorage.getItem("redirectAfterLogin")
      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin")
        window.location.href = redirectPath
      } else {
        onClose()
      }
    }

    // Listen for successful auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        handleAuthSuccess()
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase.auth, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (authType === "signup") {
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            },
          },
        })

        if (error) {
          console.error("Signup error:", error)
          setError(error.message || "Failed to create account. Please try again.")
        } else {
          setError("")
          setShowConfirmation(true)
          // Don't close modal immediately, show confirmation message
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        })

        if (error) {
          console.error("Login error:", error)
          setError(error.message || "Invalid email or password. Please try again.")
        } else {
          setError("")
          // Auth state change will handle redirect
        }
      }
    } catch (err) {
      console.error("Auth error:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Debug logging to see what's happening
      console.log('Current location:', window.location.href)
      console.log('Hostname:', window.location.hostname)
      console.log('Origin:', window.location.origin)
      console.log('NODE_ENV:', process.env.NODE_ENV)
      
      // Use the current origin for the redirect URL
      const redirectUrl = `${window.location.origin}/reset-password`
      console.log('Using redirectUrl:', redirectUrl)
      
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: redirectUrl,
      })

      if (error) {
        console.error("Password reset error:", error)
        // Provide more specific error messages based on the error type
        if (error.message.includes('Auth not configured')) {
          setError("Authentication is not properly configured. Please contact support.")
        } else if (error.message.includes('Email not confirmed')) {
          setError("Please check your email and confirm your account first.")
        } else {
          setError(error.message || "Failed to send reset email. Please try again.")
        }
      } else {
        setResetEmailSent(true)
      }
    } catch (err) {
      console.error("Password reset error:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError("")
      const redirectTo = `${window.location.origin}/auth/callback`
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      } as any)
      if (error) {
        console.error('Google sign-in error:', error)
        setError(error.message || 'Failed to sign in with Google. Please try again.')
      }
      // On success, Supabase will redirect; auth state listener will handle close/redirect on return
    } catch (err) {
      console.error('Google sign-in error:', err)
      setError('Something went wrong with Google sign-in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const resetForm = () => {
    setIsForgotPassword(false)
    setResetEmailSent(false)
    setError("")
    setFormData((prev) => ({
      ...prev,
      email: "",
    }))
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-gray-900/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 w-full max-w-md"
        >
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            {isForgotPassword ? (
              <>
                <button
                  onClick={resetForm}
                  className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <h2 className="text-3xl font-black text-white mb-2">Reset Password</h2>
                <p className="text-gray-400">Enter your email and we'll send you a link to reset your password</p>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-black text-white mb-2">
                  {authType === "login" ? "Welcome Back" : "Join CodeNeuraX"}
                </h2>
                <p className="text-gray-400">
                  {authType === "login"
                    ? localStorage.getItem("redirectAfterLogin")
                      ? "Please sign in to access the Study section"
                      : "Sign in to your account"
                    : "Create your account to get started"}
                </p>
              </>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 bg-red-900/30 border border-red-800/50 rounded-xl p-4 mb-6">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-300 text-sm">{error}</span>
            </div>
          )}

          {/* Forgot Password Form */}
          {isForgotPassword && !resetEmailSent && (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
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
                    Sending Reset Link...
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
          )}

          {/* Password Reset Confirmation */}
          {isForgotPassword && resetEmailSent && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-900/30 border border-green-800/50 rounded-xl p-6 mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <Mail className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-green-400">Check Your Email!</h3>
              </div>
              <p className="text-green-300 mb-4">
                We've sent a password reset link to <strong>{formData.email}</strong>
              </p>
              <p className="text-gray-300 text-sm mb-4">
                Please check your email and click the link to reset your password. The link will expire in 24 hours.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all duration-300"
              >
                Got it!
              </button>
            </motion.div>
          )}

          {/* Login/Signup Form */}
          {!isForgotPassword && !showConfirmation && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {authType === "signup" && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Enter your full name"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-300">Password</label>
                  {authType === "login" && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl pl-12 pr-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    minLength={6}
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {authType === "login" ? "Signing In..." : "Creating Account..."}
                  </div>
                ) : authType === "login" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="h-px bg-gray-800 flex-1" />
                <span className="text-gray-500 text-sm">or continue with</span>
                <div className="h-px bg-gray-800 flex-1" />
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3 rounded-xl transition-colors border border-gray-200 flex items-center justify-center gap-3"
                aria-label="Continue with Google"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.94 32.333 29.418 36 24 36 16.82 36 11 30.18 11 23S16.82 10 24 10c3.06 0 5.84 1.153 7.961 3.039l5.657-5.657C34.46 3.553 29.478 1.5 24 1.5 11.573 1.5 1.5 11.573 1.5 24S11.573 46.5 24 46.5 46.5 36.427 46.5 24c0-1.312-.135-2.593-.389-3.917z"/>
                  <path fill="#FF3D00" d="M6.306 14.691l6.571 4.817C14.623 16.151 18.961 13 24 13c3.06 0 5.84 1.153 7.961 3.039l5.657-5.657C34.46 3.553 29.478 1.5 24 1.5 16.104 1.5 9.241 6.019 6.306 14.691z"/>
                  <path fill="#4CAF50" d="M24 46.5c5.356 0 10.248-1.985 13.986-5.262l-6.461-5.472C29.445 37.575 26.92 38.5 24 38.5c-5.392 0-9.9-3.626-11.557-8.533l-6.5 5.01C8.822 41.66 15.886 46.5 24 46.5z"/>
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303C34.94 32.333 31 35.5 24 35.5c-5.392 0-9.9-3.626-11.557-8.533l-6.5 5.01C8.822 41.66 15.886 46 24 46c12.427 0 22.5-10.073 22.5-22.5 0-1.312-.135-2.593-.389-3.917z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>
          )}

          {/* Signup Confirmation Message */}
          {!isForgotPassword && showConfirmation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-900/30 border border-green-800/50 rounded-xl p-6 mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <Mail className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-green-400">Check Your Email!</h3>
              </div>
              <p className="text-green-300 mb-4">
                We've sent a confirmation link to <strong>{formData.email}</strong>
              </p>
              <p className="text-gray-300 text-sm mb-4">
                Please check your email and also check once into spam and click the confirmation link to activate your account.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all duration-300"
              >
                Got it!
              </button>
            </motion.div>
          )}

          {/* Switch Auth Type */}
          {!isForgotPassword && !showConfirmation && (
            <div className="text-center mt-6">
              <p className="text-gray-400">
                {authType === "login" ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => {
                    setAuthType(authType === "login" ? "signup" : "login")
                    setError("")
                    setShowConfirmation(false)
                    setFormData({ name: "", email: "", password: "" })
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  disabled={loading}
                >
                  {authType === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
