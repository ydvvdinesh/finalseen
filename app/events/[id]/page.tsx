"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Calendar, MapPin, Users, Play, ArrowLeft, Clock, Trophy, CheckCircle, Star } from "lucide-react"
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

  // Sample event data - in a real app, this would be fetched based on the ID
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
      youtubeId: "3Cr3gEoN9mk", // Sample YouTube video ID
      instructor: "Sonu Yadav",
      rating: 5,
      totalRatings: 10,
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
      title: "AI & Machine Learning Summit",
      description: "Industry experts sharing insights on the latest trends in artificial intelligence and machine learning applications. A full-day conference featuring keynotes, panel discussions, and networking opportunities.",
      date: "February 28, 2024",
      location: "Virtual Event",
      attendees: 300,
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200",
      category: "Conference",
      duration: "1 Day",
      highlights: ["Deep Learning", "Neural Networks", "AI Ethics", "Industry Applications"],
      youtubeId: "jNQXAC9IVRw", // Sample YouTube video ID
      instructor: "Dr. Michael Roberts",
      rating: 4.9,
      totalRatings: 287,
      agenda: [
        { day: "Morning", topics: ["AI Trends 2024", "Deep Learning Advances", "Ethics in AI"] },
        { day: "Afternoon", topics: ["Industry Case Studies", "Future of ML", "Q&A Panel"] }
      ],
      testimonials: [
        { name: "David Kim", role: "Data Scientist", comment: "Incredible insights from industry leaders!" },
        { name: "Lisa Wang", role: "ML Engineer", comment: "The networking opportunities were invaluable." }
      ]
    },
    "3": {
      id: 3,
      title: "Mobile App Development Workshop",
      description: "Hands-on workshop for building cross-platform mobile applications using React Native and Flutter. Perfect for developers wanting to expand into mobile development.",
      date: "January 20-21, 2024",
      location: "Innovation Hub, Downtown",
      attendees: 80,
      image: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1200",
      category: "Workshop",
      duration: "2 Days",
      highlights: ["React Native", "Flutter", "App Store Deployment", "UI/UX Design"],
      youtubeId: "M7lc1UVf-VE", // Sample YouTube video ID
      instructor: "Jennifer Lee",
      rating: 4.7,
      totalRatings: 76,
      agenda: [
        { day: "Day 1", topics: ["React Native Setup", "Navigation", "State Management"] },
        { day: "Day 2", topics: ["Flutter Basics", "UI Components", "App Store Submission"] }
      ],
      testimonials: [
        { name: "Tom Wilson", role: "Mobile Developer", comment: "Great introduction to cross-platform development!" },
        { name: "Anna Rodriguez", role: "iOS Developer", comment: "Loved the practical examples and exercises." }
      ]
    },
    "4": {
      id: 4,
      title: "Cybersecurity Awareness Seminar",
      description: "Essential cybersecurity practices for developers and IT professionals in the modern digital landscape. Learn about threat detection, secure coding practices, and incident response.",
      date: "December 10, 2023",
      location: "Security Center, Business District",
      attendees: 120,
      image: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1200",
      category: "Seminar",
      duration: "Half Day",
      highlights: ["Threat Detection", "Secure Coding", "Network Security", "Incident Response"],
      youtubeId: "bFEoMO0pc7k", // Sample YouTube video ID
      instructor: "Robert Anderson",
      rating: 4.6,
      totalRatings: 98,
      agenda: [
        { day: "Morning", topics: ["Current Threat Landscape", "Secure Development Practices", "Network Security Fundamentals"] }
      ],
      testimonials: [
        { name: "Emily Davis", role: "Security Analyst", comment: "Eye-opening session on modern security threats." },
        { name: "James Brown", role: "DevOps Engineer", comment: "Practical tips I can implement immediately." }
      ]
    },
    "5": {
      id: 5,
      title: "Cloud Computing Masterclass",
      description: "Deep dive into cloud architecture, deployment strategies, and best practices for scalable applications. Comprehensive coverage of AWS services, containerization, and DevOps practices.",
      date: "November 25, 2023",
      location: "Cloud Campus, Tech Valley",
      attendees: 200,
      image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1200",
      category: "Masterclass",
      duration: "1 Day",
      highlights: ["AWS Services", "Docker & Kubernetes", "Microservices", "DevOps Practices"],
      youtubeId: "3c-iBn73dDE", // Sample YouTube video ID
      instructor: "Mark Thompson",
      rating: 4.8,
      totalRatings: 189,
      agenda: [
        { day: "Full Day", topics: ["Cloud Architecture", "Containerization", "Orchestration", "CI/CD Pipelines"] }
      ],
      testimonials: [
        { name: "Sophie Miller", role: "Cloud Architect", comment: "Comprehensive coverage of cloud technologies!" },
        { name: "Ryan Clark", role: "DevOps Engineer", comment: "The hands-on labs were extremely valuable." }
      ]
    },
    "6": {
      id: 6,
      title: "Data Science & Analytics Workshop",
      description: "Practical data science techniques using Python, pandas, and machine learning libraries for real-world projects. Learn statistical analysis, data visualization, and predictive modeling.",
      date: "October 15, 2023",
      location: "Data Center, Analytics Hub",
      attendees: 90,
      image: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1200",
      category: "Workshop",
      duration: "2 Days",
      highlights: ["Python for Data Science", "Statistical Analysis", "Data Visualization", "Predictive Modeling"],
      youtubeId: "LHBE6Q9XlzI", // Sample YouTube video ID
      instructor: "Dr. Amanda Foster",
      rating: 4.7,
      totalRatings: 84,
      agenda: [
        { day: "Day 1", topics: ["Python Fundamentals", "Pandas & NumPy", "Data Cleaning"] },
        { day: "Day 2", topics: ["Statistical Analysis", "Machine Learning", "Data Visualization"] }
      ],
      testimonials: [
        { name: "Kevin Zhang", role: "Data Analyst", comment: "Perfect introduction to data science!" },
        { name: "Rachel Green", role: "Business Analyst", comment: "Learned practical skills I use daily now." }
      ]
    }
  }

  const event = eventsData[params.id]

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading event...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Event Not Found</h1>
          <p className="text-gray-400 mb-8">The event you're looking for doesn't exist.</p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Link>
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
      </div>

      <Header onAuth={handleAuth} />

      {/* Back Button */}
      <div className="fixed top-24 left-4 z-40">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 text-white px-4 py-2 rounded-xl font-medium hover:bg-gray-800/80 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20">
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
                <div className="relative h-96 rounded-3xl overflow-hidden">
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
                    <span className="bg-green-600/90 text-white px-4 py-2 rounded-full text-sm font-medium">
                      {event.category}
                    </span>
                  </div>
                  {!showVideo && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className="absolute inset-0 flex items-center justify-center group"
                    >
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110">
                        <Play className="w-12 h-12 text-white ml-1" />
                      </div>
                    </button>
                  )}
                </div>

                {/* YouTube Video Embed */}
                {showVideo && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 rounded-3xl overflow-hidden"
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
                <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
                  {event.title}
                </h1>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  {event.description}
                </p>

                {/* Event Info */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="w-5 h-5 text-green-400" />
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="w-5 h-5 text-green-400" />
                    <span className="font-medium">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Users className="w-5 h-5 text-green-400" />
                    <span className="font-medium">{event.attendees} attendees</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="w-5 h-5 text-green-400" />
                    <span className="font-medium">{event.duration}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Trophy className="w-5 h-5 text-green-400" />
                    <span className="font-medium">Instructor: {event.instructor}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(event.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-white font-medium">{event.rating}</span>
                  <span className="text-gray-400">({event.totalRatings} ratings)</span>
                </div>

                {/* Watch Button */}
                <button
                  onClick={() => setShowVideo(true)}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-green-500/25"
                >
                  <Play className="w-5 h-5" />
                  Watch Event Recording
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Highlights */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-black text-white mb-8">
                Event{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Highlights
                </span>
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {event.highlights.map((highlight: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 text-center hover:border-purple-500/30 transition-all duration-300"
                  >
                    <CheckCircle className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <h3 className="text-white font-semibold">{highlight}</h3>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Agenda */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-black text-white mb-12 text-center">
                Event{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Agenda
                </span>
              </h2>
              <div className="space-y-6">
                {event.agenda.map((item: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
                  >
                    <h3 className="text-xl font-bold text-cyan-400 mb-4">{item.day}</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      {item.topics.map((topic: string, topicIndex: number) => (
                        <div
                          key={topicIndex}
                          className="bg-gray-800/50 rounded-lg p-3 text-gray-300"
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
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-black text-white mb-12 text-center">
                What{" "}
                <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  Attendees Say
                </span>
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {event.testimonials.map((testimonial: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4 italic">"{testimonial.comment}"</p>
                    <div>
                      <p className="text-white font-semibold">{testimonial.name}</p>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
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