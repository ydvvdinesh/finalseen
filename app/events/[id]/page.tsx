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
      date: "Sepptember 1, 2025",
      location: "Google Meet",
      attendees: 172,
      image: "/images/Arkja Gaur - SIH Winner 2024.webp",
      category: "Webinar",
      duration: "2 Hours",
      highlights: ["Team Formation", "Judges", "Problem Statement", "Industry Applications"],
      youtubeId: "bL79zxRykuo", // Sample YouTube video ID
      instructor: "Arkja Gaur",
      rating: 5,
      totalRatings: 15,
      agenda: [
        { day: "Part 1", topics: [      "Overview of Smart India Hackathon",
          "Key Benefits of Participation",
          "Success Story: Winning SIH 2024"] },
        { day: "Part 2", topics: [      "Overview of Smart India Hackathon & Success Story (2024 Winner)",
          "How to Choose the Right Problem Statement",
          "Effective Team Formation and Role Division",
          "Tools & Platforms for Smooth Collaboration",
          "Building a Prototype under Time Constraints",
          "Judging Criteria & How to Impress the Panel",
          "Pitching and Presentation Skills",
          "Industry Applications of SIH Projects",
          "Live Q&A and Personalized Feedback"
        ] }
      ],
      testimonials: [
        { name: "Divya Parmar", role: "3rd year,B.tech", comment: "Incredible insights from industry leaders!" },
        { name: "Navadeep", role: "2nd year,B.tech", comment: "The networking opportunities were invaluable." }
      ]
    },
    "3": {
 id: 3,
title: "CodeNeuraX Webinar: Data Science & AI Roadmap",
description: "From Resume to Research: A step-by-step guide to crafting your career in Data Science & AI. Abhinav Kumar – Data Scientist (4+ years) at LTIMindtree, Stealth Startup Founder and NIT Warangal alumnus.",
date: "September 19, 2025",
location: "Google Meet",
attendees: 109,
image: "/images/Abhinav Kumar - CodeNeuraX - 11 - Final.webp",
category: "Webinar",
duration: "2 Hours",
highlights: [
  "Data Science Career Path",
  "AI & Machine Learning Fundamentals",
  "Resume & Portfolio Building",
  "Research & Project Guidance",
  "Industry Insights from Experts"
],
youtubeId: "t_MyTagczmQ",
instructor: "Abhinav Kumar",
rating: 4.7,
totalRatings: 76,
agenda: [
  { day: "Part 1", topics: ["Introduction to Data Science & AI", "Essential Skills & Tools", "Building a Strong Resume & Portfolio"] },
  { day: "Part 2", topics: ["Exploring Research Opportunities", "Hands-on AI/ML Project Walkthroughs", "Career Guidance & Industry Insights"] }
],
testimonials: [
  { name: "Dr.Andrew John", role: "Ml Intern", comment: "Informative" },
  { name: "Nagesh Reddy", role: "Student", comment: "Loved the practical examples and exercises." }
 ]
    },
    "4": {
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
    "Step-by-step roadmap for software developers",
    "Effective coding interview preparation",
    "Building a strong resume and projects",
    "Insights from Mansi’s journey to Flipkart"
  ],
  youtubeId: "ebuN8SHIkLw", // Placeholder YouTube video ID
  instructor: "Mansi Somani",
  rating: 5,
  totalRatings: 30,
