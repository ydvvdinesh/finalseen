"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Send, Mic2 } from "lucide-react"

type SpeakerApplicationFormProps = {
  eventId: number
  eventTitle: string
  onClose: () => void
}

export default function SpeakerApplicationForm({
  eventId,
  eventTitle,
  onClose,
}: SpeakerApplicationFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [expertise, setExpertise] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setSuccess(null)
    setError(null)
    try {
      const res = await fetch("/api/speaker-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          linkedin,
          expertise,
          message,
          eventId,
          eventTitle,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to submit")
      setSuccess("Application sent! We'll review and get back to you soon.")
      setName("")
      setEmail("")
      setPhone("")
      setLinkedin("")
      setExpertise("")
      setMessage("")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSending(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg mac-window shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 sm:p-8 relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute top-6 right-6 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <Mic2 className="w-5 h-5 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>Apply as Speaker</h3>
            </div>
            <p className="text-white/40 text-xs mb-6 line-clamp-2" style={{ fontFamily: "var(--font-mono)" }}>{eventTitle}</p>

            {success && (
              <p className="mb-4 text-green-400 text-xs bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                {success}
              </p>
            )}
            {error && (
              <p className="mb-4 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                {error}
              </p>
            )}

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-white/40 text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
                  Full name *
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-mac"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-white/40 text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
                  Email *
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-mac"
                  placeholder="you@email.com"
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/40 text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
                    Phone
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-mac"
                    placeholder="+91 ..."
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
                    LinkedIn
                  </label>
                  <input
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="input-mac"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/40 text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
                  Your expertise / talk topic *
                </label>
                <input
                  required
                  value={expertise}
                  onChange={(e) => setExpertise(e.target.value)}
                  className="input-mac"
                  placeholder="e.g. GenAI in production, DSA for FAANG"
                />
              </div>
              <div>
                <label className="block text-white/40 text-xs font-medium mb-1.5 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
                  Why you&apos;re a great fit & your experience *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input-mac resize-none"
                  placeholder="Brief bio, past talks, projects, or what you'd cover in this session..."
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full btn-premium justify-center"
              >
                <Send className="w-4 h-4 mr-1" />
                {sending ? "Sending..." : "Submit Application"}
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
