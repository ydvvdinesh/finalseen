"use client"

import React, { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Cpu,
  Zap,
  Terminal,
  Sparkles,
  Code2,
  CheckCircle2,
  ArrowRight,
  Clock,
  Copy,
  Check,
  Radio,
  Layers,
  ShieldCheck,
  Boxes,
  Database,
  RefreshCw,
  ExternalLink,
  Lock,
  Award,
  BookOpen,
  FileCheck2,
  FolderGit2,
  Video,
  Globe,
} from "lucide-react"

export interface ThemeConfig {
  id: string
  name: string
  shortName: string
  tagline: string
  badge: string
  color: string
  glowColor: string
  accentBorder: string
  accentBg: string
  icon: any
  domainScope: string
  deliverables: string[]
  prerequisites: string[]
  rubric: Array<{ criteria: string; weight: string; description: string }>
  codeSnippet: string
  techStack: Array<{ name: string; category: string; description: string }>
}

export const THEME_CONFIGS: ThemeConfig[] = [
  {
    id: "ai-agents",
    name: "Autonomous AI & Intelligent Systems",
    shortName: "Autonomous AI",
    tagline: "Multi-step agent workflows, automated tool calling, and reasoning interfaces.",
    badge: "Track 01 // AI & ML",
    color: "#a855f7",
    glowColor: "rgba(168, 85, 247, 0.25)",
    accentBorder: "border-purple-500/50",
    accentBg: "bg-purple-500/10",
    icon: Cpu,
    domainScope:
      "Design and deploy an intelligent autonomous web system that executes multi-step workflows, automated reasoning, or proactive data transformation using modern LLMs, function calling, and vector search.",
    deliverables: [
      "Public deployed web app URL (Vercel, Netlify, or custom domain) with working live AI features.",
      "Clean GitHub repository with comprehensive README, setup instructions, and architecture diagrams.",
      "2-minute Loom or unlisted YouTube video demonstrating autonomous agent capabilities.",
      "Documented API error boundaries and graceful fallbacks for model rate limits.",
    ],
    prerequisites: [
      "Configure your LLM API keys (Anthropic Claude, OpenAI, or Groq) in advance.",
      "Verify Next.js 15 Server Actions or Python FastAPI backend connectivity.",
      "Set up Supabase pgvector or Pinecone knowledge storage for vector search.",
    ],
    rubric: [
      {
        criteria: "Autonomous Depth & Tool Calling",
        weight: "30%",
        description: "Reliability of multi-step reasoning loops, structured schema outputs, and accurate tool invocation.",
      },
      {
        criteria: "UI/UX & Streaming Polish",
        weight: "25%",
        description: "Real-time token streaming, optimistic state transitions, and responsive clean interfaces.",
      },
      {
        criteria: "System Architecture & Stability",
        weight: "25%",
        description: "Error boundary handling, model fallback strategies, secure secret management, and performance.",
      },
      {
        criteria: "Documentation & Demo Walkthrough",
        weight: "20%",
        description: "Clear architectural explanation in README and a concise, impactful 2-minute video pitch.",
      },
    ],
    codeSnippet: `// Track 01 // Autonomous Multi-Step Agent Boilerplate
// Official problem statement drops on Dec 27, 2026 at 12:00 PM IST (T-12h)
import { generateText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

export async function runAutonomousSprintWorkflow(prompt: string) {
  const result = await generateText({
    model: openai("gpt-4o"),
    system: "You are an autonomous engineering agent for NeuraSprint 2026.",
    prompt,
    tools: {
      searchKnowledgeBase: tool({
        description: "Search indexed repository vectors",
        parameters: z.object({ query: z.string() }),
        execute: async ({ query }) => {
          // Implement Supabase pgvector cosine similarity search
          return { matches: 4, relevanceScore: 0.94 }
        },
      }),
    },
    maxSteps: 5,
  })

  return { text: result.text, steps: result.steps }
}`,
    techStack: [
      { name: "Next.js 15", category: "Framework", description: "React 19 App Router with Streaming Server Components" },
      { name: "Vercel AI SDK", category: "Agent Core", description: "Unified streaming LLM interface with tool-calling hooks" },
      { name: "Supabase Vector", category: "Database", description: "PostgreSQL pgvector storage for semantic similarity matching" },
      { name: "FastAPI / Node", category: "Backend", description: "Lightweight async backend for long-running agent worker threads" },
    ],
  },
  {
    id: "realtime-saas",
    name: "High-Velocity SaaS & Real-Time Web",
    shortName: "Real-Time SaaS",
    tagline: "Multiplayer workspaces, live streaming data, and collaborative tools.",
    badge: "Track 02 // Full Stack",
    color: "#06b6d4",
    glowColor: "rgba(6, 182, 212, 0.25)",
    accentBorder: "border-cyan-500/50",
    accentBg: "bg-cyan-500/10",
    icon: Zap,
    domainScope:
      "Architect a lightning-fast collaborative web application supporting real-time concurrent synchronization, live status feeds, multiplayer cursor presence, or zero-latency multi-user interaction.",
    deliverables: [
      "Accessible live URL with functional multiplayer session joining (multi-tab testable).",
      "Public GitHub repository with CRDT or WebSocket synchronization documentation.",
      "2-minute video demo demonstrating concurrent state updates between two simultaneous browser windows.",
      "Clean mobile-responsive dashboard layout with zero layout shifts.",
    ],
    prerequisites: [
      "Set up Supabase Realtime broadcast channels or Upstash Redis pub/sub.",
      "Verify WebSocket or Server-Sent Events (SSE) server handshake endpoints.",
      "Review Yjs or Automerge CRDT libraries for conflict-free concurrent editing.",
    ],
    rubric: [
      {
        criteria: "Real-Time Synchronization Speed",
        weight: "30%",
        description: "Sub-50ms message roundtrip latency, multi-user cursor accuracy, and broadcast efficiency.",
      },
      {
        criteria: "Conflict Resolution & CRDTs",
        weight: "25%",
        description: "Deterministic state merging when multiple peers edit simultaneously without data loss.",
      },
      {
        criteria: "UI/UX Polish & Modern Layout",
        weight: "25%",
        description: "Sleek dark mode design, presence indicator badges, smooth transitions, and accessibility.",
      },
      {
        criteria: "Documentation & Code Structure",
        weight: "20%",
        description: "Well-organized repository architecture, modular state stores, and clear Loom video demo.",
      },
    ],
    codeSnippet: `// Track 02 // Real-Time WebSocket Channel Scaffolding
// Official problem statement drops on Dec 27, 2026 at 12:00 PM IST (T-12h)
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function subscribeToWorkspaceChannel(
  roomId: string,
  onCursorMove: (payload: { userId: string; x: number; y: number }) => void
) {
  const channel = supabase.channel(\`workspace:\${roomId}\`, {
    config: { presence: { key: "user-session" } },
  })

  channel
    .on("broadcast", { event: "cursor_pos" }, ({ payload }) => {
      onCursorMove(payload)
    })
    .subscribe((status) => {
      console.log("Channel Subscription Status:", status)
    })

  return () => {
    supabase.removeChannel(channel)
  }
}`,
    techStack: [
      { name: "React 19 / Next.js", category: "Frontend", description: "Component-level optimistic updates and state transitions" },
      { name: "WebSockets / SSE", category: "Transport", description: "Bi-directional low-latency communication protocol" },
      { name: "Supabase Realtime", category: "Infrastructure", description: "Managed PostgreSQL change-data-capture broadcasts" },
      { name: "Tailwind CSS", category: "Styling", description: "Utility-first design system with responsive layouts" },
    ],
  },
  {
    id: "devtools-dx",
    name: "Next-Gen DevTools & Infrastructure",
    shortName: "DevTools & DX",
    tagline: "Build tools that make engineer workflows 10x faster and cleaner.",
    badge: "Track 03 // DevTools",
    color: "#f59e0b",
    glowColor: "rgba(245, 158, 11, 0.25)",
    accentBorder: "border-amber-500/50",
    accentBg: "bg-amber-500/10",
    icon: Terminal,
    domainScope:
      "Build developer-centric tooling: interactive web terminals, live schema visualizers, visual bundle profilers, automated mock API engines, or zero-config deployment orchestrators.",
    deliverables: [
      "Working web demo where developers can paste code/schemas and see immediate transformed output.",
      "Public GitHub repository with clear CLI installation instructions or web worker setup.",
      "2-minute video pitch demonstrating real productivity acceleration for developers.",
      "Strict TypeScript types and zero unhandled syntax exceptions on malformed input.",
    ],
    prerequisites: [
      "Familiarity with Babel AST, SWC, or TypeScript Compiler API (@typescript/vfs).",
      "Experience with Monaco Editor or CodeMirror for in-browser editing.",
      "Optional WebAssembly (Rust or Go) toolchain for high-performance parsing.",
    ],
    rubric: [
      {
        criteria: "Developer Utility & Ergonomics",
        weight: "30%",
        description: "Solves a real, painful developer workflow friction with clear time-saving impact.",
      },
      {
        criteria: "Parsing Reliability & Speed",
        weight: "25%",
        description: "Fast sub-second compilation, clear error diagnostics, and robust AST handling.",
      },
      {
        criteria: "UI/UX & Interactive Editor Polish",
        weight: "25%",
        description: "Monaco/CodeMirror integration, syntax highlighting, diff viewer, and shortcut support.",
      },
      {
        criteria: "Documentation & Video Walkthrough",
        weight: "20%",
        description: "Clear README with API specification, input/output samples, and 2-minute demo video.",
      },
    ],
    codeSnippet: `// Track 03 // AST Schema Analyzer & Mock API Generator
// Official problem statement drops on Dec 27, 2026 at 12:00 PM IST (T-12h)
export interface EndpointSpec {
  path: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  responseSchema: Record<string, any>
}

export function generateMockEndpoints(specs: EndpointSpec[]) {
  return specs.map((spec) => ({
    url: \`/api/mock\${spec.path}\`,
    method: spec.method,
    handler: () => {
      // Return synthesized deterministic mock payload based on schema
      return { status: 200, timestamp: Date.now(), data: spec.responseSchema }
    },
  }))
}`,
    techStack: [
      { name: "TypeScript", category: "Language", description: "Strict type safety for AST representations and API schemas" },
      { name: "Monaco Editor", category: "Editor", description: "VS Code in-browser editing engine with IntelliSense" },
      { name: "WebAssembly (WASM)", category: "Runtime", description: "Near-native execution speed for code parsers and linters" },
      { name: "Next.js API Routes", category: "Serverless", description: "Edge endpoint scaffolding for instant sandbox testing" },
    ],
  },
  {
    id: "open-innovation",
    name: "Future Web & Creative Exploration",
    shortName: "Creative Frontier",
    tagline: "Unconstrained technical creativity: 3D, WebGL, algorithms, and micro-tools.",
    badge: "Track 04 // Open Frontier",
    color: "#ec4899",
    glowColor: "rgba(236, 72, 153, 0.25)",
    accentBorder: "border-pink-500/50",
    accentBg: "bg-pink-500/10",
    icon: Sparkles,
    domainScope:
      "Push the boundaries of modern browser capabilities with interactive WebGL/Three.js 3D environments, educational visualizers, algorithmic simulations, or experimental web products.",
    deliverables: [
      "Public accessible live deployment running at steady 60 FPS on standard desktop GPUs.",
      "Public GitHub repository with modular shader or component code.",
      "2-minute video pitch highlighting the technical algorithms or creative engineering decisions.",
      "Graceful degradation on mobile or low-power devices with canvas fallback.",
    ],
    prerequisites: [
      "Familiarity with Three.js, React Three Fiber (@react-three/fiber), or native Canvas API.",
      "Understanding of 3D matrix math, coordinate systems, and GLSL shader pipelines.",
      "Performance profiling via Chrome DevTools GPU/Performance tabs.",
    ],
    rubric: [
      {
        criteria: "Creative Innovation & Visual Impact",
        weight: "30%",
        description: "Originality of technical concept, visual distinctiveness, and algorithmic elegance.",
      },
      {
        criteria: "Frame Rate & GPU Performance",
        weight: "25%",
        description: "Consistent 60 FPS rendering, low memory footprint, and absence of frame drops.",
      },
      {
        criteria: "Interaction Design & Controls",
        weight: "25%",
        description: "Intuitive mouse/touch controls, smooth orbital camera physics, and sound/visual feedback.",
      },
      {
        criteria: "Documentation & Code Organization",
        weight: "20%",
        description: "Clean mathematical documentation in README and a concise 2-minute video demonstration.",
      },
    ],
    codeSnippet: `// Track 04 // Canvas & Three.js 3D Scaffolding
// Official problem statement drops on Dec 27, 2026 at 12:00 PM IST (T-12h)
import * as THREE from "three"

export function createInteractiveScene(container: HTMLElement) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  )
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.appendChild(renderer.domElement)

  camera.position.z = 5
  return { scene, camera, renderer }
}`,
    techStack: [
      { name: "Three.js / R3F", category: "3D Engine", description: "Industry-standard WebGL abstraction for scene graphs and shaders" },
      { name: "GLSL Shaders", category: "Graphics", description: "Hardware-accelerated vertex and fragment calculation scripts" },
      { name: "GSAP / Framer Motion", category: "Animation", description: "Smooth timeline-based choreographies and camera tweening" },
      { name: "HTML5 Canvas API", category: "2D Fallback", description: "High-performance pixel manipulation and 2D visualizers" },
    ],
  },
]

