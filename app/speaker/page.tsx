"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, Users, ArrowRight, Clock, Mic2 } from "lucide-react"
import Header from "@/components/header"
import AuthModal from "@/components/auth-modal"
import Link from "next/link"
import Image from "next/image"
import { SPEAKER_EVENTS, SPEAKER_IMAGE_VERSION } from "@/data/speaker-events"

export default function SpeakerPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<"login" | "signup">("login")

  const handleAuth = (type: "login" | "signup") => {
    setAuthType(type)
    setShowAuthModal(true)
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      {/* Ambient glows */}
      <div className="ambient-glow w-96 h-96 top-0 left-1/4" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)' }} />
      <div className="ambient-glow w-96 h-96 bottom-0 right-1/4" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06), transparent 70%)' }} />
      <div className="ambient-glow w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.04), transparent 70%)' }} />

      <Header onAuth={handleAuth} />

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
                <span className="dot" style={{ background: '#f59e0b' }} />
                Speak at CodeNeuraX
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8" style={{ fontFamily: "var(--font-serif)" }}>
                <span className="text-white/90">Become a</span>
                <br />
                <span className="gradient-text-amber">Speaker</span>
              </h1>

              <p className="text-lg md:text-xl text-white/40 mb-12 leading-relaxed max-w-3xl mx-auto">
                Share your expertise with thousands of learners.
                <br />
                <span className="text-white/60">Browse open events and apply to speak.</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-serif)" }}>
              Open <span className="gradient-text-amber">Speaking Opportunities</span>
            </h2>
            <p className="text-lg text-white/40 max-w-3xl mx-auto leading-relaxed">
              Click an event to read the full brief. If you&apos;re a match, apply with one click.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SPEAKER_EVENTS.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/speaker/${event.id}`}>
                  <div className="glass-card overflow-hidden h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        key={`${event.id}-${event.image}-${SPEAKER_IMAGE_VERSION}`}
                        src={`${event.image}?v=${SPEAKER_IMAGE_VERSION}`}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                        quality={85}
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/20 backdrop-blur-sm" style={{ fontFamily: "var(--font-mono)" }}>
                          {event.category}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/[0.04] text-white/50 border border-white/[0.08] backdrop-blur-sm" style={{ fontFamily: "var(--font-mono)" }}>
                          Looking for Speaker
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-amber-300 transition-colors line-clamp-2">
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
                          <Users className="w-3.5 h-3.5" /><span>{event.expectedAudience}</span>
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

                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-amber-400/60 font-medium text-xs" style={{ fontFamily: "var(--font-mono)" }}>View & Apply</span>
                        <ArrowRight className="w-4 h-4 text-amber-400/40 group-hover:translate-x-1 group-hover:text-amber-400 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
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
