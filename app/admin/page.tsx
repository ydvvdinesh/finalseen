"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Briefcase,
  Trophy,
  Zap,
  Send,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
  Users,
  XCircle,
  GraduationCap,
  Linkedin,
} from "lucide-react"
import { CommunityPost } from "@/components/community-feed"

interface CampusAmbassador {
  id: string
  ref_no: string
  name: string
  email: string
  college: string
  phone: string
  address: string
  linkedin_url: string
  photo_url: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  approved_at: string | null
}

export default function AdminBroadcastPage() {
  // Authentication state
  const [adminKey, setAdminKey] = useState<string>("")
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [passInput, setPassInput] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [verifying, setVerifying] = useState<boolean>(false)

  // Broadcast Form State
  const [category, setCategory] = useState<"internship" | "hackathon" | "news">("internship")
  const [title, setTitle] = useState("")
  const [organizer, setOrganizer] = useState("")
  const [description, setDescription] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [badge, setBadge] = useState("")
  const [deadline, setDeadline] = useState("")
  const [location, setLocation] = useState("")
  const [stipendOrPrize, setStipendOrPrize] = useState("")

  const [loading, setLoading] = useState(false)
  const [postsLoading, setPostsLoading] = useState(false)
  const [activePosts, setActivePosts] = useState<CommunityPost[]>([])
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  )

  // Tab state
  const [activeTab, setActiveTab] = useState<"broadcast" | "ambassadors">("broadcast")

  // Ambassador state
  const [ambassadors, setAmbassadors] = useState<CampusAmbassador[]>([])
  const [ambassadorsLoading, setAmbassadorsLoading] = useState(false)
  const [ambassadorFeedback, setAmbassadorFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  // Check saved admin key on load
  useEffect(() => {
    const saved = sessionStorage.getItem("cnx_admin_broadcast_key")
    if (saved) {
      verifyAndLogin(saved)
    }
  }, [])

  const verifyAndLogin = async (key: string) => {
    const cleanKey = key.trim()
    if (!cleanKey) {
      setAuthError("Please enter the admin passcode.")
      return
    }
    try {
      setVerifying(true)
      setAuthError(null)
      const res = await fetch("/api/admin/broadcast", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_key: cleanKey }),
      })

      if (res.ok) {
        setAdminKey(cleanKey)
        setIsAuthenticated(true)
        sessionStorage.setItem("cnx_admin_broadcast_key", cleanKey)
        fetchActivePosts()
        fetchAmbassadors(cleanKey)
      } else {
        const errorData = await res.json().catch(() => null)
        sessionStorage.removeItem("cnx_admin_broadcast_key")
        setIsAuthenticated(false)
        setAuthError(errorData?.error || "Incorrect Admin Master Passcode. Access denied.")
      }
    } catch {
      setAuthError("Network error. Please try again.")
    } finally {
      setVerifying(false)
    }
  }

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    verifyAndLogin(passInput)
  }

  const handleLockPortal = () => {
    sessionStorage.removeItem("cnx_admin_broadcast_key")
    setAdminKey("")
    setIsAuthenticated(false)
    setPassInput("")
    setFeedback(null)
  }

  // Fetch current active 24h posts
  const fetchActivePosts = async () => {
    try {
      setPostsLoading(true)
      const res = await fetch("/api/community-feed", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setActivePosts(data.posts || [])
      }
    } catch (err) {
      console.error("Failed to load active posts:", err)
    } finally {
      setPostsLoading(false)
    }
  }

  // Handle Publish
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedback(null)

    if (!title.trim() || !description.trim() || !linkUrl.trim()) {
      setFeedback({ type: "error", message: "Title, Description, and Link URL are required." })
      return
    }

    try {
      setLoading(true)
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          admin_key: adminKey,
          category,
          title,
          organizer,
          description,
          link_url: linkUrl,
          badge,
          deadline,
          location,
          stipend_or_prize: stipendOrPrize,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to publish broadcast.")
      }

      setFeedback({
        type: "success",
        message: "Broadcast published successfully! It is now live on the website for 24 hours. " +
          (data.emailBlast?.status === "completed"
            ? `📧 Email sent to ${data.emailBlast.sent} registered users.${data.emailBlast.failed > 0 ? ` (${data.emailBlast.failed} failed)` : ""}`
            : data.emailBlast?.status === "sending_in_background"
            ? "📧 Emails are being sent in the background..."
            : "📧 Email blast skipped (marketing SMTP not configured yet)."),
      })

      // Reset form
      setTitle("")
      setOrganizer("")
      setDescription("")
      setLinkUrl("")
      setBadge("")
      setDeadline("")
      setLocation("")
      setStipendOrPrize("")

      // Refresh list
      fetchActivePosts()
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "An error occurred while publishing." })
    } finally {
      setLoading(false)
    }
  }

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this broadcast from the live website?")) return

    try {
      const res = await fetch(`/api/admin/broadcast?id=${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-key": adminKey,
        },
      })

      if (res.ok) {
        setActivePosts((prev) => prev.filter((p) => p.id !== id))
        setFeedback({ type: "success", message: "Post removed from website successfully." })
      } else {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete post.")
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Failed to delete post." })
    }
  }

  // ── Ambassador Management Functions ──────────────────────────────
  const fetchAmbassadors = async (key?: string) => {
    try {
      setAmbassadorsLoading(true)
      const res = await fetch("/api/admin/campus-ambassador", {
        headers: { "x-admin-key": key || adminKey },
      })
      if (res.ok) {
        const data = await res.json()
        setAmbassadors(data.ambassadors || [])
      }
    } catch (err) {
      console.error("Failed to load ambassadors:", err)
    } finally {
      setAmbassadorsLoading(false)
    }
  }

  const handleAmbassadorAction = async (id: string, action: 'approve' | 'reject') => {
    setProcessingIds(prev => new Set(prev).add(id))
    setAmbassadorFeedback(null)
    try {
      const res = await fetch("/api/admin/campus-ambassador", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({ id, action }),
      })
      if (res.ok) {
        setAmbassadorFeedback({ type: "success", message: `Ambassador ${action === 'approve' ? 'approved' : 'rejected'} successfully.` })
        fetchAmbassadors()
      } else {
        const data = await res.json()
        throw new Error(data.error || `Failed to ${action} ambassador.`)
      }
    } catch (err: any) {
      setAmbassadorFeedback({ type: "error", message: err.message || `Failed to ${action} ambassador.` })
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const handleDeleteAmbassador = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this ambassador profile?")) return
    setProcessingIds(prev => new Set(prev).add(id))
    try {
      const res = await fetch(`/api/admin/campus-ambassador?id=${id}`, {
        method: "DELETE",
        headers: { "x-admin-key": adminKey },
      })
      if (res.ok) {
        setAmbassadors(prev => prev.filter(a => a.id !== id))
        setAmbassadorFeedback({ type: "success", message: "Ambassador profile deleted." })
      } else {
        const data = await res.json()
        throw new Error(data.error || "Failed to delete ambassador.")
      }
    } catch (err: any) {
      setAmbassadorFeedback({ type: "error", message: err.message || "Failed to delete." })
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const pendingAmbassadors = ambassadors.filter(a => a.status === 'pending')
  const approvedAmbassadors = ambassadors.filter(a => a.status === 'approved')
  const rejectedAmbassadors = ambassadors.filter(a => a.status === 'rejected')

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full mx-auto relative z-10">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-white/50 hover:text-white transition-colors"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to CodeNeuraX</span>
          </Link>

          {isAuthenticated && (
            <button
              onClick={handleLockPortal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-rose-500/10 hover:text-rose-300 text-white/60 text-xs border border-white/[0.08] transition-colors"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Portal</span>
            </button>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════
            1. LOCKED STATE (Admin Password Screen in mac-window)
           ══════════════════════════════════════════════════════════ */}
        {!isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="mac-window">
              <div className="p-6 sm:p-8 text-center">
                <h2
                  className="text-xl font-bold text-white mb-2"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  Admin Authentication
                </h2>
                <p className="text-xs text-white/40 mb-6 leading-relaxed">
                  Enter your CodeNeuraX Master Passcode to access broadcast controls.
                </p>

                {authError && (
                  <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleUnlockSubmit} className="space-y-4">
                  <div>
                    <label
                      className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider text-left"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Master Passcode
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={passInput}
                        onChange={(e) => setPassInput(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        autoFocus
                        className="input-mac pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={verifying}
                    className="w-full btn-premium justify-center mt-2"
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Unlock Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        ) : (
          /* ══════════════════════════════════════════════════════════
              2. UNLOCKED STATE (Admin Broadcast Control Center)
             ══════════════════════════════════════════════════════════ */
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Tab Switcher */}
            <div className="flex gap-2 p-1 bg-[#0a0a0a] rounded-2xl border border-white/[0.06]">
              <button
                onClick={() => setActiveTab("broadcast")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "broadcast"
                    ? "bg-white text-black"
                    : "text-white/50 hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <Zap className="w-3.5 h-3.5" />
                Broadcasts
              </button>
              <button
                onClick={() => { setActiveTab("ambassadors"); fetchAmbassadors(); }}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "ambassadors"
                    ? "bg-white text-black"
                    : "text-white/50 hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <Users className="w-3.5 h-3.5" />
                Ambassadors
                {pendingAmbassadors.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[0.6rem] rounded-full bg-amber-500 text-black font-bold">
                    {pendingAmbassadors.length}
                  </span>
                )}
              </button>
            </div>

            {activeTab === "broadcast" && (
            <>
            {/* Broadcast Form in mac-window */}
            <div className="mac-window">
              <form onSubmit={handlePublish} className="p-6 sm:p-8 space-y-6">
                <div>
                  <h1
                    className="text-2xl sm:text-3xl font-bold text-white mb-2"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Broadcast Daily Opportunity
                  </h1>
                  <p className="text-xs text-white/40">
                    Published items appear on the website feed for all members and auto-delete after 24 hours.
                  </p>
                </div>

                {/* Feedback Alerts */}
                {feedback && (
                  <div
                    className={`p-3.5 rounded-lg text-xs ${
                      feedback.type === "success"
                        ? "bg-green-500/10 border border-green-500/20 text-green-400"
                        : "bg-red-500/10 border border-red-500/20 text-red-400"
                    }`}
                  >
                    {feedback.message}
                  </div>
                )}

                {/* Category Selector */}
                <div>
                  <label
                    className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Category
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setCategory("internship")}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                        category === "internship"
                          ? "bg-white text-black border-white"
                          : "bg-[#121215] border-[#222227] text-white/50 hover:text-white"
                      }`}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>INTERNSHIP / JOB</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCategory("hackathon")}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                        category === "hackathon"
                          ? "bg-white text-black border-white"
                          : "bg-[#121215] border-[#222227] text-white/50 hover:text-white"
                      }`}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      <Trophy className="w-4 h-4" />
                      <span>HACKATHON / EVENT</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCategory("news")}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                        category === "news"
                          ? "bg-white text-black border-white"
                          : "bg-[#121215] border-[#222227] text-white/50 hover:text-white"
                      }`}
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      <Zap className="w-4 h-4" />
                      <span>TECH NEWS</span>
                    </button>
                  </div>
                </div>

                {/* Title & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. SDE Intern 2026 / SIH Hackathon"
                      required
                      className="input-mac"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Company / Organizer
                    </label>
                    <input
                      type="text"
                      value={organizer}
                      onChange={(e) => setOrganizer(e.target.value)}
                      placeholder="e.g. Google / Devfolio / CodeNeuraX"
                      className="input-mac"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label
                    className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Details & Eligibility *
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short key highlights: eligibility (2025/2026 batch), required skills, or news summary."
                    required
                    className="input-mac"
                  />
                </div>

                {/* Link & Stipend */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Apply / Read URL *
                    </label>
                    <input
                      type="url"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://..."
                      required
                      className="input-mac"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Stipend / Prize Pool
                    </label>
                    <input
                      type="text"
                      value={stipendOrPrize}
                      onChange={(e) => setStipendOrPrize(e.target.value)}
                      placeholder="e.g. ₹35,000/mo or ₹5,00,000 Prize"
                      className="input-mac"
                    />
                  </div>
                </div>

                {/* Location, Deadline & Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div>
                    <label
                      className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Location / Mode
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Remote / Bangalore"
                      className="input-mac"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Deadline / Date
                    </label>
                    <input
                      type="text"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      placeholder="30 Aug 2026"
                      className="input-mac"
                    />
                  </div>

                  <div>
                    <label
                      className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Badge
                    </label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="Urgent / Paid"
                      className="input-mac"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-premium justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Broadcasting...</span>
                    </>
                  ) : (
                    <>
                      <span>Publish Broadcast (Active 24h)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Active Posts in mac-window */}
            <div className="mac-window">
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <h2
                      className="text-lg font-bold text-white mb-1"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      Active Broadcasts ({activePosts.length})
                    </h2>
                    <p className="text-xs text-white/40">
                      Live on website now. Self-deletes automatically 24h after publication.
                    </p>
                  </div>

                  <button
                    onClick={fetchActivePosts}
                    title="Refresh list"
                    className="p-2.5 bg-[#121215] border border-[#222227] rounded-xl text-white/40 hover:text-white transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${postsLoading ? "animate-spin text-white" : ""}`} />
                  </button>
                </div>

                {postsLoading ? (
                  <div className="text-center py-8 text-white/30 text-xs flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : activePosts.length === 0 ? (
                  <div className="text-center py-8 text-white/30 text-xs">
                    No active broadcasts currently.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activePosts.map((post) => (
                      <div
                        key={post.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#121215] border border-[#222227] hover:border-white/20 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/[0.06] text-white/60"
                              style={{ fontFamily: "var(--font-mono)" }}
                            >
                              {post.category}
                            </span>
                            {post.organizer && (
                              <span className="text-xs text-white/50">{post.organizer}</span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-white">{post.title}</p>
                          <p className="text-xs text-white/40 line-clamp-1">{post.description}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <a
                            href={post.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-[#17171c] hover:bg-[#202028] rounded-lg text-white/60 hover:text-white transition-colors"
                            title="Open link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDelete(post.id)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            </>
            )}

            {/* ══════════════════════════════════════════════════════════
                3. CAMPUS AMBASSADORS TAB
               ══════════════════════════════════════════════════════════ */}
            {activeTab === "ambassadors" && (
            <>
              {/* Feedback */}
              {ambassadorFeedback && (
                <div
                  className={`p-3.5 rounded-lg text-xs ${
                    ambassadorFeedback.type === "success"
                      ? "bg-green-500/10 border border-green-500/20 text-green-400"
                      : "bg-red-500/10 border border-red-500/20 text-red-400"
                  }`}
                >
                  {ambassadorFeedback.message}
                </div>
              )}

              {/* Pending Ambassadors */}
              <div className="mac-window">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <h2
                        className="text-lg font-bold text-white mb-1"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        Pending Verification ({pendingAmbassadors.length})
                      </h2>
                      <p className="text-xs text-white/40">
                        Review and approve campus ambassador profiles.
                      </p>
                    </div>
                    <button
                      onClick={() => fetchAmbassadors()}
                      title="Refresh"
                      className="p-2.5 bg-[#121215] border border-[#222227] rounded-xl text-white/40 hover:text-white transition-colors"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${ambassadorsLoading ? "animate-spin text-white" : ""}`} />
                    </button>
                  </div>

                  {ambassadorsLoading ? (
                    <div className="text-center py-8 text-white/30 text-xs flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : pendingAmbassadors.length === 0 ? (
                    <div className="text-center py-8 text-white/30 text-xs">
                      No pending ambassador applications.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingAmbassadors.map((amb) => (
                        <div
                          key={amb.id}
                          className="p-4 rounded-xl bg-[#121215] border border-[#222227] hover:border-white/20 transition-colors"
                        >
                          <div className="flex items-start gap-4">
                            {/* Photo */}
                            <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10 shrink-0 bg-white/[0.02]">
                              {amb.photo_url ? (
                                <img src={amb.photo_url} alt={amb.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/20 text-lg font-bold">
                                  {amb.name.charAt(0)}
                                </div>
                              )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-white">{amb.name}</span>
                                <span
                                  className="text-[0.6rem] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider font-semibold"
                                  style={{ fontFamily: "var(--font-mono)" }}
                                >
                                  {amb.ref_no}
                                </span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-white/40">
                                <span className="flex items-center gap-1.5 truncate">
                                  <GraduationCap className="w-3 h-3 shrink-0" />
                                  {amb.college}
                                </span>
                                <span className="truncate">📧 {amb.email}</span>
                                <span>📞 {amb.phone}</span>
                                <a
                                  href={amb.linkedin_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-[#0A66C2] hover:underline truncate"
                                >
                                  <Linkedin className="w-3 h-3 shrink-0" />
                                  LinkedIn
                                </a>
                              </div>
                              <p className="text-[0.65rem] text-white/25 mt-1 truncate">📍 {amb.address}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleAmbassadorAction(amb.id, 'approve')}
                                disabled={processingIds.has(amb.id)}
                                className="p-2 bg-green-500/10 hover:bg-green-500/20 rounded-lg text-green-400 transition-colors disabled:opacity-50"
                                title="Approve"
                              >
                                {processingIds.has(amb.id) ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => handleAmbassadorAction(amb.id, 'reject')}
                                disabled={processingIds.has(amb.id)}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors disabled:opacity-50"
                                title="Reject"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Approved Ambassadors */}
              <div className="mac-window">
                <div className="p-6 sm:p-8">
                  <div className="mb-6">
                    <h2
                      className="text-lg font-bold text-white mb-1"
                      style={{ fontFamily: "var(--font-serif)" }}
                    >
                      Approved Ambassadors ({approvedAmbassadors.length})
                    </h2>
                    <p className="text-xs text-white/40">
                      These profiles are visible on the public Campus Ambassadors page.
                    </p>
                  </div>

                  {approvedAmbassadors.length === 0 ? (
                    <div className="text-center py-8 text-white/30 text-xs">
                      No approved ambassadors yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {approvedAmbassadors.map((amb) => (
                        <div
                          key={amb.id}
                          className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#121215] border border-[#222227] hover:border-white/20 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-green-500/20 shrink-0">
                              {amb.photo_url ? (
                                <img src={amb.photo_url} alt={amb.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-green-500/10 flex items-center justify-center text-green-400 text-xs font-bold">
                                  {amb.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-white">{amb.name}</span>
                                <span className="text-[0.55rem] text-green-400/60 uppercase" style={{ fontFamily: "var(--font-mono)" }}>
                                  {amb.ref_no}
                                </span>
                              </div>
                              <span className="text-xs text-white/40 truncate block">{amb.college}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteAmbassador(amb.id)}
                            disabled={processingIds.has(amb.id)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors shrink-0 disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Rejected (collapsible info) */}
              {rejectedAmbassadors.length > 0 && (
                <div className="mac-window">
                  <div className="p-6 sm:p-8">
                    <div className="mb-4">
                      <h2
                        className="text-lg font-bold text-white/50 mb-1"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        Rejected ({rejectedAmbassadors.length})
                      </h2>
                    </div>
                    <div className="space-y-2">
                      {rejectedAmbassadors.map((amb) => (
                        <div
                          key={amb.id}
                          className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[#0c0c0e] border border-[#1a1a1e] opacity-60"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xs text-white/40">{amb.name}</span>
                            <span className="text-[0.55rem] text-white/20" style={{ fontFamily: "var(--font-mono)" }}>{amb.ref_no}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteAmbassador(amb.id)}
                            disabled={processingIds.has(amb.id)}
                            className="p-1.5 text-white/20 hover:text-red-400 transition-colors"
                            title="Delete permanently"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
            )}

          </motion.div>
        )}
      </div>
    </div>
  )
}
