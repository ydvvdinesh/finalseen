"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import {
  Sparkles,
  Calendar,
  MapPin,
  Check,
  Brain,
  Code,
  Users,
  Target,
  ExternalLink,
  Laptop,
  Linkedin,
  Instagram
} from "lucide-react"
import Header from "@/components/header"
import {
  AI_SPARK_OVERVIEW,
  AI_SPARK_SPEAKERS,
  type SponsorshipPerson,
} from "@/data/sponsorship"

function WorkshopSpeakerCard({ person }: { person: SponsorshipPerson }) {
  return (
    <div className="glass-card p-6 flex flex-col items-center text-center h-full">
      <p className="text-[0.65rem] text-white/40 uppercase tracking-widest font-semibold mb-4" style={{ fontFamily: "var(--font-mono)" }}>Led By</p>
      <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-2xl overflow-hidden border border-amber-500/30 mb-4 bg-white/5 shrink-0">
        {person.image ? (
          <Image src={person.image} alt={person.name} fill className="object-cover" sizes="160px" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center text-2xl font-bold text-white">
            {person.name.substring(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      <h4 className="text-lg font-bold text-white mb-1">{person.name}</h4>
      {person.tagline && <p className="text-xs text-amber-400/80 font-medium mb-4" style={{ fontFamily: "var(--font-mono)" }}>{person.tagline}</p>}
      <div className="flex gap-2 justify-center mt-auto">
        {person.linkedin && (
          <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:text-blue-400 hover:border-blue-400/20 transition-all text-white/50">
            <Linkedin className="w-4 h-4" />
          </a>
        )}
        {person.instagram && (
          <a href={person.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:text-pink-400 hover:border-pink-400/20 transition-all text-white/50">
            <Instagram className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  titleAccent,
  subtitle,
}: {
  eyebrow: string
  title: string
  titleAccent?: string
  subtitle: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="text-center mb-14 md:mb-16 max-w-4xl mx-auto"
    >
      <div className="mono-badge mx-auto mb-6">
        <span className="dot" style={{ background: '#f59e0b' }} />
        {eyebrow}
      </div>
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-serif)" }}>
        {title}{" "}
        {titleAccent ? (
          <span className="gradient-text-amber">
            {titleAccent}
          </span>
        ) : null}
      </h2>
      <p className="text-base sm:text-lg text-white/40 leading-relaxed max-w-2xl mx-auto">{subtitle}</p>
    </motion.div>
  )
}

export default function AiSparkRegistrationPage() {
  const devAnand = AI_SPARK_SPEAKERS[0];
  const parthSingh = AI_SPARK_SPEAKERS[1];
  const varunPoladiya = AI_SPARK_SPEAKERS[2];
  const akshayRanpariya = AI_SPARK_SPEAKERS[3];

  const UNSTOP_LINK = "https://unstop.com/workshops-webinars/codeneurax-ai-sparks-2026-codeneurax-1694808?lb=ZtN1MTo4&utm_medium=Share&utm_source=workshops&utm_campaign=Dinesyad38123";

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white">
      {/* Ambient Background layer */}
      <div className="ambient-glow w-96 h-96 top-0 left-1/4" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)' }} />
      <div className="ambient-glow w-96 h-96 bottom-0 right-1/4" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.06), transparent 70%)' }} />

      <Header />

      {/* Hero */}
      <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-32 overflow-hidden min-h-[85vh] flex items-center">
        {/* Video Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[#050505]/70 z-10 mix-blend-multiply" />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          >
            <source src="/videos/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] z-10" />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <div className="mono-badge mx-auto mb-8">
                <span className="dot" style={{ background: '#f59e0b' }} />
                CodeNeuraX Presents
              </div>

              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-8 relative" style={{ fontFamily: "var(--font-serif)" }}>
                <span className="text-white/90">AI SPARKS </span>
                <span className="gradient-text-amber">2026</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed max-w-3xl mx-auto">
                A premier two-day technology event bringing together students, developers, AI enthusiasts, and professionals for an immersive learning experience.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-3 mb-10 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                <div className="flex items-center gap-2 text-white/60 glass-card px-4 py-2">
                  <Calendar className="w-4 h-4 text-amber-400/80" />
                  <span>7th & 8th August 2026</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 glass-card px-4 py-2">
                  <MapPin className="w-4 h-4 text-amber-400/80" />
                  <span>Marwadi University</span>
                </div>
              </div>

              <div className="flex justify-center">
                <a
                  href={UNSTOP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium btn-green text-sm"
                >
                  Register For AISPARK
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Poster */}
      <section className="relative py-12 border-t border-white/[0.04] overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10 mb-12">
          <div className="w-full max-w-6xl mx-auto rounded-3xl overflow-hidden glass-card p-2 group">
            <Image 
              src="/images/speakers-2026.jpg" 
              alt="AI Sparks 2026 Speakers and Sponsors" 
              width={1920} 
              height={1080} 
              className="w-full h-auto object-cover rounded-2xl group-hover:scale-[1.01] transition-transform duration-700"
              priority
            />
          </div>
        </div>

        {/* Infinite Slider */}
        <div className="relative w-full max-w-[100vw] overflow-hidden py-4">
          <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
          
          <motion.div 
            className="flex w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          >
            {[
              "/images/speakers/carousel-1.jpg",
              "/images/speakers/carousel-2.jpg",
              "/images/speakers/carousel-3.jpg",
              "/images/speakers/carousel-4.jpg",
              "/images/speakers/carousel-1.jpg",
              "/images/speakers/carousel-2.jpg",
              "/images/speakers/carousel-3.jpg",
              "/images/speakers/carousel-4.jpg",
            ].map((src, idx) => (
              <div key={idx} className="w-[260px] md:w-[320px] lg:w-[400px] shrink-0 mx-3 rounded-2xl overflow-hidden glass-card p-1 group">
                <Image 
                  src={src} 
                  alt={`AI Sparks 2026 Speaker ${idx}`}
                  width={800} 
                  height={1200} 
                  className="w-full h-auto object-cover rounded-xl group-hover:scale-[1.02] transition-transform duration-700"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About AI Sparks */}
      <section id="ai-spark" className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-serif)" }}>
                About the <span className="gradient-text-amber">Event</span>
              </h2>
              <p className="text-white/60 leading-relaxed mb-6 text-base sm:text-lg">
                AI SPARKS 2026 is designed to take participants from beginner-level AI concepts to building real-world AI applications through hands-on workshops.
              </p>
              <p className="text-white/40 leading-relaxed mb-8 text-sm sm:text-base">
                {AI_SPARK_OVERVIEW.description}
              </p>
              <ul className="grid sm:grid-cols-2 gap-3">
                {AI_SPARK_OVERVIEW.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-xs text-white/60 glass-card p-3">
                    <Check className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative w-full max-w-lg mx-auto lg:max-w-none aspect-[4/5] sm:aspect-square rounded-3xl overflow-hidden glass-card p-3"
            >
              <Image
                src={AI_SPARK_OVERVIEW.image}
                alt="AI Sparks 2026 Poster"
                fill
                className="object-contain p-2 sm:p-4"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Schedule / Day 1 & Day 2 */}
      <section className="section-padding relative overflow-hidden border-t border-white/[0.04]">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <SectionHeading
            eyebrow="Hands-on Workshops"
            title="Event"
            titleAccent="Schedule"
            subtitle="Two days of intensive learning, from concepts to real-world deployment."
          />

          <div className="max-w-5xl mx-auto space-y-8">
            {/* Day 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 lg:p-10 relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full mb-4" style={{ fontFamily: "var(--font-mono)" }}>
                    DAY 1
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-serif)" }}>Agentic AI & Intelligent Automation</h3>
                  <p className="text-white/40 text-sm mb-6 leading-relaxed">
                    Dive into the world of modern AI systems and learn how intelligent agents are transforming software development and business automation.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="flex items-center gap-2 text-white font-semibold text-sm mb-3">
                        <Brain className="w-4 h-4 text-amber-400/80" />
                        Topics Covered
                      </h4>
                      <ul className="space-y-1.5 text-xs text-white/40">
                        <li>• Introduction to Agentic AI</li>
                        <li>• Understanding Large Language Models (LLMs)</li>
                        <li>• AI Agents vs Traditional Chatbots</li>
                        <li>• Tool & Function Calling</li>
                        <li>• AI Workflows and Automation</li>
                        <li>• Reasoning, Planning & Memory</li>
                        <li>• Multi-Step AI Task Execution</li>
                        <li>• Industry Trends in Generative AI</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 text-white font-semibold text-sm mb-3">
                        <Code className="w-4 h-4 text-amber-400/80" />
                        Hands-On Experience
                      </h4>
                      <ul className="space-y-1.5 text-xs text-white/40">
                        <li>• Build AI-powered workflows using Python</li>
                        <li>• Work with Google Colab (No setup required)</li>
                        <li>• Understand tool & API interactions</li>
                        <li>• Practical intelligent automation</li>
                      </ul>
                    </div>
                  </div>

                  <div className="glass-card p-4">
                    <h4 className="text-xs font-semibold text-amber-400/80 mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>Learning Outcomes</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {["Modern Agentic Systems", "AI Reasoning", "Workflow Design", "AI Engineering", "First AI Workflow"].map(outcome => (
                        <span key={outcome} className="text-[0.65rem] bg-white/[0.04] text-white/50 px-2.5 py-1 rounded-full border border-white/[0.06]" style={{ fontFamily: "var(--font-mono)" }}>
                          {outcome}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-72 shrink-0 flex flex-col gap-4">
                  <WorkshopSpeakerCard person={parthSingh} />
                  <WorkshopSpeakerCard person={varunPoladiya} />
                </div>
              </div>
            </motion.div>

            {/* Day 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 lg:p-10 relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row-reverse gap-8 items-start relative z-10">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full mb-4" style={{ fontFamily: "var(--font-mono)" }}>
                    DAY 2
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "var(--font-serif)" }}>Demystifying AI & ML</h3>
                  <p className="text-white/40 text-sm mb-6 leading-relaxed">
                    A beginner-friendly Machine Learning workshop designed for students with little or no prior ML knowledge. From intuition to code.
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="flex items-center gap-2 text-white font-semibold text-sm mb-3">
                        <Brain className="w-4 h-4 text-amber-400/80" />
                        Topics Covered
                      </h4>
                      <ul className="space-y-1.5 text-xs text-white/40">
                        <li>• What is AI and Machine Learning?</li>
                        <li>• How Machines Learn from Data</li>
                        <li>• Human Intuition vs Machine Learning</li>
                        <li>• Traditional Programming vs AI</li>
                        <li>• Understanding Predictive Models</li>
                        <li>• Linear Regression Simplified</li>
                        <li>• Training vs Testing Data</li>
                        <li>• Model Evaluation and Accuracy</li>
                        <li>• ML Career Roadmap</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 text-white font-semibold text-sm mb-3">
                        <Code className="w-4 h-4 text-amber-400/80" />
                        Hands-On Experience
                      </h4>
                      <ul className="space-y-1.5 text-xs text-white/40">
                        <li>• Build and train your first ML model</li>
                        <li>• Learn using Google Colab</li>
                        <li>• Work with real-world datasets</li>
                        <li>• Visualize predictions & performance</li>
                      </ul>
                    </div>
                  </div>

                  <div className="glass-card p-4">
                    <h4 className="text-xs font-semibold text-amber-400/80 mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>Learning Outcomes</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {["ML Fundamentals", "Mathematical Intuition", "First ML Model", "Industry Workflows", "Path to Generative AI"].map(outcome => (
                        <span key={outcome} className="text-[0.65rem] bg-white/[0.04] text-white/50 px-2.5 py-1 rounded-full border border-white/[0.06]" style={{ fontFamily: "var(--font-mono)" }}>
                          {outcome}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-72 shrink-0 flex flex-col gap-4">
                  <WorkshopSpeakerCard person={devAnand} />
                  <WorkshopSpeakerCard person={akshayRanpariya} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Event Sponsors */}
      <section className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <SectionHeading
            eyebrow="Partners & Sponsors"
            title="Backed By"
            titleAccent="The Best"
            subtitle="Proudly supported by industry leaders and visionary organizations."
          />

          <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full">
              {[
                { src: "/images/sponsors/poster1.jpg", alt: "Unstop - Powered By" },
                { src: "/images/sponsors/poster2.jpg", alt: "IDP - Co-Powered By" },
                { src: "/images/sponsors/poster6.jpg", alt: "Tensorturn - Technology Partner" },
              ].map((sponsor, i) => (
                <motion.div
                  key={sponsor.src}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i }}
                  className="relative aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden glass-card p-1 group"
                >
                  <Image src={sponsor.src} alt={sponsor.alt} fill className="object-cover rounded-xl transition-transform duration-700 group-hover:scale-105" />
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full">
              {[
                { src: "/images/sponsors/poster3.jpg", alt: "Devnovate - Goodies Partner" },
                { src: "/images/sponsors/poster4.jpg", alt: "GeeksforGeeks - Knowledge Partner" },
                { src: "/images/sponsors/poster5.jpg", alt: "CSAi - Academic Partner" },
              ].map((sponsor, i) => (
                <motion.div
                  key={sponsor.src}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (0.1 * i) }}
                  className="relative aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden glass-card p-1 group"
                >
                  <Image src={sponsor.src} alt={sponsor.alt} fill className="object-cover rounded-xl transition-transform duration-700 group-hover:scale-105" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fees Section */}
      <section className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <SectionHeading
            eyebrow="Registration"
            title="Event"
            titleAccent="Passes"
            subtitle="Choose the pass that best fits your learning goals."
          />
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Day 1 Pass */}
            <div className="flex flex-col glass-card p-8">
              <div className="text-center mb-6">
                <span className="block text-white/40 text-sm font-medium mb-1" style={{ fontFamily: "var(--font-mono)" }}>Day 1 Pass</span>
                <span className="block text-white text-4xl font-bold">₹350</span>
              </div>
              <div className="h-px w-full bg-white/[0.06] my-4"></div>
              <ul className="space-y-3 flex-1">
                {[
                  "Access to Day 1 Workshop",
                  "Agentic AI & Automation Training",
                  "Hands-on AI Agent Building",
                  "Day 1 Participation Certificate",
                  "First 100 Registered Participants will get Premium Goodies"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-white/60">
                    <Check className="w-4 h-4 text-white/30 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Full Event Pass */}
            <div className="flex flex-col glass-card p-8 border-amber-500/30 relative">
              <div className="absolute top-0 right-0 bg-amber-500 text-black text-[0.65rem] font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl" style={{ fontFamily: "var(--font-mono)" }}>
                RECOMMENDED
              </div>
              <div className="text-center mb-6 mt-2">
                <span className="flex items-center justify-center gap-1.5 text-amber-400 text-sm font-medium mb-1" style={{ fontFamily: "var(--font-mono)" }}>
                  <Sparkles className="w-3.5 h-3.5"/> Full Event (Both Days)
                </span>
                <span className="block text-amber-400 text-4xl font-bold">₹500</span>
              </div>
              <div className="h-px w-full bg-amber-500/20 my-4"></div>
              <ul className="space-y-3 flex-1">
                {[
                  "Access to Both Days (Day 1 + Day 2)",
                  "All Day 1 Benefits included",
                  "Demystifying AI & ML Workshop",
                  "Hands-on Machine Learning Training",
                  "Comprehensive 2-Day Certificate",
                  "Chance to personally meet Dev Anand (Tech Influencer)",
                  "Exclusive Networking Opportunities",
                  "First 100 Registered Participants will get Premium Goodies"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-amber-200/80">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Details Grid */}
      <section className="section-padding relative border-t border-white/[0.04]">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {/* Prerequisites */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6"
            >
              <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                <Laptop className="w-5 h-5 text-amber-400/80" />
              </div>
              <h3 className="text-base font-bold text-white mb-3" style={{ fontFamily: "var(--font-serif)" }}>Prerequisites</h3>
              <ul className="space-y-2">
                {[
                  "Basic Python knowledge is recommended",
                  "No prior ML/AI experience required",
                  "Laptop is mandatory for hands-on sessions",
                  "Google Account required for Colab",
                  "Curiosity and willingness to learn"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/50">
                    <Check className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Who Should Attend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6"
            >
              <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-amber-400/80" />
              </div>
              <h3 className="text-base font-bold text-white mb-3" style={{ fontFamily: "var(--font-serif)" }}>Who Should Attend?</h3>
              <ul className="space-y-2">
                {[
                  "1st, 2nd, 3rd & Final Year Students",
                  "Beginners interested in AI/ML",
                  "Developers looking to explore Generative AI",
                  "Students preparing for AI-related careers",
                  "Tech Enthusiasts and Innovators"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/50">
                    <Check className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Why Attend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="glass-card p-6"
            >
              <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-5 h-5 text-amber-400/80" />
              </div>
              <h3 className="text-base font-bold text-white mb-3" style={{ fontFamily: "var(--font-serif)" }}>Why Attend?</h3>
              <ul className="space-y-2">
                {[
                  "Learn directly from industry experts",
                  "Gain practical exposure to cutting-edge AI technologies",
                  "Build valuable professional connections",
                  "Network with students and professionals from multiple institutions",
                  "Explore career opportunities in technology",
                  "Enhance your technical and problem-solving skills"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/50">
                    <Check className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="section-padding relative border-t border-white/[0.04] text-center">
        <div className="container mx-auto px-4 relative z-10 max-w-3xl">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6" style={{ fontFamily: "var(--font-serif)" }}>
            Ready to dive into the future of <span className="gradient-text-amber">AI?</span>
          </h2>
          <p className="text-white/40 text-base mb-8 max-w-xl mx-auto">
            Secure your spot at AI SPARKS 2026. Limited seats available for the hands-on workshops.
          </p>
          
          <a
            href={UNSTOP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-premium btn-green text-base"
          >
            Register For AISPARK
          </a>
        </div>
      </section>

      <footer className="py-10 border-t border-white/[0.04] text-center">
        <p className="text-white/20 text-xs tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>Team CodeNeuraX 💙</p>
      </footer>
    </div>
  )
}
