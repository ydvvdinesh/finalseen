
"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Code,
  Users,
  Zap,
  BookOpen,
  MessageCircle,
  Trophy,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  Youtube,
  X,
} from "lucide-react"
import Header from "@/components/header"
import CommunityFeed from "@/components/community-feed"
import Image from "next/image"
import Link from "next/link"
import { getAssetUrl } from "@/lib/storage"
import dynamic from "next/dynamic"

const AuthModal = dynamic(() => import("@/components/auth-modal"), { ssr: false })
import Autoplay from "embla-carousel-autoplay"
import { UPCOMING_EVENTS, UPCOMING_EVENTS_VERSION } from "@/data/upcoming-events" // v9 updated

// Dynamic imports for better performance
const Carousel = dynamic(() => import("@/components/ui/carousel").then(mod => mod.Carousel), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-white/[0.02] rounded-2xl animate-pulse" />
})

const CarouselContent = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselContent), {
  ssr: false
})

const CarouselItem = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselItem), {
  ssr: false
})

const CarouselPrevious = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselPrevious), {
  ssr: false
})

const CarouselNext = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselNext), {
  ssr: false
})

// ─── Count-up hook ──────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const start = performance.now()
          const step = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - (1 - progress) * (1 - progress)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

// ─── Fade-in animation variants ─────────────────────────────────────────────
const fadeUp: any = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] as const }
  })
}

const stagger: any = {
  visible: { transition: { staggerChildren: 0.08 } }
}

// ─── LinkedIn icon SVG ──────────────────────────────────────────────────────
function LinkedInIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}


