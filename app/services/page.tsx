"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"
import AuthModal from "@/components/auth-modal"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Sparkles,
  Award,
  Users,
  Target,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react"
import {
  SERVICE_OFFERINGS,
  SERVICE_ICON_MAP,
} from "@/data/service-offerings"

const WHY_FEATURES = [
  {
    icon: Award,
    title: "Industry Expertise",
    description:
      "Proven track record across diverse industries with deep domain knowledge",
  },
  {
    icon: Users,
    title: "Expert Team",
    description:
      "Dedicated professionals in enterprise solutions",
  },
  {
    icon: Target,
    title: "Results-Driven",
    description:
      "Focused on delivering measurable outcomes and sustainable growth",
  },
] as const

const STATS = [
  { value: "10+", label: "Projects Successfully Delivered" },
  { value: "50+", label: "Enterprise Clients Worldwide" },
  { value: "24/7", label: "Global Support & Monitoring" },
  { value: "95.9%", label: "Average Uptime SLA" },
] as const

export default function ServicesPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<"login" | "signup">("login")

  const handleAuth = (type: "login" | "signup") => {
    setAuthType(type)
    setShowAuthModal(true)
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white">
      {/* Ambient glows */}
      <div className="ambient-glow w-[500px] h-[500px] -top-20 -left-20" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.08), transparent 70%)' }} />
      <div className="ambient-glow w-[500px] h-[500px] top-1/3 -right-20" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.06), transparent 70%)' }} />

      <Header onAuth={handleAuth} />
      {showAuthModal && (
        <AuthModal type={authType} onClose={() => setShowAuthModal(false)} />
      )}

      <section className="relative pt-36 pb-16">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center flex flex-col items-center"
          >
            <div className="mono-badge mb-8">
              <span className="dot" style={{ background: '#22d3ee' }} />
              What we deliver
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
              <span className="text-white/90">Services by </span>
              <span className="gradient-text-cyan">CodeNeuraX</span>
            </h1>
            <p className="text-white/40 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              End-to-end technology and creative services—from intelligent automation
              and cloud to design and growth—built with precision and energy.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative section-padding border-y border-white/[0.04]">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
                Why Choose <span className="gradient-text-purple">CodeNeuraX</span>?
              </h2>
              <p className="text-white/40 text-base sm:text-lg leading-relaxed mb-10 max-w-xl">
                We combine cutting-edge technology with deep industry expertise to
                deliver solutions that drive measurable business outcomes.
              </p>
              <ul className="space-y-6">
                {WHY_FEATURES.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <motion.li
                      key={item.title}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.08 }}
                      viewport={{ once: true }}
                      className="flex gap-4 items-start"
                    >
                      <div className="shrink-0 w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-purple-400/80" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-white mb-1">
                          {item.title}
                        </h3>
                        <p className="text-white/40 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </motion.li>
                  )
                })}
              </ul>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {STATS.map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 flex flex-col justify-center text-center"
                >
                  <p className="stat-value text-3xl md:text-4xl mb-2">
                    {stat.value}
                  </p>
                  <p className="stat-label">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="services-grid"
        className="section-padding scroll-mt-28"
      >
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICE_OFFERINGS.map((service, idx) => {
              const Icon = SERVICE_ICON_MAP[service.iconName]
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="block h-full group focus:outline-none"
                >
                  <motion.article
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="glass-card p-7 h-full flex flex-col"
                  >
                    <div className="relative z-10 flex flex-col flex-1">
                      <div className="mb-5 inline-flex rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 w-fit">
                        <Icon className={`w-6 h-6 text-white/50 group-hover:text-white transition-colors`} />
                      </div>
                      <h2 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                        {service.title}
                      </h2>
                      <p className="text-white/35 text-sm leading-relaxed mb-4 line-clamp-2">
                        {service.summary}
                      </p>
                      <span className="mt-auto inline-flex items-center gap-1.5 text-white/40 text-xs font-medium group-hover:text-cyan-400 transition-all" style={{ fontFamily: "var(--font-mono)" }}>
                        View details
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </motion.article>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto glass-card p-8 md:p-12 text-center"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              Ready to Transform Your Business?
            </h3>
            <p className="text-white/40 text-base max-w-2xl mx-auto mb-8 leading-relaxed">
              Let&apos;s discuss how our enterprise solutions can drive measurable
              growth and innovation for your organization.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/#contact-request"
                className="btn-premium btn-green text-sm"
              >
                <Calendar className="w-4 h-4" />
                Book Free Consultation
              </Link>
              <Link
                href="/#contact"
                className="btn-premium text-sm"
              >
                Contact Our Team
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
