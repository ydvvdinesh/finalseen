"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, Users, Play, ArrowRight, Clock, Trophy } from "lucide-react"
import Header from "@/components/header"
import AuthModal from "@/components/auth-modal"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import Image from "next/image"

export default function EventsPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<"login" | "signup">("login")
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
        setUser(user)
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase.auth])

  const handleAuth = (type: "login" | "signup") => {
    setAuthType(type)
    setShowAuthModal(true)
  }

  // Sample completed events data
  const completedEvents = [
    {
      id: 1,
      title: "Career Advice By IITIAN ( 2ND YEAR + GATE )",
      description: " In this session, Sonu will share his personal roadmap—how he cracked GATE, explored AI & ML, built impactful projects, and landed a prestigious role.",
      date: "July 19, 2025",
      location: "Google Meet",
      attendees: 233,
      image: "/images/Sonu yadav Poster.webp",
      category: "Session",
      duration: "2 Hours",
      highlights: ["DSA", "Gate Prepartion", "AI & ML", "Project Deployment"]
    },
    {
      id: 2,
      title: "How to Win Smart India Hackathon 2025",
      description: "Expect practical checklists for SIH readiness, plug-and-play templates for planning and pitching, and a live Q&A with feedback on your approach.",
      date: "September  1, 2025",
      location: "Google Meet",
      attendees: 172,
      image: "/images/Arkja Gaur - SIH Winner 2024.webp",
      category: "Webinar",
      duration: "2 Hours",
      highlights: ["Team Formation", "Judges", "Problem Statement", "Industry Applications"]
    },
    {
      id: 3,
      title: "CodeNeuraX Webinar: Data Science & AI Roadmap",
      description: "From Resume to Research: A step-by-step guide to crafting your career in Data Science & AI. ​Abhinav Kumar – Data Scientist (4+ years) at LTIMindtree, Stealth Startup Founder and NIT Warangal alumnus.",
      date: "September 19,2025",
      location: "Google Meet",
      attendees: 109,
      image: "/images/Abhinav Kumar - CodeNeuraX - 11 - Final.webp",
      category: "Webinar",
      duration: "2 Hours",
      highlights: ["Data Science", "Machine Learning", "LLM", "Research Papers"]
    },
    {
       id: 4,
  title: "From Tier-3 to Flipkart : A Complete Software Developer Roadmap",
  description: "An inspiring session with Mansi Somani, Software Developer at Flipkart, sharing her journey from a Tier-3 college to a top product-based company. Learn the roadmap, interview strategy, and mindset to land your dream tech role.",
  date: "October 15, 2025",
  location: "Online",
  attendees: 136,
  image: "/images/Mansi Somani - 1.webp",
  category: "Webinar",
 duration: "2 Hours",
  highlights: [
    "Roadmap",
    "Resources & Strategies",
    "Building a strong resume and projects",
    "Insights from Mansi’s journey to Flipkart"
  ],
    },
   /* {
      id: 5,
      title: "Cloud Computing Masterclass",
      description: "Deep dive into cloud architecture, deployment strategies, and best practices for scalable applications.",
      date: "November 25, 2023",
      location: "Cloud Campus, Tech Valley",
      attendees: 200,
      image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Masterclass",
      duration: "1 Day",
      highlights: ["AWS Services", "Docker & Kubernetes", "Microservices", "DevOps Practices"]
    },
    {
      id: 6,
      title: "Data Science & Analytics Workshop",
      description: "Practical data science techniques using Python, pandas, and machine learning libraries for real-world projects.",
      date: "October 15, 2023",
      location: "Data Center, Analytics Hub",
      attendees: 90,
      image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800",
      category: "Workshop",
      duration: "2 Days",
      highlights: ["Python for Data Science", "Statistical Analysis", "Data Visualization", "Predictive Modeling"]
    }*/
  ]


  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading events...</p>
        </div>
      </div>
    )
  }

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
              <div className="inline-flex items-center gap-2 bg-purple-800/50 border border-purple-700/50 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium tracking-wide">CodeNeuraX Events</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-black mb-8 relative">
                <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                  CNX
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
                  Events
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
                Join our community events, workshops, and conferences to enhance your skills
                <br />
                <span className="text-purple-400 font-semibold">and connect with fellow developers.</span>
              </p>


      {/* Button directly above Completed Events title */}
  <div className="flex justify-center">
        <a
          href="/#upcoming-events"
          className="inline-block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
        >
          Go to Upcoming Events
        </a>
      </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Completed Events Section */}
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
              Completed{" "}
              <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                Events
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Explore our past events and watch the recordings to catch up on what you missed.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {completedEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <Link href={`/events/${event.id}`}>
                  <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl overflow-hidden hover:border-green-500/30 transition-all duration-500 hover:transform hover:scale-105 relative">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                        quality={85}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className="bg-green-600/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {event.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4">
                        <div className="bg-black/70 backdrop-blur-sm rounded-full p-2 group-hover:bg-green-600/70 transition-colors">
                          <Play className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed mb-4 line-clamp-3">
                        {event.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>{event.attendees} attendees</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{event.duration}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.highlights.slice(0, 2).map((highlight, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-800/50 text-gray-300 px-2 py-1 rounded-full text-xs"
                          >
                            {highlight}
                          </span>
                        ))}
                        {event.highlights.length > 2 && (
                          <span className="bg-gray-800/50 text-gray-300 px-2 py-1 rounded-full text-xs">
                            +{event.highlights.length - 2} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-green-400 font-medium text-sm">Watch Recording</span>
                        <ArrowRight className="w-4 h-4 text-green-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-12 relative">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-lg">Team CodeNeuraX 💙</p>
        </div>
      </footer>

      {showAuthModal && <AuthModal type={authType} onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}