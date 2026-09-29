"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  Clock,
  Mic2,
  CheckCircle,
  Gift,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import Header from "@/components/header"
import AuthModal from "@/components/auth-modal"
import SpeakerApplicationForm from "@/components/speaker-application-form"
import Link from "next/link"
import Image from "next/image"
import { getSpeakerEventById, SPEAKER_IMAGE_VERSION } from "@/data/speaker-events"

interface SpeakerEventPageProps {
  params: {
    id: string
  }
}

export default function SpeakerEventPage({ params }: SpeakerEventPageProps) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<"login" | "signup">("login")
  const [showForm, setShowForm] = useState(false)

  const event = getSpeakerEventById(params.id)

  const handleAuth = (type: "login" | "signup") => {
    setAuthType(type)
    setShowAuthModal(true)
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="text-center glass-card p-10 max-w-md">
          <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-serif)" }}>Event Not Found</h1>
          <Link href="/speaker" className="btn-premium text-sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Opportunities
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white">
      {/* Ambient glows */}
      <div className="ambient-glow w-96 h-96 top-0 left-1/4" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)' }} />
      <div className="ambient-glow w-96 h-96 bottom-0 right-1/4" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06), transparent 70%)' }} />

      <Header onAuth={handleAuth} />

      <section className="relative pt-36 pb-12">
        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/speaker"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white/60 bg-white/[0.03] border border-white/[0.06] hover:text-white hover:border-white/20 transition-all mb-8"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to all opportunities</span>
          </Link>

          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid lg:grid-cols-2 gap-12 items-start"
            >
              <div className="relative h-80 lg:h-[28rem] rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl">
                <Image
                  key={`${event.id}-${event.image}-${SPEAKER_IMAGE_VERSION}`}
                  src={`${event.image}?v=${SPEAKER_IMAGE_VERSION}`}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute top-6 left-6">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/20 backdrop-blur-sm"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {event.category}
                  </span>
                </div>
                <div className="absolute top-6 right-6">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium bg-white/[0.04] text-white/50 border border-white/[0.08] backdrop-blur-sm flex items-center gap-1.5"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <Mic2 className="w-3.5 h-3.5 text-amber-400" />
                    Looking for Speaker
                  </span>
                </div>
              </div>

              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-serif)" }}>
                  {event.title}
                </h1>
                <p className="text-base sm:text-lg text-white/40 mb-8 leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <Calendar className="w-4 h-4 text-amber-400/80" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <MapPin className="w-4 h-4 text-amber-400/80" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <Users className="w-4 h-4 text-amber-400/80" />
                    <span>{event.expectedAudience}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <Clock className="w-4 h-4 text-amber-400/80" />
                    <span>{event.duration}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="btn-premium text-sm"
                >
                  <Mic2 className="w-4 h-4 text-amber-400" />
                  Looking for Speaker — Apply Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-serif)" }}>
                About this <span className="gradient-text-amber">Event</span>
              </h2>
              <div className="glass-card p-8">
                <p className="text-white/60 leading-relaxed whitespace-pre-line text-base sm:text-lg">
                  {event.fullDescription}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2" style={{ fontFamily: "var(--font-serif)" }}>
                <Sparkles className="w-5 h-5 text-amber-400/80" />
                We&apos;re looking for
              </h2>
              <ul className="space-y-3">
                {event.lookingFor.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-white/60 text-sm leading-relaxed glass-card p-4">
                    <CheckCircle className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2" style={{ fontFamily: "var(--font-serif)" }}>
                <Gift className="w-5 h-5 text-orange-400/80" />
                Speaker perks
              </h2>
              <ul className="space-y-3">
                {event.perks.map((perk, index) => (
                  <li key={index} className="flex items-start gap-3 text-white/60 text-sm leading-relaxed glass-card p-4">
                    <CheckCircle className="w-4 h-4 text-orange-400/80 shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center" style={{ fontFamily: "var(--font-serif)" }}>
              Session <span className="gradient-text-purple">Highlights</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {event.highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 text-center"
                >
                  <CheckCircle className="w-6 h-6 text-amber-400/70 mx-auto mb-3" />
                  <h3 className="text-white/80 font-medium text-sm">{highlight}</h3>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 relative">
        <div className="container mx-auto px-4 text-center">
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="btn-premium text-base"
          >
            <Mic2 className="w-5 h-5 text-amber-400" />
            Apply to Speak at This Event
          </button>
        </div>
      </section>

      <footer className="border-t border-white/[0.04] py-10 relative">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/20 text-xs tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>Team CodeNeuraX 💙</p>
        </div>
      </footer>

      {showAuthModal && <AuthModal type={authType} onClose={() => setShowAuthModal(false)} />}

      {showForm && (
        <SpeakerApplicationForm
          eventId={event.id}
          eventTitle={event.title}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
