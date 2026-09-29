"use client"

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Briefcase,
  Trophy,
  Zap,
  Clock,
  ExternalLink,
  Share2,
  Search,
  Calendar,
  MapPin,
  DollarSign,
  Building2,
  Check,
  RefreshCw,
  ArrowRight,
  Hash,
  Sparkles,
  X,
} from "lucide-react"

export interface CommunityPost {
  id: string
  category: "internship" | "hackathon" | "news"
  title: string
  organizer?: string | null
  description: string
  link_url: string
  badge?: string | null
  deadline?: string | null
  location?: string | null
  stipend_or_prize?: string | null
  created_at: string
  expires_at?: string | null
}

/** Generate a short display ID from the full UUID (first 8 chars) */
function getShortId(id: string): string {
  return id.replace(/-/g, "").slice(0, 8).toUpperCase()
}

export default function CommunityFeed() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"all" | "internship" | "hackathon" | "news">("all")
  const [showBuddyKidCallout, setShowBuddyKidCallout] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const scrolledRef = useRef(false)

  const handleHackathonTabClick = () => {
    setActiveTab("hackathon")
    if (typeof window !== "undefined") {
      const alreadyShown = sessionStorage.getItem("cnx_seen_try_buddykid")
      if (!alreadyShown) {
        setShowBuddyKidCallout(true)
        sessionStorage.setItem("cnx_seen_try_buddykid", "true")
      }
    }
  }

  const fetchFeed = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/community-feed", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setPosts(data.posts || [])
      }
    } catch (err) {
      console.error("Failed to load community feed:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeed()
  }, [])

  // Deep-link: scroll to a specific opportunity via ?opp=<id> URL parameter
  useEffect(() => {
    if (loading || posts.length === 0 || scrolledRef.current) return

    const params = new URLSearchParams(window.location.search)
    const oppId = params.get("opp")
    if (!oppId) return

    // Find matching post
    const matchedPost = posts.find((p) => p.id === oppId)
    if (!matchedPost) return

    // Ensure tab is set to "all" so the card is visible in the grid
    setActiveTab("all")

    scrolledRef.current = true
    setHighlightedId(oppId)

    // Small delay for DOM render
    setTimeout(() => {
      const element = document.getElementById(`opp-${oppId}`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 300)

    // Clear highlight after animation
    setTimeout(() => setHighlightedId(null), 4000)
  }, [loading, posts])

  // Calculate remaining time for 24h posts
  const getRemainingHours = (createdAt: string) => {
    const postTime = new Date(createdAt).getTime()
    const now = Date.now()
    const diffHours = 24 - Math.floor((now - postTime) / (1000 * 60 * 60))
    if (diffHours <= 0) return "Expiring soon"
    return `${diffHours}h left`
  }

  const handleShare = (post: CommunityPost) => {
    // Single CodeNeuraX link with opportunity ID — brings user to website first
    const opportunityUrl = `https://www.codeneurax.in/?opp=${post.id}#feed`

    const text = `🔥 *${post.title}* (${post.category.toUpperCase()})\n` +
      `${post.organizer ? `🏢 By: ${post.organizer}\n` : ""}` +
      `${post.stipend_or_prize ? `💰 ${post.stipend_or_prize}\n` : ""}` +
      `${post.deadline ? `📅 Deadline: ${post.deadline}\n` : ""}` +
      `${post.location ? `📍 ${post.location}\n` : ""}` +
      `\n🔗 View & Apply on CodeNeuraX:\n${opportunityUrl}`

    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, "_blank")

    setCopiedId(post.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const counts = useMemo(() => {
    return {
      all: posts.length,
      internship: posts.filter((p) => p.category === "internship").length,
      hackathon: posts.filter((p) => p.category === "hackathon").length,
      news: posts.filter((p) => p.category === "news").length,
    }
  }, [posts])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesTab = activeTab === "all" || post.category === activeTab
      const matchesSearch =
        searchQuery === "" ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.organizer && post.organizer.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesTab && matchesSearch
    })
  }, [posts, activeTab, searchQuery])

  return (
    <section id="feed" className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 scroll-mt-28">
      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Category Tabs in mac-window style */}
        <div className="flex items-center gap-1.5 p-1.5 bg-[#0a0a0c] border border-white/[0.08] rounded-2xl overflow-x-auto w-full md:w-auto scrollbar-none">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${activeTab === "all"
                ? "bg-white text-black shadow-md"
                : "text-white/40 hover:text-white"
              }`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span>ALL</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === "all" ? "bg-black/10 text-black font-bold" : "bg-white/[0.06] text-white/50"
                }`}
            >
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("internship")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${activeTab === "internship"
                ? "bg-white text-black shadow-md"
                : "text-white/40 hover:text-white"
              }`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>INTERNSHIPS</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === "internship" ? "bg-black/10 text-black font-bold" : "bg-white/[0.06] text-white/50"
                }`}
            >
              {counts.internship}
            </span>
          </button>

          <button
            onClick={handleHackathonTabClick}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${activeTab === "hackathon"
                ? "bg-white text-black shadow-md"
                : "text-white/40 hover:text-white"
              }`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>HACKATHONS</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === "hackathon" ? "bg-black/10 text-black font-bold" : "bg-white/[0.06] text-white/50"
                }`}
            >
              {counts.hackathon}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("news")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${activeTab === "news"
                ? "bg-white text-black shadow-md"
                : "text-white/40 hover:text-white"
              }`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>TECH NEWS</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === "news" ? "bg-black/10 text-black font-bold" : "bg-white/[0.06] text-white/50"
                }`}
            >
              {counts.news}
            </span>
          </button>
        </div>

        {/* Search Bar & Refresh */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search feed..."
              className="input-mac py-2 pl-9 text-xs"
            />
            <Search className="w-3.5 h-3.5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={fetchFeed}
            title="Refresh Feed"
            className="p-2.5 bg-[#121215] border border-[#222227] rounded-xl text-white/40 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-white" : ""}`} />
          </button>
        </div>
      </div>

      {/* ─── Try BuddyKid Prompt (Shown ONCE when clicking Hackathon) ─── */}
      <AnimatePresence>
        {showBuddyKidCallout && activeTab === "hackathon" && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 overflow-hidden"
          >
            <div className="relative rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-cyan-950/40 via-purple-950/30 to-blue-950/40 border border-cyan-500/30 shadow-2xl shadow-cyan-500/5 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-cyan-400 bg-cyan-500/15 px-2.5 py-0.5 rounded-full border border-cyan-500/25">
                        New Feature
                      </span>
                      <span className="text-xs text-white/40 font-mono">Hackathon Team Finder</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">
                      Looking for Hackathon Teammates? <span className="gradient-text-cyan">Try BuddyKid!</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-white/50 mt-1 max-w-xl leading-relaxed">
                      Don&apos;t build alone or miss out on hackathons. Create a team or join an open squad using your skills and team code.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <Link
                    href="/buddykid"
                    className="btn-premium text-xs py-2.5 px-5 shadow-lg shadow-cyan-500/10 inline-flex items-center gap-2"
                  >
                    <span>Try BuddyKid</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => setShowBuddyKidCallout(false)}
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white transition"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feed Cards Grid — Pixel-Perfect Website macOS Windows */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="mac-window h-72 animate-pulse flex flex-col justify-between p-6">
              <div className="space-y-3 pt-6">
                <div className="h-4 bg-white/[0.04] rounded w-1/3" />
                <div className="h-5 bg-white/[0.06] rounded w-3/4" />
                <div className="h-3 bg-white/[0.03] rounded w-full" />
              </div>
              <div className="h-10 bg-white/[0.04] rounded-xl w-full" />
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        /* Empty State */
        <div className="mac-window max-w-xl mx-auto">
          <div className="p-8 sm:p-10 text-center">
            <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4 text-white/30">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1.5">No Active Broadcasts</h3>
            <p className="text-xs text-white/40 mb-6 leading-relaxed">
              Updates stay live for 24 hours. Check back soon or join our community WhatsApp group!
            </p>
            <a
              href="https://whatsapp.com/channel/0029VbC93H2HVvTiyyFL9C0Y"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium justify-center text-xs py-2.5 px-5 mx-auto"
            >
              <span>Join WhatsApp Group</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredPosts.map((post) => {
              return (
                <motion.div
                  key={post.id}
                  id={`opp-${post.id}`}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className={`mac-window flex flex-col justify-between group hover:border-white/20 transition-all duration-500 scroll-mt-28 ${highlightedId === post.id
                      ? "ring-2 ring-amber-400/60 border-amber-400/30 shadow-[0_0_30px_-5px_rgba(251,191,36,0.2)]"
                      : ""
                    }`}
                >
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Top status line: Category, ID & Expiry */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[10px] uppercase font-mono tracking-wider text-white/40"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            {post.category}
                          </span>
                          <span
                            className="inline-flex items-center gap-0.5 text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08] text-white/25"
                            style={{ fontFamily: "var(--font-mono)" }}
                            title={`Opportunity ID: ${post.id}`}
                          >
                            <Hash className="w-2.5 h-2.5" />
                            {getShortId(post.id)}
                          </span>
                        </div>

                        <span
                          className="text-[10px] font-mono text-white/30 flex items-center gap-1"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          <Clock className="w-3 h-3 text-white/30" />
                          {getRemainingHours(post.created_at)}
                        </span>
                      </div>

                      {/* Organizer / Company */}
                      {post.organizer && (
                        <div className="flex items-center gap-1.5 text-xs text-white/40 mb-1 font-mono">
                          <Building2 className="w-3 h-3 text-white/30" />
                          <span className="text-white/60">{post.organizer}</span>
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-lg font-bold text-white tracking-tight mb-2 group-hover:text-amber-400/90 transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-white/40 leading-relaxed line-clamp-3 mb-4 font-sans">
                        {post.description}
                      </p>

                      {/* Meta Tags */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {post.stipend_or_prize && (
                          <span
                            className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-[#121215] text-white/70 border border-[#222227]"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            <DollarSign className="w-3 h-3 text-emerald-400" />
                            <span>{post.stipend_or_prize}</span>
                          </span>
                        )}

                        {post.location && (
                          <span
                            className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-[#121215] text-white/50 border border-[#222227]"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            <MapPin className="w-3 h-3 text-white/30" />
                            <span>{post.location}</span>
                          </span>
                        )}

                        {post.deadline && (
                          <span
                            className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-[#121215] text-white/50 border border-[#222227]"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            <Calendar className="w-3 h-3 text-white/30" />
                            <span>{post.deadline}</span>
                          </span>
                        )}

                        {post.badge && (
                          <span
                            className="inline-flex items-center text-[11px] px-2.5 py-1 rounded-lg bg-[#121215] text-amber-400/80 border border-[#222227]"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            {post.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-4 border-t border-white/[0.06] flex items-center gap-2">
                      <a
                        href={post.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 btn-premium justify-center text-xs py-2.5"
                      >
                        <span>
                          {post.category === "internship"
                            ? "Apply Now"
                            : post.category === "hackathon"
                              ? "Register"
                              : "Read Article"}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleShare(post)}
                        title="Share on WhatsApp"
                        className="p-2.5 bg-[#121215] hover:bg-[#1a1a1f] border border-[#222227] text-white/50 hover:text-white rounded-xl transition-colors"
                      >
                        {copiedId === post.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  )
}