type ThemeSubTab = "overview" | "toolchain" | "rubric" | "flightplan" | "code"

interface LiveStatsData {
  totalRegistered: number
  paidCount: number
  pendingCount: number
  maxSlots: number
  slotsRemaining: number
  tracks: Record<string, number>
}

interface NeuraSprintThemeSandboxProps {
  activeThemeId: string
  onThemeChange: (id: string) => void
  onSelectTrack: (id: string) => void
}

export default function NeuraSprintThemeSandbox({
  activeThemeId,
  onThemeChange,
  onSelectTrack,
}: NeuraSprintThemeSandboxProps) {
  const [activeTab, setActiveTab] = useState<ThemeSubTab>("overview")
  const [copiedCode, setCopiedCode] = useState(false)
  const [stats, setStats] = useState<LiveStatsData>({
    totalRegistered: 0,
    paidCount: 0,
    pendingCount: 0,
    maxSlots: 250,
    slotsRemaining: 250,
    tracks: {
      "ai-agents": 0,
      "realtime-saas": 0,
      "devtools-dx": 0,
      "open-innovation": 0,
    },
  })
  const [isLoadingStats, setIsLoadingStats] = useState(false)

  // Fetch real dynamic stats from Supabase
  const fetchLiveStats = async () => {
    try {
      setIsLoadingStats(true)
      const res = await fetch("/api/neurasprint/stats", { cache: "no-store" })
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch {
      // Graceful fallback
    } finally {
      setIsLoadingStats(false)
    }
  }

  useEffect(() => {
    fetchLiveStats()
    const interval = setInterval(fetchLiveStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const activeTheme = useMemo(
    () => THEME_CONFIGS.find((t) => t.id === activeThemeId) || THEME_CONFIGS[0],
    [activeThemeId]
  )

  const handleCopyCode = () => {
    if (typeof window === "undefined") return
    navigator.clipboard.writeText(activeTheme.codeSnippet)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  // Real dynamic count for the active track
  const trackCount = stats.tracks[activeTheme.id] || 0

  return (
    <section id="theme-engine" className="py-20 sm:py-28 relative z-10 border-b border-zinc-800/80">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-3 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Challenge Tracks // Real-Time Platform Status</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
            Choose Your Sprint Frontier
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Inspect track objectives, required deliverables, evaluation rubrics, and starter boilerplates.
            Select your track to begin your registration.
          </p>

          {/* Real Live Database Ticker */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>
                Verified Participants: <strong className="text-white">{stats.paidCount}</strong> / {stats.maxSlots} Slots
              </span>
            </span>

            <span className="px-3 py-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-zinc-400">
              Remaining Spots: <strong className="text-purple-300">{stats.slotsRemaining}</strong>
            </span>

            <button
              onClick={fetchLiveStats}
              disabled={isLoadingStats}
              title="Refresh Live Statistics"
              className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStats ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* ─── Track Explorer Window ─── */}
        <div className="max-w-5xl mx-auto rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden">
          {/* Top Track Switcher Tabs */}
          <div className="p-2 sm:p-2.5 bg-zinc-900/90 border-b border-zinc-800 flex gap-1.5 overflow-x-auto no-scrollbar">
            {THEME_CONFIGS.map((theme) => {
              const isActive = activeTheme.id === theme.id
              const ThemeIcon = theme.icon
              const currentTrackEnrolled = stats.tracks[theme.id] || 0

              return (
                <button
                  key={theme.id}
                  onClick={() => onThemeChange(theme.id)}
                  className={`relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "text-white font-semibold bg-zinc-800 border border-zinc-700 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                  }`}
                >
                  <ThemeIcon
                    className="w-4 h-4 shrink-0"
                    style={{ color: isActive ? theme.color : undefined }}
                  />
                  <span>{theme.shortName}</span>

                  {/* Real Dynamic Badge */}
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-md font-mono"
                    style={{
                      backgroundColor: `${theme.color}15`,
                      color: theme.color,
                    }}
                  >
                    {currentTrackEnrolled > 0
                      ? `${currentTrackEnrolled} Enrolled`
                      : "Open"}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Active Track Header Banner */}
          <div
            className="p-6 sm:p-8 border-b border-zinc-800 relative overflow-hidden"
            style={{
              background: `radial-gradient(ellipse at top left, ${activeTheme.glowColor} 0%, rgba(9, 9, 11, 0.98) 70%)`,
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-[11px] font-mono uppercase tracking-widest font-bold px-2.5 py-1 rounded-md border"
                    style={{
                      color: activeTheme.color,
                      borderColor: `${activeTheme.color}40`,
                      backgroundColor: `${activeTheme.color}15`,
                    }}
                  >
                    {activeTheme.badge}
                  </span>

                  <span className="text-xs font-mono text-zinc-400">
                    Live Enrolled: <strong className="text-white">{trackCount}</strong>
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                  {activeTheme.name}
                </h3>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-4">
                  {activeTheme.domainScope}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {activeTheme.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-zinc-950/80 border border-zinc-800 text-[11px] font-mono text-zinc-300"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Instant Enroll Button */}
              <button
                onClick={() => onSelectTrack(activeTheme.id)}
                className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-zinc-950 bg-white hover:bg-zinc-200 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95 shrink-0"
              >
                <span>Select Track in Form</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* ─── Official Embargo Notice Card ─── */}
            <div className="mt-6 p-4 rounded-xl bg-zinc-950/90 border border-zinc-800/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 mt-0.5 shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold font-mono text-white flex items-center gap-2 mb-0.5">
                    <span>Problem Statement Unlocks T-12 Hours Before Kickoff</span>
                    <span className="text-[10px] text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10">
                      Dec 27, 2026 &bull; 12:00 PM IST
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans max-w-xl">
                    To guarantee 100% fair competition and prevent pre-building, specific challenge prompts are confidential. The live problem statement and starter repository will be unlocked simultaneously on this page.
                  </p>
                </div>
              </div>

              <a
                href="https://whatsapp.com/channel/0029VbC93H2HVvTiyyFL9C0Y"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 transition-colors whitespace-nowrap cursor-pointer shrink-0"
              >
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>WhatsApp Drop Alert</span>
              </a>
            </div>
          </div>

          {/* Sub-Tabs Navigation */}
          <div className="px-6 py-3 bg-zinc-900/60 border-b border-zinc-800 flex gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                activeTab === "overview"
                  ? "bg-zinc-800 text-white font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" style={{ color: activeTheme.color }} />
              <span>Deliverables Checklist</span>
            </button>

            <button
              onClick={() => setActiveTab("toolchain")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                activeTab === "toolchain"
                  ? "bg-zinc-800 text-white font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Boxes className="w-3.5 h-3.5" style={{ color: activeTheme.color }} />
              <span>Recommended Toolchain</span>
            </button>

            <button
              onClick={() => setActiveTab("rubric")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                activeTab === "rubric"
                  ? "bg-zinc-800 text-white font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Award className="w-3.5 h-3.5" style={{ color: activeTheme.color }} />
              <span>Judging Rubric</span>
            </button>

            <button
              onClick={() => setActiveTab("flightplan")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                activeTab === "flightplan"
                  ? "bg-zinc-800 text-white font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Clock className="w-3.5 h-3.5" style={{ color: activeTheme.color }} />
              <span>24h Timeline</span>
            </button>

            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                activeTab === "code"
                  ? "bg-zinc-800 text-white font-bold"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" style={{ color: activeTheme.color }} />
              <span>Starter Boilerplate</span>
            </button>
          </div>

          {/* Sub-Tab Content Area */}
          <div className="p-6 sm:p-8 bg-zinc-950 min-h-[320px]">
            {/* View 1: Deliverables Checklist */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-2">
                    Official Submission Deliverables
                  </h4>
                  <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                    All participants enrolled in the {activeTheme.name} track must deliver the following components before the 24-hour countdown expires:
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {activeTheme.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-3"
                    >
                      <CheckCircle2
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: activeTheme.color }}
                      />
                      <span className="text-xs text-zinc-200 leading-relaxed font-sans">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <div className="text-xs font-mono text-zinc-300 font-bold uppercase">
                    Pre-Sprint Preparation Guide
                  </div>
                  <ul className="text-xs text-zinc-400 space-y-1.5 list-disc list-inside font-sans">
                    {activeTheme.prerequisites.map((pre, i) => (
                      <li key={i}>{pre}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* View 2: Recommended Toolchain */}
            {activeTab === "toolchain" && (
              <div className="space-y-4">
                <div className="text-xs font-mono text-zinc-400 mb-2">
                  Verified ecosystem packages and infrastructure for this track:
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {activeTheme.techStack.map((tech, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-white font-mono">{tech.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
                          {tech.category}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-sans leading-relaxed">{tech.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View 3: Judging Rubric */}
            {activeTab === "rubric" && (
              <div className="space-y-4">
                <div className="text-xs font-mono text-zinc-400 mb-2">
                  Jury evaluation breakdown (100 Points Total):
                </div>

                <div className="space-y-3">
                  {activeTheme.rubric.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start justify-between gap-4"
                    >
                      <div>
                        <div className="text-xs font-bold text-white mb-1 font-sans">{item.criteria}</div>
                        <p className="text-xs text-zinc-400 font-sans leading-relaxed">{item.description}</p>
                      </div>

                      <span
                        className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 shrink-0"
                        style={{ color: activeTheme.color }}
                      >
                        {item.weight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* View 4: 24h Flight Plan */}
            {activeTab === "flightplan" && (
              <div className="space-y-3">
                <div className="text-xs font-mono text-zinc-400 mb-2">
                  Sprint milestone timeline (IST timezone):
                </div>

                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl bg-zinc-900 border border-amber-500/30 flex items-start gap-3">
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-zinc-950 text-amber-400 border border-zinc-800 shrink-0">
                      T-12:00
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">Problem Statement Vault Unlocked (Dec 27, 12:00 PM IST)</div>
                      <div className="text-xs text-zinc-400 font-sans">Official prompt, starter repo, and technical requirements go live. 12 hours to review and design.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-3">
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-zinc-950 text-purple-400 border border-zinc-800 shrink-0">
                      T+00:00
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">Sprint Kickoff & Commit Window Opens (Dec 28, 12:00 AM IST)</div>
                      <div className="text-xs text-zinc-400 font-sans">Initialize public GitHub repository, configure environment secrets, and begin development.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-3">
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-zinc-950 text-cyan-400 border border-zinc-800 shrink-0">
                      T+06:00
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">Core Architecture & Dataflow Gate</div>
                      <div className="text-xs text-zinc-400 font-sans">Establish primary API endpoints, database schemas, and state synchronization.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-3">
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-zinc-950 text-emerald-400 border border-zinc-800 shrink-0">
                      T+18:00
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">Feature Freeze & Deployment Polish</div>
                      <div className="text-xs text-zinc-400 font-sans">Deploy live build on Vercel/Netlify, verify responsiveness across viewports, record 2-minute walkthrough.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-start gap-3">
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-zinc-950 text-red-400 border border-zinc-800 shrink-0">
                      T+24:00
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">Repository Freeze & Submission Deadline (Dec 29, 12:00 AM IST)</div>
                      <div className="text-xs text-zinc-400 font-sans">Submit GitHub repo URL and deployed URL through participant portal. Commit history locked.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* View 5: Starter Boilerplate */}
            {activeTab === "code" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>TypeScript 5.8 Starter Implementation</span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCode ? "Copied" : "Copy Code"}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto whitespace-pre leading-relaxed">
                  <code>{activeTheme.codeSnippet}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
