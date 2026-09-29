"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle,
} from "lucide-react"
import Header from "@/components/header"
import AuthModal from "@/components/auth-modal"
import {
  getServiceBySlug,
  SERVICE_ICON_MAP,
} from "@/data/service-offerings"

interface Props {
  params: { slug: string }
}

export default function ServiceDetailPage({ params }: Props) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<"login" | "signup">("login")
  const service = getServiceBySlug(params.slug)

  const handleAuth = (type: "login" | "signup") => {
    setAuthType(type)
    setShowAuthModal(true)
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 text-white">
        <div className="text-center max-w-md glass-card p-10">
          <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: "var(--font-serif)" }}>Service not found</h1>
          <p className="text-white/40 mb-8 text-sm">
            This service does not exist or the link may be outdated.
          </p>
          <Link
            href="/services"
            className="btn-premium text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to services
          </Link>
        </div>
      </div>
    )
  }

  const Icon = SERVICE_ICON_MAP[service.iconName]

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white">
      {/* Ambient glows */}
      <div className="ambient-glow w-96 h-96 top-0 left-1/4" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.08), transparent 70%)' }} />
      <div className="ambient-glow w-96 h-96 bottom-0 right-1/4" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.06), transparent 70%)' }} />

      <Header onAuth={handleAuth} />
      {showAuthModal && (
        <AuthModal type={authType} onClose={() => setShowAuthModal(false)} />
      )}

      <div className="fixed top-24 left-6 z-40">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white/60 bg-white/[0.03] border border-white/[0.06] hover:text-white hover:border-white/20 backdrop-blur-md transition-all"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          All services
        </Link>
      </div>

      <section className="relative pt-36 pb-16 md:pb-20 z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 mb-8">
              <Icon className={`w-8 h-8 ${service.iconClass}`} />
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
              {service.title}
            </h1>
            <p className="text-base sm:text-lg text-white/50 mb-10 leading-relaxed border-l-2 border-cyan-400/40 pl-4">
              {service.summary}
            </p>
            <div className="space-y-4 text-white/40 text-sm sm:text-base leading-relaxed">
              {service.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding relative z-10 border-t border-white/[0.04]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8" style={{ fontFamily: "var(--font-serif)" }}>
                What <span className="gradient-text-cyan">we cover</span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {service.highlights.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="glass-card p-5 flex gap-3 items-start"
                  >
                    <CheckCircle className={`w-5 h-5 shrink-0 text-cyan-400/80 mt-0.5`} />
                    <span className="text-white/70 text-sm font-medium leading-snug">
                      {item}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding relative z-10 border-t border-white/[0.04]">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto text-center glass-card p-8 sm:p-10"
          >
            <p className="text-white/50 text-sm mb-6">
              Want to talk about this service for your team?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/#contact-request"
                className="btn-premium btn-green text-xs"
              >
                <Calendar className="w-4 h-4" />
                Book a consultation
              </Link>
              <Link
                href="/services"
                className="btn-premium text-xs"
              >
                Other services
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/[0.04] py-10 relative">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/20 text-xs tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>Team CodeNeuraX 💙</p>
        </div>
      </footer>
    </div>
  )
}
