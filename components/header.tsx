"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, LogOut, User as UserIcon, ChevronDown, Calendar, Bell, Users, CheckCircle2, XCircle, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export default function Header({ onAuth }: { onAuth?: (type: "login" | "signup") => void } = {}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [activeProfileTab, setActiveProfileTab] = useState<"profile" | "notifications">("profile")
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const supabase = createClient()

  const fetchNotifications = useCallback(async (userEmail: string) => {
    if (!userEmail) return
    try {
      setLoadingNotifications(true)
      const res = await fetch(`/api/notifications?email=${encodeURIComponent(userEmail)}`)
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unread_count || 0)
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err)
    } finally {
      setLoadingNotifications(false)
    }
  }, [])

  const markAsRead = async (notificationId?: number | string) => {
    if (!user?.email) return
    try {
      const action = notificationId ? "mark_read" : "mark_all_read"
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          email: user.email,
          notification_id: notificationId,
        }),
      })
      if (notificationId) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      } else {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
        setUnreadCount(0)
      }
    } catch (err) {
      console.error("Failed to mark notification read:", err)
    }
  }

  const formatRelativeTime = (dateString?: string) => {
    if (!dateString) return "Recent"
    try {
      const diff = Date.now() - new Date(dateString).getTime()
      const mins = Math.floor(diff / (1000 * 60))
      if (mins < 1) return "Just now"
      if (mins < 60) return `${mins}m ago`
      const hours = Math.floor(mins / 60)
      if (hours < 24) return `${hours}h ago`
      const days = Math.floor(hours / 24)
      return `${days}d ago`
    } catch {
      return "Recent"
    }
  }

  // Listen to Supabase auth state
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        setUser(data?.user || null)
      } catch {
        setUser(null)
      }
    }
    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      setUser(session?.user || null)
      if ((event === "SIGNED_IN" || event === "INITIAL_SESSION") && session?.user?.email) {
        const cacheKey = `cnx_login_audit_${session.user.id}`
        if (typeof window !== "undefined" && !sessionStorage.getItem(cacheKey)) {
          sessionStorage.setItem(cacheKey, String(Date.now()))
          fetch("/api/auth/record-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "",
              login_method: session.user.app_metadata?.provider || "supabase_auth",
            }),
          }).catch(() => {})
        }
      }
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [supabase])

  // Fetch notifications on user load and periodically
  useEffect(() => {
    const email = user?.email
    if (email) {
      fetchNotifications(email)
      const interval = setInterval(() => {
        fetchNotifications(email)
      }, 45000)
      return () => clearInterval(interval)
    } else {
      setNotifications([])
      setUnreadCount(0)
    }
  }, [user?.email, fetchNotifications])

  // Don't render header on dedicated login page
  if (pathname === "/login") {
    return null
  }

  const handleSignOut = async () => {
    try {
      document.cookie = "cnx_guest_active=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      document.cookie = "cnx_guest=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      if (user) {
        await supabase.auth.signOut()
      }
      setUser(null)
      setIsUserMenuOpen(false)
      window.location.href = "/login"
    } catch (err) {
      console.error("Sign out error:", err)
      window.location.href = "/login"
    }
  }

  const navItems = [
    { name: "Home", href: "/#home" },
    { name: "Feed", href: "/#feed" },
    { name: "Events", href: "/events" },
    { name: "Econtent", href: "/econtent" },
    { name: "Work With Us", href: "/work-with-us" },
    { name: "Campus Ambassadors", href: "/campus-ambassadors" },
    { name: "BuddyKid", href: "/buddykid", badge: "TRY" },
    { name: "AISPARK", href: "/aispark" },
    { name: "Services", href: "/services" },
  ]

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") || href.startsWith("#")) {
      const targetId = href.replace("/#", "").replace("#", "")
      const isOnMainPage = pathname === "/"
      if (isOnMainPage) {
        e.preventDefault()
        const target = document.getElementById(targetId)
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
      setIsMenuOpen(false)
    }
  }

  const userDisplayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Member"

  const userEmail = user?.email || ""

  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : ""

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl z-50">
      <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl px-6 py-3 shadow-2xl shadow-black/50">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/images/codeneurax-logo.webp"
              alt="CodeNeuraX Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="text-lg font-bold tracking-tight text-white">
              Code<span className="gradient-text-amber">NeuraX</span>
            </span>
          </Link>

          {/* Navigation — monospace style */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className="relative px-3 py-2 text-[0.8rem] font-medium tracking-wide text-white/50 hover:text-white transition-colors duration-300 font-mono flex items-center gap-1.5"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <span>{item.name}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse leading-none">
                    {item.badge}
                  </span>
                )}
                <span className="absolute bottom-0.5 left-3 right-3 h-px bg-white/0 hover:bg-white/30 transition-all duration-300" />
              </a>
            ))}
          </nav>

          {/* CTA & User Profile */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="https://whatsapp.com/channel/0029VbC93H2HVvTiyyFL9C0Y"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/[0.06] text-white hover:bg-white/[0.1] border border-white/[0.08] transition-all duration-300"
            >
              Whatsapp
            </a>

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    const nextOpen = !isUserMenuOpen
                    setIsUserMenuOpen(nextOpen)
                    if (nextOpen && user?.email) {
                      fetchNotifications(user.email)
                      if (unreadCount > 0) {
                        setActiveProfileTab("notifications")
                      }
                    }
                  }}
                  className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium text-white transition-all ${
                    unreadCount > 0
                      ? "bg-rose-500/10 hover:bg-rose-500/15 border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                      : "bg-white/[0.06] hover:bg-white/[0.1] border-white/[0.1]"
                  }`}
                  aria-label="Profile and notifications"
                >
                  <div className="relative">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                      {userDisplayName.charAt(0)}
                    </div>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500 border border-[#0a0a0a]" />
                      </span>
                    )}
                  </div>

                  {unreadCount > 0 && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-300">
                      <Bell className="w-3 h-3 text-rose-400 animate-pulse" />
                      <span>{unreadCount}</span>
                    </span>
                  )}

                  <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-[330px] sm:w-[360px] rounded-2xl overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.95)] border border-white/[0.08] z-50 bg-[#0f0f14]/98 backdrop-blur-2xl"
                    >
                      {/* macOS Title Bar with Tab Switcher */}
                      <div className="bg-[#1a1a1f] px-3.5 py-2 flex items-center justify-between border-b border-white/[0.06]">
                        <div className="flex items-center gap-[6px]">
                          <div className="w-[10px] h-[10px] rounded-full bg-[#ff5f57] shadow-[0_0_4px_rgba(255,95,87,0.3)]" />
                          <div className="w-[10px] h-[10px] rounded-full bg-[#febc2e] shadow-[0_0_4px_rgba(254,188,46,0.3)]" />
                          <div className="w-[10px] h-[10px] rounded-full bg-[#28c840] shadow-[0_0_4px_rgba(40,200,64,0.3)]" />
                        </div>

                        {/* Switcher Tabs */}
                        <div className="flex items-center bg-black/40 p-0.5 rounded-lg border border-white/[0.05]">
                          <button
                            type="button"
                            onClick={() => setActiveProfileTab("profile")}
                            className={`px-2.5 py-0.5 rounded-md text-[10px] font-mono tracking-wider transition-all ${
                              activeProfileTab === "profile"
                                ? "bg-white/[0.12] text-white shadow-sm font-semibold"
                                : "text-white/40 hover:text-white/70"
                            }`}
                          >
                            profile
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveProfileTab("notifications")
                              if (user?.email) fetchNotifications(user.email)
                            }}
                            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono tracking-wider transition-all ${
                              activeProfileTab === "notifications"
                                ? "bg-white/[0.12] text-white shadow-sm font-semibold"
                                : "text-white/40 hover:text-white/70"
                            }`}
                          >
                            <span>inbox</span>
                            {unreadCount > 0 && (
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500 text-white leading-tight">
                                {unreadCount}
                              </span>
                            )}
                          </button>
                        </div>

                        <div className="w-[30px]" />
                      </div>

                      {/* Card Body */}
                      <div className="px-4 py-4">
                        {activeProfileTab === "profile" ? (
                          <>
                            {/* Avatar + Name */}
                            <div className="flex items-center gap-3.5 mb-3.5">
                              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-base font-bold text-white uppercase shadow-lg shadow-blue-600/20">
                                {userDisplayName.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">
                                  {userDisplayName}
                                </p>
                                <p className="text-[11px] text-white/35 truncate">
                                  {userEmail}
                                </p>
                              </div>
                            </div>

                            {/* Unread banner if any */}
                            {unreadCount > 0 && (
                              <button
                                type="button"
                                onClick={() => setActiveProfileTab("notifications")}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 hover:bg-rose-500/15 transition-colors mb-3 text-xs"
                              >
                                <span className="flex items-center gap-2">
                                  <Bell className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                                  <span>{unreadCount} new {unreadCount === 1 ? 'notification' : 'notifications'}</span>
                                </span>
                                <span className="text-[10px] font-mono text-rose-400">View &rarr;</span>
                              </button>
                            )}

                            {/* Join Date */}
                            {joinDate && (
                              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-3">
                                <Calendar className="w-3.5 h-3.5 text-emerald-400/70 shrink-0" />
                                <div>
                                  <p className="text-[10px] uppercase tracking-[0.15em] font-mono text-white/30">
                                    Member Since
                                  </p>
                                  <p className="text-xs font-medium text-white/70">
                                    {joinDate}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* BuddyKid Squad Shortcut */}
                            <Link
                              href="/buddykid"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/15 border border-cyan-500/20 text-cyan-300 text-xs font-medium transition-colors mb-3"
                            >
                              <span className="flex items-center gap-2">
                                <Users className="w-3.5 h-3.5" />
                                <span>My BuddyKid Squads</span>
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                            </Link>

                            {/* Sign Out */}
                            <div className="pt-2 border-t border-white/[0.06]">
                              <button
                                type="button"
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                              >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Sign Out</span>
                              </button>
                            </div>
                          </>
                        ) : (
                          /* Tab 2: Notifications (Inbox) */
                          <div className="space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                              <span className="text-xs font-semibold text-white/90 flex items-center gap-1.5 font-mono">
                                <Bell className="w-3.5 h-3.5 text-amber-400" />
                                <span>Squad Notifications</span>
                              </span>
                              {unreadCount > 0 && (
                                <button
                                  type="button"
                                  onClick={() => markAsRead()}
                                  className="text-[10px] font-mono text-white/40 hover:text-white transition-colors"
                                >
                                  Mark all read
                                </button>
                              )}
                            </div>

                            <div className="max-h-[280px] overflow-y-auto space-y-2 pr-1 divide-y divide-white/[0.04]">
                              {notifications.length === 0 ? (
                                <div className="py-8 text-center space-y-2">
                                  <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto text-white/30">
                                    <Bell className="w-4 h-4" />
                                  </div>
                                  <p className="text-xs text-white/60 font-medium">All caught up!</p>
                                  <p className="text-[10px] text-white/30">No notifications right now.</p>
                                </div>
                              ) : (
                                notifications.map((notif) => (
                                  <div
                                    key={notif.id}
                                    className={`pt-2.5 first:pt-0 pb-2 px-2.5 rounded-xl transition-all ${
                                      !notif.is_read
                                        ? "bg-white/[0.04] border border-white/[0.06]"
                                        : "opacity-75 hover:opacity-100"
                                    }`}
                                  >
                                    <div className="flex items-start gap-2.5">
                                      <div className="mt-0.5 shrink-0">
                                        {notif.type === "team_join_request" ? (
                                          <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                            <Users className="w-3.5 h-3.5" />
                                          </div>
                                        ) : notif.type === "team_accepted" ? (
                                          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                          </div>
                                        ) : (
                                          <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                                            <XCircle className="w-3.5 h-3.5" />
                                          </div>
                                        )}
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1">
                                          <p className="text-xs font-semibold text-white truncate">
                                            {notif.title}
                                          </p>
                                          <span className="text-[9px] font-mono text-white/30 shrink-0">
                                            {formatRelativeTime(notif.created_at)}
                                          </span>
                                        </div>
                                        <p className="text-[11px] text-white/60 mt-0.5 leading-snug line-clamp-2">
                                          {notif.message}
                                        </p>

                                        <div className="flex items-center justify-between mt-2 pt-1">
                                          <Link
                                            href={notif.link_url || "/buddykid"}
                                            onClick={() => {
                                              if (!notif.is_read) markAsRead(notif.id)
                                              setIsUserMenuOpen(false)
                                            }}
                                            className="text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                                          >
                                            <span>Open Squads</span>
                                            <ArrowRight className="w-2.5 h-2.5" />
                                          </Link>

                                          {!notif.is_read && (
                                            <button
                                              type="button"
                                              onClick={() => markAsRead(notif.id)}
                                              className="text-[9px] font-mono text-white/30 hover:text-white/70 transition-colors"
                                            >
                                              Mark read
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-xs font-medium text-white/80 transition-all font-mono"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                  <span>Guest</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-[260px] rounded-2xl overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.9)] border border-white/[0.08] z-50"
                    >
                      {/* macOS Title Bar */}
                      <div className="bg-[#1a1a1f] px-4 py-2.5 flex items-center gap-2 border-b border-white/[0.06]">
                        <div className="flex items-center gap-[6px]">
                          <div className="w-[10px] h-[10px] rounded-full bg-[#ff5f57]" />
                          <div className="w-[10px] h-[10px] rounded-full bg-[#febc2e]" />
                          <div className="w-[10px] h-[10px] rounded-full bg-[#28c840]" />
                        </div>
                        <div className="flex-1 text-center">
                          <span className="text-[10px] font-mono text-white/20 tracking-wider">guest mode</span>
                        </div>
                        <div className="w-[42px]" />
                      </div>

                      {/* Card Body */}
                      <div className="bg-[#0f0f14]/98 backdrop-blur-2xl px-5 py-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm font-mono">
                            G
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">Guest User</p>
                            <p className="text-[11px] text-white/40">Limited access mode</p>
                          </div>
                        </div>

                        <Link
                          href="/login"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white text-black hover:bg-white/90 transition shadow-md text-center"
                        >
                          Sign In with Google
                        </Link>

                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-white/40 hover:text-white/70 rounded-lg transition"
                        >
                          Exit Guest Mode
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden relative p-2 rounded-lg hover:bg-white/5 transition text-white/60 hover:text-white"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            {unreadCount > 0 && !isMenuOpen && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden mt-4 border-t border-white/[0.06] pt-4 flex flex-col gap-1 overflow-hidden"
            >
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleSmoothScroll(e, item.href)}
                  className="px-3 py-2.5 text-sm text-white/50 hover:text-white hover:bg-white/[0.04] rounded-lg transition-all duration-200 flex items-center justify-between"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}

              <div className="mt-3 border-t border-white/[0.06] pt-4 pb-2 space-y-2">
                {user ? (
                  <div className="space-y-2">
                    {/* Mobile profile card */}
                    <div className="flex items-center justify-between px-3 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0">
                          {userDisplayName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{userDisplayName}</p>
                          <p className="text-[10px] text-white/35 truncate">{userEmail}</p>
                          {joinDate && (
                            <p className="text-[10px] text-white/25 mt-0.5">Joined {joinDate}</p>
                          )}
                        </div>
                      </div>

                      {unreadCount > 0 && (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                          <Bell className="w-3 h-3 text-rose-400" />
                          <span>{unreadCount}</span>
                        </span>
                      )}
                    </div>

                    {/* Mobile Notification Quick Link */}
                    {unreadCount > 0 && (
                      <Link
                        href="/buddykid"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-semibold hover:bg-rose-500/15 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Bell className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                          <span>{unreadCount} Squad Notification{unreadCount > 1 ? 's' : ''}</span>
                        </span>
                        <span className="text-[10px] font-mono text-rose-400">Review &rarr;</span>
                      </Link>
                    )}

                    <Link
                      href="/buddykid"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium"
                    >
                      <span className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5" />
                        <span>My BuddyKid Squads</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                    </Link>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span className="text-xs font-mono text-white/70">Guest Mode</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="text-[11px] text-white/40 hover:text-white"
                      >
                        Exit
                      </button>
                    </div>
                    <Link
                      href="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full px-5 py-2.5 rounded-xl text-sm font-semibold bg-white text-black text-center hover:bg-white/90 transition"
                    >
                      Sign In with Google
                    </Link>
                  </div>
                )}

                <a
                  href="https://whatsapp.com/channel/0029VbC93H2HVvTiyyFL9C0Y"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/[0.06] text-white text-center hover:bg-white/[0.1] border border-white/[0.08] transition"
                >
                  Join Community
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
