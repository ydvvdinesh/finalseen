"use client"

import { useState, useRef, Suspense } from "react"
import { motion } from "framer-motion"
import {
  Code,
  Users,
  Zap,
  BookOpen,
  MessageCircle,
  Trophy,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Calendar,
  Clock,
  MapPin,
  Lightbulb,
  Youtube,
} from "lucide-react"
import Header from "@/components/header"
import ProgrammingLanguages from "@/components/programming-languages"
import Image from "next/image"
import AuthModal from "@/components/auth-modal"
import dynamic from "next/dynamic"
import Autoplay from "embla-carousel-autoplay"
import Chatbot from "@/components/Chatbot";

// Dynamic imports for better performance
const Carousel = dynamic(() => import("@/components/ui/carousel").then(mod => mod.Carousel), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-800/50 rounded-3xl animate-pulse" />
})

const CarouselContent = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselContent), {
  ssr: false
})

const CarouselItem = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselItem), {
  ssr: false
})

const CarouselPrevious = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselPrevious), {
  ssr: false
})

const CarouselNext = dynamic(() => import("@/components/ui/carousel").then(mod => mod.CarouselNext), {
  ssr: false
})

export default function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<"login" | "signup">("login")

  const handleAuth = (type: "login" | "signup") => {
    setAuthType(type)
    setShowAuthModal(true)
  }

  // Contact form state
  const [cfName, setCfName] = useState("")
  const [cfEmail, setCfEmail] = useState("")
  const [cfMobile, setCfMobile] = useState(""); // Add mobile number state
  const [cfTopic, setCfTopic] = useState("career_guidance")
  const [cfMessage, setCfMessage] = useState("")
  const [cfSending, setCfSending] = useState(false)
  const [cfSuccess, setCfSuccess] = useState<string | null>(null)
  const [cfError, setCfError] = useState<string | null>(null)

  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault()
    setCfError(null)
    setCfSuccess(null)
    setCfSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cfName,
          email: cfEmail,
          mobile: cfMobile, // <-- add mobile
          topic: cfTopic,
          message: cfMessage,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.error || 'Failed to send message')
      }
      setCfSuccess('Thanks! Your request has been sent.')
      setCfName('')
      setCfEmail('')
      setCfMobile('')
      setCfTopic('career_guidance')
      setCfMessage('')
    } catch (err: any) {
      setCfError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setCfSending(false)
    }
  }

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Driven",
      description: "Connect with like-minded students and professionals in an inclusive environment",
      link: "https://chat.whatsapp.com/LqYC0LCO02hGCRTMeQoFLQ",
      hasWhatsApp: true,
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "Coding Challenges",
      description: "Weekly coding challenges to sharpen your skills and prepare for interviews",
      link: "https://chat.whatsapp.com/KNMoq05gpmg2m5wMsqbRAa",
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Discussions",
      description: "Regular Ask Me Anything sessions with experienced industry professionals",
      link: "https://chat.whatsapp.com/GKCfjzZ80ooBdq3lJQu6xE",
      hasWhatsApp: true,
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Hackathons & Events",
      description: "Stay updated with the latest hackathons and tech events worldwide",
      link: "https://chat.whatsapp.com/Fn3OMDXcC48DZYboMDhsQP",
      hasWhatsApp: true,
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Learning Resources",
      description: "Curated tech news, insights, and learning materials for continuous growth",
      link: "https://chat.whatsapp.com/BV8EWgMA4V3FWUjybtw2Ue",
      hasWhatsApp: true,
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Career Opportunities",
      description: "Access to internships, job opportunities, and career guidance",
      link: "https://chat.whatsapp.com/LpMpa6jpI1OGqQDrACQnxW",
      hasWhatsApp: true,
    },
  ]

  type EventType = {
    title: string;
    date: string;
    time: string;
    location: string;
    type: string;
    description: string;
    status: string;
    registrationLink: string;
    image: string;
  };

  const events: EventType[] = [
   /* {
      title: "How to Win Smart India Hackathon 2025",
      date: "Sep 1,2025",
      time: "06:00 PM - 8:00 PM",
      location: "Online",
      type: "Workshop",
      description: "Join our expert-led session by Arkja Gaur and take the first step toward winning hackathon.",
      status: "ongoing",
      registrationLink: "https://lu.ma/rtfoub6j",
      image: "/images/Arkja Gaur - SIH Winner 2024.webp",
    },*/
    {
      title: "CodeNeuraX Webinar: Data Science & AI Roadmap",
      date: "Sep 19,2025",
      time: "6:00 PM - 8:00 PM",
      location: "Online",
      type: "Webinar",
      description: "​From Resume to Research: A step-by-step guide to crafting your career in Data Science & AI. ​Abhinav Kumar – Data Scientist (4+ years) at LTIMindtree, Stealth Startup Founder and NIT Warangal alumnus.",
      status: "Upcoming",
      registrationLink: "https://lu.ma/5b175jfy",
      image: "/images/Abhinav Kumar - CodeNeuraX - 11 - Final.webp",
    },
  ];

  const autoplay = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  return (
    <>
      {/* ...existing code... */}
      <div className="min-h-screen bg-black relative overflow-hidden" id="home" key="main-content">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50" />
          <div className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 md:w-96 h-64 md:h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <Header onAuth={handleAuth} />
        {showAuthModal && (
          <AuthModal
            type={authType}
            onClose={() => setShowAuthModal(false)}
          />
        )}

        {/* Hero Section */}
        <section className="relative pt-28 md:pt-32 pb-16 md:pb-20">
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8 md:mb-12"
              >
                <div className="inline-flex items-center gap-2 bg-gray-800/50 border border-gray-700/50 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 animate-pulse" />
                  <span className="text-cyan-300 text-xs sm:text-sm font-medium tracking-wide">
                    Student-Led Tech Community
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 sm:mb-8 relative">
                  <span className="bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
                    Code
                  </span>
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                    NeuraX
                  </span>
                  <div className="absolute -top-4 -right-4 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-ping opacity-20" />
                </h1>

                <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 leading-relaxed max-w-4xl mx-auto px-2">
                  Connect, inspire, and empower the next generation of
                  <span className="text-cyan-400 font-semibold"> coders</span>,
                  <span className="text-blue-400 font-semibold"> developers</span>, and
                  <span className="text-purple-400 font-semibold"> innovators</span>
                </p>
              </motion.div>

              {/* Programming Languages Animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="mb-8 sm:mb-12"
              >
                <ProgrammingLanguages />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mb-10 sm:mb-16"
              >
                <a
                  href="https://chat.whatsapp.com/LqYC0LCO02hGCRTMeQoFLQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 sm:gap-4 bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 text-white font-bold px-6 sm:px-12 py-3 sm:py-5 rounded-xl sm:rounded-2xl text-base sm:text-xl transition-all duration-500 transform hover:scale-105 sm:hover:scale-110 hover:shadow-2xl hover:shadow-green-500/30 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <MessageCircle className="w-5 h-5 sm:w-7 sm:h-7 animate-bounce" />
                  Join Our Community Now
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 sm:group-hover:translate-x-2 transition-transform duration-300" />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="relative"
              >
                <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center relative z-10">
                    <motion.div whileHover={{ scale: 1.05 }} className="group">
                      <div className="text-3xl sm:text-4xl font-black text-white mb-1 sm:mb-2 group-hover:text-cyan-400 transition-colors">
                        2900+
                      </div>
                      <div className="text-gray-400 text-sm sm:text-base font-medium">Active Members</div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} className="group">
                      <div className="text-3xl sm:text-4xl font-black text-white mb-1 sm:mb-2 group-hover:text-blue-400 transition-colors">
                        2+
                      </div>
                      <div className="text-gray-400 text-sm sm:text-base font-medium">Monthly Events</div>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} className="group">
                      <div className="text-3xl sm:text-4xl font-black text-white mb-1 sm:mb-2 group-hover:text-purple-400 transition-colors">
                        Ongoing
                      </div>
                      <div className="text-gray-400 text-sm sm:text-base font-medium">Success Stories</div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 sm:py-20 md:py-24 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center gap-2 bg-purple-800/50 border border-purple-700/50 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium tracking-wide">About Us</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-white mb-8">
                Who{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  We Are
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                CodeNeuraX is a platform that provides all the essential resources for computer science student needs to grow and succeed.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
              {/* Left Content */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                    <p>
                      Founded in 2025 by Dinesh Yadav, CodeNeuraX Community is a welcoming tech community designed specifically for computer science students and recent graduates. The community is organized into four WhatsApp groups to serve different needs:
                    </p>
                    <p>
                      Through workshops, hackathons, research projects, and industry partnerships, we provide our members
                      with the resources and opportunities they need to excel in the fields of robotics and artificial
                      intelligence.
                    </p>
                  </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="grid grid-cols-3 gap-8"
                >
                  <div className="text-left">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="w-6 h-6 text-purple-400" />
                      <div className="text-2xl font-black text-white">2900+</div>
                    </div>
                    <div className="text-gray-400 text-sm">Active Members</div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-3 mb-3">
                      <Code className="w-6 h-6 text-cyan-400" />
                      <div className="text-2xl font-black text-white">50+</div>
                    </div>
                    <div className="text-gray-400 text-sm">Internship Support</div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-3 mb-3">
                      <Trophy className="w-6 h-6 text-yellow-400" />
                      <div className="text-2xl font-black text-white">20+</div>
                    </div>
                    <div className="text-gray-400 text-sm">Events Per Year</div>
                  </div>
                </motion.div>
              </div>

              {/* Right Slideshow */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative h-96 rounded-3xl overflow-hidden flex items-center justify-center">
                  {/* Carousel with Autoplay and Manual Controls */}
                  <Carousel
                    opts={{ loop: true }}
                    plugins={[autoplay.current as any]}
                    className="w-full h-full"
                  >
                    <CarouselContent className="h-96">
                      {[
                        "/images/CodeNeuraX.webp",
                        "/images/Founder - CNX -1.webp",
                        "/images/From the backstage.webp",
                        "/images/Founder - CNX -2.webp",
                        "/images/Career Guidance by sonu yadav.webp",
                        "/images/mam with cnxx.webp",
                        "/images/conxx-team.webp",
                      ].map((image, index) => (
                        <CarouselItem key={index} className="relative h-96">
                          <Image
                            src={image}
                            alt={`Team photo ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover rounded-3xl"
                            priority={index === 0}
                            loading={index === 0 ? "eager" : "lazy"}
                            quality={85}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="community" className="py-16 sm:py-20 md:py-24 relative">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16 md:mb-20"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 sm:mb-8">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  CodeNeuraX
                </span>
                ?
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-2">
                We provide an inclusive platform for students and early-career professionals to explore technology,
                sharpen their skills, and unlock real-world opportunities.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-cyan-500/30 transition-all duration-500 hover:transform hover:scale-[1.02] sm:hover:scale-105 relative overflow-hidden h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div className="text-cyan-400 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:text-white">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-cyan-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
                        {feature.description}
                      </p>

                      {feature.hasWhatsApp && (
                        <a
                          href={feature.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-medium transition-colors group/link text-sm sm:text-base"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Join WhatsApp Group
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 group-hover/link:translate-x-1 transition-transform" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Events & Knowledge Section */}
        <section id="events" className="py-0 relative">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16 md:mb-20"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 sm:mb-8">
                <span className="">
                  <span className="text-white">Events</span>
                  <span> & </span>
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">Knowledge</span>
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-2">
                Stay updated with our latest events, workshops, and curated knowledge resources to accelerate your tech
                journey.
              </p>
            </motion.div>

            {/* Events Section */}
            <div className="mb-16 sm:mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-8 sm:mb-12"
              >
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                <h3 id="upcoming-events" className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Upcoming Events</h3>
              </motion.div>
              
              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                {events.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative"
                  >
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl sm:rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all duration-500 hover:transform hover:scale-[1.02] relative h-full">
                      {/* Event Image */}
                      <div className="relative h-48 sm:h-56 overflow-hidden">
                        <Image
                          src={event.image || "/placeholder.svg"}
                          alt={event.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Status badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                              event.status === "upcoming"
                                ? "bg-green-900/80 text-green-400 border border-green-800/50"
                                : event.status === "registration-open"
                                  ? "bg-blue-900/80 text-blue-400 border border-blue-800/50"
                                  : "bg-gray-800/80 text-gray-400 border border-gray-700/50"
                            }`}
                          >
                            {event.status === "upcoming"
                              ? "Upcoming"
                              : event.status === "registration-open"
                                ? "Registration Open"
                                : "Upcoming"}
                          </span>
                          <span className="bg-purple-900/80 text-purple-400 px-3 py-1 rounded-full text-xs font-medium border border-purple-800/50 backdrop-blur-sm">
                            {event.type}
                          </span>
                        </div>
                      </div>

                      <div className="relative z-10 p-6 sm:p-8">
                        <h4 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                          {event.title}
                        </h4>

                        <div className="flex flex-col gap-2 mb-4 text-sm text-gray-300">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-400" />
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-400" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-purple-400" />
                            <span>{event.location}</span>
                          </div>
                        </div>

                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">{event.description}</p>

                        {event.status !== "Ongoing" && (
                          <a
                            href={event.registrationLink}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm"
                          >
                            Register Now
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="about" className="py-8 sm:py-10 md:py-12 relative mt-20 sm:mt-28 md:mt-36">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-8 sm:mb-12">
                Our{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  Mission
                </span>
              </h2>
              <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5" />
                <div className="relative z-10">
                  <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed mb-6 sm:mb-8">
                    At CodeNeuraX, we believe that growth comes not just from individual effort but from
                    <span className="text-cyan-400 font-bold"> collective intelligence</span>. That's why we're building
                    a culture where members can exchange ideas, showcase their work, seek mentorship, and support each
                    other on their tech journeys.
                  </p>
                  <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
                    Whether you're just starting out or already building advanced projects, CodeNeuraX offers a space to
                    grow, share, and collaborate with a
                    <span className="text-purple-400 font-bold"> strong and supportive network</span>.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>


        {/* Founder Section */}
        <section id="founder" className="py-16 sm:py-20 md:py-24 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16 md:mb-20"
            >
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 sm:mb-6 tracking-tight">
                Meet Our <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">Team</span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                The passionate individuals driving CodeNeuraX forward and building an amazing platform.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 max-w-6xl mx-auto">
              {/* Founder */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="group text-center"
              >
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-cyan-500/30 transition-all duration-500 hover:transform hover:scale-[1.02] sm:hover:scale-105 relative overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                      DY
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-cyan-400 transition-colors">
                      Dinesh Yadav
                    </h3>
                    <p className="text-cyan-400 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Founder & Convener</p>
                    <p className="text-gray-300 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                      Passionate about empowering the next generation of developers through community-driven learning and
                      innovation.
                    </p>

                    {/* Social Links */}
                    <div className="flex justify-center gap-3 sm:gap-4">
                      <a
                        href="https://www.linkedin.com/in/dinesh-yadav-1b462831a/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/social bg-blue-600 hover:bg-blue-700 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-110"
                      >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                      <a
                        href="https://www.instagram.com/ydvv.dinesh/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/social bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-110"
                      >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.663.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.358-2.618-6.78-6.98-6.98C15.668.014 15.259 0 12 0zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Content Manager */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="group text-center"
              >
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-purple-500/30 transition-all duration-500 hover:transform hover:scale-[1.02] sm:hover:scale-105 relative overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                      RI
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-purple-400 transition-colors">
                      Rayan Ishani
                    </h3>
                    <p className="text-purple-400 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Content Head</p>
                    <p className="text-gray-300 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                      Creative content strategist focused on delivering engaging educational materials and community-driven content.
                    </p>

                    {/* Social Links */}
                    <div className="flex justify-center gap-3 sm:gap-4">
                      <a
                        href="https://www.linkedin.com/in/rayan-ishani-008528320/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/social bg-blue-600 hover:bg-blue-700 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-110"
                      >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                      <a
                        href="https://www.instagram.com/rayanishani/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/social bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-110"
                      >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.663.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.358-2.618-6.78-6.98-6.98C15.668.014 15.259 0 12 0zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Outreach Manager */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="group text-center"
              >
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-blue-500/30 transition-all duration-500 hover:transform hover:scale-[1.02] sm:hover:scale-105 relative overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                      SN
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2 group-hover:text-blue-400 transition-colors">
                      Shiva Nagesh
                    </h3>
                    <p className="text-blue-400 font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Outreach Manager</p>
                    <p className="text-gray-300 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                    Forging powerful partnerships and driving greater impact and extending our reach to empower more tech enthusiasts worldwide.
                    </p>

                    {/* Social Links */}
                    <div className="flex justify-center gap-3 sm:gap-4">
                      <a
                        href="https://www.linkedin.com/in/padala-siva-nagesh-908300343"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/social bg-blue-600 hover:bg-blue-700 p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-110"
                      >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </a>
                      <a
                        href="https://www.instagram.com/shhivaa_.001?igsh=MTN5YWNxMG1tdG12Nw=="
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 p-3 rounded-xl transition-all duration-300">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.663.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.358-2.618-6.78-6.98-6.98C15.668.014 15.259 0 12 0zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Request Form Section (Service Support) */}
        <section id="contact-request" className="py-16 sm:py-20 md:py-24 relative">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12">
              {/* Left: Heading & Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="md:w-1/2 text-center md:text-left mb-8 md:mb-0 flex flex-col justify-center"
              >
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 sm:mb-8">
                  Service <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">Support</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-300 max-w-xl leading-relaxed px-2 md:px-0">
                  Need career guidance, want a website, promotion, or have another request? Fill out the form and our team will get back to you!
                </p>
              </motion.div>
              {/* Right: Form */}
              <form
                onSubmit={submitContact}
                className="md:w-1/2 max-w-xl mx-auto bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-xl"
              >
                {cfSuccess && (
                  <div className="mb-4 text-green-400 font-semibold text-center">{cfSuccess}</div>
                )}
                {cfError && (
                  <div className="mb-4 text-red-400 font-semibold text-center">{cfError}</div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2" htmlFor="cfName">
                      Name
                    </label>
                    <input
                      id="cfName"
                      type="text"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                      placeholder="Your Name"
                      value={cfName}
                      onChange={e => setCfName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-medium mb-2" htmlFor="cfEmail">
                      Email
                    </label>
                    <input
                      id="cfEmail"
                      type="email"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                      placeholder="you@email.com"
                      value={cfEmail}
                      onChange={e => setCfEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-medium mb-2" htmlFor="cfMobile">
                      Mobile Number
                    </label>
                    <input
                      id="cfMobile"
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                      placeholder="Your Mobile Number"
                      value={cfMobile}
                      onChange={e => setCfMobile(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 font-medium mb-2" htmlFor="cfTopic">
                      What do you need help with?
                    </label>
                    <select
                      id="cfTopic"
                      className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                      value={cfTopic}
                      onChange={e => setCfTopic(e.target.value)}
                      required
                    >
                      <option value="career_guidance">Career Guidance</option>
                      <option value="make_website">Make My Website</option>
                      <option value="promotion">For Promotion</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="mb-8">
                  <label className="block text-gray-300 font-medium mb-2" htmlFor="cfMessage">
                    Message
                  </label>
                  <textarea
                    id="cfMessage"
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/80 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                    placeholder="Describe your request..."
                    rows={5}
                    value={cfMessage}
                    onChange={e => setCfMessage(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 rounded-xl text-lg transition-all duration-300 shadow-lg"
                  disabled={cfSending}
                >
                  {cfSending ? "Sending..." : "Submit Request"}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Get in Touch Section */}
        <section id="contact" className="py-16 sm:py-20 md:py-24 relative">
          <div className="container mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12 sm:mb-16 md:mb-20"
            >
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 sm:mb-8">
                Get in{" "}
                <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Touch</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-2">
                Ready to join our community? Connect with us through any of these channels and start your tech journey
                today.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 max-w-7xl mx-auto">
              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="group text-center"
              >
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-red-500/30 transition-all duration-500 hover:transform hover:scale-[1.02] sm:hover:scale-105 relative overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="text-red-400 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-red-400 transition-colors">
                      Email
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                      Drop us a line for partnerships and inquiries.
                    </p>
                    <a
                      href="mailto:team@codeneurax.in"
                      className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 font-medium transition-colors group/link text-sm sm:text-base"
                    >
                      Contact Us
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* WhatsApp */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="group text-center"
              >
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-green-500/30 transition-all duration-500 hover:transform hover:scale-[1.02] sm:hover:scale-105 relative overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="text-green-400 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                      <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-green-400 transition-colors">
                      WhatsApp
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                      Join our main community group instantly.
                    </p>
                    <a
                      href="https://chat.whatsapp.com/LqYC0LCO02hGCRTMeQoFLQ"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-medium transition-colors group/link text-sm sm:text-base"
                    >
                      Join Community
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* LinkedIn */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="group text-center"
              >
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-blue-500/30 transition-all duration-500 hover:transform hover:scale-[1.02] sm:hover:scale-105 relative overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="text-blue-400 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-blue-400 transition-colors">
                      LinkedIn
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                      Connect with us professionally.
                    </p>
                    <a
                      href="https://www.linkedin.com/company/codeneurax/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors group/link text-sm sm:text-base"
                    >
                      Follow Us
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Instagram */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="group text-center"
              >
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-pink-500/30 transition-all duration-500 hover:transform hover:scale-[1.02] sm:hover:scale-105 relative overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="text-pink-400 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.663.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.2-4.358-2.618-6.78-6.98-6.98C15.668.014 15.259 0 12 0zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-pink-400 transition-colors">
                      Instagram
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                      Follow us for community highlights.
                    </p>
                    <a
                      href="https://www.instagram.com/codeneurax/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 font-medium transition-colors group/link text-sm sm:text-base"
                    >
                      Follow Us
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* YouTube */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="group text-center"
              >
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-red-600/30 transition-all duration-500 hover:transform hover:scale-[1.02] sm:hover:scale-105 relative overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="text-red-500 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 flex justify-center">
                      <Youtube className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 group-hover:text-red-500 transition-colors">
                      YouTube
                    </h3>
                    <p className="text-gray-300 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                      Watch our tutorials and events.
                    </p>
                    <a
                      href="https://www.youtube.com/@codeneurax"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 font-medium transition-colors group/link text-sm sm:text-base"
                    >
                      Subscribe
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
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
      </div>
    </>
  );
}
