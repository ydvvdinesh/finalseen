"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import AuthModal from "@/components/auth-modal"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Users, Sparkles, ArrowRight, ExternalLink, GraduationCap, Linkedin } from "lucide-react"

interface Ambassador {
  ref_no: string
  name: string
  college: string
  photo_url: string
  linkedin_url: string
}

export default function CampusAmbassadorsPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<"login" | "signup">("login")
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([])
  const [loading, setLoading] = useState(true)

  const handleAuth = (type: "login" | "signup") => {
    setAuthType(type)
    setShowAuthModal(true)
  }

  useEffect(() => {
    const fetchAmbassadors = async () => {
      try {
        const res = await fetch(`/api/campus-ambassador/list?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
          },
        })
        if (res.ok) {
          const data = await res.json()
          setAmbassadors(data.ambassadors || [])
        }
      } catch (err) {
        console.error("Failed to fetch ambassadors:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchAmbassadors()
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white">
      {/* Ambient Background Effects */}
      <div
        className="ambient-glow w-[600px] h-[600px] -top-32 -left-32"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.10), transparent 70%)" }}
      />
      <div
        className="ambient-glow w-[500px] h-[500px] top-1/4 -right-20"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.08), transparent 70%)" }}
      />
      <div
        className="ambient-glow w-[400px] h-[400px] bottom-0 left-1/3"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.06), transparent 70%)" }}
      />

      <Header onAuth={handleAuth} />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="mono-badge mx-auto">
              <span className="dot" style={{ background: "#a855f7" }} />
              Our Ambassadors
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 max-w-5xl mx-auto"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Meet Our <span className="gradient-text-purple">Campus Ambassadors</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-white/40 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >
            These incredible leaders represent CodeNeuraX on their campuses, organize events,
            and inspire thousands of students to build, learn, and grow together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
          >
            <Link
              href="/campus-ambassadors/register"
              className="btn-premium text-sm inline-flex"
            >
              <Sparkles className="w-4 h-4" />
              Become a Campus Ambassador
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      {ambassadors.length > 0 && (
        <section className="relative pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4">
              {[
                { label: "Ambassadors", value: ambassadors.length, icon: <Users className="w-5 h-5" /> },
                { label: "Colleges", value: new Set(ambassadors.map(a => a.college)).size, icon: <GraduationCap className="w-5 h-5" /> },
                { label: "Growing Strong", value: "🚀", icon: <Sparkles className="w-5 h-5" /> },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                  className="glass-card p-5 text-center"
                >
                  <div className="flex justify-center mb-2 text-purple-400/80">{stat.icon}</div>
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                    {stat.value}
                  </div>
                  <div className="text-[0.65rem] text-white/40 uppercase tracking-wider font-semibold" style={{ fontFamily: "var(--font-mono)" }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ambassadors Grid */}
      <section className="relative pb-24">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center gap-3 text-white/30 text-sm">
                <div className="w-5 h-5 border-2 border-white/20 border-t-purple-400 rounded-full animate-spin" />
                Loading ambassadors...
              </div>
            </div>
          ) : ambassadors.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-20"
            >
              <div className="glass-card max-w-lg mx-auto p-10">
                <div className="w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-6">
                  <Users className="w-9 h-9 text-purple-400/70" />
                </div>
                <h3
                  className="text-2xl font-bold text-white mb-4"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Be the First Ambassador!
                </h3>
                <p className="text-white/40 text-sm mb-8 leading-relaxed">
                  No approved ambassadors yet. Register now and be the pioneer Campus Ambassador
                  for CodeNeuraX at your university!
                </p>
                <Link
                  href="/campus-ambassadors/register"
                  className="btn-premium text-sm inline-flex"
                >
                  <Sparkles className="w-4 h-4" />
                  Register Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ) : (
            /* Ambassadors Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8">
              {ambassadors.map((ambassador, idx) => (
                <motion.div
                  key={ambassador.ref_no}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                  className="group flex flex-col items-center text-center"
                >
                  {/* Circular Profile Photo */}
                  <div className="relative mb-4">
                    {/* Glow ring on hover */}
                    <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-purple-500/0 via-cyan-500/0 to-amber-500/0 group-hover:from-purple-500/30 group-hover:via-cyan-500/20 group-hover:to-amber-500/30 transition-all duration-500 blur-sm" />
                    
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-full overflow-hidden border-2 border-white/[0.08] group-hover:border-purple-500/40 transition-all duration-500 shadow-lg group-hover:shadow-purple-500/10">
                      {ambassador.photo_url ? (
                        <Image
                          src={ambassador.photo_url}
                          alt={ambassador.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 176px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                          <span className="text-3xl sm:text-4xl font-bold text-white/40" style={{ fontFamily: "var(--font-serif)" }}>
                            {ambassador.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-purple-300 transition-colors duration-300 mb-1 line-clamp-1">
                    {ambassador.name}
                  </h3>

                  {/* College */}
                  <p className="text-[0.65rem] sm:text-xs text-white/40 mb-3 line-clamp-2 leading-relaxed max-w-[180px]" style={{ fontFamily: "var(--font-mono)" }}>
                    {ambassador.college}
                  </p>

                  {/* LinkedIn Link */}
                  {ambassador.linkedin_url && (
                    <a
                      href={ambassador.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[0.65rem] font-medium text-white/30 hover:text-[#0A66C2] transition-colors duration-300 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.06] hover:border-[#0A66C2]/30 hover:bg-[#0A66C2]/5"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      <Linkedin className="w-3 h-3" />
                      LinkedIn
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}

                  {/* Ref No Badge */}
                  <span
                    className="mt-2 text-[0.55rem] text-white/20 uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {ambassador.ref_no}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative pb-24 border-t border-white/[0.04] pt-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Ready to <span className="gradient-text-amber">Lead?</span>
            </h2>
            <p className="text-white/40 text-sm sm:text-base mb-8 leading-relaxed">
              Join the CodeNeuraX Campus Ambassador Program and represent us at your university.
              Build your network, develop leadership skills, and make an impact.
            </p>
            <Link
              href="/campus-ambassadors/register"
              className="btn-premium text-sm inline-flex"
            >
              Apply Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-10 relative">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/20 text-xs tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
            Team CodeNeuraX 💙
          </p>
        </div>
      </footer>

      {showAuthModal && <AuthModal type={authType} onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}
