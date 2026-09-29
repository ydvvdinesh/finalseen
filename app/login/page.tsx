"use client"

import React, { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import {
  ArrowRight,
  ShieldCheck,
  Loader2,
  Sparkles,
  UserX,
} from "lucide-react"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawNext = searchParams.get("next") || "/"
  const nextPath =
    rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.includes("\\")
      ? rawNext
      : "/"

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        if (data?.user) {
          router.replace(nextPath)
        }
      } catch {
        // Ignore
      }
    }
    checkUser()
  }, [supabase, router, nextPath])

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError(null)
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        (typeof window !== "undefined" && window.location.origin.includes("localhost")
          ? window.location.origin
          : "https://www.codeneurax.in")

      const redirectTo = `${baseUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`

      const { error: authError } = await (supabase.auth as any).signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      })

      if (authError) {
        setError(authError.message || "Failed to sign in with Google.")
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
   }
  }

  const isRestrictedRedirect =
    searchParams.get("restricted") === "true" ||
    nextPath.startsWith("/econtent") ||
    nextPath.startsWith("/services")

  const handleGuestMode = () => {
    // Set guest cookies with 7-day duration for seamless browsing
    document.cookie = `cnx_guest_active=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    document.cookie = `cnx_guest=true; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
    const destination = isRestrictedRedirect ? "/" : nextPath
    window.location.href = destination
  }

  const stats = [
    { value: "7,000+", label: "Members" },
    { value: "50+", label: "Internship Support" },
    { value: "20+", label: "Events/Year" },
  ]

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#030305] text-white overflow-hidden">

      {/* ══════════════ LEFT HALF — Branding ══════════════ */}
      <div className="relative lg:w-[55%] w-full flex flex-col justify-center items-center px-6 sm:px-10 lg:px-16 xl:px-24 py-14 lg:py-0 overflow-hidden">

        {/* Animated orbs background */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Large purple orb */}
          <div
            className="absolute w-[520px] h-[520px] top-1/2 left-1/2 -translate-x-[60%] -translate-y-[45%] rounded-full blur-[100px] opacity-30"
            style={{ background: "radial-gradient(circle, #7c3aed, #4f46e5 40%, transparent 70%)" }}
          />
          {/* Blue orb */}
          <div
            className="absolute w-[400px] h-[400px] top-[20%] right-[5%] rounded-full blur-[90px] opacity-20"
            style={{ background: "radial-gradient(circle, #3b82f6, #6366f1 50%, transparent 70%)" }}
          />
          {/* Warm accent */}
          <div
            className="absolute w-[300px] h-[300px] bottom-[15%] left-[10%] rounded-full blur-[80px] opacity-15"
            style={{ background: "radial-gradient(circle, #f59e0b, #ef4444 50%, transparent 70%)" }}
          />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
          {/* Radial vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, transparent 40%, #030305 80%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-xl text-center lg:text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-xl mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] tracking-[0.2em] uppercase font-mono text-white/50 font-medium">
              Student-Led Tech Community
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.05] mb-6">
              <span className="text-white/90">Code</span>
              <span className="font-bold bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                NeuraX
              </span>
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-white/40 leading-relaxed max-w-md mx-auto lg:mx-0 mb-10"
          >
            Connect, inspire, and empower the next generation of{" "}
            <span className="text-amber-400/90 font-medium">coders</span>,{" "}
            <span className="text-amber-400/90 font-medium">developers</span>, and{" "}
            <span className="text-amber-400/90 font-medium">innovators</span>.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap justify-center lg:justify-start gap-0"
          >
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`px-6 py-4 ${
                  i < stats.length - 1
                    ? "border-r border-white/[0.08]"
                    : ""
                }`}
              >
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-0.5">
                  {stat.value}
                </p>
                <p className="text-[10px] tracking-[0.2em] uppercase font-mono text-white/30">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Floating particles / dots decoration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="hidden lg:block mt-14"
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  "bg-gradient-to-br from-blue-500 to-indigo-600",
                  "bg-gradient-to-br from-purple-500 to-pink-600",
                  "bg-gradient-to-br from-amber-500 to-orange-600",
                  "bg-gradient-to-br from-emerald-500 to-teal-600",
                ].map((gradient, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full ${gradient} border-2 border-[#030305] flex items-center justify-center text-[9px] font-bold text-white`}
                  >
                    {["D", "A", "S", "K"][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[11px] text-white/40">
                  Trusted by <span className="text-white/70 font-medium">7,000+</span> students nationwide
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══════════════ RIGHT HALF — Sign In ══════════════ */}
      <div className="relative lg:w-[45%] w-full flex items-center justify-center px-6 sm:px-10 lg:px-14 xl:px-20 py-14 lg:py-0">

        {/* Vertical separator */}
        <div className="hidden lg:block absolute left-0 top-[8%] bottom-[8%] w-px bg-gradient-to-b from-transparent via-white/[0.07] to-transparent" />

        {/* Subtle glow */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div
            className="absolute w-[450px] h-[450px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] opacity-10"
            style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative z-10 w-full max-w-[380px]"
        >
          {/* Logo for mobile (hidden on desktop since left side has it) */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <Image
              src="/images/codeneurax-logo.webp"
              alt="CodeNeuraX"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
              priority
            />
            <span className="text-xl font-black tracking-tight text-white">
              Code<span className="text-amber-400">NeuraX</span>
            </span>
          </div>

          {/* Sign-In Card — macOS Window Style */}
          <div className="rounded-2xl overflow-hidden shadow-[0_32px_80px_-12px_rgba(0,0,0,0.9)] border border-white/[0.08]">

            {/* ── macOS Title Bar ── */}
            <div className="bg-[#1a1a1f] px-5 py-3.5 flex items-center gap-2 border-b border-white/[0.06]">
              {/* Traffic light dots */}
              <div className="flex items-center gap-[7px]">
                <div className="w-[13px] h-[13px] rounded-full bg-[#ff5f57] shadow-[0_0_6px_rgba(255,95,87,0.4)]" />
                <div className="w-[13px] h-[13px] rounded-full bg-[#febc2e] shadow-[0_0_6px_rgba(254,188,46,0.4)]" />
                <div className="w-[13px] h-[13px] rounded-full bg-[#28c840] shadow-[0_0_6px_rgba(40,200,64,0.4)]" />
              </div>
              {/* Window title */}
              <div className="flex-1 text-center">
                <span className="text-[11px] font-mono text-white/25 tracking-wider">
                  
                </span>
              </div>
              {/* Spacer to balance dots */}
              <div className="w-[55px]" />
            </div>

            {/* ── Window Body ── */}
            <div className="bg-[#0f0f14]/95 backdrop-blur-2xl px-8 sm:px-10 py-10">

              {/* Logo + Heading */}
              <div className="text-center mb-9">
                <div className="hidden lg:flex w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] items-center justify-center shadow-2xl">
                  <Image
                    src="/images/codeneurax-logo.webp"
                    alt="CodeNeuraX"
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                    priority
                  />
                </div>

                <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                  Join Our Community
                </h2>
                <p className="text-[13px] text-white/35 leading-relaxed max-w-[280px] mx-auto">
                  Sign in with your Google account to access the CodeNeuraX ecosystem
                </p>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-start gap-2.5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/15 text-rose-300 text-xs leading-relaxed"
                >
                  <span className="shrink-0 mt-0.5">⚠️</span>
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="group w-full relative overflow-hidden bg-white hover:bg-gray-50 text-[#1a1a1a] font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-sm shadow-[0_8px_30px_-4px_rgba(255,255,255,0.1)] disabled:opacity-50 active:scale-[0.98] hover:shadow-[0_12px_40px_-4px_rgba(255,255,255,0.15)]"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      className="w-5 h-5 shrink-0"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.611 20.083H42V20H24v8h11.303C33.94 32.333 29.418 36 24 36 16.82 36 11 30.18 11 23S16.82 10 24 10c3.06 0 5.84 1.153 7.961 3.039l5.657-5.657C34.46 3.553 29.478 1.5 24 1.5 11.573 1.5 1.5 11.573 1.5 24S11.573 46.5 24 46.5 46.5 36.427 46.5 24c0-1.312-.135-2.593-.389-3.917z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.306 14.691l6.571 4.817C14.623 16.151 18.961 13 24 13c3.06 0 5.84 1.153 7.961 3.039l5.657-5.657C34.46 3.553 29.478 1.5 24 1.5 16.104 1.5 9.241 6.019 6.306 14.691z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24 46.5c5.356 0 10.248-1.985 13.986-5.262l-6.461-5.472C29.445 37.575 26.92 38.5 24 38.5c-5.392 0-9.9-3.626-11.557-8.533l-6.5 5.01C8.822 41.66 15.886 46.5 24 46.5z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.611 20.083H42V20H24v8h11.303c-1.363 4.333-5.392 8-11.303 8-5.392 0-9.9-3.626-11.557-8.533l-6.5 5.01C8.822 41.66 15.886 46 24 46c12.427 0 22.5-10.073 22.5-22.5 0-1.312-.135-2.593-.389-3.917z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                    <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="mt-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-white/[0.08]" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-white/20">or</span>
                <div className="flex-1 h-px bg-white/[0.08]" />
              </div>

              {/* Continue as Guest */}
              <button
                type="button"
                onClick={handleGuestMode}
                className="group w-full mt-4 relative overflow-hidden bg-white/[0.04] hover:bg-white/[0.08] text-white/70 hover:text-white font-medium py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-sm border border-white/[0.08] hover:border-white/[0.15] active:scale-[0.98]"
              >
                <UserX className="w-4.5 h-4.5 text-white/40 group-hover:text-white/60 transition-colors" />
                <span>Continue as Guest</span>
                <ArrowRight className="w-4 h-4 text-white/30 ml-auto group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              {/* Security badge */}
              <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-white/20">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/60" />
                <span>End-to-end encrypted</span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="mt-6 text-center">
            <p className="text-[11px] text-white/20 leading-relaxed">
              By signing in, you agree to our{" "}
              <a
                href="/terms"
                className="text-white/35 hover:text-white/60 underline underline-offset-2 decoration-white/10 hover:decoration-white/30 transition-colors"
              >
                Terms of Service
              </a>{" "}
              &amp;{" "}
              <a
                href="/privacy"
                className="text-white/35 hover:text-white/60 underline underline-offset-2 decoration-white/10 hover:decoration-white/30 transition-colors"
              >
                Privacy Policy
              </a>
            </p>
          </div>

          {/* Copyright */}
          <div className="mt-5 text-center text-[10px] font-mono text-white/15">
            &copy; {new Date().getFullYear()} CodeNeuraX &middot; All rights reserved
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#030305] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
