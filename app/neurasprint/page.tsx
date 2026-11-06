"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Clock,
  Trophy,
  Users,
  ArrowRight,
  CheckCircle2,
  Code2,
  Zap,
  Globe,
  ShieldCheck,
  Loader2,
  AlertCircle,
  ChevronDown,
  Award,
  Copy,
  Check,
  MessageCircle,
  Mail,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  Play,
  RotateCcw,
  Sliders,
  Compass,
  Flame,
  Radio,
  Lock,
} from "lucide-react"
import Header from "@/components/header"
import AuthModal from "@/components/auth-modal"
import Link from "next/link"
import Script from "next/script"
import NeuraSprintThemeSandbox, { THEME_CONFIGS } from "@/components/neurasprint-theme-sandbox"

// ─── Animation variants ─────────────────────────────────────────────────
const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

const stagger: any = {
  visible: { transition: { staggerChildren: 0.08 } },
}

// ─── Curated Technical Skills ───────────────────────────────────────────
const SKILL_OPTIONS = [
  "TypeScript",
  "JavaScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Tailwind CSS",
  "PostgreSQL",
  "MongoDB",
  "Supabase",
  "Express",
  "Docker",
  "GraphQL",
  "FastAPI",
  "Vue.js",
  "Angular",
  "Svelte",
  "Golang",
  "Django",
  "PHP / Laravel",
  "AWS",
  "Firebase",
  "AI / LLM APIs",
  "Git / GitHub",
]

const YEAR_OPTIONS = [
  "1st Year (Undergraduate)",
  "2nd Year (Undergraduate)",
  "3rd Year (Undergraduate)",
  "4th Year (Undergraduate)",
  "Postgraduate / Master's",
  "Recent Graduate",
  "Working Professional",
]

// ─── Embedded Hackathon Themes / Tracks ─────────────────────────────────
const HACKATHON_THEMES = THEME_CONFIGS

type Step = "form" | "payment" | "success"

