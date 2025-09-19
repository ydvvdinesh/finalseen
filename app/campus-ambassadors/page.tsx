"use client"

import { useMemo, useState } from "react"
import Header from "@/components/header"
import AuthModal from "@/components/auth-modal"
import { motion } from "framer-motion"
import { Search, GraduationCap, MapPin, Send, Users, Mail, Linkedin } from "lucide-react"
import Image from "next/image"
import { AMBASSADORS } from "@/data/ambassadors"

type Ambassador = typeof AMBASSADORS[number]

export default function CampusAmbassadorsPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<"login" | "signup">("login")

  const [query, setQuery] = useState("")
  const [records] = useState<Ambassador[] | null>(AMBASSADORS)

  const handleAuth = (type: "login" | "signup") => {
    setAuthType(type)
    setShowAuthModal(true)
  }

  // Search: show results ONLY when searching, and match by university only
  const source = records && records.length > 0 ? records : AMBASSADORS
  const ordered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const match: Ambassador[] = []
    for (const a of source) {
      const hay = (a.university || "").toLowerCase()
      if (hay.includes(q)) match.push(a)
    }
    return match
  }, [query, source])

  // Join form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [university, setUniversity] = useState("")
  const [message, setMessage] = useState("")
  const [phone, setPhone] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const submitJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setSuccess(null)
    setError(null)
    try {
      const finalPhotoUrl = photoUrl
      const res = await fetch("/api/ambassador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, university, message, phone, linkedin, photoUrl: finalPhotoUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to submit")
      setSuccess("Thanks! We received your application. We'll reach out soon.")
      setName("")
      setEmail("")
      setUniversity("")
      setMessage("")
      setPhone("")
      setLinkedin("")
      setPhotoUrl("")
      // Manage ambassadors list in data/ambassadors.ts manually
    } catch (err: any) {
      setError(err?.message || "Something went wrong")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <Header onAuth={handleAuth} />

      {/* Hero */}
      <section className="relative pt-32 pb-14">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 bg-blue-800/40 border border-blue-700/50 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
              <Users className="w-5 h-5 text-blue-300" />
              <span className="text-blue-200 text-sm font-medium tracking-wide">Campus Ambassadors</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">Lead your</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">Campus / University</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-3xl">
              Join CodeNeuraX as a Campus Ambassador for (2025-26). Organize events, grow communities, and unlock exclusive perks.

            </p>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="relative pb-8">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 bg-gray-900/50 border border-gray-800/60 rounded-2xl px-4 py-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search university"
                className="w-full bg-transparent outline-none text-white placeholder:text-gray-500"
              />
            </div>
            <p className="text-gray-400 text-sm mt-3">Showing {ordered.length} of 20 result{ordered.length === 1 ? "" : "s"}</p>
          </div>
        </div>
      </section>

    {/* Ambassadors list */}
<section className="relative pb-16">
  <div className="container mx-auto px-4 relative z-10">
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {ordered.map((a, idx) => (
        <motion.div
          key={a.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.05 }}
          viewport={{ once: true }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/60 rounded-3xl p-8 hover:border-blue-500/30 transition"
        >
          <div className="flex flex-col gap-5 items-center">
            {a.avatar ? (
              <div className="relative h-28 w-28 rounded-full overflow-hidden">
                <Image
                  src={a.avatar}
                  alt={a.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="h-28 w-28 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center text-white text-2xl font-bold">
                {a.name.split(" ").map((w) => w[0]).join("")}
              </div>
            )}
            <div className="w-full">
              <h3 className="text-xl font-semibold text-white">{a.name}</h3>

              {/* Static tenure line */}
              <p className="text-gray-400 text-sm mt-1">Tenure (2025–26)</p>

              <div className="flex items-center gap-2 text-gray-300 mt-1">
                <GraduationCap className="w-4 h-4" />
                <span className="line-clamp-2">{a.university}</span>
              </div>

              {a.department && (
                <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {a.department}
                    {a.year ? ` • ${a.year}` : ""}
                  </span>
                </div>
              )}

              {(a.email || a.socials?.length) && (
                <div className="mt-4">
                  <div className="text-gray-400 text-xs mb-2">
                    Contact information
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {a.email && (
                      <a
                        href={`mailto:${a.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-800/70 hover:bg-gray-800 text-gray-200 text-sm"
                      >
                        <Mail className="w-4 h-4" /> Email
                      </a>
                    )}
                    {a.socials?.find(
                      (s) => s.platform.toLowerCase() === "linkedin"
                    ) && (
                      <a
                        href={
                          a.socials!.find(
                            (s) => s.platform.toLowerCase() === "linkedin"
                          )!.url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white text-sm"
                      >
                        <Linkedin className="w-4 h-4" /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</section>


      {/* Join form */}
      <section className="relative pb-24 mt-24" id="join">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="max-w-4xl mx-auto bg-gray-900/40 border border-gray-800/60 rounded-3xl p-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Join as Campus Ambassador</h2>
            <p className="text-gray-300 mb-6">Tell us about yourself and your campus. We'll review and contact you.</p>

            {success && <div className="mb-4 text-green-400 font-semibold">{success}</div>}
            {error && <div className="mb-4 text-red-400 font-semibold">{error}</div>}

            <form onSubmit={submitJoin} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="name">Full Name</label>
                <input id="name" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" className="w-full px-4 py-3 rounded-xl bg-gray-800/80 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@email.com" className="w-full px-4 py-3 rounded-xl bg-gray-800/80 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="phone">Phone Number</label>
                <input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Your phone number" className="w-full px-4 py-3 rounded-xl bg-gray-800/80 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="linkedin">LinkedIn URL</label>
                <input id="linkedin" type="url" value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://www.linkedin.com/in/username" className="w-full px-4 py-3 rounded-xl bg-gray-800/80 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-gray-300 mb-2" htmlFor="university">University / College</label>
                <input id="university" value={university} onChange={e => setUniversity(e.target.value)} required placeholder="Your university/college name" className="w-full px-4 py-3 rounded-xl bg-gray-800/80 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="photo">Upload Photo (optional)</label>
                <input id="photo" type="file" accept="image/*" className="w-full text-sm text-gray-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600/80 file:text-white hover:file:bg-blue-600/90" />
              </div>
              <div>
                <label className="block text-gray-300 mb-2" htmlFor="photoUrl">or Photo URL</label>
                <input id="photoUrl" type="url" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="https://example.com/your-photo.jpg" className="w-full px-4 py-3 rounded-xl bg-gray-800/80 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-gray-300 mb-2" htmlFor="message">Why do you want to be an ambassador?</label>
                <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={5} placeholder="Share your experience, community work, or plans" className="w-full px-4 py-3 rounded-xl bg-gray-800/80 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="sm:col-span-2">
                <button disabled={sending} className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 rounded-xl font-semibold hover:scale-[1.02] transition disabled:opacity-60">
                  <Send className="w-4 h-4" />
                  {sending ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {showAuthModal && <AuthModal type={authType} onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}