agenda: [
    { 
      day: "Evening", 
      topics: [
        "Mansi’s Journey from Tier-3 College to Flipkart",
        "Roadmap to Become a Software Developer",
        "Interview Preparation & DSA Strategy",
        "Q&A and Career Guidance"
      ] 
    }
  ],
  testimonials: [
    { name: "Kiran Patil", role: "CS Student", comment: "Truly motivating! Helped me understand how to plan my career roadmap effectively." },
    { name: "Neha Sharma", role: "Aspiring Developer", comment: "Mansi’s insights were so practical and relatable. Loved every minute!" }
  ],
    },
    "5": {
  id: 5,
  title: "Journey to Microsoft: From Student to Software Engineer",
  description: "Learn how Parth Thakrar turned his dream of working at Microsoft into reality. This session covers his journey, preparation strategy, roadmap, and insights for aspiring software engineers.",
  date: "November 15, 2025",
  location: "Online",
  attendees: 119,
  image: "/images/CodeNeuraX (1080 x 1080 px) - Parth.png",
  category: "Webinar",
  duration: "2 Hours",
  highlights: [
    "Career Journey",
    "Microsoft Preparation Strategy",
    "Interview Insights",
    "Roadmap for Microsoft",
    "Live Q&A"
  ],
  youtubeId: "t_MyTagczmQ", // Add if you have a YouTube recording
  instructor: "Parth Thakrar",
  rating: 5.0, // You can adjust
  totalRatings: 20,
  agenda: [
    { 
      day: "Single Session", 
      topics: [
        "Parth's Journey & Challenges",
        "Microsoft Recruitment Preparation",
        "DSA + System Design Approach",
        "Resume & Project Strategy",
        "Q&A with Speaker"
      ] 
    }
  ],
  testimonials: [
    { name: "Meet Parsna", role: "Aspiring Software Engineer", comment: "Very inspiring and practical journey shared by Parth!" },
    { name: "Shwati", role: "Tech Enthusiast", comment: "Loved the clarity and roadmap he provided!" }
  ]
    },
    "6": {
  id: 6,
  title: "CodeNeuraX Webinar: Crack Amazon Internship in 2nd & 3rd Year",
  description: "An exclusive career-focused session with Amulya Bharti J, Upcoming SDE Intern at Amazon. Learn the exact preparation roadmap, DSA strategies, project-building approach, and behavioral preparation Amazon looks for in its interns.",
  date: "December 25, 2025",
  location: "Online",
  attendees: 114,
  image: "/images/6.jpg",
  category: "Career Session",
  duration: "2 Hours",
  highlights: [
    "Amazon Internship Preparation Roadmap",
    "DSA & Problem-Solving Strategy",
    "Project Building & Resume Optimization",
    "Amazon Leadership Principles Deep Dive",
    "Behavioral Interview Preparation",
    "Live Q&A Session"
  ],
  youtubeId: "4Ayw7ajVi28", // Replace with actual session recording ID
  instructor: "Amulya Bharti J",
  rating: 4.9,
  totalRatings: 18,
  agenda: [
    {
      day: "Session Flow",
      topics: [
        "How to Start Amazon Internship Preparation",
        "DSA Strategy & Resources",
        "Building Strong Projects",
        "Understanding Amazon Leadership Principles",
        "Interview Experience & Insights",
        "Live Q&A"
      ]
    }
  ],
  testimonials: [
    {
      name: "Rishi Verma",
      role: "2nd Year CSE Student",
      comment: "This session gave me absolute clarity on how to prepare for Amazon internships."
    },
    {
      name: "Priya Sharma",
      role: "Aspiring Software Engineer",
      comment: "The breakdown of DSA and leadership principles was extremely practical and motivating."
    }
  ]
    },
  "7": {
    "id": 7,
    "title": "CodeNeuraX: A Journey into Data Science",
    "description": "CodeNeuraX proudly presents an exclusive career-focused session — A Journey into Data Science — featuring Nivedita Gupta, Data Scientist at Flipkart. This session covers her journey, roadmap, required skills, real-world applications of data science at Flipkart, and career guidance for aspiring data scientists.",
    "date": "January 17, 2026",
    "location": "Google Meet",
    "attendees": 96,
    "image": "/images/7.png",
    "category": "Webinar",
    "duration": "2 Hours",
    "highlights": [
      "Data Science Career Roadmap",
      "Beginner to Advanced Skill Progression",
      "Real-world Applications at Flipkart",
      "Tools & Technologies",
      "Live Q&A"
    ],
    "youtubeId": "cBNuPgm6_8w",
    "instructor": "Nivedita Gupta",
    "rating": 4.2,
    "totalRatings": 48,
    "agenda": [
      {
        "day": "Single Session",
        "topics": [
          "Speaker's Journey into Data Science",
          "Data Science Fundamentals & Skills",
          "Industry Use-Cases at Flipkart",
          "Project & Career Guidance",
          "Q&A with Speaker"
        ]
      }
    ],
    "testimonials": [
      {
        "name": "Aarav Patel",
        "role": "Data Science Student",
        "comment": "The session gave a very clear roadmap and real industry perspective on data science."
      },
      {
        "name": "Sneha Sharma",
        "role": "Aspiring Data Analyst",
        "comment": "Very insightful session with practical guidance and honest career advice."
      }
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
          <p className="text-gray-400 text-lg">Team CodeNeuraX 💙</p>
        </div>
      </footer>

      {showAuthModal && <AuthModal type={authType} onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}