"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, Users, Play, ArrowLeft, Clock, Trophy, CheckCircle, Star, Sparkles } from "lucide-react"
import Header from "@/components/header"
import AuthModal from "@/components/auth-modal"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import Image from "next/image"

interface EventPageProps {
  params: {
    id: string
  }
}

export default function EventPage({ params }: EventPageProps) {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<"login" | "signup">("login")
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [showVideo, setShowVideo] = useState(false)
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
    } = supabase.auth.onAuthStateChange((event: any, session: any) => {
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

  // Sample event data
  const eventsData: { [key: string]: any } = {
    "1": {
      id: 1,
      title: "Career Advice By IITIAN ( 2ND YEAR + GATE )",
      description: "In this session, Sonu will share his personal roadmap—how he cracked GATE, explored AI & ML, built impactful projects, and landed a prestigious role.",
      date: "July 19, 2025",
      location: "Google Meet",
      attendees: 233,
      image: "/images/Sonu yadav Poster.webp",
      category: "Session",
      duration: "2 Hours",
      highlights: ["DSA", "Gate Prepartion", "AI & ML", "Project Deployment"],
      youtubeId: "3Cr3gEoN9mk",
      instructor: "Sonu Yadav",
      rating: 4.9,
      totalRatings: 46,
      agenda: [
        { day: "Part 1", topics: ["Gate Roadmap", "Resource", "Mistake which have to Avoid"] },
        { day: "Part 2", topics: ["Doubts", "Gate Notes", "How to prepare with job"] },
        { day: "Part 3", topics: ["What is AI & ML", "Future In AI", "How to become AI Researcher"] }
      ],
      testimonials: [
        { name: "Vineet Yadav", role: "Student", comment: "Amazing Session ! Learned so much in just 2 Hours." },
        { name: "Isha Thaker, Marwadi University", role: "Student", comment: "A big shoutout to Team CodeNeuraX for bringing a man like him to the stage" }
      ]
    },
    "2": {
      id: 2,
      title: "How to Win Smart India Hackathon 2025",
      description: "Expect practical checklists for SIH readiness, plug-and-play templates for planning and pitching, and a live Q&A with feedback on your approach.",
      date: "September 1, 2025",
      location: "Google Meet",
      attendees: 172,
      image: "/images/Arkja Gaur - SIH Winner 2024.webp",
      category: "Webinar",
      duration: "2 Hours",
      highlights: ["Team Formation", "Judges", "Problem Statement", "Industry Applications"],
      youtubeId: "r2Y81-yN2yQ",
      instructor: "Arkja Gaur",
      rating: 4.8,
      totalRatings: 32,
      agenda: [
        { day: "Part 1", topics: ["SIH Overview", "Team Formation", "Idea Generation"] },
        { day: "Part 2", topics: ["Pitching Strategies", "Presentation Templates", "Live Q&A"] }
      ],
      testimonials: [
        { name: "Aditya Roy", role: "Hackathon Lead", comment: "The practical tips on presentation and answering judge questions were gold." },
        { name: "Sneha Patel", role: "Student", comment: "Arkja's direct advice made hackathon preparation seem structured and achievable." }
      ]
    },
    "3": {
      id: 3,
      title: "CodeNeuraX Webinar: Data Science & AI Roadmap",
      description: "From Resume to Research: A step-by-step guide to crafting your career in Data Science & AI. Abhinav Kumar – Data Scientist at LTIMindtree, Startup Founder, NIT Warangal alumnus.",
      date: "September 19, 2025",
      location: "Google Meet",
      attendees: 109,
      image: "/images/Abhinav Kumar - CodeNeuraX - 11 - Final.webp",
      category: "Webinar",
      duration: "2 Hours",
      highlights: ["Data Science", "Machine Learning", "LLM", "Research Papers"],
      youtubeId: "V_J1b9z_Rk8",
      instructor: "Abhinav Kumar",
      rating: 4.9,
      totalRatings: 28,
      agenda: [
        { day: "Part 1", topics: ["Data Science Roadmap", "Mathematical Foundations", "ML Algorithms"] },
        { day: "Part 2", topics: ["LLM Applications", "Writing Research Papers", "Career Guidance"] }
      ],
      testimonials: [
        { name: "Rahul Soni", role: "AI Enthusiast", comment: "The roadmap shared was the most actionable one I've ever seen." }
      ]
    },
    "4": {
      id: 4,
      title: "From Tier-3 to Flipkart : A Complete Software Developer Roadmap",
      description: "An inspiring session with Mansi Somani, Software Developer at Flipkart, sharing her journey from a Tier-3 college to a top product-based company.",
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
      youtubeId: "7T_J2b9r_Qk",
      instructor: "Mansi Somani",
      rating: 5.0,
      totalRatings: 40,
      agenda: [
        { day: "Single Session", topics: ["Tier-3 Challenges", "DSA Strategy", "Interview Rounds", "Flipkart Experience"] }
      ],
      testimonials: [
        { name: "Kunal Mehra", role: "Student", comment: "Extremely relatable and packed with actionable advice." }
      ]
    },
    "5": {
      id: 5,
      title: "Journey to Microsoft : From Student to Software Engineer",
      description: "An insightful session with Ishita Rai, Software Engineer at Microsoft, sharing her inspiring journey from college to one of the world's leading tech companies.",
      date: "November 23, 2025",
      location: "Online",
      attendees: 215,
      image: "/images/Ishita Rai - Session Poster - 1.webp",
      category: "Webinar",
      duration: "2 Hours",
      highlights: [
        "Microsoft Journey",
        "Interview Preparation",
        "Resume & Project Tips",
        "Q&A Session"
      ],
      youtubeId: "t_MyTagczmQ",
      instructor: "Ishita Rai",
      rating: 4.9,
      totalRatings: 35,
      agenda: [
        { day: "Session Flow", topics: ["College Preparation", "Microsoft Interview Process", "Key Takeaways"] }
      ],
      testimonials: [
        { name: "Riya Verma", role: "Student", comment: "Super inspiring! Answered all my doubts regarding Microsoft hiring." }
      ]
    },
    "6": {
      id: 6,
      title: "CodeNeuraX: Master the Amazon Interview",
      description: "An exclusive career-focused session with Vanshika Goyal, Incoming SDE at Amazon, sharing her comprehensive roadmap to crack top tech interviews.",
      date: "December 08, 2025",
      location: "Online",
      attendees: 180,
      image: "/images/vanshika-goyal.webp",
      category: "Webinar",
      duration: "2 Hours",
      highlights: [
        "Amazon SDE Roadmap",
        "DSA & Problem Solving Strategy",
        "Resume Building & Projects",
        "Live Q&A Session"
      ],
      youtubeId: "4Ayw7ajVi28",
      instructor: "Vanshika Goyal",
      rating: 4.9,
      totalRatings: 25,
      agenda: [
        { day: "Single Session", topics: ["Amazon Leadership Principles", "DSA Prep", "Interview Insights"] }
      ],
      testimonials: [
        { name: "Priya Sharma", role: "Aspiring SDE", comment: "Clear, concise, and super helpful!" }
      ]
    },
    "7": {
      id: 7,
      title: "CodeNeuraX: A Journey into Data Science",
      description: "An exclusive career-focused session with Nivedita Gupta, Data Scientist at Flipkart, covering her journey, roadmap, and real-world data science at scale.",
      date: "January 17, 2026",
      location: "Online",
      attendees: 96,
      image: "/images/7.png",
      category: "Webinar",
      duration: "2 Hours",
      highlights: [
        "Data Science Career Roadmap",
        "Beginner to Advanced Skill Progression",
        "Real-world Data Science at Flipkart",
        "Tools & Technologies",
        "Live Q&A"
      ],
      youtubeId: "cBNuPgm6_8w",
      instructor: "Nivedita Gupta",
      rating: 4.8,
      totalRatings: 30,
      agenda: [
        { day: "Single Session", topics: ["Speaker Journey", "Data Science at Scale", "Skill Progression"] }
      ],
      testimonials: [
        { name: "Aarav Patel", role: "Data Science Student", comment: "Practical guidance from someone working at Flipkart!" }
      ]
    },
    "8": {
      id: 8,
      title: "CodeNeuraX: Crack the Google Interview",
      description: "An exclusive session with Divanshi Jain, Incoming SWE at Google, covering her roadmap, DSA prep, resume tips, and real Google interview experience.",
      date: "April 17, 2026",
      location: "Online",
      attendees: 350,
      image: "/images/8.png",
      category: "Webinar",
      duration: "2 Hours",
      highlights: [
        "Roadmap to Crack Top Tech Interviews",
        "Effective DSA Preparation Strategy",
        "Resume & Profile Building Tips",
        "Real Google Interview Experience",
        "Live Q&A"
      ],
      youtubeId: "KySipqF3kos",
      instructor: "Divanshi Jain",
      rating: 4.9,
      totalRatings: 52,
      agenda: [
        { day: "Single Session", topics: ["Journey to Google", "DSA Strategy", "Interview Frameworks", "Live Q&A"] }
      ],
      testimonials: [
        { name: "Rohan Mehta", role: "CSE Student", comment: "The best session for preparing for product-based companies!" }
      ]
    }
  }

  const event = eventsData[params.id]

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-xs" style={{ fontFamily: "var(--font-mono)" }}>Loading event...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="text-center glass-card p-10 max-w-md">
          <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-serif)" }}>Event Not Found</h1>
          <p className="text-white/40 mb-8 text-sm">The event you're looking for doesn't exist.</p>
          <Link
            href="/events"
            className="btn-premium text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white">
      {/* Ambient glows */}
      <div className="ambient-glow w-96 h-96 top-0 left-1/4" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.08), transparent 70%)' }} />
      <div className="ambient-glow w-96 h-96 bottom-0 right-1/4" style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.06), transparent 70%)' }} />

      <Header onAuth={handleAuth} />

      {/* Back Button */}
      <div className="fixed top-24 left-6 z-40">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white/60 bg-white/[0.03] border border-white/[0.06] hover:text-white hover:border-white/20 backdrop-blur-md transition-all"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Events
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              {/* Event Image */}
              <div className="relative">
                <div className="relative h-96 rounded-3xl overflow-hidden glass-card">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-6 left-6">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-300 border border-green-500/20 backdrop-blur-sm"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {event.category}
                    </span>
                  </div>
                  {!showVideo && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className="absolute inset-0 flex items-center justify-center group"
                    >
                      <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-full p-5 group-hover:scale-110 transition-all duration-300">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </button>
                  )}
                </div>

                {/* YouTube Video Embed */}
                {showVideo && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 rounded-3xl overflow-hidden z-20 border border-white/20 shadow-2xl"
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${event.youtubeId}?autoplay=1`}
                      title={event.title}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </motion.div>
                )}
              </div>

              {/* Event Details */}
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "var(--font-serif)" }}>
                  {event.title}
                </h1>
                <p className="text-base sm:text-lg text-white/40 mb-8 leading-relaxed">
                  {event.description}
                </p>

                {/* Event Info */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <Calendar className="w-4 h-4 text-green-400/80" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <MapPin className="w-4 h-4 text-green-400/80" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <Users className="w-4 h-4 text-green-400/80" />
                    <span>{event.attendees} attendees</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <Clock className="w-4 h-4 text-green-400/80" />
                    <span>{event.duration}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <Trophy className="w-4 h-4 text-green-400/80" />
                    <span>Instructor: {event.instructor}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(event.rating)
                            ? "text-amber-400 fill-current"
                            : "text-white/20"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-white text-sm font-medium">{event.rating}</span>
                  <span className="text-white/30 text-xs" style={{ fontFamily: "var(--font-mono)" }}>({event.totalRatings} ratings)</span>
                </div>

                {/* Watch Button */}
                <button
                  onClick={() => setShowVideo(true)}
                  className="btn-premium btn-green text-sm"
                >
                  <Play className="w-4 h-4" />
                  Watch Event Recording
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Highlights */}
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
                Event <span className="gradient-text-purple">Highlights</span>
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {event.highlights.map((highlight: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 text-center"
                >
                  <CheckCircle className="w-6 h-6 text-purple-400/80 mx-auto mb-3" />
                  <h3 className="text-white/80 font-medium text-sm">{highlight}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Event Agenda */}
      <section className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center" style={{ fontFamily: "var(--font-serif)" }}>
                Event <span className="gradient-text-cyan">Agenda</span>
              </h2>
              <div className="space-y-4">
                {event.agenda.map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="glass-card p-6"
                  >
                    <h3 className="text-base font-semibold text-white mb-3" style={{ fontFamily: "var(--font-mono)" }}>{item.day}</h3>
                    <div className="grid md:grid-cols-3 gap-2">
                      {item.topics.map((topic: string, topicIndex: number) => (
                        <div
                          key={topicIndex}
                          className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 text-white/60 text-xs"
                        >
                          {topic}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center" style={{ fontFamily: "var(--font-serif)" }}>
                What <span className="gradient-text-amber">Attendees Say</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {event.testimonials.map((testimonial: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-white/60 mb-4 text-sm leading-relaxed italic">"{testimonial.comment}"</p>
                    <div>
                      <p className="text-white font-medium text-sm">{testimonial.name}</p>
                      <p className="text-white/30 text-xs" style={{ fontFamily: "var(--font-mono)" }}>{testimonial.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.04] py-10 relative">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/20 text-xs tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>Team CodeNeuraX 💙</p>
        </div>
      </footer>

      {showAuthModal && <AuthModal type={authType} onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}