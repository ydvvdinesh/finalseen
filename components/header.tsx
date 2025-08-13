"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { Menu, X, LogOut } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface HeaderProps {
  onAuth: (type: "login" | "signup") => void
}

export default function Header({ onAuth }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      setUser(data?.user ?? null)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Events", href: "/events" },
    { name: "Econtent", href: "/econtent" },
    { name: "Study", href: "/study", requiresAuth: true },
    { name: "Services", href: "#contact-request" },
    { name: "Contact", href: "#contact" },
  ]

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      const isOnMainPage = window.location.pathname === "/"
      if (isOnMainPage) {
        const target = document.querySelector(href)
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      } else {
        // If not on main page, redirect to home page with the hash
        window.location.href = `/${href}`
      }
      setIsMenuOpen(false)
    }
  }

  const handleStudyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (user) {
      window.location.href = "/study"
    } else {
      localStorage.setItem("redirectAfterLogin", "/study")
      onAuth("login")
    }
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl bg-black/80 text-white rounded-2xl shadow-lg backdrop-blur-md z-50 px-6 py-3">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/codeneurax-logo.webp" alt="Logo" width={32} height={32} className="h-8 w-8 object-contain" />
          <span className="text-xl font-bold">
            Code<span className="text-blue-400">NeuraX</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) =>
                item.requiresAuth ? handleStudyClick(e) : handleSmoothScroll(e, item.href)
              }
              className="relative group hover:text-blue-400 transition"
            >
              {item.name}
              <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-400 transition-all group-hover:w-full"></span>
            </a>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          ) : user ? (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-300">
                Hi, {user.user_metadata?.full_name || user.email?.split("@")[0]}
              </span>
              <button onClick={handleSignOut} className="hover:text-blue-400 transition flex items-center gap-1">
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => onAuth("login")} className="hover:text-blue-400 transition">Login</button>
              <button
                onClick={() => onAuth("signup")}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-1.5 rounded-xl text-sm font-semibold shadow-md hover:scale-105 transition"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-800/50 transition"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden mt-4 border-t border-white/10 pt-4 flex flex-col gap-3 text-sm"
        >
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) =>
                item.requiresAuth ? handleStudyClick(e) : handleSmoothScroll(e, item.href)
              }
              className="hover:text-blue-400 transition"
            >
              {item.name}
              {item.requiresAuth && !user && " 🔒"}
            </a>
          ))}

          <div className="mt-4 border-t border-white/10 pt-4 flex flex-col gap-3">
            {user ? (
              <>
                <span className="text-gray-300">
                  Hi, {user.user_metadata?.full_name || user.email?.split("@")[0]}
                </span>
                <button onClick={handleSignOut} className="flex items-center gap-2 hover:text-blue-400 transition">
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => onAuth("login")} className="hover:text-blue-400 transition">Login</button>
                <button
                  onClick={() => onAuth("signup")}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-1.5 rounded-xl text-sm font-semibold shadow-md hover:scale-105 transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  )
}
