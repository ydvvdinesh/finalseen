"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Sparkles,
  Megaphone,
  Users,
  Mail,
  Phone,
  Check,
  X,
  Handshake,
  ArrowRight
} from "lucide-react"
import Header from "@/components/header"
import AuthModal from "@/components/auth-modal"
import SponsorshipPersonCard from "@/components/sponsorship-person-card"
import {
  SPONSORSHIP_HERO,
  FEATURED_EVENTS,
  AI_SPARK_OVERVIEW,
  AI_SPARK_SPEAKERS,
  SPEAKER_ALUMNI_COMPANIES,
  VISIBILITY_OPPORTUNITIES,
  SPONSORSHIP_TIERS,
  BRANDING_BENEFITS,
  ENGAGEMENT_BENEFITS,
  COMMUNITY_PARTNERS,
  TEAM_GROUPS,
  SPONSORSHIP_CONTACTS,
  SPONSORSHIP_EMAIL,
  type TierId,
} from "@/data/sponsorship"

function TierCell({ value }: { value: boolean | string }) {
  if (value === true) {
    return <Check className="w-4 h-4 text-emerald-400 mx-auto" aria-label="Included" />
  }
  if (value === false) {
    return <X className="w-4 h-4 text-white/20 mx-auto" aria-label="Not included" />
  }
  return <span className="text-xs text-white/60 font-medium" style={{ fontFamily: "var(--font-mono)" }}>{value}</span>
}

function SectionHeading({
  eyebrow,
  title,
  titleAccent,
  subtitle,
}: {
  eyebrow: string
  title: string
  titleAccent?: string
  subtitle: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="text-center mb-14 md:mb-16 max-w-4xl mx-auto"
    >
      <div className="mono-badge mx-auto mb-6">
        <span className="dot" style={{ background: '#f59e0b' }} />
        {eyebrow}
      </div>
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-serif)" }}>
        {title}{" "}
        {titleAccent ? (
          <span className="gradient-text-amber">
            {titleAccent}
          </span>
        ) : null}
      </h2>
      <p className="text-base sm:text-lg text-white/40 leading-relaxed max-w-2xl mx-auto">{subtitle}</p>
    </motion.div>
  )
}

