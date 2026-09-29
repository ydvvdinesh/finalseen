"use client"

import { useState } from "react"
import Header from "@/components/header"
import AuthModal from "@/components/auth-modal"
import { motion } from "framer-motion"
import { Briefcase, MapPin, Clock, ArrowLeft, CheckCircle2, ArrowRight, Star, Users, Zap, Trophy, ShieldCheck, HeartHandshake, Target } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface PositionPageProps {
  params: {
    id: string
  }
}

export default function PositionPage({ params }: PositionPageProps) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<"login" | "signup">("login")

  const handleAuth = (type: "login" | "signup") => {
    setAuthType(type)
    setShowAuthModal(true)
  }

  // Form State
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [university, setUniversity] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const positionsData: { [key: string]: any } = {
    "campus-ambassador": {
      id: "campus-ambassador",
      title: "Campus Ambassador",
      department: "Community",
      location: "Remote / On-Campus",
      duration: "1 Academic Year",
      image: "/images/CodeNeuraX.webp",
      description: "Lead your campus community, organize events, and be the face of CodeNeuraX at your university. Perfect for passionate students looking to build their network and leadership skills.",
      highlights: [
        "Lead your campus community",
        "Direct mentorship from founders",
        "Organize exclusive hackathons",
        "Build a massive professional network"
      ],
      responsibilities: [
        "Represent CodeNeuraX actively on your university campus.",
        "Organize local meetups, webinars, and hackathons with our support.",
        "Promote CodeNeuraX events and initiatives to your peers.",
        "Build and maintain a vibrant community of tech enthusiasts.",
        "Gather feedback from students to help improve our offerings."
      ],
      requirements: [
        "Currently enrolled in a university/college program.",
        "Strong communication, networking, and leadership skills.",
        "Passionate about technology, coding, and community building.",
        "Active presence on social media and within campus clubs."
      ],
      perks: [
        "Exclusive CodeNeuraX merchandise and goodies.",
        "Direct mentorship sessions from the core team.",
        "Official Certificate of Leadership and LOR.",
        "Networking opportunities with industry experts.",
        "Free access to all premium CodeNeuraX events."
      ]
    },
    "convener": {
      id: "convener",
      title: "Convener of the Community",
      department: "Community Management",
      location: "Remote",
      duration: "6 Months - 1 Year",
      image: "/images/CodeNeuraX.webp",
      description: "Take charge of our community initiatives. You'll be managing discussions, coordinating with speakers, and ensuring our community remains active, engaging, and supportive.",
      highlights: [
        "Manage thousands of members",
        "Host live sessions and AMAs",
        "Shape the community strategy",
        "Connect with industry leaders"
      ],
      responsibilities: [
        "Moderate and engage with the community across WhatsApp and Discord.",
        "Plan and execute online events, AMAs, and weekly coding challenges.",
        "Onboard new members and ensure a welcoming, inclusive environment.",
        "Collaborate closely with the core team to strategize community growth.",
        "Identify, reach out to, and invite guest speakers for our sessions."
      ],
      requirements: [
        "Prior experience in community management or event organization.",
        "Excellent written and verbal communication skills.",
        "Deep familiarity with the tech ecosystem and developer communities.",
        "Self-motivated with exceptionally strong organizational skills."
      ],
      perks: [
        "Key role in major community decisions and overall strategy.",
        "Backstage access to exclusive tech events and workshops.",
        "Outstanding Letter of Recommendation from CodeNeuraX leadership.",
        "Hands-on management, operations, and leadership experience.",
        "Direct one-on-one networking with guest speakers."
      ]
    }
  }

  const position = positionsData[params.id]

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setSuccess(null)
    setError(null)
    try {
      const res = await fetch("/api/ambassador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, university, message, phone, linkedin, photoUrl: "" }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to submit")
      setSuccess("Thanks! We received your application. We'll reach out soon.")
      setName("")
      setEmail("")
      setPhone("")
      setUniversity("")
      setLinkedin("")
      setMessage("")
    } catch (err: any) {
      setError(err?.message || "Something went wrong")
    } finally {
      setSending(false)
    }
  }

  const handleScrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const target = document.getElementById("apply-form")
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  if (!position) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="text-center glass-card p-10 max-w-md">
          <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-serif)" }}>Position Not Found</h1>
          <p className="text-white/40 mb-8 text-sm">The position you're looking for doesn't exist.</p>
          <Link
            href="/work-with-us"
            className="btn-premium text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Positions
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white">
      {/* Ambient Background */}
      <div className="ambient-glow w-[500px] h-[500px] -top-20 -left-20" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.08), transparent 70%)' }} />
      <div className="ambient-glow w-[500px] h-[500px] top-1/2 -right-20" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.06), transparent 70%)' }} />

      <Header onAuth={handleAuth} />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto mb-8">
            <Link
              href="/work-with-us"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white/60 bg-white/[0.03] border border-white/[0.06] hover:text-white hover:border-white/20 transition-all w-fit"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Positions</span>
            </Link>
          </div>
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              {/* Image */}
              <div className="relative">
                <div className="relative h-96 rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl">
                  <Image
                    src={position.image}
                    alt={position.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-6 left-6">
                    <span
                      className="bg-purple-500/20 backdrop-blur-md text-purple-300 px-4 py-1.5 rounded-full text-xs font-semibold border border-purple-500/30"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      WE'RE HIRING
                    </span>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
                  {position.title}
                </h1>
                <p className="text-base sm:text-lg text-white/40 mb-8 leading-relaxed">
                  {position.description}
                </p>

                {/* Info Badges */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                      <Briefcase className="w-4 h-4 text-cyan-400/80" />
                      <div>
                        <p className="text-[0.65rem] text-white/30 uppercase font-semibold" style={{ fontFamily: "var(--font-mono)" }}>Department</p>
                        <span className="text-sm font-medium text-white/80">{position.department}</span>
                      </div>
                    </div>
                  </div>
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-pink-400/80" />
                      <div>
                        <p className="text-[0.65rem] text-white/30 uppercase font-semibold" style={{ fontFamily: "var(--font-mono)" }}>Location</p>
                        <span className="text-sm font-medium text-white/80">{position.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-amber-400/80" />
                      <div>
                        <p className="text-[0.65rem] text-white/30 uppercase font-semibold" style={{ fontFamily: "var(--font-mono)" }}>Duration</p>
                        <span className="text-sm font-medium text-white/80">{position.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-green-400/80" />
                      <div>
                        <p className="text-[0.65rem] text-white/30 uppercase font-semibold" style={{ fontFamily: "var(--font-mono)" }}>Team Size</p>
                        <span className="text-sm font-medium text-white/80">Growing Fast</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                {position.id === "campus-ambassador" ? (
                  <Link
                    href="/campus-ambassadors/register"
                    className="btn-premium btn-green text-sm inline-flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Apply Now
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                ) : (
                  <a
                    href="#apply-form"
                    onClick={handleScrollToForm}
                    className="btn-premium btn-green text-sm"
                  >
                    <Zap className="w-4 h-4" />
                    Apply Now
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Role Highlights */}
      <section className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                Role <span className="gradient-text-purple">Highlights</span>
              </h2>
              <p className="text-white/40 text-base max-w-2xl mx-auto">What you can expect from this incredible opportunity.</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {position.highlights.map((highlight: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 text-center group"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Star className="w-5 h-5 text-purple-400/80" />
                  </div>
                  <h3 className="text-white/80 font-medium text-sm leading-snug">{highlight}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Responsibilities & Requirements */}
      <section className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <Target className="w-6 h-6 text-cyan-400/80" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>What You'll Do</h2>
                </div>
                <div className="space-y-3">
                  {position.responsibilities.map((item: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3 p-4 rounded-xl glass-card"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-400/80 shrink-0 mt-1" />
                      <span className="text-white/60 text-sm leading-relaxed">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <ShieldCheck className="w-6 h-6 text-pink-400/80" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>Requirements</h2>
                </div>
                <div className="space-y-3">
                  {position.requirements.map((item: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3 p-4 rounded-xl glass-card"
                    >
                      <ArrowRight className="w-4 h-4 text-pink-400/80 shrink-0 mt-1" />
                      <span className="text-white/60 text-sm leading-relaxed">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Perks Section */}
      <section className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="mono-badge mx-auto mb-6">
                <span className="dot" style={{ background: '#22c55e' }} />
                Perks & Benefits
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                What's In It <span className="gradient-text-amber">For You?</span>
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              {position.perks.map((item: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 p-5 rounded-xl glass-card"
                >
                  <Trophy className="w-5 h-5 text-amber-400/80 shrink-0" />
                  <span className="text-white/70 text-sm font-medium">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Application / CTA Section */}
      {position.id === "campus-ambassador" ? (
        <section className="section-padding relative border-t border-white/[0.04]">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto glass-card p-8 sm:p-12 text-center"
            >
              <div className="mono-badge mx-auto mb-6">
                <span className="dot" style={{ background: "#a855f7" }} />
                Campus Ambassador Portal
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-serif)" }}>
                Ready to Join <span className="gradient-text-purple">CodeNeuraX</span>?
              </h2>
              <p className="text-white/40 text-sm sm:text-base mb-8 leading-relaxed max-w-lg mx-auto">
                Submit your profile, college details, and photo directly on our dedicated Campus Ambassador registration portal to get your unique Ambassador ID and get featured!
              </p>
              <Link
                href="/campus-ambassadors/register"
                className="btn-premium btn-green text-sm inline-flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Apply on Campus Ambassador Portal
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          </div>
        </section>
      ) : (
        <section id="apply-form" className="section-padding relative border-t border-white/[0.04]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12 max-w-6xl mx-auto">
              {/* Left: Heading & Description */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="lg:w-5/12"
              >
                <div className="mono-badge mb-6">
                  <span className="dot" />
                  Next Steps
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
                  Apply <span className="gradient-text-cyan">Now</span>
                </h2>
                <p className="text-base text-white/40 leading-relaxed mb-6">
                  Ready to join the CodeNeuraX team? Fill out the application form and tell us why you'd be a great fit for the <strong className="text-white/80">{position.title}</strong> role!
                </p>
              </motion.div>

              {/* Right: Mac Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="lg:w-7/12"
              >
                <div className="mac-window">
                  <form onSubmit={submitApplication} className="p-6 sm:p-8">
                    {success && (
                      <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs font-semibold text-center flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        {success}
                      </div>
                    )}
                    {error && (
                      <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold text-center">
                        {error}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }} htmlFor="name">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="name"
                          type="text"
                          className="input-mac"
                          placeholder="John Doe"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }} htmlFor="email">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          className="input-mac"
                          placeholder="john@example.com"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }} htmlFor="phone">
                          Mobile Number <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          className="input-mac"
                          placeholder="+91 9876543210"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }} htmlFor="linkedin">
                          LinkedIn URL <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="linkedin"
                          type="url"
                          className="input-mac"
                          placeholder="https://linkedin.com/in/johndoe"
                          value={linkedin}
                          onChange={e => setLinkedin(e.target.value)}
                          required
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }} htmlFor="university">
                          University / College <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="university"
                          type="text"
                          className="input-mac"
                          placeholder="University Name"
                          value={university}
                          onChange={e => setUniversity(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }} htmlFor="message">
                        Why do you want to apply? <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        id="message"
                        className="input-mac"
                        placeholder="Share your experience, passion, and what you hope to achieve..."
                        rows={4}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full btn-premium justify-center"
                      disabled={sending}
                    >
                      {sending ? "Submitting Application..." : "Submit Application"}
                      {!sending && <ArrowRight className="w-4 h-4 ml-1" />}
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-10 relative">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/20 text-xs tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>Team CodeNeuraX 💙</p>
        </div>
      </footer>

      {showAuthModal && <AuthModal type={authType} onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}
