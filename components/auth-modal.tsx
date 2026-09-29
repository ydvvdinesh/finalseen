"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface AuthModalProps {
  type: "login" | "signup"
  onClose: () => void
}

export default function AuthModal({ type, onClose }: AuthModalProps) {
  const [authType] = useState(type)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()

  const finishEmailAuth = useCallback(() => {
    const redirectPath = sessionStorage.getItem("redirectAfterLogin")
    if (redirectPath) {
      sessionStorage.removeItem("redirectAfterLogin")
      // Validate redirect path to prevent open redirects
      if (redirectPath.startsWith("/") && !redirectPath.startsWith("//")) {
        window.location.assign(redirectPath)
      } else {
        onClose()
      }
      return
    }
    onClose()
  }, [onClose])

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError("")
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (window.location.origin.includes('localhost') ? window.location.origin : 'https://www.codeneurax.in')
      const redirectTo = `${baseUrl}/auth/callback`
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
    } catch (err) {
      console.error('Google sign-in error:', err)
      setError('Something went wrong with Google sign-in. Please try again.')
    } finally {
      setLoading(false)
    }
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
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal: Mac window styled */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md mac-window shadow-2xl z-10"
        >
          <div className="p-8 relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="mono-badge mx-auto mb-4">
                <span className="dot" />
                Authentication
              </div>
              <h2 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                {authType === "login" ? "Welcome Back" : "Join CodeNeuraX"}
              </h2>
              <p className="text-white/40 text-xs">
                {sessionStorage.getItem("redirectAfterLogin")
                  ? "Please sign in to continue"
                  : "Sign in or create an account to get started"}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 mb-6 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white text-black hover:bg-white/90 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-3 text-sm shadow-md disabled:opacity-50"
                aria-label="Continue with Google"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.94 32.333 29.418 36 24 36 16.82 36 11 30.18 11 23S16.82 10 24 10c3.06 0 5.84 1.153 7.961 3.039l5.657-5.657C34.46 3.553 29.478 1.5 24 1.5 11.573 1.5 1.5 11.573 1.5 24S11.573 46.5 24 46.5 46.5 36.427 46.5 24c0-1.312-.135-2.593-.389-3.917z"/>
                  <path fill="#FF3D00" d="M6.306 14.691l6.571 4.817C14.623 16.151 18.961 13 24 13c3.06 0 5.84 1.153 7.961 3.039l5.657-5.657C34.46 3.553 29.478 1.5 24 1.5 16.104 1.5 9.241 6.019 6.306 14.691z"/>
                  <path fill="#4CAF50" d="M24 46.5c5.356 0 10.248-1.985 13.986-5.262l-6.461-5.472C29.445 37.575 26.92 38.5 24 38.5c-5.392 0-9.9-3.626-11.557-8.533l-6.5 5.01C8.822 41.66 15.886 46.5 24 46.5z"/>
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303C34.94 32.333 31 35.5 24 35.5c-5.392 0-9.9-3.626-11.557-8.533l-6.5 5.01C8.822 41.66 15.886 46 24 46c12.427 0 22.5-10.073 22.5-22.5 0-1.312-.135-2.593-.389-3.917z"/>
                </svg>
                <span>{loading ? "Connecting..." : "Continue with Google"}</span>
              </button>
              <p className="text-white/30 text-[0.7rem] text-center mt-4" style={{ fontFamily: "var(--font-mono)" }}>
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
