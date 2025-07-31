"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BookOpen, Code, Users, Trophy, Star, ArrowRight, CheckCircle, Clock, Target, AlertCircle } from "lucide-react"
import Header from "@/components/header"
import AuthModal from "@/components/auth-modal"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export default function StudyPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const supabase = createClient()

  // Check authentication on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          // User is not authenticated, redirect to home with login prompt
          localStorage.setItem("redirectAfterLogin", "/study")
          window.location.href = "/"
          return
        }

        setUser(user)
      } catch (error) {
        console.error("Auth check error:", error)
        // Redirect to home on error
        window.location.href = "/"
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        // User signed out, redirect to home
        window.location.href = "/"
      } else if (session?.user) {
        setUser(session.user)
        setAuthLoading(false)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase.auth])

  const handleAuth = (type: "login" | "signup") => {
    setAuthType(type)
    setShowAuthModal(true)
  }

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.from("waitlist").insert([
        {
          email: email,
          created_at: new Date().toISOString(),
        },
      ])

      if (error) {
        if ('code' in error && error.code === "23505") {

          // Unique constraint violation
          setError("This email is already on the waitlist!")
        } else {
          console.error("Waitlist error:", error)
          setError("Something went wrong. Please try again.")
        }
      } else {
        setIsSubmitted(true)
        setEmail("")
      }
    } catch (err) {
      console.error("Waitlist submission error:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If user is not authenticated, this component won't render due to redirect
  if (!user) {
    return null
  }

  const courses = [
    {
      title: "Full Stack Web Development",
      description: "Master React, Node.js, and modern web technologies",
      duration: "12 weeks",
      level: "Beginner to Advanced",
      icon: <Code className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Data Structures & Algorithms",
      description: "Ace coding interviews with comprehensive DSA training",
      duration: "8 weeks",
      level: "Intermediate",
      icon: <Target className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Mobile App Development",
      description: "Build iOS and Android apps with React Native",
      duration: "10 weeks",
      level: "Intermediate",
      icon: <BookOpen className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Machine Learning Fundamentals",
      description: "Dive into AI and ML with Python and TensorFlow",
      duration: "14 weeks",
      level: "Advanced",
      icon: <Star className="w-8 h-8" />,
      color: "from-orange-500 to-red-500",
    },
  ]

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Live Interactive Sessions",
      description: "Real-time learning with expert instructors",
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Hands-on Projects",
      description: "Build real-world applications and portfolios",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Industry Certification",
      description: "Get certified and boost your career prospects",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Flexible Schedule",
      description: "Learn at your own pace with recorded sessions",
    },
  ]

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <Header onAuth={handleAuth} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 bg-green-800/50 border border-green-700/50 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-300 text-sm font-medium tracking-wide">
                  Welcome, {user.user_metadata?.full_name || user.email?.split("@")[0]}!
                </span>
              </div>

              <div className="inline-flex items-center gap-2 bg-gray-800/50 border border-gray-700/50 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
                <BookOpen className="w-5 h-5 text-purple-400 animate-pulse" />
                <span className="text-purple-300 text-sm font-medium tracking-wide">Premium Learning Experience</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black mb-8 relative">
                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                  CodeNeuraX
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                  Academy
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
                Master cutting-edge technologies with our comprehensive courses designed by industry experts.
                <br />
                <span className="text-purple-400 font-semibold">Transform your career with hands-on learning.</span>
              </p>
            </motion.div>

            {/* Waitlist Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-16"
            >
              {!isSubmitted ? (
                <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold text-white mb-4">Join the Waitlist</h3>
                  <p className="text-gray-300 mb-6">
                    Be the first to know when our courses launch and get exclusive early access!
                  </p>

                  {/* Add this notification */}
                  {(!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) && (
                    <div className="flex items-center gap-2 bg-yellow-900/30 border border-yellow-800/50 rounded-xl p-4 mb-6">
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                      <span className="text-yellow-300 text-sm">
                        Demo mode: Waitlist is simulated. Set up Supabase for full functionality.
                      </span>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 bg-red-900/30 border border-red-800/50 rounded-xl p-4 mb-6">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-300">{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      required
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white font-bold px-8 py-4 rounded-xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          Join Waitlist
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-900/30 backdrop-blur-xl border border-green-800/50 rounded-3xl p-8 max-w-2xl mx-auto"
                >
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-4">You're on the list!</h3>
                  <p className="text-gray-300">
                    Thanks for joining our waitlist. We'll notify you as soon as our courses are available.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
              Upcoming{" "}
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Courses
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Comprehensive courses designed to take you from beginner to industry-ready professional.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 hover:border-purple-500/30 transition-all duration-500 hover:transform hover:scale-105 relative overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />

                  <div className="relative z-10">
                    <div
                      className={`text-transparent bg-gradient-to-r ${course.color} bg-clip-text mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {course.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-6">{course.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full">📅 {course.duration}</span>
                      <span className="bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full">📊 {course.level}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Our Academy
              </span>
              ?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group text-center"
              >
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 hover:border-cyan-500/30 transition-all duration-500 hover:transform hover:scale-105">
                  <div className="text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
              Ready to{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Level Up
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Join thousands of students who have transformed their careers with CodeNeuraX Academy.
            </p>
            {!isSubmitted && (
              <button
                onClick={() => document.querySelector('input[type="email"]')?.scrollIntoView({ behavior: "smooth" })}
                className="group inline-flex items-center gap-4 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 hover:from-purple-600 hover:via-pink-600 hover:to-cyan-600 text-white font-bold px-12 py-6 rounded-2xl text-xl transition-all duration-500 transform hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/30"
              >
                <BookOpen className="w-7 h-7 animate-bounce" />
                Join Waitlist Now
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-12 relative">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-lg">Team CodeNeuraX</p>
        </div>
      </footer>

      {showAuthModal && <AuthModal type={authType} onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}