// ─── Interactive Particle Canvas Component ──────────────────────────────
function InteractiveStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    // Generate particles
    const particleCount = Math.min(width > 768 ? 55 : 25, 60)
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      alpha: number
    }> = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.8 + 0.8,
        alpha: Math.random() * 0.5 + 0.2,
      })
    }

    let mouseX = -1000
    let mouseY = -1000

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }
    window.addEventListener("mousemove", handleMouseMove)

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw and connect particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha})`
        ctx.fill()

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(147, 51, 234, ${(1 - dist / 120) * 0.15})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }

        // Mouse interaction
        const mdx = p.x - mouseX
        const mdy = p.y - mouseY
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        if (mdist < 150) {
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(mouseX, mouseY)
          ctx.strokeStyle = `rgba(6, 182, 212, ${(1 - mdist / 150) * 0.25})`
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-60"
    />
  )
}

// ─── Dynamic Razorpay Script Loader ─────────────────────────────────────
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false)
    if ((window as any).Razorpay) return resolve(true)

    const existing = document.querySelector('script[src*="checkout.razorpay.com"]')
    if (existing) {
      existing.addEventListener("load", () => resolve(true))
      existing.addEventListener("error", () => resolve(false))
      setTimeout(() => {
        resolve(typeof (window as any).Razorpay !== "undefined")
      }, 500)
      return
    }

    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

// ─── Countdown Hook ─────────────────────────────────────────────────────
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }

    calculateTime()
    const interval = setInterval(calculateTime, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  return timeLeft
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════
export default function NeuraSprintPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<"login" | "signup">("login")
  const handleAuth = (type: "login" | "signup") => {
    setAuthType(type)
    setShowAuthModal(true)
  }

  // Active Embedded Theme state
  const [activeThemeId, setActiveThemeId] = useState<string>("ai-agents")
  const activeTheme = useMemo(
    () => HACKATHON_THEMES.find((t) => t.id === activeThemeId) || HACKATHON_THEMES[0],
    [activeThemeId]
  )

  // Registration Form State
  const [step, setStep] = useState<Step>("form")
  const [selectedTrack, setSelectedTrack] = useState<string>("ai-agents")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    year: "",
    branch: "",
    skills: [] as string[],
    githubUrl: "",
    linkedinUrl: "",
    priorHackathons: "",
  })
  const [registrationId, setRegistrationId] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const eventDate = new Date("2026-12-28T00:00:00+05:30")
  const countdown = useCountdown(eventDate)
  const registerRef = useRef<HTMLDivElement>(null)

  // Preload Razorpay on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!(window as any).Razorpay) {
        loadRazorpayScript()
      }
    }
  }, [])

  const updateForm = useCallback((field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }, [])

  const toggleSkill = useCallback((skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }))
  }, [])

  const scrollToRegister = () => {
    if (registerRef.current) {
      registerRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Set track from Theme Engine
  const applyThemeToTrack = (themeId: string) => {
    setSelectedTrack(themeId)
    scrollToRegister()
  }

  // ─── Submit Registration ───
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.fullName.trim()) {
      setError("Full name is required.")
      return
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError("Please provide a valid email address.")
      return
    }
    const cleanPhone = formData.phone.replace(/[\s\-\+]/g, "")
    if (!/^(\+91|91)?[6-9]\d{9}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit mobile number.")
      return
    }
    if (!formData.college.trim()) {
      setError("College / University name is required.")
      return
    }
    if (!formData.year) {
      setError("Please select your academic year.")
      return
    }
    if (!formData.branch.trim()) {
      setError("Branch or department is required.")
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch("/api/neurasprint/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          priorHackathons: formData.priorHackathons
            ? `[Track: ${selectedTrack}] ${formData.priorHackathons}`
            : `[Track: ${selectedTrack}]`,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.already_paid) {
          setRegistrationId(data.registration_id)
          setStep("success")
          return
        }
        throw new Error(data.error || "Registration request could not be processed.")
      }

      setRegistrationId(data.registration_id)
      initiatePayment(data.registration_id)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // ─── Initiate Razorpay Payment ───
  const initiatePayment = async (regId: string) => {
    setStep("payment")
    setError(null)

    try {
      const isLoaded = await loadRazorpayScript()
      if (!isLoaded || typeof (window as any).Razorpay === "undefined") {
        throw new Error(
          "Payment gateway script could not be loaded. If you are using an ad-blocker or Brave Shields, please whitelist this domain."
        )
      }

      const res = await fetch("/api/neurasprint/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: regId,
          email: formData.email,
          fullName: formData.fullName,
        }),
      })

      const orderData = await res.json()

      if (!res.ok) {
        throw new Error(orderData.error || "Failed to initialize payment gateway order.")
      }

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "CodeNeuraX",
        description: "NeuraSprint 2026 — Participant Registration Fee",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/neurasprint/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                registration_id: regId,
              }),
            })

            const verifyData = await verifyRes.json()

            if (verifyData.success) {
              setStep("success")
            } else {
              setError(
                verifyData.error ||
                  "Payment verification was unsuccessful. Please retain your payment receipt and contact codeneurax@gmail.com."
              )
              setStep("form")
            }
          } catch {
            setError(
              "Payment verification request timed out. If your account was debited, contact codeneurax@gmail.com."
            )
            setStep("form")
          }
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          registration_id: regId,
          event: "NeuraSprint 2026",
          track: selectedTrack,
        },
        theme: {
          color: "#7c3aed",
        },
        modal: {
          ondismiss: function () {
            setError("Payment session was cancelled. You may retry when ready.")
            setStep("form")
          },
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (err: any) {
      setError(err.message || "Failed to initiate payment. Please try again.")
      setStep("form")
    }
  }

  const copyRegistrationId = () => {
    navigator.clipboard.writeText(registrationId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-[#07070a] text-zinc-100 selection:bg-purple-500/20 selection:text-purple-200 relative overflow-x-hidden">
        {/* Interactive Particle Starfield Canvas */}
        <InteractiveStarfield />

        {/* Ambient Pulsing Glow Orbs */}
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none rounded-full blur-[140px] opacity-25"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }}
        />
        <div
          className="absolute top-[1200px] right-0 w-[500px] h-[500px] pointer-events-none rounded-full blur-[150px] opacity-15"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }}
        />

        <Header onAuth={handleAuth} />
        {showAuthModal && (
          <AuthModal type={authType} onClose={() => setShowAuthModal(false)} />
        )}

        {/* ═══════════════════════════════════════════════════════════════
            HERO SECTION — High-Tech, Dynamic, Commanding
           ═══════════════════════════════════════════════════════════════ */}
        <section className="relative pt-36 pb-20 sm:pt-44 sm:pb-28 border-b border-zinc-800/80 overflow-hidden z-10">
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Animated Live Status Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-purple-500/40 text-purple-300 text-xs font-mono mb-8 backdrop-blur-md shadow-lg shadow-purple-500/10"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>REGISTRATIONS LIVE // 24-HOUR ONLINE WEB CHALLENGE</span>
              </motion.div>

              {/* Title with Gradient Shimmer */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-white mb-6 leading-[1.05]"
              >
                NeuraSprint{" "}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  2026
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10 font-normal"
              >
                An intense 24-hour web engineering sprint. Solve real-world problem statements, build scalable
                architectures, and leverage cutting-edge AI coding agents.
              </motion.p>

              {/* Primary Actions */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center justify-center gap-4 mb-14"
              >
                <button
                  onClick={scrollToRegister}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-500 hover:to-violet-500 text-white text-sm font-semibold transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Register Participant — ₹99</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#theme-engine"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 text-sm font-medium transition-all backdrop-blur-md"
                >
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>Explore Embedded Tracks</span>
                </a>
              </motion.div>

              {/* High-Tech HUD Specs Grid with Glow Borders */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left"
              >
                {[
                  { label: "Challenge Format", val: "100% Online (Global)", icon: Globe, color: "text-cyan-400" },
                  { label: "Sprint Window", val: "Dec 28-29, 2026", icon: Calendar, color: "text-purple-400" },
                  { label: "Clock Duration", val: "24 Hours Continuous", icon: Clock, color: "text-emerald-400" },
                  { label: "Direct Cash Pool", val: "₹7,500+ INR", icon: Trophy, color: "text-amber-400" },
                ].map((spec, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/90 backdrop-blur-md hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <spec.icon className={`w-3.5 h-3.5 ${spec.color}`} />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                        {spec.label}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-zinc-100 font-mono">{spec.val}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            COUNTDOWN TICKER RADAR HUD
           ═══════════════════════════════════════════════════════════════ */}
        <section className="py-8 bg-zinc-950/80 border-b border-zinc-800/80 relative z-10 backdrop-blur-md">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="relative p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
                  <Radio className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    T-Minus Countdown
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono">
                    December 28, 2026 &bull; 12:00 AM IST
                  </div>
                </div>
              </div>

              {/* Digits with Digital Glow */}
              <div className="flex items-center gap-4 sm:gap-6 font-mono text-center">
                {[
                  { num: countdown.days, lbl: "Days" },
                  { num: countdown.hours, lbl: "Hours" },
                  { num: countdown.minutes, lbl: "Minutes" },
                  { num: countdown.seconds, lbl: "Seconds" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 sm:gap-6">
                    <div>
                      <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        {String(item.num).padStart(2, "0")}
                      </div>
                      <div className="text-[9px] uppercase tracking-widest text-zinc-500 mt-0.5">
                        {item.lbl}
                      </div>
                    </div>
                    {idx < 3 && <span className="text-zinc-600 text-lg font-light">:</span>}
                  </div>
                ))}
              </div>

              <div className="text-right hidden md:block">
                <span className="text-xs font-mono text-emerald-400 font-medium">
                  Enrollment Fee: ₹99
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            THE EMBEDDED THEME ENGINE — CRAZY FULLY ANIMATED TRACKS!
           ═══════════════════════════════════════════════════════════════ */}
        <NeuraSprintThemeSandbox
          activeThemeId={activeThemeId}
          onThemeChange={setActiveThemeId}
          onSelectTrack={applyThemeToTrack}
        />

        {/* ═══════════════════════════════════════════════════════════════
            OFFICIAL COMPETITION RULES & FAIR PLAY GUIDELINES
           ═══════════════════════════════════════════════════════════════ */}
        <section id="rules" className="py-20 sm:py-28 border-b border-zinc-800/80 bg-zinc-950/60 relative z-10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mb-12">
              <div className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-3 font-semibold flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Fair Play Protocol // Verification Standards</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                Official Sprint Guidelines
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                NeuraSprint 2026 evaluates genuine engineering capability, architecture design, and problem solving.
                All participants must adhere to the four competition standards below.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 max-w-5xl">
              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">01. Solo Engineering</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    NeuraSprint is strictly an individual sprint. Every participant must build and deploy their project independently to demonstrate personal technical capability.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">02. Modern AI Tools Permitted</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    Using AI copilots (Claude, ChatGPT, GitHub Copilot, Cursor, v0) and open-source packages is 100% authorized. Modern software engineering demands mastery of high-leverage tooling.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">03. Zero Pre-Building Guarantee</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    All repository commits and implementation must take place during the 24-hour sprint. Problem statements are revealed 12 hours prior. Pre-existing closed-source work is disqualified.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1">04. Public Verification</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                    Every final submission must include an accessible deployed URL (Vercel, Netlify, Cloudflare) and a public GitHub repository with a concise 2-minute video pitch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            PRIZES & RECOGNITION — SHARP PODIUM WITH HOLOGRAPHIC TIERS
           ═══════════════════════════════════════════════════════════════ */}
        <section id="prizes" className="py-20 sm:py-28 border-b border-zinc-800/80 relative z-10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mb-16">
              <div className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-3 font-semibold">
                Cash Settlements // Direct UPI
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
                ₹7,500 INR Prize Pool
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Direct monetary rewards for top ranked web engineers, verified and transferred immediately following
                the evaluation phase.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
              {/* 1st Place Champion */}
              <div className="p-8 rounded-2xl bg-gradient-to-b from-purple-950/30 to-zinc-900 border border-purple-500/50 relative shadow-2xl hover:border-purple-400 transition-all group">
                <div className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-purple-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                  First Place &bull; Champion
                </div>
                <div className="text-4xl font-extrabold font-mono text-white mb-2 pt-2">
                  ₹3,500 <span className="text-sm font-normal text-zinc-400">INR</span>
                </div>
                <p className="text-xs text-purple-300 font-mono mb-6">Direct Cash + Certificate of Excellence</p>

                <div className="space-y-2.5 text-xs text-zinc-300 border-t border-zinc-800/80 pt-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Direct UPI Cash Settlement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Verified Certificate of Excellence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Featured Engineer Profile on CodeNeuraX</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>1-on-1 Career & Architecture Mentorship</span>
                  </div>
                </div>
              </div>

              {/* 2nd Place Runner Up */}
              <div className="p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-cyan-500/40 transition-all">
                <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-2">
                  Second Place &bull; Runner Up
                </div>
                <div className="text-4xl font-extrabold font-mono text-white mb-2">
                  ₹2,500 <span className="text-sm font-normal text-zinc-400">INR</span>
                </div>
                <p className="text-xs text-zinc-400 font-mono mb-6">Direct Cash + Certificate of Merit</p>

                <div className="space-y-2.5 text-xs text-zinc-300 border-t border-zinc-800/80 pt-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Direct UPI Cash Settlement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Verified Certificate of Merit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>CodeNeuraX Community Spotlight</span>
                  </div>
                </div>
              </div>

              {/* 3rd Place 2nd Runner Up */}
              <div className="p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/40 transition-all">
                <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-semibold mb-2">
                  Third Place &bull; 2nd Runner Up
                </div>
                <div className="text-4xl font-extrabold font-mono text-white mb-2">
                  ₹1,500 <span className="text-sm font-normal text-zinc-400">INR</span>
                </div>
                <p className="text-xs text-zinc-400 font-mono mb-6">Direct Cash + Certificate of Merit</p>

                <div className="space-y-2.5 text-xs text-zinc-300 border-t border-zinc-800/80 pt-5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Direct UPI Cash Settlement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Verified Certificate of Merit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>CodeNeuraX Community Spotlight</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 max-w-5xl flex items-center justify-between gap-4 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-purple-400 shrink-0" />
                <span>All submitted projects that pass baseline compilation receive an official Certificate of Participation.</span>
              </div>
              <span className="text-zinc-500 uppercase tracking-wider hidden sm:inline">Verifiable ID</span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            REGISTRATION TERMINAL (WITH EMBEDDED TRACK PICKER)
           ═══════════════════════════════════════════════════════════════ */}
        <section ref={registerRef} id="register" className="py-20 sm:py-28 border-b border-zinc-800/80 relative z-10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mx-auto mb-10 text-center">
              <div className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-3 font-semibold">
                Direct Enrollment
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
                Participant Registration
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Confirm your participant pass below. The entry fee is ₹99 INR, handled securely via Razorpay.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <AnimatePresence mode="wait">
                {step === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="p-8 sm:p-10 rounded-2xl bg-zinc-900 border border-emerald-500/50 text-center shadow-2xl"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5">
                      <Check className="w-7 h-7 text-emerald-400" />
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                      Registration Confirmed
                    </h3>
                    <p className="text-zinc-400 text-sm mb-6 max-w-md mx-auto">
                      Your entry fee has been confirmed. You are officially enrolled for NeuraSprint 2026.
                    </p>

                    <div className="p-5 rounded-xl bg-zinc-950 border border-zinc-800 text-left mb-6">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                        Assigned Registration ID
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-wider">
                          {registrationId}
                        </span>
                        <button
                          onClick={copyRegistrationId}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy ID</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="text-xs font-mono text-zinc-400 text-left p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 mb-6 space-y-2">
                      <div>&bull; Keep your registration ID safe — you will need it on submission day.</div>
                      <div>&bull; Selected Track: <strong className="text-purple-300 uppercase">{selectedTrack}</strong></div>
                      <div>&bull; Official Problem Statement unlocks on Dec 27, 2026 at 12:00 PM IST (T-12h).</div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <a
                        href="https://whatsapp.com/channel/0029VbC93H2HVvTiyyFL9C0Y"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold font-mono transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Join WhatsApp Announcement Group
                      </a>
                      <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors"
                      >
                        Return to Homepage
                      </Link>
                    </div>
                  </motion.div>
                ) : step === "payment" ? (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-center"
                  >
                    <Loader2 className="w-9 h-9 text-purple-400 animate-spin mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">
                      Opening Razorpay Gateway...
                    </h3>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                      Please finalize your payment in the checkout window. Do not close or refresh this page.
                    </p>
                  </motion.div>
                ) : (
                  <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                    <form onSubmit={handleRegister} className="space-y-6">
                      {/* Top Alert */}
                      {error && (
                        <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 flex items-start gap-3">
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <div className="text-xs text-red-300 leading-relaxed font-sans">{error}</div>
                        </div>
                      )}

                      {/* Track Selector embedded inside form */}
                      <div>
                        <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">
                          Selected Challenge Track
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {HACKATHON_THEMES.map((theme) => (
                            <button
                              key={theme.id}
                              type="button"
                              onClick={() => setSelectedTrack(theme.id)}
                              className={`p-2.5 rounded-xl border text-xs font-mono text-left transition-all flex items-center gap-2 cursor-pointer ${
                                selectedTrack === theme.id
                                  ? "bg-purple-600/20 border-purple-500 text-purple-200"
                                  : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                              }`}
                            >
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: theme.color }}
                              />
                              <span className="truncate">{theme.name.split(" ")[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Participant Identification */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                            Full Legal Name <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => updateForm("fullName", e.target.value)}
                            placeholder="e.g. Alex Sharma"
                            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                              Email Address <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => updateForm("email", e.target.value)}
                              placeholder="alex@example.com"
                              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                              Phone / WhatsApp <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => updateForm("phone", e.target.value)}
                              placeholder="10-digit mobile number"
                              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Academic & Profiles */}
                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                            College / University / Organization <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.college}
                            onChange={(e) => updateForm("college", e.target.value)}
                            placeholder="e.g. Marwadi University, Rajkot"
                            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                          />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                              Academic Year <span className="text-red-400">*</span>
                            </label>
                            <select
                              required
                              value={formData.year}
                              onChange={(e) => updateForm("year", e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                            >
                              <option value="">Select year</option>
                              {YEAR_OPTIONS.map((y) => (
                                <option key={y} value={y} className="bg-zinc-900 text-zinc-100">
                                  {y}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                              Branch / Major <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.branch}
                              onChange={(e) => updateForm("branch", e.target.value)}
                              placeholder="e.g. Computer Science"
                              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>

                        {/* Technology chips */}
                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">
                            Select Your Technologies
                          </label>
                          <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-zinc-950 border border-zinc-800 max-h-36 overflow-y-auto">
                            {SKILL_OPTIONS.map((skill) => {
                              const selected = formData.skills.includes(skill)
                              return (
                                <button
                                  key={skill}
                                  type="button"
                                  onClick={() => toggleSkill(skill)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                                    selected
                                      ? "bg-purple-600 text-white font-medium shadow-sm"
                                      : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                                  }`}
                                >
                                  {skill}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                              GitHub Profile URL
                            </label>
                            <input
                              type="url"
                              value={formData.githubUrl}
                              onChange={(e) => updateForm("githubUrl", e.target.value)}
                              placeholder="https://github.com/username"
                              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                              LinkedIn Profile URL
                            </label>
                            <input
                              type="url"
                              value={formData.linkedinUrl}
                              onChange={(e) => updateForm("linkedinUrl", e.target.value)}
                              placeholder="https://linkedin.com/in/username"
                              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                            Prior Hackathon Experience (Optional)
                          </label>
                          <textarea
                            rows={2}
                            value={formData.priorHackathons}
                            onChange={(e) => updateForm("priorHackathons", e.target.value)}
                            placeholder="Brief summary of projects or past competitions"
                            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none"
                          />
                        </div>
                      </div>

                      {/* Checkout Action Card */}
                      <div className="pt-4 border-t border-zinc-800">
                        <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-4 mb-4">
                          <div>
                            <div className="text-sm font-semibold text-white">
                              Standard Participant Entry
                            </div>
                            <div className="text-xs font-mono text-zinc-500">
                              24h Challenge Pass &bull; Verifiable Certificate
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-mono font-bold text-white">
                              ₹99.00 <span className="text-xs font-normal text-zinc-500">INR</span>
                            </div>
                            <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 justify-end">
                              <Lock className="w-3 h-3" />
                              <span>256-bit Encrypted</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={submitting}
                          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-purple-700 hover:from-purple-500 hover:to-violet-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-purple-500/20"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              <span>Initiating Gateway...</span>
                            </>
                          ) : (
                            <>
                              <span>Complete Registration &bull; Pay ₹99 INR</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            FOOTER / INQUIRIES
           ═══════════════════════════════════════════════════════════════ */}
        <footer className="py-16 bg-[#07070a] border-t border-zinc-800/80 relative z-10">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pb-10 border-b border-zinc-800/80">
              <div>
                <div className="text-lg font-bold text-white tracking-tight mb-1">
                  CodeNeuraX
                </div>
                <div className="text-xs text-zinc-500 font-mono">
                  Autonomous Web Engineering Platform &bull; NeuraSprint 2026
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs font-mono text-zinc-400">
                <a
                  href="mailto:codeneurax@gmail.com"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>codeneurax@gmail.com</span>
                </a>
                <a
                  href="https://whatsapp.com/channel/0029VbC93H2HVvTiyyFL9C0Y"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Community</span>
                </a>
              </div>
            </div>

            <div className="max-w-5xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
              <div>&copy; 2026 CodeNeuraX. All rights reserved.</div>
              <div className="flex items-center gap-4">
                <Link href="/terms" className="hover:text-zinc-300 transition-colors">
                  Terms
                </Link>
                <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
                  Privacy
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
