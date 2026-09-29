"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, Users, Play, ArrowRight, Clock, Trophy, Sparkles, Check, ExternalLink } from "lucide-react"
import Header from "@/components/header"
import AuthModal from "@/components/auth-modal"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import Image from "next/image"
import {
  AI_SPARK_OVERVIEW,
  AI_SPARK_SPEAKERS,
  SPEAKER_ALUMNI_COMPANIES,
  COMMUNITY_PARTNERS,
  TEAM_GROUPS,
} from "@/data/sponsorship"

export default function EventsPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<"login" | "signup">("login")
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const supabase = createClient()

  // Check authentication on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase.auth])

  const handleAuth = (type: "login" | "signup") => {
    setAuthType(type)
    setShowAuthModal(true)
  }

  // Sample completed events data
  const completedEvents = [
    {
      id: 1,
      title: "Career Advice By IITIAN ( 2ND YEAR + GATE )",
      description: " In this session, Sonu will share his personal roadmap—how he cracked GATE, explored AI & ML, built impactful projects, and landed a prestigious role.",
      date: "July 19, 2025",
      location: "Google Meet",
      attendees: 233,
      image: "/images/Sonu yadav Poster.webp",
      category: "Session",
      duration: "2 Hours",
      highlights: ["DSA", "Gate Prepartion", "AI & ML", "Project Deployment"]
    },
    {
      id: 2,
      title: "How to Win Smart India Hackathon 2025",
      description: "Expect practical checklists for SIH readiness, plug-and-play templates for planning and pitching, and a live Q&A with feedback on your approach.",
      date: "September  1, 2025",
      location: "Google Meet",
      attendees: 172,
      image: "/images/Arkja Gaur - SIH Winner 2024.webp",
      category: "Webinar",
      duration: "2 Hours",
      highlights: ["Team Formation", "Judges", "Problem Statement", "Industry Applications"]
    },
    {
      id: 3,
      title: "CodeNeuraX Webinar: Data Science & AI Roadmap",
      description: "From Resume to Research: A step-by-step guide to crafting your career in Data Science & AI. ​Abhinav Kumar – Data Scientist (4+ years) at LTIMindtree, Stealth Startup Founder and NIT Warangal alumnus.",
      date: "September 19,2025",
      location: "Google Meet",
      attendees: 109,
      image: "/images/Abhinav Kumar - CodeNeuraX - 11 - Final.webp",
      category: "Webinar",
      duration: "2 Hours",
      highlights: ["Data Science", "Machine Learning", "LLM", "Research Papers"]
    },
    {
      id: 4,
      title: "From Tier-3 to Flipkart : A Complete Software Developer Roadmap",
      description: "An inspiring session with Mansi Somani, Software Developer at Flipkart, sharing her journey from a Tier-3 college to a top product-based company. Learn the roadmap, interview strategy, and mindset to land your dream tech role.",
      date: "October 15, 2025",
      location: "Online",
      attendees: 136,
      image: "/images/Mansi Somani - 1.webp",
      category: "Webinar",
      duration: "2 Hours",
      highlights: [
        "Roadmap",
        "Resources & Strategies",
        "Building a strong resume and projects",
        "Insights from Mansi’s journey to Flipkart"
      ],
    },
    {
      id: 5,
      title: "Journey to Microsoft : From Student to Software Engineer",
      description: "An insightful session with Ishita Rai, Software Engineer at Microsoft, sharing her inspiring journey from college to one of the world's leading tech companies. Learn actionable tips on preparation, interviews, and standing out as a candidate.",
      date: "November 23, 2025",
      location: "Online",
      attendees: 215,
      image: "/images/Ishita Rai - Session Poster - 1.webp",
      category: "Webinar",
      duration: "2 Hours",
      highlights: [
        "Microsoft Journey",
        "Interview Preparation",
        "Resume & Project Tips",
        "Q&A Session"
      ]
    },
    {
      id: 6,
      title: "CodeNeuraX: Master the Amazon Interview",
      description: "An exclusive career-focused session with Vanshika Amulya Bharti J, Incoming SDE at Amazon, sharing her comprehensive roadmap to crack top tech interviews, DSA strategy, project recommendations, and real interview insights.",
      date: "December 08, 2025",
      location: "Online",
      attendees: 180,
      image: "/images/6.jpg",
      category: "Webinar",
      duration: "2 Hours",
      highlights: [
        "Amazon SDE Roadmap",
        "DSA & Problem Solving Strategy",
        "Resume Building & Projects",
        "Live Q&A Session"
      ]
    },
    {
      id: 7,
      title: "CodeNeuraX: A Journey into Data Science",
      description: "An exclusive career-focused session with Nivedita Gupta, Data Scientist at Flipkart, covering her journey into data science, the complete roadmap from fundamentals to advanced level, real-world applications at Flipkart, and career guidance for aspiring data scientists.",
      date: "January 17, 2026",
      location: "Online",
      attendees: 96,
      image: "/images/7.png",
      category: "Webinar",
      duration: "2 Hours",
      highlights: [
        "Data Science Career Roadmap",
        "Beginner to Advanced Skill Progression",
        "Real-world Data Science at Flipkart",
        "Tools & Technologies for Data Science",
        "Project Building Strategy",
        "Live Q&A Session"
      ]
    },
    {
      id: 8,
      title: "CodeNeuraX: Crack the Google Interview",
      description: "An exclusive career-focused session with Divanshi Jain, Incoming SWE at Google, focused on helping students understand the roadmap to crack top product-based company interviews, master DSA preparation, build strong resumes and projects, and gain insights from real interview experiences.",
      date: "April 17, 2026",
      location: "Online",
      attendees: 350,
      image: "/images/8.png",
      category: "Webinar",
      duration: "2 Hours",
      highlights: [
        "Roadmap to Crack Top Tech Interviews",
        "Effective DSA Preparation Strategy",
        "Common Mistakes Students Make",
        "Resume & Profile Building Tips",
        "Real Google Interview Experience",
        "Industry Expectations from Freshers",
        "Live Q&A Session"
      ]
    }
  ]

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-xs" style={{ fontFamily: "var(--font-mono)" }}>Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white">
      {/* Ambient Background Glows */}
      <div className="ambient-glow w-[500px] h-[500px] -top-20 -left-20" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.08), transparent 70%)' }} />
      <div className="ambient-glow w-[500px] h-[500px] top-1/3 -right-20" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.06), transparent 70%)' }} />

      <Header onAuth={handleAuth} />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <div className="mono-badge mx-auto mb-8">
                <span className="dot" />
                CodeNeuraX Events
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8" style={{ fontFamily: "var(--font-serif)" }}>
                <span className="text-white/90">CNX </span>
                <span className="gradient-text-purple">Events</span>
              </h1>

              <p className="text-lg md:text-xl text-white/40 mb-12 leading-relaxed max-w-3xl mx-auto">
                Join our community events, workshops, and conferences to enhance your skills
                and connect with fellow developers.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/#upcoming-events"
                  className="btn-premium btn-green text-sm"
                >
                  Go to Upcoming Events
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a 
                  href="/speaker"
                  className="btn-premium text-sm"
                >
                  Become a Speaker
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Completed Events Section */}
      <section className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              Completed <span className="gradient-text-cyan">Events</span>
            </h2>
            <p className="text-lg text-white/40 max-w-3xl mx-auto leading-relaxed">
              Explore our past events and watch the recordings to catch up on what you missed.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {completedEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/events/${event.id}`}>
                  <div className="glass-card overflow-hidden h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        quality={85}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-300 border border-green-500/20 backdrop-blur-sm"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {event.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <div className="bg-black/60 backdrop-blur-sm rounded-full p-2 group-hover:bg-white/20 transition-colors">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-green-300 transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-white/35 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                        {event.description}
                      </p>

                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center gap-2 text-xs text-white/30">
                          <Calendar className="w-3.5 h-3.5" /><span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/30">
                          <MapPin className="w-3.5 h-3.5" /><span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/30">
                          <Users className="w-3.5 h-3.5" /><span>{event.attendees} attendees</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/30">
                          <Clock className="w-3.5 h-3.5" /><span>{event.duration}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {event.highlights.slice(0, 2).map((highlight, idx) => (
                          <span key={idx} className="bg-white/[0.04] text-white/40 px-2 py-0.5 rounded-full text-[0.65rem]" style={{ fontFamily: "var(--font-mono)" }}>
                            {highlight}
                          </span>
                        ))}
                        {event.highlights.length > 2 && (
                          <span className="bg-white/[0.04] text-white/30 px-2 py-0.5 rounded-full text-[0.65rem]">
                            +{event.highlights.length - 2} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-2">
                        <span className="text-green-400/70 font-medium text-xs" style={{ fontFamily: "var(--font-mono)" }}>Watch Recording</span>
                        <ArrowRight className="w-4 h-4 text-green-400/60 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Spark 2026 — Flagship Event Recap */}
      <section className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="mono-badge mx-auto mb-6">
              <span className="dot" style={{ background: '#f59e0b' }} />
              Flagship Offline Event
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              AI Spark <span className="gradient-text-amber">2026</span>
            </h2>
            <p className="text-lg text-white/40 max-w-3xl mx-auto leading-relaxed">
              Our first flagship offline event — a two-day immersive technology experience at Marwadi University, Rajkot.
            </p>
          </motion.div>

          {/* Overview */}
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-20">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-wrap gap-3 mb-6 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                <span className="flex items-center gap-1.5 glass-card px-3 py-1.5 text-white/60">
                  <Calendar className="w-3.5 h-3.5 text-amber-400/80" /> 7th &amp; 8th August 2026
                </span>
                <span className="flex items-center gap-1.5 glass-card px-3 py-1.5 text-white/60">
                  <MapPin className="w-3.5 h-3.5 text-amber-400/80" /> Marwadi University, Rajkot
                </span>
                <span className="flex items-center gap-1.5 glass-card px-3 py-1.5 text-white/60">
                  <Users className="w-3.5 h-3.5 text-amber-400/80" /> 4000+ Reach
                </span>
              </div>
              <p className="text-white/50 leading-relaxed mb-6 text-sm sm:text-base">{AI_SPARK_OVERVIEW.description}</p>
              <ul className="grid sm:grid-cols-2 gap-2.5 mb-8">
                {AI_SPARK_OVERVIEW.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-white/60 glass-card p-3">
                    <Check className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/aispark"
                className="btn-premium text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                View AI Spark Page
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative w-full max-w-lg mx-auto lg:max-w-none aspect-square rounded-3xl overflow-hidden glass-card p-4"
            >
              <Image
                src={AI_SPARK_OVERVIEW.image}
                alt="AI Spark 2026 by CodeNeuraX"
                fill
                className="object-contain p-4"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </div>

          {/* Speakers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h3 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              Event <span className="gradient-text-amber">Speakers</span>
            </h3>
            <p className="text-white/40 text-sm">Industry experts who shared their knowledge at AI Spark 2026.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto mb-20">
            {AI_SPARK_SPEAKERS.map((speaker, idx) => (
              <motion.div
                key={speaker.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center"
              >
                {speaker.image && (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border border-white/10">
                    <Image
                      src={speaker.image}
                      alt={speaker.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                )}
                <h4 className="text-white font-bold text-base mb-1">{speaker.name}</h4>
                {speaker.tagline && (
                  <p className="text-amber-400/80 text-xs font-medium mb-3" style={{ fontFamily: "var(--font-mono)" }}>{speaker.tagline}</p>
                )}
                {speaker.highlights && (
                  <ul className="text-left space-y-1 mb-4">
                    {speaker.highlights.slice(0, 2).map((h) => (
                      <li key={h} className="flex items-start gap-2 text-xs text-white/40">
                        <Check className="w-3 h-3 text-amber-400/60 shrink-0 mt-0.5" />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
                {speaker.linkedin && (
                  <a
                    href={speaker.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-amber-400/70 hover:text-amber-300 transition-colors"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <ExternalLink className="w-3 h-3" /> LinkedIn
                  </a>
                )}
              </motion.div>
            ))}
          </div>

          {/* Community Partners & Speaker Alumni */}
          <div className="max-w-5xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                Speakers from <span className="gradient-text-amber">Top Companies</span>
              </h3>
              <p className="text-white/30 text-xs" style={{ fontFamily: "var(--font-mono)" }}>Our community has hosted speakers from the best in tech.</p>
            </motion.div>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mb-14">
              {SPEAKER_ALUMNI_COMPANIES.map((company) => (
                <div key={company.name} className="flex flex-col items-center gap-2 w-28 md:w-36" title={company.name}>
                  <div className="relative w-24 h-14 md:w-32 md:h-16 rounded-xl bg-white/5 border border-white/[0.06] overflow-hidden px-3 py-2">
                    <Image src={company.image} alt={company.name} fill className="object-contain p-1" sizes="128px" />
                  </div>
                  <span className="text-[0.65rem] text-white/40" style={{ fontFamily: "var(--font-mono)" }}>{company.name}</span>
                </div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                Community <span className="gradient-text-amber">Partners</span>
              </h3>
              <p className="text-white/30 text-xs" style={{ fontFamily: "var(--font-mono)" }}>Universities, hackathon communities, and more who collaborated with us.</p>
            </motion.div>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
              {COMMUNITY_PARTNERS.map((partner) => (
                <div key={partner.name} className="flex flex-col items-center gap-2 w-28 md:w-32" title={partner.name}>
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/5 border border-white/[0.06] overflow-hidden">
                    <Image src={partner.image} alt={partner.name} fill className="object-contain p-2" sizes="96px" />
                  </div>
                  <span className="text-[0.65rem] text-white/40 text-center leading-tight" style={{ fontFamily: "var(--font-mono)" }}>{partner.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h3 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-serif)" }}>
              The <span className="gradient-text-amber">Team</span> Behind AI Spark
            </h3>
            <p className="text-white/40 text-sm">Driven by innovation, creativity, and collaboration.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {TEAM_GROUPS.map((group, gIdx) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: gIdx * 0.08 }}
                viewport={{ once: true }}
                className="glass-card p-6"
              >
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-mono)" }}>
                  <Users className="w-4 h-4 text-amber-400" />
                  {group.title}
                </h4>
                <ul className="space-y-3">
                  {group.members.map((member) => (
                    <li key={member.name}>
                      <p className="text-white/80 font-medium text-sm">{member.name}</p>
                      <p className="text-white/30 text-xs" style={{ fontFamily: "var(--font-mono)" }}>{member.role}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.04] py-10 relative">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/20 text-xs tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>Team CodeNeuraX 💙</p>
        </div>
      </footer>

      {showAuthModal && <AuthModal type={authType} onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}