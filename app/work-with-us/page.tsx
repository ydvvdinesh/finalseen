"use client"

import { useState } from "react"
import Header from "@/components/header"
import AuthModal from "@/components/auth-modal"
import Link from "next/link"
import { Clock, Trophy, ArrowRight, Zap, CheckCircle2, Briefcase } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

interface Position {
  id: string;
  title: string;
  company: string;
  logo: string;
  type: string;
  typeColor: string;
  statusBadges: { text: string; className: string; icon?: React.ReactNode }[];
  tags: string[];
  deadline: string;
}

export default function WorkWithUsPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<"login" | "signup">("login")

  const handleAuth = (type: "login" | "signup") => {
    setAuthType(type)
    setShowAuthModal(true)
  }

  const positions: Position[] = [
    {
      id: "campus-ambassador",
      title: "CodeNeuraX Campus Ambassador 2027",
      company: "CodeNeuraX",
      logo: "/images/CodeNeuraX.webp",
      type: "COMMUNITY",
      typeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      statusBadges: [
        {
          text: "Unpaid",
          className: "text-white/50 bg-white/[0.04] border-white/[0.08]"
        },
        {
          text: "Hybrid",
          className: "text-white/70 bg-white/[0.04] border-white/[0.08]"
        }
      ],
      tags: ["#Leadership", "#Community", "#Networking"],
      deadline: "Dec 15, 2026"
    },
    /*{
      id: "convener",
      title: "Convener of the Community",
      company: "CodeNeuraX",
      logo: "/images/CodeNeuraX.webp",
      type: "MANAGEMENT",
      typeColor: "text-pink-400 bg-pink-500/10 border-pink-500/20",
      statusBadges: [
        {
          text: "Unpaid",
          className: "text-white/50 bg-white/[0.04] border-white/[0.08]"
        },
        {
          text: "Remote",
          className: "text-white/70 bg-white/[0.04] border-white/[0.08]"
        }
      ],
      tags: ["#Management", "#Strategy", "#Community"],
      deadline: "Closed"
    }*/
  ]

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white">
      {/* Ambient Background Effects */}
      <div className="ambient-glow w-[500px] h-[500px] -top-20 -left-20" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.08), transparent 70%)' }} />
      <div className="ambient-glow w-[500px] h-[500px] top-1/3 -right-20" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.06), transparent 70%)' }} />

      <Header onAuth={handleAuth} />

      {/* Hero Section */}
      <section className="relative pt-36 pb-16">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="mono-badge mx-auto">
              <span className="dot" />
              Careers & Opportunities
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 max-w-4xl mx-auto"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Work With <span className="gradient-text-amber">CodeNeuraX</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-white/40 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            We're looking for passionate individuals to help us build the most engaging and supportive student tech community. Explore our open positions below.
          </motion.p>
        </div>
      </section>

      {/* Open Positions Grid */}
      <section className="relative pb-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-6">
            {positions.map((position, idx) => (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="glass-card p-7 flex flex-col h-full group"
              >
                {/* Top Row: Logo & Type Badge */}
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-2 flex items-center justify-center shrink-0">
                    <div className="relative w-full h-full">
                      <Image
                        src={position.logo}
                        alt={position.company}
                        fill
                        className="object-contain"
                        sizes="56px"
                      />
                    </div>
                  </div>
                  <span
                    className={`text-[0.7rem] font-semibold tracking-wider uppercase px-3 py-1 rounded-full border ${position.typeColor}`}
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {position.type}
                  </span>
                </div>

                {/* Title & Company */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors line-clamp-2">
                  {position.title}
                </h3>
                <p className="text-xs text-white/40 font-medium mb-5" style={{ fontFamily: "var(--font-mono)" }}>
                  {position.company}
                </p>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {position.statusBadges.map((badge, i) => (
                    <div
                      key={i}
                      className={`inline-flex items-center text-xs font-medium px-3 py-1 rounded-full border ${badge.className}`}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {badge.icon}
                      {badge.text}
                    </div>
                  ))}
                </div>

                {/* Hashtags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {position.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs text-white/30 font-medium px-2 py-1 rounded-md bg-white/[0.02] border border-white/[0.04]"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Spacer to push footer down */}
                <div className="flex-grow"></div>

                {/* Footer: Apply By & Button */}
                <div className="flex items-center justify-between border-t border-white/[0.06] pt-5 mt-2 gap-2">
                  <div className="flex items-center text-white/40 text-xs font-medium min-w-0" style={{ fontFamily: "var(--font-mono)" }}>
                    <Clock className="w-3.5 h-3.5 mr-2 shrink-0 text-white/30" />
                    <span className="truncate">Apply by: {position.deadline}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/work-with-us/${position.id}`}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-white/50 bg-white/[0.03] border border-white/[0.06] hover:text-white hover:border-white/20 transition-all"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Details
                    </Link>
                    <Link
                      href={position.id === "campus-ambassador" ? "/campus-ambassadors/register" : `/work-with-us/${position.id}`}
                      className="btn-premium text-xs py-2 px-4 shrink-0 whitespace-nowrap"
                    >
                      Apply Now
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
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