export default function SponsorshipPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<"login" | "signup">("login")
  const [highlightTier, setHighlightTier] = useState<TierId>("gold")

  const handleAuth = (type: "login" | "signup") => {
    setAuthType(type)
    setShowAuthModal(true)
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white">
      {/* Ambient glow backgrounds */}
      <div className="ambient-glow w-96 h-96 top-0 left-1/4" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)' }} />
      <div className="ambient-glow w-96 h-96 bottom-0 right-1/4" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06), transparent 70%)' }} />

      <Header onAuth={handleAuth} />
      {showAuthModal && (
        <AuthModal type={authType} onClose={() => setShowAuthModal(false)} />
      )}

      {/* Hero */}
      <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-32 overflow-hidden min-h-[85vh] flex items-center">
        {/* Video Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[#050505]/70 z-10 mix-blend-multiply" />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-10" />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <div className="mono-badge mx-auto mb-8">
                <span className="dot" style={{ background: '#f59e0b' }} />
                {SPONSORSHIP_HERO.badge}
              </div>

              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-8 relative" style={{ fontFamily: "var(--font-serif)" }}>
                <span className="text-white/90">Partner with </span>
                <br />
                <span className="gradient-text-amber">
                  {SPONSORSHIP_HERO.title}
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed max-w-2xl mx-auto">
                {SPONSORSHIP_HERO.subtitle}
                <br />
                <span className="text-white/70" style={{ fontFamily: "var(--font-mono)" }}>
                  {SPONSORSHIP_HERO.dates} · {SPONSORSHIP_HERO.venue}
                </span>
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="#tiers"
                  className="btn-premium btn-green text-sm"
                >
                  View Sponsorship Tiers
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="#contact"
                  className="btn-premium text-sm"
                >
                  Contact Us
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Spark */}
      <section id="ai-spark" className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <div className="mono-badge mb-6">
                <span className="dot" style={{ background: '#f59e0b' }} />
                CodeNeuraX Event
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-serif)" }}>
                AI Spark <span className="gradient-text-amber">2026</span>
              </h2>
              <p className="text-white/60 leading-relaxed mb-4 text-base sm:text-lg">{AI_SPARK_OVERVIEW.description}</p>
              <p className="text-white/40 leading-relaxed mb-8 text-sm">{AI_SPARK_OVERVIEW.value}</p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {AI_SPARK_OVERVIEW.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-xs text-white/60 glass-card p-3">
                    <Check className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative w-full max-w-lg mx-auto lg:max-w-none aspect-[4/5] sm:aspect-square rounded-3xl overflow-hidden glass-card p-3"
            >
              <Image
                src={AI_SPARK_OVERVIEW.image}
                alt="AI Sparks 2026 by CodeNeuraX"
                fill
                className="object-contain p-2 sm:p-4"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section className="section-padding relative overflow-hidden border-t border-white/[0.04]">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <SectionHeading
            eyebrow="AI Spark Speakers"
            title="Featured"
            titleAccent="Speakers"
            subtitle="Industry voices amplifying your brand to 200K+ digital followers."
          />

          <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {AI_SPARK_SPEAKERS.map((speaker, idx) => (
              <motion.div
                key={speaker.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <SponsorshipPersonCard person={speaker} photoSize="speaker" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visibility */}
      <section className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <SectionHeading
            eyebrow="The Smart Network"
            title="Brand Visibility &"
            titleAccent="Outreach"
            subtitle="Maximum reach across campus and digital audiences."
          />

          <div className="max-w-4xl mx-auto">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-white/40 text-center leading-relaxed mb-10 text-sm sm:text-base"
            >
              Sponsors receive extensive visibility through our comprehensive event promotion campaign—university-wide
              digital displays, social media marketing, WhatsApp community outreach, and prominent placement on event
              posters, banners, standees, and official communications. Exposure is further amplified by our guest
              speaker&apos;s social media presence of over 200,000 followers.
            </motion.p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {VISIBILITY_OPPORTUNITIES.map((item, idx) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 glass-card px-5 py-4"
                >
                  <Megaphone className="w-4 h-4 text-amber-400/80 shrink-0" />
                  <span className="text-xs text-white/60">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section id="tiers" className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <SectionHeading
            eyebrow="Sponsorship Benefits"
            title="Choose Your"
            titleAccent="Tier"
            subtitle="Silver, Gold, and Platinum packages tailored for your brand goals."
          />

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {SPONSORSHIP_TIERS.map((tier) => (
              <button
                key={tier.id}
                type="button"
                onClick={() => setHighlightTier(tier.id)}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all border ${
                  highlightTier === tier.id
                    ? "bg-white/10 border-white/30 text-white"
                    : "border-white/[0.06] text-white/30 hover:text-white/60"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {tier.name} — {tier.price}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-16">
            {SPONSORSHIP_TIERS.map((tier) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative rounded-2xl p-8 glass-card transition-all ${
                  highlightTier === tier.id
                    ? "border-amber-500/40 bg-white/[0.04] scale-[1.02] shadow-xl"
                    : ""
                }`}
              >
                {tier.id === "gold" && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[0.65rem] font-bold uppercase tracking-wider bg-amber-500 text-black px-3 py-0.5 rounded-full" style={{ fontFamily: "var(--font-mono)" }}>
                    Popular
                  </span>
                )}
                <p
                  className={`text-xs font-semibold uppercase tracking-wider mb-2`}
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {tier.name}
                </p>
                <p className="text-3xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-serif)" }}>{tier.price}</p>
                <button
                  type="button"
                  onClick={() => setHighlightTier(tier.id)}
                  className="w-full py-2 rounded-xl border border-white/[0.08] text-xs font-medium text-white/50 hover:bg-white/5 hover:text-white transition-colors"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Highlight in table
                </button>
              </motion.div>
            ))}
          </div>

          {/* Branding table */}
          <div className="max-w-6xl mx-auto mb-16 overflow-x-auto glass-card p-4">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="p-4 text-white/40 font-medium text-xs uppercase" style={{ fontFamily: "var(--font-mono)" }}>Branding Benefits</th>
                  {SPONSORSHIP_TIERS.map((t) => (
                    <th
                      key={t.id}
                      className={`p-4 text-center text-xs font-bold ${
                        highlightTier === t.id ? "text-white bg-white/5" : "text-white/40"
                      }`}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {t.name}
                      <div className="text-[0.65rem] font-normal text-white/30 mt-1">{t.price}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BRANDING_BENEFITS.map((row) => (
                  <tr key={row.label} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="p-4 text-xs text-white/60">{row.label}</td>
                    <td className={`p-4 text-center ${highlightTier === "silver" ? "bg-white/5" : ""}`}>
                      <TierCell value={row.silver} />
                    </td>
                    <td className={`p-4 text-center ${highlightTier === "gold" ? "bg-white/5" : ""}`}>
                      <TierCell value={row.gold} />
                    </td>
                    <td className={`p-4 text-center ${highlightTier === "platinum" ? "bg-white/5" : ""}`}>
                      <TierCell value={row.platinum} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Engagement table */}
          <div className="max-w-6xl mx-auto overflow-x-auto glass-card p-4">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="p-4 text-white/40 font-medium text-xs uppercase" style={{ fontFamily: "var(--font-mono)" }}>Engagement Benefits</th>
                  {SPONSORSHIP_TIERS.map((t) => (
                    <th
                      key={t.id}
                      className={`p-4 text-center text-xs font-bold ${
                        highlightTier === t.id ? "text-white bg-white/5" : "text-white/40"
                      }`}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {t.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ENGAGEMENT_BENEFITS.map((row) => (
                  <tr key={row.label} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                    <td className="p-4 text-xs text-white/60">{row.label}</td>
                    <td className={`p-4 text-center ${highlightTier === "silver" ? "bg-white/5" : ""}`}>
                      <TierCell value={row.silver} />
                    </td>
                    <td className={`p-4 text-center ${highlightTier === "gold" ? "bg-white/5" : ""}`}>
                      <TierCell value={row.gold} />
                    </td>
                    <td className={`p-4 text-center ${highlightTier === "platinum" ? "bg-white/5" : ""}`}>
                      <TierCell value={row.platinum} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <SectionHeading
            eyebrow="Community Partners"
            title="Our"
            titleAccent="Network"
            subtitle="Collaborating with universities, hackathon communities, and speakers from top product companies."
          />

          <div className="max-w-5xl mx-auto mb-14">
            <p className="text-center text-white/30 text-xs font-semibold uppercase tracking-wider mb-6" style={{ fontFamily: "var(--font-mono)" }}>
              Speakers from Google, Amazon, Microsoft & Flipkart
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
              {SPEAKER_ALUMNI_COMPANIES.map((company) => (
                <div
                  key={company.name}
                  className="flex flex-col items-center gap-2 w-28 md:w-36"
                  title={company.name}
                >
                  <div className="relative w-24 h-14 md:w-32 md:h-16 rounded-xl bg-white/5 border border-white/[0.06] overflow-hidden px-3 py-2">
                    <Image
                      src={company.image}
                      alt={company.name}
                      fill
                      className="object-contain p-1"
                      sizes="128px"
                    />
                  </div>
                  <span className="text-[0.65rem] text-white/40" style={{ fontFamily: "var(--font-mono)" }}>{company.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 max-w-5xl mx-auto">
            {COMMUNITY_PARTNERS.map((partner) => (
              <div
                key={partner.name}
                className="flex flex-col items-center gap-3 w-28 md:w-32"
                title={partner.name}
              >
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/5 border border-white/[0.06] overflow-hidden">
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    fill
                    className="object-contain p-2"
                    sizes="96px"
                  />
                </div>
                <span className="text-[0.65rem] text-white/40 text-center leading-tight" style={{ fontFamily: "var(--font-mono)" }}>{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeading
            eyebrow="Featured Events"
            title="Expert-Led"
            titleAccent="Sessions"
            subtitle="Past and ongoing sessions that built our community reach and credibility."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED_EVENTS.map((event, index) => (
              <motion.article
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="glass-card overflow-hidden h-full flex flex-col group"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-sm font-bold text-white mb-2 line-clamp-2 group-hover:text-amber-300 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed line-clamp-3">{event.description}</p>
                </div>
              </motion.article>
            ))}
          </div>

          <p className="text-center mt-10">
            <Link href="/events" className="btn-premium text-xs">
              View all events →
            </Link>
          </p>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <SectionHeading
            eyebrow="Our Team"
            title="The People Behind"
            titleAccent="AI Spark"
            subtitle="Driven by innovation, creativity, and collaboration."
          />

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
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-mono)" }}>
                  <Users className="w-4 h-4 text-amber-400" />
                  {group.title}
                </h3>
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

      {/* Contact */}
      <section id="contact" className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <SectionHeading
            eyebrow="Contact Us"
            title="Become a"
            titleAccent="Sponsor"
            subtitle="Reach out to discuss partnership opportunities for AI Spark 2026."
          />

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
            {SPONSORSHIP_CONTACTS.map((contact) => (
              <motion.div
                key={contact.email}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card p-6"
              >
                <h3 className="text-base font-bold text-white mb-1">{contact.name}</h3>
                <p className="text-amber-400/80 text-xs mb-5" style={{ fontFamily: "var(--font-mono)" }}>{contact.role}</p>
                <div className="space-y-2">
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400/80" />
                    {contact.phone}
                  </a>
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs break-all"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-400/80" />
                    {contact.email}
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-white/30 text-xs mb-2" style={{ fontFamily: "var(--font-mono)" }}>General inquiries</p>
            <a
              href={`mailto:${SPONSORSHIP_EMAIL}`}
              className="inline-flex items-center gap-2 text-base font-semibold text-amber-400/90 hover:text-amber-300"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <Mail className="w-4 h-4" />
              {SPONSORSHIP_EMAIL}
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.04] py-10 text-center">
        <p className="text-white/20 text-xs tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>Team CodeNeuraX 💙</p>
      </footer>
    </div>
  )
}
