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
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        console.error("Password reset error:", error)
        setError(error.message || "Failed to send password reset email. Please try again.")
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