export default function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<"login" | "signup">("login")

  // Animated counters
  const heroMembers = useCountUp(7000, 2000)
  const aboutMembers = useCountUp(7000, 2000)

  const handleAuth = (type: "login" | "signup") => {
    setAuthType(type)
    setShowAuthModal(true)
  }

  // Contact form state
  const [cfName, setCfName] = useState("")
  const [cfEmail, setCfEmail] = useState("")
  const [cfMobile, setCfMobile] = useState("")
  const [cfTopic, setCfTopic] = useState("career_guidance")
  const [cfMessage, setCfMessage] = useState("")
  const [cfSending, setCfSending] = useState(false)
  const [cfSuccess, setCfSuccess] = useState<string | null>(null)
  const [cfError, setCfError] = useState<string | null>(null)

  // Upcoming Event popup state (appears on open / refresh)
  const [showEventPopup, setShowEventPopup] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEventPopup(true)
    }, 700)
    return () => clearTimeout(timer)
  }, [])

  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setCfError(null)
    setCfSuccess(null)
    setCfSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cfName, email: cfEmail, mobile: cfMobile,
          topic: cfTopic, message: cfMessage,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to send message')
      setCfSuccess('Thanks! Your request has been sent.')
      setCfName(''); setCfEmail(''); setCfMobile(''); setCfTopic('career_guidance'); setCfMessage('')
    } catch (err: any) {
      setCfError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setCfSending(false)
    }
  }

  const features = [
    { icon: <Users className="w-6 h-6" />, title: "Community Driven", description: "Connect with like-minded students and professionals in an inclusive environment" },
    { icon: <Code className="w-6 h-6" />, title: "Coding Challenges", description: "Weekly coding challenges to sharpen your skills and prepare for interviews" },
    { icon: <MessageCircle className="w-6 h-6" />, title: "Discussions", description: "Regular Ask Me Anything sessions with experienced industry professionals" },
    { icon: <Trophy className="w-6 h-6" />, title: "Hackathons & Events", description: "Stay updated with the latest hackathons and tech events worldwide" },
    { icon: <BookOpen className="w-6 h-6" />, title: "Learning Resources", description: "Curated tech news, insights, and learning materials for continuous growth" },
    { icon: <Zap className="w-6 h-6" />, title: "Career Opportunities", description: "Access to internships and career guidance" },
  ]

  const events = UPCOMING_EVENTS

  const sponsorImages = [
    "/images/paranox2.png",
    "/images/intellify.png",
    "/images/techxninja.jpg",
    "/images/pec.png",
    "/images/Marwadi university.png",
    "/images/1.png"
  ]

  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }))

  // Team data
  const team = [
    { initials: "DY", name: "Dinesh Yadav", role: "Founder", desc: "Passionate about empowering the next generation of developers through community-driven learning and innovation.", linkedin: "https://www.linkedin.com/in/dinesh-yadav-1b462831a/", gradient: "from-cyan-400 to-blue-500" },
    { initials: "MD", name: "Mitali Desai", role: "Convener", desc: "Ensuring smooth operations, and creating a welcoming environment for all members.", linkedin: "https://in.linkedin.com/in/mitali-desai-425884319", gradient: "from-purple-400 to-pink-500" },
    { initials: "IT", name: "Isha Thaker", role: "Content Head", desc: "Creative content strategist focused on delivering engaging educational materials and community-driven content.", linkedin: "https://www.linkedin.com/in/isha-thaker/", gradient: "from-blue-400 to-cyan-500" },
    { initials: "PD", name: "Prachi Doshi", role: "Host & Content Creator", desc: "Manages our stage with a vision.", linkedin: "https://www.linkedin.com/in/prachi-doshi-679119303/", gradient: "from-pink-400 to-purple-500" },
    { initials: "DT", name: "Divya Thakur", role: "Video Editor", desc: "Edits event recordings, creates highlight reels and tutorial videos to power our YouTube and social channels.", linkedin: "https://www.linkedin.com/in/divya-thakur-6b02a6300/", gradient: "from-amber-400 to-orange-500" },
  ]

  const contacts = [
    { icon: <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>, title: "Email", desc: "Drop us a line for partnerships and inquiries.", link: "mailto:team@codeneurax.in", linkText: "Contact Us", color: "red" },
    { icon: <MessageCircle className="w-7 h-7" />, title: "WhatsApp", desc: "Join our main community group instantly.", link: "https://whatsapp.com/channel/0029VbC93H2HVvTiyyFL9C0Y", linkText: "Join Community", color: "green" },
    { icon: <LinkedInIcon className="w-7 h-7" />, title: "LinkedIn", desc: "Connect with us professionally.", link: "https://www.linkedin.com/company/codeneurax/", linkText: "Follow Us", color: "blue" },
    { icon: <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.663.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.358-2.618-6.78-6.98-6.98C15.668.014 15.259 0 12 0zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>, title: "Instagram", desc: "Follow us for updates and behind-the-scenes content.", link: "https://www.instagram.com/codeneurax/", linkText: "Follow Us", color: "pink" },
    { icon: <Youtube className="w-7 h-7" />, title: "YouTube", desc: "Watch our tutorials and event recordings.", link: "https://www.youtube.com/@CodeNeuraX", linkText: "Subscribe", color: "red" },
  ]

  const colorMap: Record<string, string> = {
    red: "text-red-400 hover:border-red-500/20",
    green: "text-green-400 hover:border-green-500/20",
    blue: "text-blue-400 hover:border-blue-500/20",
    pink: "text-pink-400 hover:border-pink-500/20",
  }

  return (
    <>
      <main className="min-h-screen bg-[#050505] relative overflow-hidden" id="home" key="main-content">

        <Header onAuth={handleAuth} />
        {showAuthModal && (
          <AuthModal type={authType} onClose={() => setShowAuthModal(false)} />
        )}

        {/* ═══════════════════════════════════════════════════════════════
            UPCOMING EVENT POPUP (ON OPEN / REFRESH)
           ═══════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {showEventPopup && events && events.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            >
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/80 backdrop-blur-md"
                onClick={() => setShowEventPopup(false)}
              />

              {/* Event Modal Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ type: "spring", damping: 26, stiffness: 320 }}
                className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-gradient-to-b from-[#1b0a36] via-[#100524] to-[#070114] border border-purple-500/40 shadow-[0_0_90px_-15px_rgba(168,85,247,0.5)] p-5 sm:p-7 my-auto z-10"
              >
                {/* Ambient Radial Glows */}
                <div
                  className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(168,85,247,0.4), transparent 70%)" }}
                />
                <div
                  className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(34,211,238,0.25), transparent 70%)" }}
                />

                {/* Close Button */}
                <button
                  onClick={() => setShowEventPopup(false)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/50 hover:bg-white/10 text-white/70 hover:text-white transition-colors border border-white/15 backdrop-blur-md"
                  aria-label="Close popup"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Poster Image */}
                <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-5 border border-purple-500/25 group">
                  <Image
                    src={`${events[0].image || "/images/neuraknockout-2026.jpg"}?v=${UPCOMING_EVENTS_VERSION}`}
                    alt={events[0].title}
                    fill
                    sizes="(max-width: 640px) 100vw, 550px"
                    priority
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#100524] via-black/20 to-transparent" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-mono font-semibold backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {events[0].status === "registration-open" ? "REGISTRATION OPEN" : "UPCOMING"}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-purple-500/30 border border-purple-400/35 text-purple-200 text-[11px] font-mono backdrop-blur-md">
                      {events[0].type}
                    </span>
                    {events[0].entryFee && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/25 border border-amber-400/35 text-amber-200 text-[11px] font-mono font-semibold backdrop-blur-md">
                        {events[0].entryFee}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Category & Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] font-mono font-semibold uppercase tracking-wider mb-2.5">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    Featured Upcoming Event
                  </div>

                  {/* Title */}
                  <h3
                    className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {events[0].title}
                  </h3>

                  {/* Speaker or Organizer */}
                  {events[0].speaker && (
                    <div className="mb-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs sm:text-sm text-purple-200">
                      <Users className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="line-clamp-1">
                        <strong className="text-white/90 font-medium">Speaker:</strong> {events[0].speaker}
                      </span>
                    </div>
                  )}

                  {events[0].organizer && (
                    <div className="mb-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs sm:text-sm text-purple-200">
                      <Users className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="line-clamp-1">
                        <strong className="text-white/90 font-medium">Presented by:</strong> {events[0].organizer}
                      </span>
                    </div>
                  )}

                  {/* Quick Meta Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4 p-3 rounded-xl bg-white/[0.03] border border-purple-500/15 text-xs text-purple-200/80">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="font-mono truncate">{events[0].date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="font-mono truncate">{events[0].time}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="font-mono truncate">{events[0].location}</span>
                    </div>
                  </div>

                  {/* Highlights / Pills */}
                  {events[0].highlights && events[0].highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5 text-[11px] font-mono">
                      {events[0].highlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <a
                      href={events[0].registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShowEventPopup(false)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10 transition-all group"
                    >
                      <span>
                        {events[0].registrationPlatform
                          ? `Register on ${events[0].registrationPlatform}`
                          : "Register Now"}
                      </span>
                      <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-0.5 transition-transform" />
                    </a>
                    <a
                      href="#upcoming-events"
                      onClick={() => setShowEventPopup(false)}
                      className="px-4 py-3 rounded-xl text-sm font-medium text-purple-200/80 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 transition-all text-center"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════════════
            HERO SECTION
           ═══════════════════════════════════════════════════════════════ */}
        <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-32 min-h-[90vh] flex items-center overflow-hidden" aria-label="Hero section">
          {/* Background Video Layer: Logo Animation (Desktop Only for extreme mobile speed) */}
          <div className="hidden md:block absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[#050505]/65 z-10" />
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen scale-105"
            >
              <source src={getAssetUrl("/images/gemini_generated_video_f7698634.mp4")} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-[#050505] z-10" />
          </div>

          {/* Ambient background glows */}
          <div className="ambient-glow w-[600px] h-[600px] -top-40 -left-40" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)' }} />
          <div className="ambient-glow w-[500px] h-[500px] top-20 -right-20" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.08), transparent 70%)' }} />
          <div className="ambient-glow w-[400px] h-[400px] bottom-0 left-1/3" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.06), transparent 70%)' }} />

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center max-w-5xl mx-auto">

              {/* Mono badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-10"
              >
                <div className="mono-badge mx-auto">
                  <span className="dot" />
                  Student-Led Tech Community
                </div>
              </motion.div>

              {/* Hero heading — Instrument Serif */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl mb-8 leading-[0.95] tracking-tight"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                <span className="text-white/90">Code</span>
                <span className="gradient-text-amber">NeuraX</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-base sm:text-lg md:text-xl text-white/40 mb-12 leading-relaxed max-w-3xl mx-auto"
              >
                Connect, inspire, and empower the next generation of{" "}
                <span className="text-white/70">coders</span>,{" "}
                <span className="text-white/70">developers</span>, and{" "}
                <span className="text-white/70">innovators</span>
              </motion.p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="mb-16"
              >
                <a
                  href="https://whatsapp.com/channel/0029VbC93H2HVvTiyyFL9C0Y"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium btn-green text-base"
                >
                  <MessageCircle className="w-5 h-5" />
                  Join Our Community
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
              >
                <div className="glass-card p-8 sm:p-10 max-w-3xl mx-auto">
                  <div className="grid grid-cols-3 gap-8 text-center">
                    <div ref={heroMembers.ref}>
                      <div className="stat-value text-3xl sm:text-4xl mb-2">
                        {heroMembers.count.toLocaleString()}+
                      </div>
                      <div className="stat-label">Active Members</div>
                    </div>
                    <div className="border-x border-white/[0.06]">
                      <div className="stat-value text-3xl sm:text-4xl mb-2">2+</div>
                      <div className="stat-label">Monthly Events</div>
                    </div>
                    <div>
                      <div className="stat-value text-3xl sm:text-4xl mb-2">Ongoing</div>
                      <div className="stat-label">Success Stories</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            DAILY OPPORTUNITY FEED (24h EPHEMERAL)
           ═══════════════════════════════════════════════════════════════ */}
        <CommunityFeed />

        {/* ═══════════════════════════════════════════════════════════════
            ABOUT SECTION
           ═══════════════════════════════════════════════════════════════ */}
        <section id="about" className="section-padding relative">
          <div className="container mx-auto px-4">
            {/* Section header */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
              className="text-center mb-16"
            >
              <div className="mono-badge mx-auto mb-8">
                <span className="dot" />
                About Us
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-serif)" }}>
                Who <span className="gradient-text-purple">We Are</span>
              </h2>
              <p className="text-lg text-white/40 max-w-3xl mx-auto leading-relaxed">
                CodeNeuraX is a platform that provides all the essential resources for computer science student needs to grow and succeed.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
              {/* Left — Mac terminal window */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={0.1}
              >
                <div className="mac-window">
                  <div className="p-6 sm:p-8 space-y-5">
                    <p className="text-white/60 leading-relaxed text-sm sm:text-base">
                      Founded in 2025 by Dinesh Yadav, CodeNeuraX Community is a welcoming tech community designed specifically for computer science students and recent graduates. The community is organized into four WhatsApp groups to serve different needs.
                    </p>
                    <p className="text-white/60 leading-relaxed text-sm sm:text-base">
                      Through workshops, hackathons, research projects, and industry partnerships, we provide our members with the resources and opportunities they need to excel in the fields of Computer Science.
                    </p>

                    {/* Stats inside terminal */}
                    <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/[0.06]">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-4 h-4 text-purple-400" />
                          <span ref={aboutMembers.ref} className="stat-value text-xl">{aboutMembers.count.toLocaleString()}+</span>
                        </div>
                        <div className="stat-label">Members</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Code className="w-4 h-4 text-cyan-400" />
                          <span className="stat-value text-xl">50+</span>
                        </div>
                        <div className="stat-label">Internship Support</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Trophy className="w-4 h-4 text-amber-400" />
                          <span className="stat-value text-xl">20+</span>
                        </div>
                        <div className="stat-label">Events/Year</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right — Photo Carousel */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={0.2}
              >
                <div className="relative h-96 sm:h-[26rem] rounded-2xl overflow-hidden glass-card p-1">
                  <Carousel opts={{ loop: true }} plugins={[autoplay.current as any]} className="w-full h-full">
                    <CarouselContent className="h-96 sm:h-[26rem]">
                      {[
                        "/images/slideshow/auditorium-stage.png",
                        "/images/slideshow/slide-1.jpg",
                        "/images/slideshow/slide-2.jpg",
                        "/images/slideshow/slide-3.jpg",
                        "/images/slideshow/slide-4.jpg",
                        "/images/slideshow/slide-5.jpg",
                        "/images/CodeNeuraX.webp",
                        "/images/Founder - CNX -1.webp",
                        "/images/From the backstage.webp",
                        "/images/Founder - CNX -2.webp",
                        "/images/Career Guidance by sonu yadav.webp",
                        "/images/mam with cnxx.webp",
                        "/images/conxx-team.webp",
                        "/images/Thanking Founder.webp",
                      ].map((image, index) => (
                        <CarouselItem key={index} className="relative h-96 sm:h-[26rem]">
                          <Image
                            src={image}
                            alt={`CodeNeuraX Community photo ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover rounded-xl"
                            priority={index === 0}
                            loading={index === 0 ? "eager" : "lazy"}
                            quality={85}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-xl" />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-3 bg-black/50 border-white/10 hover:bg-black/80 text-white" />
                    <CarouselNext className="right-3 bg-black/50 border-white/10 hover:bg-black/80 text-white" />
                  </Carousel>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            FEATURES SECTION
           ═══════════════════════════════════════════════════════════════ */}
        <section id="community" className="section-padding relative" aria-label="Features">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-serif)" }}>
                Why Choose <span className="gradient-text-cyan">CodeNeuraX</span>?
              </h2>
              <p className="text-lg text-white/40 max-w-3xl mx-auto leading-relaxed">
                We provide an inclusive platform for students and early-career professionals to explore technology,
                sharpen their skills, and unlock real-world opportunities.
              </p>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={stagger}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={fadeUp} custom={index * 0.05} className="group">
                  <div className="glass-card p-7 h-full">
                    <div className="text-white/30 mb-5 group-hover:text-white/60 transition-colors duration-400">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-white transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-white/35 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    {feature.title === "Hackathons & Events" && (
                      <div className="mt-4 pt-3 border-t border-white/[0.06]">
                        <Link
                          href="/buddykid"
                          className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:text-cyan-200 transition font-mono"
                        >
                          <span>Looking for teammates? <strong>Try BuddyKid &rarr;</strong></span>
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            EVENTS SECTION
           ═══════════════════════════════════════════════════════════════ */}
        <section id="events" className="section-padding relative" aria-label="Events and knowledge">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: "var(--font-serif)" }}>
                <span className="text-white">Events</span>{" "}
                <span className="gradient-text-purple">& Knowledge</span>
              </h2>
              <p className="text-lg text-white/40 max-w-3xl mx-auto leading-relaxed">
                Stay updated with our latest events, workshops, and curated knowledge resources to accelerate your tech journey.
              </p>
            </motion.div>

            {/* Upcoming Events */}
            <div className="mb-16">
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={0}
                className="flex items-center gap-3 mb-10"
              >
                <Calendar className="w-6 h-6 text-purple-400/60" />
                <h3 id="upcoming-events" className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
                  Upcoming Events
                </h3>
              </motion.div>

              {events.length === 1 ? (
                // Full-width featured card layout when there is a single event
                <motion.div
                  initial="hidden" whileInView="visible" viewport={{ once: true }}
                  variants={fadeUp} custom={0.1}
                  className="group"
                >
                  <div className="glass-card overflow-hidden flex flex-col lg:flex-row border border-white/[0.08] hover:border-purple-500/30 transition-all duration-500">
                    {/* Event Image */}
                    <div className="relative w-full lg:w-1/2 min-h-[280px] sm:min-h-[340px] lg:min-h-[400px] overflow-hidden">
                      <Image
                        src={`${events[0].image || "/placeholder.svg"}?v=${UPCOMING_EVENTS_VERSION}`}
                        alt={events[0].title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/85 via-black/30 to-transparent" />

                      <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border"
                          style={{
                            fontFamily: "var(--font-mono)",
                            ...(events[0].status === "upcoming"
                              ? { background: "rgba(34,197,94,0.15)", color: "#4ade80", borderColor: "rgba(34,197,94,0.2)" }
                              : events[0].status === "registration-open"
                                ? { background: "rgba(59,130,246,0.15)", color: "#60a5fa", borderColor: "rgba(59,130,246,0.2)" }
                                : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.1)" }
                            )
                          }}
                        >
                          {events[0].status === "upcoming" ? "To Be Announced" : events[0].status === "registration-open" ? "Registration Open" : "Upcoming"}
                        </span>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border"
                          style={{
                            fontFamily: "var(--font-mono)",
                            background: "rgba(168,85,247,0.15)", color: "#c084fc", borderColor: "rgba(168,85,247,0.2)"
                          }}
                        >
                          {events[0].type}
                        </span>
                        {events[0].entryFee && (
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border"
                            style={{
                              fontFamily: "var(--font-mono)",
                              background: "rgba(245,158,11,0.15)", color: "#fbbf24", borderColor: "rgba(245,158,11,0.25)"
                            }}
                          >
                            {events[0].entryFee}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Event Content */}
                    <div className="p-6 sm:p-8 lg:p-10 w-full lg:w-1/2 flex flex-col justify-between">
                      <div>
                        <h4 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                          {events[0].title}
                        </h4>

                        {events[0].speaker && (
                          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs sm:text-sm text-purple-300">
                            <Users className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span><strong className="text-white/80 font-medium">Speaker:</strong> {events[0].speaker}</span>
                          </div>
                        )}

                        {events[0].organizer && (
                          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs sm:text-sm text-purple-300">
                            <Users className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span><strong className="text-white/80 font-medium">Organizer:</strong> {events[0].organizer}</span>
                          </div>
                        )}

                        <div className="grid sm:grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-white/50">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
                            <span className="font-mono text-xs sm:text-sm">{events[0].date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                            <span className="font-mono text-xs sm:text-sm">{events[0].time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                            <span className="text-xs sm:text-sm">{events[0].location}</span>
                          </div>
                        </div>

                        {events[0].highlights && events[0].highlights.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-6 text-[11px] font-mono">
                            {events[0].highlights.map((h, i) => (
                              <span key={i} className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300">
                                {h}
                              </span>
                            ))}
                          </div>
                        )}

                        <p className="text-white/45 text-sm sm:text-base leading-relaxed mb-6">
                          {events[0].description}
                        </p>
                      </div>

                      {events[0].status !== "Ongoing" && (
                        <div className="flex flex-wrap items-center gap-3">
                          <a
                            href={events[0].registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-premium text-sm py-3 px-6 inline-flex items-center gap-2"
                          >
                            <span>
                              {events[0].registrationPlatform
                                ? `Register on ${events[0].registrationPlatform}`
                                : (events[0].status === "registration-open" ? "Register Now" : "Stay Tuned (TBA)")}
                            </span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <Link
                            href="/events"
                            className="px-5 py-3 rounded-xl text-sm font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/25 hover:bg-purple-500/20 hover:border-purple-500/40 transition-all inline-flex items-center gap-2 font-mono"
                          >
                            <span>Explore All Events</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                  {events.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial="hidden" whileInView="visible" viewport={{ once: true }}
                      variants={fadeUp} custom={index * 0.1}
                      className="group"
                    >
                      <div className="glass-card overflow-hidden h-full flex flex-col justify-between border border-white/[0.08] hover:border-purple-500/30 transition-all duration-500">
                        <div>
                          {/* Event Image */}
                          <div className="relative h-56 sm:h-64 overflow-hidden">
                            <Image
                              src={`${event.image || "/placeholder.svg"}?v=${UPCOMING_EVENTS_VERSION}`}
                              alt={event.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              loading="lazy"
                              className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                              <span
                                className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border"
                                style={{
                                  fontFamily: "var(--font-mono)",
                                  ...(event.status === "upcoming"
                                    ? { background: "rgba(34,197,94,0.15)", color: "#4ade80", borderColor: "rgba(34,197,94,0.2)" }
                                    : event.status === "registration-open"
                                      ? { background: "rgba(59,130,246,0.15)", color: "#60a5fa", borderColor: "rgba(59,130,246,0.2)" }
                                      : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", borderColor: "rgba(255,255,255,0.1)" }
                                  )
                                }}
                              >
                                {event.status === "upcoming" ? "To Be Announced" : event.status === "registration-open" ? "Registration Open" : "Upcoming"}
                              </span>
                              <span
                                className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border"
                                style={{
                                  fontFamily: "var(--font-mono)",
                                  background: "rgba(168,85,247,0.15)", color: "#c084fc", borderColor: "rgba(168,85,247,0.2)"
                                }}
                              >
                                {event.type}
                              </span>
                              {event.entryFee && (
                                <span
                                  className="px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md border"
                                  style={{
                                    fontFamily: "var(--font-mono)",
                                    background: "rgba(245,158,11,0.15)", color: "#fbbf24", borderColor: "rgba(245,158,11,0.25)"
                                  }}
                                >
                                  {event.entryFee}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="p-6 sm:p-8">
                            <h4 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors leading-snug">
                              {event.title}
                            </h4>

                            {event.speaker && (
                              <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs sm:text-sm text-purple-300">
                                <Users className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                <span><strong className="text-white/80 font-medium">Speaker:</strong> {event.speaker}</span>
                              </div>
                            )}

                            {event.organizer && (
                              <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs sm:text-sm text-purple-300">
                                <Users className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                <span><strong className="text-white/80 font-medium">Organizer:</strong> {event.organizer}</span>
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-white/60">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                <span className="font-mono truncate">{event.date}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                <span className="font-mono truncate">{event.time}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            </div>

                            {event.highlights && event.highlights.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-4 text-[11px] font-mono">
                                {event.highlights.map((h, i) => (
                                  <span
                                    key={i}
                                    className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300"
                                  >
                                    {h}
                                  </span>
                                ))}
                              </div>
                            )}

                            <p className="text-white/45 text-sm sm:text-base leading-relaxed mb-6">
                              {event.description}
                            </p>
                          </div>
                        </div>

                        <div className="p-6 sm:p-8 pt-0 flex flex-wrap items-center justify-between gap-3">
                          {event.status !== "Ongoing" && (
                            <a
                              href={event.registrationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-premium text-sm py-2.5 px-5 inline-flex items-center gap-2"
                            >
                              <span>
                                {event.registrationPlatform
                                  ? `Register on ${event.registrationPlatform}`
                                  : (event.status === "registration-open" ? "Register Now" : "Stay Tuned (TBA)")}
                              </span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {event.prizes && (
                            <span className="text-[11px] font-mono text-amber-300/90 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                              🏆 Prizes Pool: ₹4,700+
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SPEAKERS FOR AI SPARK
           ═══════════════════════════════════════════════════════════════ */}
        <section id="ai-spark-speakers" className="section-padding relative overflow-hidden border-y border-white/[0.04]">
          <div className="container mx-auto px-4 sm:px-6 mb-10 md:mb-14">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
              className="text-center"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5" style={{ fontFamily: "var(--font-serif)" }}>
                <span className="text-white">Speakers for </span>
                <span className="gradient-text-amber">AI Spark</span>
              </h2>
              <p className="text-lg text-white/40 max-w-3xl mx-auto leading-relaxed">
                Learn from industry experts, researchers, and AI evangelists shaping the future of technology.
              </p>
            </motion.div>
          </div>

          <div className="relative w-full max-w-[100vw] overflow-hidden py-4">
            <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

            <motion.div
              className="flex w-max"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            >
              {[
                "/images/speakers/carousel-1.jpg",
                "/images/speakers/carousel-2.jpg",
                "/images/speakers/carousel-3.jpg",
                "/images/speakers/carousel-4.jpg",
                "/images/speakers/carousel-1.jpg",
                "/images/speakers/carousel-2.jpg",
                "/images/speakers/carousel-3.jpg",
                "/images/speakers/carousel-4.jpg",
              ].map((src, idx) => (
                <div key={idx} className="w-[260px] md:w-[320px] lg:w-[400px] shrink-0 mx-3 rounded-2xl overflow-hidden border border-white/[0.06] group">
                  <Image
                    src={src}
                    alt={`AI Sparks 2026 Speaker ${idx}`}
                    width={400}
                    height={600}
                    sizes="(max-width: 768px) 260px, 400px"
                    loading="lazy"
                    className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            MISSION SECTION
           ═══════════════════════════════════════════════════════════════ */}
        <section className="section-padding relative">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-10" style={{ fontFamily: "var(--font-serif)" }}>
                Our <span className="gradient-text-purple">Mission</span>
              </h2>
              <div className="glass-card p-8 sm:p-10 md:p-14 relative">
                {/* Ambient glow behind card */}
                <div className="absolute -top-20 -left-20 w-60 h-60 bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-pink-500/5 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  <p className="text-base sm:text-lg text-white/50 leading-relaxed">
                    At CodeNeuraX, we believe that growth comes not just from individual effort but from
                    <span className="text-cyan-400/80 font-medium"> collective intelligence</span>. That's why we're building
                    a culture where members can exchange ideas, showcase their work, seek mentorship, and support each
                    other on their tech journeys.
                  </p>
                  <p className="text-base sm:text-lg text-white/50 leading-relaxed">
                    Whether you're just starting out or already building advanced projects, CodeNeuraX offers a space to
                    grow, share, and collaborate with a
                    <span className="text-purple-400/80 font-medium"> strong and supportive network</span>.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            TEAM SECTION
           ═══════════════════════════════════════════════════════════════ */}
        <section id="founder" className="section-padding relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
              className="text-center mb-16"
            >
              <div className="mono-badge mx-auto mb-8">
                <span className="dot" />
                People behind the community
              </div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5" style={{ fontFamily: "var(--font-serif)" }}>
                <span className="text-white">Team </span>
                <span className="gradient-text-cyan">CodeNeuraX</span>
              </h2>
              <p className="text-base sm:text-lg text-white/40 max-w-3xl mx-auto leading-relaxed">
                The passionate individuals driving CodeNeuraX forward and building an amazing platform.
              </p>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={stagger}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
            >
              {team.map((member, index) => (
                <motion.div key={member.name} variants={fadeUp} custom={index * 0.05} className="group text-center">
                  <div className="glass-card p-7 h-full">
                    {/* Avatar */}
                    <div className={`w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-xl font-bold ring-2 ring-transparent group-hover:ring-white/10 transition-all duration-500`}>
                      {member.initials}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-white transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm font-medium text-white/30 mb-3" style={{ fontFamily: "var(--font-mono)" }}>
                      {member.role}
                    </p>
                    <p className="text-white/35 text-sm leading-relaxed mb-5">
                      {member.desc}
                    </p>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/30 hover:text-blue-400 hover:border-blue-400/20 transition-all duration-300"
                      aria-label={`LinkedIn Profile of ${member.name}`}
                    >
                      <LinkedInIcon className="w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            COMMUNITY PARTNERS
           ═══════════════════════════════════════════════════════════════ */}
        <section id="partners" className="section-padding relative">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-serif)" }}>
                As <span className="gradient-text-purple">Community Partners</span>
              </h2>
              <p className="text-lg text-white/40 max-w-3xl mx-auto leading-relaxed">
                We're proud to collaborate with these amazing organizations, who help CodeNeuraX bring together innovators, developers, and problem-solvers to create an extraordinary hackathon experience.
              </p>
            </motion.div>

            {/* Mac-window marquee */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0.1}
            >
              <div className="mac-window">
                <div className="p-4 infinite-marquee">
                  <div className="marquee-content">
                    {[...Array(3)].map((_, setIndex) => (
                      <div key={setIndex} className="marquee-set">
                        {sponsorImages.map((src, idx) => (
                          <div
                            key={`${setIndex}-${idx}`}
                            className="min-w-[240px] sm:min-w-[300px] bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 flex-shrink-0 mx-2"
                          >
                            <div className="relative h-24 sm:h-32 flex items-center justify-center">
                              <Image
                                src={src}
                                alt={`Community Partner ${idx + 1}`}
                                fill
                                className="object-contain"
                                sizes="(max-width: 640px) 60vw, 300px"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            SERVICE SUPPORT (CONTACT FORM)
           ═══════════════════════════════════════════════════════════════ */}
        <section id="contact-request" className="section-padding relative">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
              {/* Left description */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={0}
                className="lg:w-1/2 flex flex-col justify-center"
              >
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-serif)" }}>
                  Service <span className="gradient-text-purple">Support</span>
                </h2>
                <p className="text-lg text-white/40 max-w-xl leading-relaxed">
                  Need career guidance, want a website, promotion, or have another request? Fill out the form and our team will get back to you!
                </p>
              </motion.div>

              {/* Right — Mac-window form */}
              <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={0.1}
                className="lg:w-1/2"
              >
                <div className="mac-window max-w-xl mx-auto">
                  <form onSubmit={submitContact} className="p-6 sm:p-8">
                    {cfSuccess && (
                      <div className="mb-5 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">{cfSuccess}</div>
                    )}
                    {cfError && (
                      <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{cfError}</div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }} htmlFor="cfName">Name</label>
                        <input id="cfName" type="text" className="input-mac" placeholder="Your Name" value={cfName} onChange={e => setCfName(e.target.value)} required />
                      </div>
                      <div>
                        <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }} htmlFor="cfEmail">Email</label>
                        <input id="cfEmail" type="email" className="input-mac" placeholder="you@email.com" value={cfEmail} onChange={e => setCfEmail(e.target.value)} required />
                      </div>
                      <div>
                        <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }} htmlFor="cfMobile">Mobile</label>
                        <input id="cfMobile" type="tel" className="input-mac" placeholder="Your Mobile Number" value={cfMobile} onChange={e => setCfMobile(e.target.value)} required />
                      </div>
                      <div>
                        <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }} htmlFor="cfTopic">Topic</label>
                        <select id="cfTopic" className="input-mac" value={cfTopic} onChange={e => setCfTopic(e.target.value)} required>
                          <option value="career_guidance">Career Guidance</option>
                          <option value="make_website">Make My Website</option>
                          <option value="promotion">For Promotion</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }} htmlFor="cfMessage">Message</label>
                      <textarea id="cfMessage" className="input-mac" placeholder="Describe your request..." rows={4} value={cfMessage} onChange={e => setCfMessage(e.target.value)} required />
                    </div>
                    <button
                      type="submit"
                      className="w-full btn-premium justify-center"
                      disabled={cfSending}
                      style={{ background: cfSending ? "rgba(255,255,255,0.03)" : undefined }}
                    >
                      {cfSending ? "Sending..." : "Submit Request"}
                      {!cfSending && <ArrowRight className="w-4 h-4" />}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════
            GET IN TOUCH
           ═══════════════════════════════════════════════════════════════ */}
        <section id="contact" className="section-padding relative" aria-label="Contact information">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={0}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-serif)" }}>
                Get in <span className="gradient-text-cyan">Touch</span>
              </h2>
              <p className="text-lg text-white/40 max-w-3xl mx-auto leading-relaxed">
                Ready to join our community? Connect with us through any of these channels and start your tech journey today.
              </p>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={stagger}
              className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 max-w-7xl mx-auto"
            >
              {contacts.map((c, index) => (
                <motion.div key={c.title} variants={fadeUp} custom={index * 0.05} className="group text-center">
                  <div className={`glass-card p-6 h-full ${colorMap[c.color] || ""}`}>
                    <div className={`mb-5 flex justify-center ${c.color === "red" ? "text-red-400/50" : c.color === "green" ? "text-green-400/50" : c.color === "blue" ? "text-blue-400/50" : "text-pink-400/50"} group-hover:scale-105 transition-transform duration-300`}>
                      {c.icon}
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">{c.title}</h3>
                    <p className="text-white/30 text-xs leading-relaxed mb-4">{c.desc}</p>
                    <a
                      href={c.link}
                      target={c.link.startsWith("mailto:") ? undefined : "_blank"}
                      rel={c.link.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
                        c.color === "red" ? "text-red-400/60 hover:text-red-400" :
                        c.color === "green" ? "text-green-400/60 hover:text-green-400" :
                        c.color === "blue" ? "text-blue-400/60 hover:text-blue-400" :
                        "text-pink-400/60 hover:text-pink-400"
                      }`}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {c.linkText}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

      </main>
    </>
  )
}
