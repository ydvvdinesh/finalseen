"use client"

import { useState, useEffect, useCallback } from "react"
import Header from "@/components/header"
import AuthModal from "@/components/auth-modal"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  User,
  Mail,
  Linkedin,
  Sparkles,
  Users,
  Plus,
  Search,
  GraduationCap,
  Code2,
  Trophy,
  X,
  Copy,
  Check,
  UserPlus,
  Zap,
  Shield,
  Eye,
  ChevronDown,
  Key,
  Hash,
  AlertCircle,
  Lock,
  LogIn,
  Crown,
  UserMinus,
  UserCheck,
  Clock,
  ExternalLink,
  LogOut,
  CheckCircle,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Send,
  Trash2,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────
interface SquadContact {
  id: string
  name: string
  email: string
  linkedin?: string
  college: string
  skills: string
  is_leader: boolean
  role: string
}

interface Team {
  id: string
  team_code: string
  hackathon_name: string
  team_name: string
  creator_name: string
  creator_email?: string
  creator_skills: string
  creator_college: string
  creator_linkedin?: string
  looking_for: string
  max_members: number
  member_count: number
  members: { id?: string; name: string; skills: string; college: string; email?: string; linkedin?: string; status?: string }[]
  squad_contacts?: SquadContact[]
  created_at: string
}

interface PendingApplicant {
  id: string
  team_id: string
  member_name: string
  member_email: string
  member_linkedin: string
  member_skills: string
  member_college: string
  created_at?: string
  joined_at?: string
  status: string
}

interface ApprovedMember {
  id: string
  team_id: string
  member_name: string
  member_email: string
  member_linkedin: string
  member_skills: string
  member_college: string
  created_at?: string
  joined_at?: string
  status: string
}

interface LedTeam extends Team {
  pending_applicants: PendingApplicant[]
  approved_members: ApprovedMember[]
  squad_contacts?: SquadContact[]
}

interface JoinedTeamMembership {
  membership_id: string
  joined_at: string
  my_skills: string
  team: Team
  fellow_members?: ApprovedMember[]
  squad_contacts?: SquadContact[]
}

interface PendingApplicationMembership {
  application_id: string
  applied_at: string
  my_skills: string
  team: Team
}

interface ManageData {
  teamsLed: LedTeam[]
  teamsJoined: JoinedTeamMembership[]
  pendingApplications: PendingApplicationMembership[]
  totalPendingToReview: number
}

// ─── Skill Tag Presets ───────────────────────────────────────
const SKILL_SUGGESTIONS = [
  "React", "Next.js", "Python", "Node.js", "TypeScript",
  "Flutter", "Java", "C++", "Machine Learning", "AI/ML",
  "UI/UX Design", "Figma", "Backend", "Frontend", "DevOps",
  "Blockchain", "Cloud", "Data Science", "Cybersecurity",
  "Mobile Dev", "Go", "Rust", "MongoDB", "PostgreSQL",
]

// ─── Moving Hackathon Background Typography Presets ──────────
const HACKATHON_NAMES_ROW1 = [
  "SMART INDIA HACKATHON",
  "ETHINDIA",
  "HACKATHON OF CODENEURAX",
  "GOOGLE SOLUTION CHALLENGE",
  "HACKMIT",
  "FLIPKART GRiD 6.0",
]

const HACKATHON_NAMES_ROW2 = [
  "HACKCBS",
  "TATA IMAGIN-A-THON",
  "MLH GLOBAL HACK",
  "UNSTOP INNOVATE",
  "HACKOUT 2026",
  "MICROSOFT IMAGINE CUP",
]

const HACKATHON_NAMES_ROW3 = [
  "DEVPOST GLOBAL HACK",
  "SIH 2026",
  "CODENEURAX HACK-FEST",
  "AWS COMMUNITY SQUAD",
  "HACKAROUND",
  "NASA SPACE APPS",
]

const HACKATHON_NAMES_ROW4 = [
  "BUDDYKID SQUAD",
  "AI SPARK HACKATHON",
  "WEB3 BUIDL-ATHON",
  "GLOBAL AI HACKATHON",
  "OPEN SOURCE OLYMPICS",
  "SYNCHRONIZE 2026",
]

export default function BuddyKidPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authType, setAuthType] = useState<"login" | "signup">("login")

  // Supabase Auth state
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const supabase = createClient()

  // Tab state: browse | create | code | my-teams
  const [activeTab, setActiveTab] = useState<"browse" | "create" | "code" | "my-teams">("browse")

  // Code lookup state
  const [lookupCode, setLookupCode] = useState("")
  const [lookupResult, setLookupResult] = useState<Team | null>(null)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState<string | null>(null)

  // Squad management & approval state
  const [manageData, setManageData] = useState<ManageData | null>(null)
  const [loadingManage, setLoadingManage] = useState(false)
  const [manageActionLoading, setManageActionLoading] = useState<string | null>(null)
  const [manageSuccessMsg, setManageSuccessMsg] = useState<string | null>(null)
  const [manageErrorMsg, setManageErrorMsg] = useState<string | null>(null)

  // Teams data
  const [teams, setTeams] = useState<Team[]>([])
  const [loadingTeams, setLoadingTeams] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Create team form
  const [createForm, setCreateForm] = useState({
    hackathon_name: "",
    team_name: "",
    creator_name: "",
    creator_email: "",
    creator_linkedin: "",
    creator_skills: "",
    creator_college: "",
    looking_for: "",
    max_members: "4",
  })
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [creating, setCreating] = useState(false)
  const [createSuccess, setCreateSuccess] = useState<{ teamCode: string } | null>(null)
  const [createError, setCreateError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [copiedItem, setCopiedItem] = useState<string | null>(null)
  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedItem(id)
    setTimeout(() => setCopiedItem(null), 2000)
  }

  // Join team modal
  const [joiningTeam, setJoiningTeam] = useState<Team | null>(null)
  const [joinForm, setJoinForm] = useState({
    member_name: "",
    member_email: "",
    member_linkedin: "",
    member_skills: "",
    member_college: "",
  })
  const [joinSelectedSkills, setJoinSelectedSkills] = useState<string[]>([])
  const [joining, setJoining] = useState(false)
  const [joinSuccess, setJoinSuccess] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null)

  // Detail panel
  const [viewingTeam, setViewingTeam] = useState<Team | null>(null)

  // Open Team Details safely with full normalization (prevents undefined member/skill crashes)
  const openTeamDetails = useCallback((team: any) => {
    if (!team) return
    const matched = teams.find(t => t.id === team.id)
    const rawMembers = matched?.members || team.members || team.approved_members || []
    const members = rawMembers.map((m: any, idx: number) => ({
      id: m.id || `member-${idx}`,
      name: m.member_name || m.name || "Teammate",
      email: m.member_email || m.email || "",
      college: m.member_college || m.college || "Student",
      skills: m.member_skills || m.skills || "Developer",
      linkedin: m.member_linkedin || m.linkedin || "",
    }))
    const memberCount = matched?.member_count || team.member_count || (members.length + 1)

    setViewingTeam({
      ...team,
      ...matched,
      members,
      member_count: memberCount,
      team_name: team.team_name || matched?.team_name || `${team.creator_name || "Leader"}'s Team`,
      creator_name: team.creator_name || matched?.creator_name || "Team Leader",
      creator_email: team.creator_email || matched?.creator_email || "",
      creator_college: team.creator_college || matched?.creator_college || "",
      creator_skills: team.creator_skills || matched?.creator_skills || "",
      creator_linkedin: team.creator_linkedin || matched?.creator_linkedin || "",
      max_members: team.max_members || matched?.max_members || 4,
    })
  }, [teams])

  const handleAuth = (type: "login" | "signup") => {
    setAuthType(type)
    setShowAuthModal(true)
  }

  // ─── Fetch Teams ─────────────────────────────────────────
  const fetchTeams = useCallback(async () => {
    try {
      setLoadingTeams(true)
      const res = await fetch("/api/buddykid/teams")
      const data = await res.json()
      if (data.teams) setTeams(data.teams)
    } catch {
      console.error("Failed to fetch teams")
    } finally {
      setLoadingTeams(false)
    }
  }, [])

  // ─── Fetch User Squad & Management Data ───────────────────
  const fetchManageData = useCallback(async () => {
    if (!user?.email) return
    try {
      setLoadingManage(true)
      const res = await fetch(`/api/buddykid/manage?email=${encodeURIComponent(user.email)}`)
      const data = await res.json()
      if (res.ok) {
        setManageData(data)
      }
    } catch (err) {
      console.error("Failed to fetch manage data:", err)
    } finally {
      setLoadingManage(false)
    }
  }, [user?.email])

  useEffect(() => {
    if (user?.email) {
      fetchManageData()
    }
  }, [user?.email, fetchManageData])

  useEffect(() => {
    if (activeTab === "my-teams" && user?.email) {
      fetchManageData()
    }
  }, [activeTab, user?.email, fetchManageData])

  // ─── Handle Squad Management Actions ─────────────────────
  const handleManageAction = async (
    action: "approve" | "reject" | "remove_member" | "leave_team" | "cancel_application" | "delete_team",
    teamId: string,
    memberId?: string
  ) => {
    if (!user?.email) {
      handleAuth("login")
      return
    }

    const actionKey = `${action}-${memberId || teamId}`
    setManageActionLoading(actionKey)
    setManageSuccessMsg(null)
    setManageErrorMsg(null)

    try {
      const res = await fetch("/api/buddykid/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          team_id: teamId,
          member_id: memberId,
          user_email: user.email,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Action failed")

      setManageSuccessMsg(data.message || "Action processed successfully")
      setTimeout(() => setManageSuccessMsg(null), 4000)

      if (viewingTeam && viewingTeam.id === teamId && (action === "delete_team" || action === "leave_team")) {
        setViewingTeam(null)
      }

      await Promise.all([fetchTeams(), fetchManageData()])
    } catch (err: any) {
      setManageErrorMsg(err?.message || "An error occurred")
      setTimeout(() => setManageErrorMsg(null), 5000)
    } finally {
      setManageActionLoading(null)
    }
  }

  // ─── Auth Verification & Autofill ─────────────────────────
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        if (data?.user) {
          setUser(data.user)
          const name =
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            data.user.email?.split("@")[0] ||
            ""
          const email = data.user.email || ""
          setCreateForm(prev => ({
            ...prev,
            creator_name: prev.creator_name || name,
            creator_email: prev.creator_email || email,
          }))
          setJoinForm(prev => ({
            ...prev,
            member_name: prev.member_name || name,
            member_email: prev.member_email || email,
          }))
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error("Auth check failed:", err)
        setUser(null)
      } finally {
        setAuthLoading(false)
      }
    }
    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [supabase])

  // ─── Parse URL Query Parameters ───────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const action = params.get("action")
      const code = params.get("code")
      if (action === "code" || code) {
        setActiveTab("code")
        if (code) {
          const upper = code.trim().toUpperCase()
          setLookupCode(upper)
          handleLookupCode(upper)
        }
      }
    }
  }, [])

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  // ─── Lookup Team by Code ──────────────────────────────────
  const handleLookupCode = async (codeOverride?: string) => {
    const targetCode = (codeOverride || lookupCode).trim().toUpperCase()
    if (!targetCode) {
      setLookupError("Please enter a team code (e.g. BK-XXXXXX)")
      return
    }

    setLookupLoading(true)
    setLookupError(null)
    setLookupResult(null)

    try {
      // 1. First check in loaded teams
      const localMatch = teams.find(t => t.team_code.toUpperCase() === targetCode)
      if (localMatch) {
        setLookupResult(localMatch)
        return
      }

      // 2. Fetch from API endpoint
      const res = await fetch(`/api/buddykid/teams?code=${encodeURIComponent(targetCode)}`)
      const data = await res.json()
      if (data.team) {
        setLookupResult(data.team)
      } else {
        setLookupError(`No team found with code "${targetCode}". Please verify the code and try again.`)
      }
    } catch {
      setLookupError("Unable to search team code right now. Please check your connection and try again.")
    } finally {
      setLookupLoading(false)
    }
  }

  // ─── Create Team Handler ─────────────────────────────────
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreating(true)
    setCreateError(null)

    try {
      const res = await fetch("/api/buddykid/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...createForm,
          creator_skills: selectedSkills.join(", "),
          max_members: Number(createForm.max_members),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to create team")

      setCreateSuccess({ teamCode: data.team_code })
      fetchTeams()
      fetchManageData()
    } catch (err: any) {
      setCreateError(err?.message || "Something went wrong")
    } finally {
      setCreating(false)
    }
  }

  // ─── Join Team Handler ───────────────────────────────────
  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!joiningTeam) return

    if (!joinForm.member_name.trim()) {
      setJoinError("Please enter your name.")
      return
    }
    if (!joinForm.member_email.trim()) {
      setJoinError("Please enter your email.")
      return
    }
    if (!joinForm.member_linkedin.trim()) {
      setJoinError("Please enter your LinkedIn profile URL.")
      return
    }
    if (!joinForm.member_college.trim()) {
      setJoinError("Please enter your college name.")
      return
    }
    if (joinSelectedSkills.length === 0) {
      setJoinError("Please select at least one skill tag below before submitting.")
      return
    }

    setJoining(true)
    setJoinError(null)

    try {
      const res = await fetch("/api/buddykid/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_id: joiningTeam.id,
          ...joinForm,
          member_skills: joinSelectedSkills.join(", "),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to join team")

      setJoinSuccess(true)
      fetchTeams()
      fetchManageData()
    } catch (err: any) {
      setJoinError(err?.message || "Something went wrong")
    } finally {
      setJoining(false)
    }
  }

  // ─── Skills Toggle ───────────────────────────────────────
  const toggleSkill = (skill: string, isJoin = false) => {
    if (isJoin) {
      setJoinSelectedSkills(prev =>
        prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
      )
      if (joinError && joinError.includes("skill")) {
        setJoinError(null)
      }
    } else {
      setSelectedSkills(prev =>
        prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
      )
    }
  }

  // ─── Filter Teams ────────────────────────────────────────
  const filteredTeams = teams.filter(t => {
    const q = searchQuery.toLowerCase()
    return (
      t.hackathon_name.toLowerCase().includes(q) ||
      t.team_name.toLowerCase().includes(q) ||
      t.creator_name.toLowerCase().includes(q) ||
      t.creator_skills.toLowerCase().includes(q) ||
      t.creator_college.toLowerCase().includes(q) ||
      t.looking_for.toLowerCase().includes(q)
    )
  })

  const copyTeamCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetJoinForm = () => {
    setJoiningTeam(null)
    const name =
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email?.split("@")[0] ||
      ""
    const email = user?.email || ""
    setJoinForm({
      member_name: name,
      member_email: email,
      member_linkedin: "",
      member_skills: "",
      member_college: "",
    })
    setJoinSelectedSkills([])
    setJoinSuccess(false)
    setJoinError(null)
  }

  const handleJoinClick = (team: Team) => {
    if (!user) {
      setAuthType("login")
      setShowAuthModal(true)
      return
    }
    const name =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      ""
    const email = user.email || ""
    setJoinForm(prev => ({
      ...prev,
      member_name: prev.member_name || name,
      member_email: prev.member_email || email,
    }))
    setJoinError(null)
    setJoiningTeam(team)
  }

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden text-white">
      {/* ─── Ambient Background ───────────────────────────── */}
      <div
        className="ambient-glow w-[600px] h-[600px] -top-32 -left-32"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.08), transparent 70%)" }}
      />
      <div
        className="ambient-glow w-[500px] h-[500px] top-[40%] -right-20"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.06), transparent 70%)" }}
      />
      <div
        className="ambient-glow w-[400px] h-[400px] bottom-0 left-1/3"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.05), transparent 70%)" }}
      />

      {/* ─── Moving Hackathon Background Typography ──────── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        {/* Row 1 - Moving Left (Top) */}
        <div className="absolute top-28 -left-20 w-[250%] rotate-[-2deg] opacity-40 sm:opacity-46">
          <div className="animate-marquee-left flex items-center gap-12 font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase font-extrabold tracking-tight">
            {[...HACKATHON_NAMES_ROW1, ...HACKATHON_NAMES_ROW1, ...HACKATHON_NAMES_ROW1].map((item, idx) => (
              <span
                key={idx}
                className={`whitespace-nowrap ${
                  idx % 3 === 0
                    ? "stroke-text-purple"
                    : idx % 3 === 1
                    ? "text-white/[0.19]"
                    : "stroke-text-cyan"
                }`}
              >
                {item}
                <span className="mx-8 text-purple-400/35 font-sans">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* Row 2 - Moving Right (Upper Middle) */}
        <div className="absolute top-[480px] -left-20 w-[250%] rotate-[1.5deg] opacity-38 sm:opacity-43">
          <div className="animate-marquee-right flex items-center gap-12 font-mono text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase font-black tracking-widest">
            {[...HACKATHON_NAMES_ROW2, ...HACKATHON_NAMES_ROW2, ...HACKATHON_NAMES_ROW2].map((item, idx) => (
              <span
                key={idx}
                className={`whitespace-nowrap ${
                  idx % 2 === 0
                    ? "stroke-text-subtle"
                    : "text-purple-300/[0.24]"
                }`}
              >
                {item}
                <span className="mx-8 text-cyan-400/35">/</span>
              </span>
            ))}
          </div>
        </div>

        {/* Row 3 - Moving Left Fast (Middle) */}
        <div className="absolute top-[920px] -left-20 w-[250%] rotate-[-1deg] opacity-40 sm:opacity-46">
          <div className="animate-marquee-left-fast flex items-center gap-12 font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase font-extrabold tracking-tight">
            {[...HACKATHON_NAMES_ROW3, ...HACKATHON_NAMES_ROW3, ...HACKATHON_NAMES_ROW3].map((item, idx) => (
              <span
                key={idx}
                className={`whitespace-nowrap ${
                  idx % 3 === 0
                    ? "text-cyan-300/[0.24]"
                    : idx % 3 === 1
                    ? "stroke-text-purple"
                    : "stroke-text-subtle"
                }`}
              >
                {item}
                <span className="mx-8 text-pink-400/35 font-sans">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* Row 4 - Moving Right Fast (Lower) */}
        <div className="absolute top-[1380px] -left-20 w-[250%] rotate-[2deg] opacity-38 sm:opacity-43">
          <div className="animate-marquee-right-fast flex items-center gap-12 font-mono text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase font-black tracking-widest">
            {[...HACKATHON_NAMES_ROW4, ...HACKATHON_NAMES_ROW4, ...HACKATHON_NAMES_ROW4].map((item, idx) => (
              <span
                key={idx}
                className={`whitespace-nowrap ${
                  idx % 2 === 0
                    ? "stroke-text-cyan"
                    : "stroke-text-purple"
                }`}
              >
                {item}
                <span className="mx-8 text-purple-400/35">#</span>
              </span>
            ))}
          </div>
        </div>

        {/* Row 5 - Moving Left (Cards Section) */}
        <div className="absolute top-[1850px] -left-20 w-[250%] rotate-[-1.5deg] opacity-40 sm:opacity-46">
          <div className="animate-marquee-left flex items-center gap-12 font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase font-extrabold tracking-tight">
            {[...HACKATHON_NAMES_ROW1, ...HACKATHON_NAMES_ROW3].map((item, idx) => (
              <span
                key={idx}
                className={`whitespace-nowrap ${
                  idx % 2 === 0
                    ? "stroke-text-purple"
                    : "stroke-text-cyan"
                }`}
              >
                {item}
                <span className="mx-8 text-purple-400/35 font-sans">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* Row 6 - Moving Right (Bottom Section) */}
        <div className="absolute top-[2350px] -left-20 w-[250%] rotate-[1.5deg] opacity-38 sm:opacity-43">
          <div className="animate-marquee-right flex items-center gap-12 font-mono text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase font-black tracking-widest">
            {[...HACKATHON_NAMES_ROW2, ...HACKATHON_NAMES_ROW4].map((item, idx) => (
              <span
                key={idx}
                className={`whitespace-nowrap ${
                  idx % 2 === 0
                    ? "stroke-text-subtle"
                    : "text-purple-300/[0.24]"
                }`}
              >
                {item}
                <span className="mx-8 text-cyan-400/35">/</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <Header onAuth={handleAuth} />

      {/* ─── Hero Section ─────────────────────────────────── */}
      <section className="relative pt-36 pb-16">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Back button */}
          <div className="max-w-6xl mx-auto mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white/60 bg-white/[0.03] border border-white/[0.06] hover:text-white hover:border-white/20 transition-all w-fit"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <div className="mono-badge mb-6 mx-auto w-fit">
              <span className="dot" style={{ background: "#22d3ee" }} />
               Find Your Dream Team
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              CodeNeuraX's {" "}
              <span className="gradient-text-cyan">BuddyKid</span>
            </h1>

            <p className="text-base sm:text-lg text-white/40 leading-relaxed max-w-2xl mx-auto mb-10">
              No more struggling to find teammates! Create a team or join one — connect with
              skilled developers, designers, and innovators from colleges across India.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[
                { icon: <Zap className="w-3.5 h-3.5" />, text: "Instant Matching" },
                { icon: <Shield className="w-3.5 h-3.5" />, text: "Verified & Safe" },
                { icon: <Users className="w-3.5 h-3.5" />, text: "Cross-College Teams" },
              ].map((pill, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/50 text-xs"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {pill.icon}
                  {pill.text}
                </div>
              ))}
            </div>

            {/* Tab Switcher */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => { setActiveTab("browse"); setCreateSuccess(null) }}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === "browse"
                    ? "bg-white/[0.1] text-white border border-white/[0.15] shadow-lg shadow-white/[0.03]"
                    : "bg-white/[0.03] text-white/50 border border-white/[0.06] hover:text-white hover:border-white/[0.12]"
                }`}
              >
                <Search className="w-4 h-4" />
                Browse Teams
              </button>
              <button
                onClick={() => { setActiveTab("code"); setCreateSuccess(null) }}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === "code"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                    : "bg-white/[0.03] text-white/50 border border-white/[0.06] hover:text-white hover:border-white/[0.12]"
                }`}
              >
                <Key className="w-4 h-4" />
                Join with Code
              </button>
              <button
                onClick={() => setActiveTab("create")}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === "create"
                    ? "bg-white/[0.1] text-white border border-white/[0.15] shadow-lg shadow-white/[0.03]"
                    : "bg-white/[0.03] text-white/50 border border-white/[0.06] hover:text-white hover:border-white/[0.12]"
                }`}
              >
                <Plus className="w-4 h-4" />
                Create a Team
              </button>
              <button
                onClick={() => { setActiveTab("my-teams"); setCreateSuccess(null) }}
                className={`relative flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  activeTab === "my-teams"
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-500/10"
                    : "bg-white/[0.03] text-white/50 border border-white/[0.06] hover:text-white hover:border-white/[0.12]"
                }`}
              >
                <Crown className="w-4 h-4 text-purple-400" />
                <span>My Squads & Approvals</span>
                {manageData && manageData.totalPendingToReview > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-extrabold animate-pulse shadow-sm">
                    {manageData.totalPendingToReview}
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Content Section ──────────────────────────────── */}
      <section className="relative pb-24">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {!authLoading && !user ? (
            <div className="max-w-md mx-auto text-center py-12">
              <div className="mac-window p-8 sm:p-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center mx-auto mb-5">
                  <Lock className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-serif)" }}>
                  Member Sign In Required
                </h3>
                <p className="text-sm text-white/40 mb-6 leading-relaxed">
                  BuddyKid is exclusively available for signed-in members of CodeNeuraX. Sign in with your account to create teams or join hackathon squads.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/login?next=/buddykid"
                    className="btn-premium justify-center text-sm py-3 px-6"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In with Google
                  </Link>
                  <Link
                    href="/"
                    className="px-5 py-3 rounded-xl text-sm font-semibold text-white/50 bg-white/[0.03] border border-white/[0.06] hover:text-white transition text-center"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {user && (
                <div className="flex items-center justify-center gap-2 mb-8">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Signed in as <strong>{user.user_metadata?.full_name || user.email}</strong></span>
                  </div>
                </div>
              )}
              <AnimatePresence mode="wait">
                {/* ═══ BROWSE TEAMS TAB ═══ */}
                {activeTab === "browse" && (
                <motion.div
                  key="browse"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Quick Join With Code Link */}
                  <div className="flex justify-center mb-6">
                    <button
                      onClick={() => setActiveTab("code")}
                      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all font-mono"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Have an invite code from a teammate? <strong>Join with Code &rarr;</strong></span>
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="max-w-xl mx-auto mb-10">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="text"
                        placeholder="Search by hackathon, skills, college..."
                        className="input-mac pl-11 pr-4"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Teams Grid */}
                  {loadingTeams ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="w-6 h-6 animate-spin text-white/30" />
                      <span className="ml-3 text-white/30 text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                        Loading teams...
                      </span>
                    </div>
                  ) : filteredTeams.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-6">
                        <Users className="w-8 h-8 text-white/20" />
                      </div>
                      <h3
                        className="text-xl font-bold text-white/60 mb-2"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {searchQuery ? "No teams match your search" : "No teams yet"}
                      </h3>
                      <p className="text-white/30 text-sm mb-6">
                        {searchQuery
                          ? "Try different keywords or create your own team!"
                          : "Be the first to create a hackathon team!"}
                      </p>
                      <button
                        onClick={() => setActiveTab("create")}
                        className="btn-premium text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Create a Team
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {filteredTeams.map((team, idx) => (
                        <motion.div
                          key={team.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: idx * 0.05 }}
                          className="glass-card group relative"
                        >
                          <div className="p-5">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <Trophy className="w-3.5 h-3.5 text-amber-400/70 shrink-0" />
                                  <span
                                    className="text-[0.65rem] text-amber-400/70 uppercase tracking-wider font-semibold truncate"
                                    style={{ fontFamily: "var(--font-mono)" }}
                                  >
                                    {team.hackathon_name}
                                  </span>
                                  {user?.email && (team.creator_email?.toLowerCase() === user.email.toLowerCase() || manageData?.teamsLed.some(t => t.id === team.id)) && (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[9px] font-mono font-bold flex items-center gap-1">
                                      <Crown className="w-2.5 h-2.5" /> LEADER
                                    </span>
                                  )}
                                  {user?.email && manageData?.teamsJoined.some(tj => tj.team.id === team.id) && (
                                    <span className="px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 text-[9px] font-mono font-bold flex items-center gap-1">
                                      <Check className="w-2.5 h-2.5" /> MEMBER
                                    </span>
                                  )}
                                  {user?.email && manageData?.pendingApplications.some(pa => pa.team.id === team.id) && (
                                    <span className="px-1.5 py-0.5 rounded bg-purple-400/20 text-purple-300 text-[9px] font-mono font-bold flex items-center gap-1">
                                      <Clock className="w-2.5 h-2.5" /> PENDING
                                    </span>
                                  )}
                                </div>
                                <h3 className="text-base font-bold text-white truncate">
                                  {team.team_name || `${team.creator_name}'s Team`}
                                </h3>
                              </div>
                              <div
                                className="shrink-0 ml-3 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[0.6rem] text-cyan-400 font-bold"
                                style={{ fontFamily: "var(--font-mono)" }}
                              >
                                {team.member_count}/{team.max_members}
                              </div>
                            </div>

                            {/* Creator Info */}
                            <div className="flex items-center gap-2.5 mb-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                                {team.creator_name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-white/80 truncate">{team.creator_name}</p>
                                <p className="text-[0.6rem] text-white/30 truncate">{team.creator_college}</p>
                              </div>
                            </div>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {team.creator_skills.split(",").slice(0, 4).map((skill, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/15 text-purple-300/80 text-[0.6rem] font-medium"
                                  style={{ fontFamily: "var(--font-mono)" }}
                                >
                                  {skill.trim()}
                                </span>
                              ))}
                              {team.creator_skills.split(",").length > 4 && (
                                <span className="px-2 py-0.5 text-[0.6rem] text-white/30">
                                  +{team.creator_skills.split(",").length - 4}
                                </span>
                              )}
                            </div>

                            {/* Looking For */}
                            {team.looking_for && (
                              <p className="text-[0.7rem] text-white/35 mb-4 line-clamp-2">
                                <span className="text-cyan-400/60 font-semibold">Looking for:</span>{" "}
                                {team.looking_for}
                              </p>
                            )}

                            {/* Members preview */}
                            {team.members.length > 0 && (
                              <div className="mb-4">
                                <p
                                  className="text-[0.6rem] text-white/25 uppercase tracking-wider mb-1.5 font-semibold"
                                  style={{ fontFamily: "var(--font-mono)" }}
                                >
                                  Team Members
                                </p>
                                <div className="flex -space-x-2">
                                  {team.members.slice(0, 3).map((m, i) => (
                                    <div
                                      key={i}
                                      className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 border-2 border-[#0a0a0a] flex items-center justify-center text-[9px] font-bold text-white"
                                      title={m.name}
                                    >
                                      {m.name.charAt(0).toUpperCase()}
                                    </div>
                                  ))}
                                  {team.members.length > 3 && (
                                    <div className="w-7 h-7 rounded-full bg-white/[0.06] border-2 border-[#0a0a0a] flex items-center justify-center text-[9px] text-white/40">
                                      +{team.members.length - 3}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            {(() => {
                              const userEmail = user?.email?.toLowerCase()
                              const isLeader = Boolean(
                                userEmail &&
                                  (team.creator_email?.toLowerCase() === userEmail ||
                                    manageData?.teamsLed.some(t => t.id === team.id))
                              )
                              const isApprovedMember = Boolean(
                                userEmail &&
                                  manageData?.teamsJoined.some(tj => tj.team.id === team.id)
                              )
                              const isPendingApplicant = Boolean(
                                userEmail &&
                                  manageData?.pendingApplications.some(pa => pa.team.id === team.id)
                              )
                              const isActionLoading =
                                manageActionLoading?.includes(team.id)

                              return (
                                <>
                                  {(isLeader || isApprovedMember) && (
                                    <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-300 font-mono">
                                      <span className="flex items-center gap-1.5">
                                        <Mail className="w-3 h-3 text-emerald-400" />
                                        <span>Squad Contacts Available</span>
                                      </span>
                                      <span className="text-[9px] text-emerald-400/80 underline cursor-pointer" onClick={() => openTeamDetails(team)}>
                                        Details
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => openTeamDetails(team)}
                                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-white/50 bg-white/[0.03] border border-white/[0.06] hover:text-white hover:border-white/[0.15] transition-all"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                      Details
                                    </button>

                                  {isLeader ? (
                                    <div className="flex-1 flex items-center gap-1.5">
                                      <button
                                        onClick={() => setActiveTab("my-teams")}
                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-amber-400/15 border border-amber-400/30 text-amber-300 hover:bg-amber-400/25 transition-all shadow-md cursor-pointer"
                                        title="You are the Team Leader"
                                      >
                                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                                        <span>Manage</span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to permanently delete "${team.team_name || team.hackathon_name}"? All members and applications will be deleted.`)) {
                                            handleManageAction("delete_team", team.id)
                                          }
                                        }}
                                        disabled={isActionLoading}
                                        className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all cursor-pointer disabled:opacity-50"
                                        title="Delete Squad"
                                      >
                                        {isActionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                      </button>
                                    </div>
                                  ) : isApprovedMember ? (
                                    <button
                                      onClick={() => {
                                        if (confirm(`Are you sure you want to leave ${team.team_name || "this team"}? You will need leader approval if you want to rejoin.`)) {
                                          handleManageAction("leave_team", team.id)
                                        }
                                      }}
                                      disabled={isActionLoading}
                                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 transition-all shadow-md cursor-pointer disabled:opacity-50"
                                      title="Leave this squad"
                                    >
                                      {isActionLoading ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <LogOut className="w-3.5 h-3.5 text-red-400" />
                                      )}
                                      <span>Leave</span>
                                    </button>
                                  ) : isPendingApplicant ? (
                                    <button
                                      onClick={() => {
                                        if (confirm(`Withdraw your pending join request for ${team.team_name || "this team"}?`)) {
                                          handleManageAction("cancel_application", team.id)
                                        }
                                      }}
                                      disabled={isActionLoading}
                                      className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all shadow-md cursor-pointer disabled:opacity-50"
                                      title="Application pending leader approval. Click to withdraw."
                                    >
                                      {isActionLoading ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                      )}
                                      <span>Pending</span>
                                    </button>
                                  ) : team.member_count < team.max_members ? (
                                    <button
                                      onClick={() => handleJoinClick(team)}
                                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-white text-black hover:bg-white/90 transition-all shadow-md cursor-pointer"
                                    >
                                      <UserPlus className="w-3.5 h-3.5 text-black" />
                                      <span>Join</span>
                                    </button>
                                  ) : (
                                    <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-white/30 bg-white/[0.03] border border-white/[0.06]">
                                      <Users className="w-3.5 h-3.5" />
                                      <span>Full</span>
                                    </div>
                                  )}
                                </div>
                              </>
                            )
                            })()}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ═══ JOIN WITH CODE TAB ═══ */}
              {activeTab === "code" && (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="max-w-2xl mx-auto"
                >
                  <div className="mac-window">
                    <div className="p-6 sm:p-10">
                      <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                          <Key className="w-7 h-7 text-cyan-400" />
                        </div>
                        <h2
                          className="text-2xl sm:text-3xl font-bold text-white mb-2"
                          style={{ fontFamily: "var(--font-serif)" }}
                        >
                          Join Team Through Code
                        </h2>
                        <p className="text-sm text-white/40 max-w-md mx-auto leading-relaxed">
                          Got an invite code from your team leader or friend? Enter the team code below to instantly find and join their squad.
                        </p>
                      </div>

                      {/* Code Input Form */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          handleLookupCode()
                        }}
                        className="mb-8"
                      >
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="relative flex-1">
                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400/60" />
                            <input
                              type="text"
                              value={lookupCode}
                              onChange={(e) => {
                                const val = e.target.value.toUpperCase().replace(/\s+/g, "")
                                setLookupCode(val)
                                setLookupError(null)
                              }}
                              placeholder="e.g. BK-3X9K2P"
                              className="input-mac pl-11 pr-4 text-center font-mono tracking-widest text-lg uppercase font-bold text-cyan-300 placeholder:text-white/20 placeholder:font-normal placeholder:tracking-normal placeholder:text-sm"
                              maxLength={12}
                              autoFocus
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={lookupLoading || !lookupCode.trim()}
                            className="btn-premium py-3 px-6 justify-center text-sm font-semibold shrink-0"
                          >
                            {lookupLoading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Searching...</span>
                              </>
                            ) : (
                              <>
                                <Search className="w-4 h-4" />
                                <span>Find Team</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>

                      {/* Error State */}
                      {lookupError && (
                        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-start gap-3">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                          <div>
                            <p className="font-semibold mb-0.5">Team Not Found</p>
                            <p className="text-white/40">{lookupError}</p>
                          </div>
                        </div>
                      )}

                      {/* Found Team Card */}
                      {lookupResult && (
                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-cyan-500/30 relative overflow-hidden">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                                <span
                                  className="text-[0.65rem] text-amber-400/80 uppercase tracking-wider font-semibold font-mono"
                                >
                                  {lookupResult.hackathon_name}
                                </span>
                              </div>
                              <h3 className="text-xl font-bold text-white">
                                {lookupResult.team_name || `${lookupResult.creator_name}'s Team`}
                              </h3>
                            </div>
                            <div className="px-3 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/25 text-xs text-cyan-300 font-mono font-bold">
                              {lookupResult.member_count}/{lookupResult.max_members} Spots
                            </div>
                          </div>

                          {/* Leader info */}
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-4">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                              {lookupResult.creator_name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-white/90">
                                Led by {lookupResult.creator_name}
                              </p>
                              <p className="text-[11px] text-white/40">{lookupResult.creator_college}</p>
                            </div>
                          </div>

                          {/* Skills */}
                          <div className="mb-4">
                            <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2 font-mono font-semibold">
                              Skills
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {lookupResult.creator_skills.split(",").map((s, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px] font-mono"
                                >
                                  {s.trim()}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Looking for */}
                          {lookupResult.looking_for && (
                            <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10 mb-6">
                              <p className="text-[10px] text-cyan-400/60 uppercase tracking-wider mb-1 font-mono font-semibold">
                                Looking For
                              </p>
                              <p className="text-xs text-white/60">{lookupResult.looking_for}</p>
                            </div>
                          )}

                          {/* Join button or state */}
                          {(() => {
                            const userEmail = user?.email?.toLowerCase()
                            const isLeader = Boolean(
                              userEmail &&
                                (lookupResult.creator_email?.toLowerCase() === userEmail ||
                                  manageData?.teamsLed.some(t => t.id === lookupResult.id))
                            )
                            const isApprovedMember = Boolean(
                              userEmail &&
                                manageData?.teamsJoined.some(tj => tj.team.id === lookupResult.id)
                            )
                            const isPendingApplicant = Boolean(
                              userEmail &&
                                manageData?.pendingApplications.some(pa => pa.team.id === lookupResult.id)
                            )
                            const isActionLoading = manageActionLoading?.includes(lookupResult.id)

                            if (isLeader) {
                              return (
                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                  <button
                                    onClick={() => setActiveTab("my-teams")}
                                    className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-amber-400/15 border border-amber-400/30 text-amber-300 hover:bg-amber-400/25 transition-all shadow-md cursor-pointer"
                                  >
                                    <Crown className="w-4 h-4 text-amber-400" />
                                    <span>Manage Squad (You are Leader)</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to permanently delete "${lookupResult.team_name || lookupResult.hackathon_name}"? All members and applications will be deleted.`)) {
                                        handleManageAction("delete_team", lookupResult.id)
                                      }
                                    }}
                                    disabled={isActionLoading}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 transition-all shadow-md cursor-pointer disabled:opacity-50"
                                    title="Disband and delete this squad"
                                  >
                                    {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin text-red-300" /> : <Trash2 className="w-4 h-4 text-red-400" />}
                                    <span>Delete Squad</span>
                                  </button>
                                </div>
                              )
                            }
                            if (isApprovedMember) {
                              return (
                                <div className="space-y-2.5">
                                  <button
                                    onClick={() => openTeamDetails(lookupResult)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 transition-all shadow-md cursor-pointer"
                                  >
                                    <Eye className="w-4 h-4 text-cyan-400" />
                                    <span>View Squad Contacts (You are a Member)</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to leave ${lookupResult.team_name || "this team"}?`)) {
                                        handleManageAction("leave_team", lookupResult.id)
                                      }
                                    }}
                                    disabled={isActionLoading}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 transition-all cursor-pointer disabled:opacity-50"
                                  >
                                    {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4 text-red-400" />}
                                    <span>Leave This Squad</span>
                                  </button>
                                </div>
                              )
                            }
                            if (isPendingApplicant) {
                              return (
                                <div className="w-full p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                                  <div className="flex items-center justify-center gap-2 text-amber-300 text-sm font-semibold mb-2">
                                    <Clock className="w-4 h-4 animate-pulse text-amber-400" />
                                    <span>Application Pending Review</span>
                                  </div>
                                  <p className="text-white/40 text-xs mb-3">
                                    The team leader has not reviewed your request yet.
                                  </p>
                                  <button
                                    onClick={() => handleManageAction("cancel_application", lookupResult.id)}
                                    disabled={isActionLoading}
                                    className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 transition cursor-pointer"
                                  >
                                    Withdraw Request
                                  </button>
                                </div>
                              )
                            }
                            if (lookupResult.member_count < lookupResult.max_members) {
                              return (
                                <button
                                  onClick={() => handleJoinClick(lookupResult)}
                                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-white text-black hover:bg-white/90 transition-all shadow-md"
                                >
                                  <UserPlus className="w-4 h-4 text-black" />
                                  <span>Apply to Join {lookupResult.team_name || `${lookupResult.creator_name}'s Team`}</span>
                                  <ArrowRight className="w-4 h-4 text-black" />
                                </button>
                              )
                            }
                            return (
                              <div className="w-full text-center py-3 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/40 text-xs font-mono">
                                This team is already full ({lookupResult.member_count}/{lookupResult.max_members} members)
                              </div>
                            )
                          })()}
                        </div>
                      )}

                      {/* Browse All shortcut */}
                      <div className="mt-8 text-center pt-6 border-t border-white/[0.06]">
                        <button
                          onClick={() => {
                            setActiveTab("browse")
                            setLookupResult(null)
                            setLookupError(null)
                          }}
                          className="text-xs text-white/40 hover:text-white transition font-mono inline-flex items-center gap-1.5"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>Don&apos;t have a code? Browse all available teams</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ═══ CREATE TEAM TAB ═══ */}
              {activeTab === "create" && (
                <motion.div
                  key="create"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-12 max-w-6xl mx-auto">
                    {/* Left: Info */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      className="lg:w-5/12"
                    >
                      <div className="mono-badge mb-6">
                        <span className="dot" style={{ background: "#22d3ee" }} />
                        Create Team
                      </div>
                      <h2
                        className="text-3xl sm:text-4xl font-bold text-white mb-5 leading-tight"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        Lead Your{" "}
                        <span className="gradient-text-cyan">Dream Team</span>
                      </h2>
                      <p className="text-sm text-white/40 leading-relaxed mb-8">
                        Create a team for your upcoming hackathon. Share your team code with
                        friends or let talented developers find and join you.
                      </p>

                      <div className="space-y-3">
                        {[
                          "Unique team code for easy sharing",
                          "Set team size (2–10 members)",
                          "Describe skills you're looking for",
                          "Auto-close when team is full",
                          "All data tracked for safety",
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <CheckCircle2 className="w-4 h-4 text-green-400/80 shrink-0" />
                            <span className="text-white/50 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Right: Form or Success */}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                      className="lg:w-7/12"
                    >
                      {createSuccess ? (
                        <div className="mac-window">
                          <div className="p-8 sm:p-10 text-center">
                            <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
                              <CheckCircle2 className="w-9 h-9 text-green-400" />
                            </div>
                            <h2
                              className="text-2xl sm:text-3xl font-bold text-white mb-3"
                              style={{ fontFamily: "var(--font-serif)" }}
                            >
                              Team Created!
                            </h2>
                            <p className="text-white/40 text-sm mb-8 leading-relaxed max-w-md mx-auto">
                              Share your team code with others so they can find and join your team.
                              Your team is now visible in the Browse section.
                            </p>

                            <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 mb-8 max-w-sm mx-auto">
                              <p
                                className="text-[0.65rem] text-white/30 uppercase tracking-wider font-semibold mb-3"
                                style={{ fontFamily: "var(--font-mono)" }}
                              >
                                Your Team Code
                              </p>
                              <div className="flex items-center justify-center gap-3">
                                <span
                                  className="text-2xl sm:text-3xl font-bold text-cyan-400 tracking-wider"
                                  style={{ fontFamily: "var(--font-mono)" }}
                                >
                                  {createSuccess.teamCode}
                                </span>
                                <button
                                  onClick={() => copyTeamCode(createSuccess.teamCode)}
                                  className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-colors text-white/50 hover:text-white"
                                  title="Copy Code"
                                >
                                  {copied ? (
                                    <Check className="w-4 h-4 text-green-400" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                              <p className="text-[0.6rem] text-white/20 mt-3" style={{ fontFamily: "var(--font-mono)" }}>
                                Share this code with your teammates
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                              <button
                                onClick={() => { setActiveTab("browse"); setCreateSuccess(null) }}
                                className="btn-premium text-sm"
                              >
                                <Users className="w-4 h-4" />
                                Browse All Teams
                              </button>
                              <button
                                onClick={() => {
                                  setCreateSuccess(null)
                                  setCreateForm({
                                    hackathon_name: "", team_name: "", creator_name: "",
                                    creator_email: "", creator_linkedin: "", creator_skills: "",
                                    creator_college: "", looking_for: "", max_members: "4",
                                  })
                                  setSelectedSkills([])
                                }}
                                className="btn-premium text-sm"
                              >
                                <Plus className="w-4 h-4" />
                                Create Another
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="mac-window">
                          <form onSubmit={handleCreateTeam} className="p-6 sm:p-8">
                            {createError && (
                              <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-semibold text-center">
                                {createError}
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                              {/* Hackathon Name */}
                              <div className="sm:col-span-2">
                                <label
                                  className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                                  style={{ fontFamily: "var(--font-mono)" }}
                                  htmlFor="bk-hackathon"
                                >
                                  <span className="inline-flex items-center gap-1.5">
                                    <Trophy className="w-3 h-3" />
                                    Hackathon Name <span className="text-red-400">*</span>
                                  </span>
                                </label>
                                <input
                                  id="bk-hackathon"
                                  type="text"
                                  className="input-mac"
                                  placeholder="e.g. Smart India Hackathon 2026"
                                  value={createForm.hackathon_name}
                                  onChange={e => setCreateForm({ ...createForm, hackathon_name: e.target.value })}
                                  required
                                  maxLength={200}
                                />
                              </div>

                              {/* Team Name */}
                              <div className="sm:col-span-2">
                                <label
                                  className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                                  style={{ fontFamily: "var(--font-mono)" }}
                                  htmlFor="bk-teamname"
                                >
                                  <span className="inline-flex items-center gap-1.5">
                                    <Users className="w-3 h-3" />
                                    Team Name <span className="text-white/20">(optional)</span>
                                  </span>
                                </label>
                                <input
                                  id="bk-teamname"
                                  type="text"
                                  className="input-mac"
                                  placeholder="e.g. Code Warriors"
                                  value={createForm.team_name}
                                  onChange={e => setCreateForm({ ...createForm, team_name: e.target.value })}
                                  maxLength={200}
                                />
                              </div>

                              {/* Your Name */}
                              <div>
                                <label
                                  className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                                  style={{ fontFamily: "var(--font-mono)" }}
                                  htmlFor="bk-name"
                                >
                                  <span className="inline-flex items-center gap-1.5">
                                    <User className="w-3 h-3" />
                                    Your Name <span className="text-red-400">*</span>
                                  </span>
                                </label>
                                <input
                                  id="bk-name"
                                  type="text"
                                  className="input-mac"
                                  placeholder="John Doe"
                                  value={createForm.creator_name}
                                  onChange={e => setCreateForm({ ...createForm, creator_name: e.target.value })}
                                  required
                                  maxLength={100}
                                />
                              </div>

                              {/* Email */}
                              <div>
                                <label
                                  className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                                  style={{ fontFamily: "var(--font-mono)" }}
                                  htmlFor="bk-email"
                                >
                                  <span className="inline-flex items-center gap-1.5">
                                    <Mail className="w-3 h-3" />
                                    Email <span className="text-red-400">*</span>
                                  </span>
                                </label>
                                <input
                                  id="bk-email"
                                  type="email"
                                  className="input-mac"
                                  placeholder="john@example.com"
                                  value={createForm.creator_email}
                                  onChange={e => setCreateForm({ ...createForm, creator_email: e.target.value })}
                                  required
                                  maxLength={100}
                                />
                              </div>

                              {/* LinkedIn */}
                              <div>
                                <label
                                  className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                                  style={{ fontFamily: "var(--font-mono)" }}
                                  htmlFor="bk-linkedin"
                                >
                                  <span className="inline-flex items-center gap-1.5">
                                    <Linkedin className="w-3 h-3" />
                                    LinkedIn URL <span className="text-red-400">*</span>
                                  </span>
                                </label>
                                <input
                                  id="bk-linkedin"
                                  type="url"
                                  className="input-mac"
                                  placeholder="https://linkedin.com/in/johndoe"
                                  value={createForm.creator_linkedin}
                                  onChange={e => setCreateForm({ ...createForm, creator_linkedin: e.target.value })}
                                  required
                                  maxLength={300}
                                />
                              </div>

                              {/* College */}
                              <div>
                                <label
                                  className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                                  style={{ fontFamily: "var(--font-mono)" }}
                                  htmlFor="bk-college"
                                >
                                  <span className="inline-flex items-center gap-1.5">
                                    <GraduationCap className="w-3 h-3" />
                                    College <span className="text-red-400">*</span>
                                  </span>
                                </label>
                                <input
                                  id="bk-college"
                                  type="text"
                                  className="input-mac"
                                  placeholder="IIT Delhi"
                                  value={createForm.creator_college}
                                  onChange={e => setCreateForm({ ...createForm, creator_college: e.target.value })}
                                  required
                                  maxLength={200}
                                />
                              </div>

                              {/* Skills */}
                              <div className="sm:col-span-2">
                                <label
                                  className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                                  style={{ fontFamily: "var(--font-mono)" }}
                                >
                                  <span className="inline-flex items-center gap-1.5">
                                    <Code2 className="w-3 h-3" />
                                    Your Skills <span className="text-red-400">*</span>
                                  </span>
                                </label>
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                  {SKILL_SUGGESTIONS.map(skill => (
                                    <button
                                      key={skill}
                                      type="button"
                                      onClick={() => toggleSkill(skill)}
                                      className={`px-2.5 py-1 rounded-lg text-[0.65rem] font-medium transition-all border ${
                                        selectedSkills.includes(skill)
                                          ? "bg-cyan-500/20 border-cyan-500/30 text-cyan-300"
                                          : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/[0.12]"
                                      }`}
                                      style={{ fontFamily: "var(--font-mono)" }}
                                    >
                                      {skill}
                                    </button>
                                  ))}
                                </div>
                                {selectedSkills.length > 0 && (
                                  <p className="text-[0.6rem] text-cyan-400/50" style={{ fontFamily: "var(--font-mono)" }}>
                                    Selected: {selectedSkills.join(", ")}
                                  </p>
                                )}
                              </div>

                              {/* Looking For */}
                              <div className="sm:col-span-2">
                                <label
                                  className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                                  style={{ fontFamily: "var(--font-mono)" }}
                                  htmlFor="bk-lookingfor"
                                >
                                  <span className="inline-flex items-center gap-1.5">
                                    <Search className="w-3 h-3" />
                                    Looking For <span className="text-white/20">(describe ideal teammates)</span>
                                  </span>
                                </label>
                                <input
                                  id="bk-lookingfor"
                                  type="text"
                                  className="input-mac"
                                  placeholder="e.g. Need a UI/UX designer and a backend developer with Python"
                                  value={createForm.looking_for}
                                  onChange={e => setCreateForm({ ...createForm, looking_for: e.target.value })}
                                  maxLength={500}
                                />
                              </div>

                              {/* Max Members */}
                              <div>
                                <label
                                  className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                                  style={{ fontFamily: "var(--font-mono)" }}
                                  htmlFor="bk-maxmembers"
                                >
                                  <span className="inline-flex items-center gap-1.5">
                                    <Users className="w-3 h-3" />
                                    Max Team Size
                                  </span>
                                </label>
                                <div className="relative">
                                  <select
                                    id="bk-maxmembers"
                                    className="input-mac appearance-none pr-10 cursor-pointer"
                                    value={createForm.max_members}
                                    onChange={e => setCreateForm({ ...createForm, max_members: e.target.value })}
                                  >
                                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                      <option key={n} value={n} className="bg-[#111] text-white">
                                        {n} members
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                                </div>
                              </div>
                            </div>

                            {/* Submit */}
                            <button
                              type="submit"
                              className="w-full btn-premium justify-center mt-4"
                              disabled={creating || selectedSkills.length === 0}
                            >
                              {creating ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  <span>Creating Team...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-4 h-4" />
                                  <span>Create Team</span>
                                  <ArrowRight className="w-4 h-4" />
                                </>
                              )}
                            </button>

                            {selectedSkills.length === 0 && (
                              <p className="text-center text-[0.65rem] text-white/20 mt-3" style={{ fontFamily: "var(--font-mono)" }}>
                                Please select at least one skill to continue
                              </p>
                            )}
                          </form>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {/* ═══ MY SQUADS & APPROVALS TAB ═══ */}
              {activeTab === "my-teams" && (
                <motion.div
                  key="my-teams"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  {/* Dashboard Header Bar */}
                  <div className="mac-window p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Crown className="w-5 h-5 text-amber-400" />
                          <span
                            className="text-xs text-amber-400 font-mono uppercase tracking-widest font-semibold"
                          >
                            Squad Management & Approvals
                          </span>
                        </div>
                        <h2
                          className="text-2xl sm:text-3xl font-bold text-white mb-1"
                          style={{ fontFamily: "var(--font-serif)" }}
                        >
                          My Squads & Decisions
                        </h2>
                        <p className="text-sm text-white/40 max-w-xl">
                          Review pending applications for teams you lead, manage approved squad members, or check the status of your own applications.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => fetchManageData()}
                          disabled={loadingManage}
                          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-white/60 bg-white/[0.04] border border-white/[0.08] hover:text-white hover:bg-white/[0.08] transition-all disabled:opacity-50 cursor-pointer"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${loadingManage ? "animate-spin" : ""}`} />
                          <span>Refresh</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/[0.06]">
                      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <p className="text-[10px] uppercase font-mono text-white/40 tracking-wider mb-1">Teams Led</p>
                        <p className="text-xl font-bold text-white font-mono">{manageData?.teamsLed.length || 0}</p>
                      </div>
                      <div className={`p-3.5 rounded-xl border transition-all ${
                        (manageData?.totalPendingToReview || 0) > 0
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                          : "bg-white/[0.02] border-white/[0.05] text-white/40"
                      }`}>
                        <p className="text-[10px] uppercase font-mono tracking-wider mb-1 flex items-center justify-between">
                          <span>Pending Review</span>
                          {(manageData?.totalPendingToReview || 0) > 0 && (
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                          )}
                        </p>
                        <p className={`text-xl font-bold font-mono ${
                          (manageData?.totalPendingToReview || 0) > 0 ? "text-amber-400" : "text-white"
                        }`}>
                          {manageData?.totalPendingToReview || 0}
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <p className="text-[10px] uppercase font-mono text-white/40 tracking-wider mb-1">Teams Joined</p>
                        <p className="text-xl font-bold text-white font-mono">{manageData?.teamsJoined.length || 0}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                        <p className="text-[10px] uppercase font-mono text-white/40 tracking-wider mb-1">My Requests</p>
                        <p className="text-xl font-bold text-white font-mono">{manageData?.pendingApplications.length || 0}</p>
                      </div>
                    </div>
                  </div>

                  {/* Toast Alerts */}
                  {manageSuccessMsg && (
                    <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-3 shadow-lg shadow-emerald-500/5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{manageSuccessMsg}</span>
                    </div>
                  )}
                  {manageErrorMsg && (
                    <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium flex items-center gap-3 shadow-lg shadow-red-500/5">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{manageErrorMsg}</span>
                    </div>
                  )}

                  {/* ─── SECTION 1: TEAMS YOU LEAD (Leader Approval Hub) ─── */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-amber-400" />
                        <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
                          Teams You Lead ({manageData?.teamsLed.length || 0})
                        </h3>
                      </div>
                      <button
                        onClick={() => setActiveTab("create")}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-mono inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create Another Team</span>
                      </button>
                    </div>

                    {loadingManage && !manageData ? (
                      <div className="p-12 text-center text-white/30 text-xs font-mono">
                        <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-white/20" />
                        Loading your leadership squads...
                      </div>
                    ) : !manageData?.teamsLed || manageData.teamsLed.length === 0 ? (
                      <div className="mac-window p-8 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
                          <Crown className="w-6 h-6 text-white/20" />
                        </div>
                        <h4 className="text-base font-bold text-white/70 mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                          You Haven&apos;t Created Any Teams Yet
                        </h4>
                        <p className="text-xs text-white/40 max-w-md mx-auto mb-5">
                          Create a team to become a Team Leader. You can recruit teammates, review applicant requests, and decide who joins your squad!
                        </p>
                        <button
                          onClick={() => setActiveTab("create")}
                          className="btn-premium text-xs py-2.5 px-5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Create a Team</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {manageData.teamsLed.map((team) => (
                          <div key={team.id} className="mac-window p-5 sm:p-7 space-y-6">
                            {/* Team Head */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
                              <div>
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                                  <span className="text-[10px] text-amber-400/90 font-mono uppercase font-semibold">
                                    {team.hackathon_name}
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-mono font-bold">
                                    TEAM LEADER
                                  </span>
                                </div>
                                <h3 className="text-xl font-bold text-white">
                                  {team.team_name || `${team.creator_name}'s Team`}
                                </h3>
                              </div>

                              <div className="flex items-center gap-2 flex-wrap">
                                <button
                                  onClick={() => copyTeamCode(team.team_code)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-300 hover:bg-cyan-500/20 transition-all cursor-pointer"
                                  title="Click to copy invite code"
                                >
                                  <Hash className="w-3 h-3 text-cyan-400" />
                                  <span>{team.team_code}</span>
                                  {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
                                </button>
                                <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                                  team.member_count >= team.max_members
                                    ? "bg-red-500/15 border border-red-500/30 text-red-300"
                                    : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                                }`}>
                                  {team.member_count}/{team.max_members} Members {team.member_count >= team.max_members && "(Full)"}
                                </span>
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to permanently delete "${team.team_name || team.hackathon_name}"? All members and pending applications will be deleted. This cannot be undone.`)) {
                                      handleManageAction("delete_team", team.id)
                                    }
                                  }}
                                  disabled={manageActionLoading?.includes(team.id)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs font-mono text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all cursor-pointer disabled:opacity-50"
                                  title="Permanently disband and delete this squad"
                                >
                                  {manageActionLoading?.includes(team.id) ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                                  ) : (
                                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                  )}
                                  <span>Delete Squad</span>
                                </button>
                              </div>
                            </div>

                            {/* ── Sub-section A: Pending Join Applications ── */}
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-amber-400" />
                                  <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                                    Pending Join Requests ({team.pending_applicants.length})
                                  </h4>
                                </div>
                                {team.pending_applicants.length > 0 && (
                                  <span className="text-[11px] text-amber-400/90 font-mono bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/25">
                                    Decision Required
                                  </span>
                                )}
                              </div>

                              {team.pending_applicants.length === 0 ? (
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs text-white/35 font-mono">
                                  No pending join requests for this squad. Teammates can apply using your invite code <strong>{team.team_code}</strong> or from Browse Teams.
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                  {team.pending_applicants.map((applicant) => {
                                    const isActionLoading = manageActionLoading?.includes(applicant.id)
                                    return (
                                      <div
                                        key={applicant.id}
                                        className="p-4 rounded-xl bg-gradient-to-b from-white/[0.04] to-white/[0.02] border border-amber-500/30 hover:border-amber-500/50 transition-all flex flex-col justify-between"
                                      >
                                        <div>
                                          <div className="flex items-start justify-between gap-3 mb-2.5">
                                            <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-md">
                                                {applicant.member_name.charAt(0).toUpperCase()}
                                              </div>
                                              <div>
                                                <p className="text-sm font-bold text-white">{applicant.member_name}</p>
                                                <p className="text-xs text-white/40 flex items-center gap-1">
                                                  <GraduationCap className="w-3 h-3 text-white/30" />
                                                  <span>{applicant.member_college}</span>
                                                </p>
                                              </div>
                                            </div>
                                            {applicant.member_linkedin && (
                                              <a
                                                href={applicant.member_linkedin}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-blue-400 hover:text-blue-300 transition-colors"
                                                title="View LinkedIn Profile"
                                              >
                                                <Linkedin className="w-4 h-4" />
                                              </a>
                                            )}
                                          </div>

                                          <div className="text-[11px] text-white/50 font-mono mb-3 flex items-center gap-1.5">
                                            <Mail className="w-3 h-3 text-white/30" />
                                            <span>{applicant.member_email}</span>
                                          </div>

                                          {applicant.member_skills && (
                                            <div className="mb-4">
                                              <p className="text-[10px] text-white/30 uppercase font-mono mb-1.5 font-semibold">
                                                Applicant Skills
                                              </p>
                                              <div className="flex flex-wrap gap-1.5">
                                                {applicant.member_skills.split(",").map((sk, i) => (
                                                  <span
                                                    key={i}
                                                    className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/25 text-purple-300 text-[10px] font-mono"
                                                  >
                                                    {sk.trim()}
                                                  </span>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                        {/* Leader Decision Actions */}
                                        <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                                          <button
                                            onClick={() => handleManageAction("approve", team.id, applicant.id)}
                                            disabled={isActionLoading || team.member_count >= team.max_members}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-white text-black hover:bg-white/90 active:scale-[0.98] transition-all shadow-md cursor-pointer disabled:opacity-50"
                                            title={team.member_count >= team.max_members ? "Team is full" : "Approve applicant into squad"}
                                          >
                                            {isActionLoading ? (
                                              <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                                            ) : (
                                              <UserCheck className="w-3.5 h-3.5 text-black" />
                                            )}
                                            <span>Approve</span>
                                          </button>

                                          <button
                                            onClick={() => {
                                              if (confirm(`Reject ${applicant.member_name}'s application?`)) {
                                                handleManageAction("reject", team.id, applicant.id)
                                              }
                                            }}
                                            disabled={isActionLoading}
                                            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 transition-all cursor-pointer disabled:opacity-50"
                                          >
                                            <X className="w-3.5 h-3.5" />
                                            <span>Reject</span>
                                          </button>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>

                            {/* ── Sub-section B: Confirmed Squad Members & Contact Directory ── */}
                            {(() => {
                              const allSquadEmails = [
                                team.creator_email,
                                ...team.approved_members.map((m: any) => m.member_email),
                              ].filter(Boolean) as string[]

                              return (
                                <div className="space-y-3 pt-2">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                      <Users className="w-4 h-4 text-cyan-400" />
                                      <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                                        Confirmed Squad & Contact Roster ({team.member_count}/{team.max_members})
                                      </h4>
                                    </div>

                                    {allSquadEmails.length > 0 && (
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <a
                                          href={`mailto:${allSquadEmails.join(",")}?subject=${encodeURIComponent(`[CodeNeuraX BuddyKid] ${team.team_name || team.hackathon_name} Squad Sync`)}`}
                                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-all cursor-pointer"
                                          title="Send an email to everyone in the squad"
                                        >
                                          <Send className="w-3 h-3 text-cyan-400" />
                                          <span>Email Entire Squad</span>
                                        </a>
                                        <button
                                          onClick={() => copyText(allSquadEmails.join(", "), `squad-emails-${team.id}`)}
                                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-white/70 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
                                          title="Copy all squad emails"
                                        >
                                          {copiedItem === `squad-emails-${team.id}` ? (
                                            <>
                                              <Check className="w-3 h-3 text-emerald-400" />
                                              <span className="text-emerald-300">Emails Copied!</span>
                                            </>
                                          ) : (
                                            <>
                                              <Copy className="w-3 h-3 text-white/50" />
                                              <span>Copy All Emails</span>
                                            </>
                                          )}
                                        </button>
                                      </div>
                                    )}
                                  </div>

                                  <div className="space-y-2.5">
                                    {/* Leader Row with full contact */}
                                    <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/[0.06] to-transparent border border-amber-400/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                      <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-xs font-bold text-white shadow-md shrink-0">
                                          {team.creator_name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-bold text-white">{team.creator_name}</p>
                                            <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[9px] font-mono font-bold flex items-center gap-1">
                                              <Crown className="w-2.5 h-2.5" /> LEADER (YOU)
                                            </span>
                                          </div>
                                          <p className="text-xs text-white/40">{team.creator_college} • {team.creator_skills}</p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 flex-wrap">
                                        {team.creator_email && (
                                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white/70">
                                            <Mail className="w-3 h-3 text-cyan-400" />
                                            <a href={`mailto:${team.creator_email}`} className="hover:text-cyan-300 underline underline-offset-2">
                                              {team.creator_email}
                                            </a>
                                            <button
                                              onClick={() => copyText(team.creator_email!, `creator-email-${team.id}`)}
                                              className="ml-1 text-white/40 hover:text-white cursor-pointer"
                                              title="Copy email"
                                            >
                                              {copiedItem === `creator-email-${team.id}` ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                                            </button>
                                          </div>
                                        )}
                                        {team.creator_linkedin && (
                                          <a
                                            href={team.creator_linkedin}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-300 hover:bg-blue-500/20 transition cursor-pointer"
                                          >
                                            <Linkedin className="w-3 h-3 text-blue-400" />
                                            <span>LinkedIn</span>
                                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                          </a>
                                        )}
                                      </div>
                                    </div>

                                    {/* Approved Members List with full contact */}
                                    {team.approved_members.map((member) => {
                                      const isActionLoading = manageActionLoading?.includes(member.id)
                                      return (
                                        <div
                                          key={member.id}
                                          className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
                                        >
                                          <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm">
                                              {member.member_name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                              <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-sm font-semibold text-white">{member.member_name}</p>
                                                <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[9px] font-mono font-semibold">
                                                  SQUAD MEMBER
                                                </span>
                                              </div>
                                              <p className="text-xs text-white/40">
                                                {member.member_college} • {member.member_skills}
                                              </p>
                                            </div>
                                          </div>

                                          <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
                                            <div className="flex items-center gap-2 flex-wrap">
                                              {member.member_email && (
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-white/70">
                                                  <Mail className="w-3 h-3 text-cyan-400" />
                                                  <a href={`mailto:${member.member_email}`} className="hover:text-cyan-300 underline underline-offset-2">
                                                    {member.member_email}
                                                  </a>
                                                  <button
                                                    onClick={() => copyText(member.member_email, `member-email-${member.id}`)}
                                                    className="ml-1 text-white/40 hover:text-white cursor-pointer"
                                                    title="Copy email"
                                                  >
                                                    {copiedItem === `member-email-${member.id}` ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                                                  </button>
                                                </div>
                                              )}
                                              {member.member_linkedin && (
                                                <a
                                                  href={member.member_linkedin}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-300 hover:bg-blue-500/20 transition cursor-pointer"
                                                >
                                                  <Linkedin className="w-3 h-3 text-blue-400" />
                                                  <span>LinkedIn</span>
                                                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                                </a>
                                              )}
                                            </div>

                                            <button
                                              onClick={() => {
                                                if (confirm(`Are you sure you want to remove ${member.member_name} from your squad? They will not be able to rejoin without your permission.`)) {
                                                  handleManageAction("remove_member", team.id, member.id)
                                                }
                                              }}
                                              disabled={isActionLoading}
                                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                                              title="Leader removal power"
                                            >
                                              {isActionLoading ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin text-red-300" />
                                              ) : (
                                                <UserMinus className="w-3.5 h-3.5 text-red-400" />
                                              )}
                                              <span>Remove Member</span>
                                            </button>
                                          </div>
                                        </div>
                                      )
                                    })}

                                    {team.approved_members.length === 0 && (
                                      <p className="text-xs text-white/30 font-mono py-2 italic">
                                        No teammates in your squad yet. Approve applicants above or invite friends using code {team.team_code}!
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )
                            })()}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ─── SECTION 2: TEAMS YOU'VE JOINED (Teammate Directory & Leave Squad) ─── */}
                  <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
                          Teams You&apos;ve Joined & Squad Directory ({manageData?.teamsJoined.length || 0})
                        </h3>
                      </div>
                      <span className="text-xs text-white/40 font-mono">
                        View teammate contact details or leave squad
                      </span>
                    </div>

                    {!manageData?.teamsJoined || manageData.teamsJoined.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center text-xs text-white/35 font-mono">
                        You haven&apos;t joined any other teams yet. Browse open squads to apply!
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {manageData.teamsJoined.map((item) => {
                          const isActionLoading = manageActionLoading?.includes(item.team.id)
                          const contacts = item.squad_contacts || []
                          const allEmails = contacts.map(c => c.email).filter(Boolean)

                          return (
                            <div
                              key={item.membership_id}
                              className="mac-window p-5 sm:p-7 space-y-6"
                            >
                              {/* Header */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
                                <div>
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="text-[10px] text-amber-400 font-mono uppercase font-semibold">
                                      {item.team.hackathon_name}
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-emerald-400/15 text-emerald-300 text-[10px] font-mono font-bold">
                                      ACTIVE MEMBER
                                    </span>
                                  </div>

                                  <h4 className="text-xl font-bold text-white mb-1">
                                    {item.team.team_name || `${item.team.creator_name}'s Team`}
                                  </h4>
                                  <p className="text-xs text-white/40">
                                    Team Leader: <strong className="text-white/70">{item.team.creator_name}</strong> ({item.team.creator_college})
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 flex-wrap">
                                  <button
                                    onClick={() => openTeamDetails(item.team)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-white/60 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Team Details</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to leave ${item.team.team_name || "this team"}? You will need leader approval to rejoin.`)) {
                                        handleManageAction("leave_team", item.team.id)
                                      }
                                    }}
                                    disabled={isActionLoading}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 transition cursor-pointer disabled:opacity-50"
                                  >
                                    {isActionLoading ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <LogOut className="w-3.5 h-3.5 text-red-400" />
                                    )}
                                    <span>Leave Squad</span>
                                  </button>
                                </div>
                              </div>

                              {/* ── Teammate Contact Directory ── */}
                              <div className="space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div>
                                    <h5 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                                      <Mail className="w-4 h-4 text-cyan-400" />
                                      <span>Squad Contact Directory ({contacts.length} Teammates)</span>
                                    </h5>
                                    <p className="text-xs text-white/40">
                                      Reach out to coordinate hackathon strategy, repo links, and meeting calls.
                                    </p>
                                  </div>

                                  {allEmails.length > 0 && (
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <a
                                        href={`mailto:${allEmails.join(",")}?subject=${encodeURIComponent(`[CodeNeuraX BuddyKid] ${item.team.team_name || item.team.hackathon_name} Squad Sync`)}`}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-all cursor-pointer"
                                        title="Email all members of this squad"
                                      >
                                        <Send className="w-3 h-3 text-cyan-400" />
                                        <span>Email Entire Squad</span>
                                      </a>
                                      <button
                                        onClick={() => copyText(allEmails.join(", "), `joined-emails-${item.team.id}`)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium text-white/70 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition cursor-pointer"
                                        title="Copy all squad emails"
                                      >
                                        {copiedItem === `joined-emails-${item.team.id}` ? (
                                          <>
                                            <Check className="w-3 h-3 text-emerald-400" />
                                            <span className="text-emerald-300">Copied!</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="w-3 h-3 text-white/50" />
                                            <span>Copy Emails</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {contacts.map((contact) => {
                                    const isSelf = user?.email?.toLowerCase() === contact.email?.toLowerCase()
                                    return (
                                      <div
                                        key={contact.id}
                                        className={`p-4 rounded-xl border transition-all ${
                                          contact.is_leader
                                            ? "bg-amber-500/[0.04] border-amber-400/25"
                                            : "bg-white/[0.02] border-white/[0.06]"
                                        }`}
                                      >
                                        <div className="flex items-start justify-between gap-3 mb-2.5">
                                          <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md ${
                                              contact.is_leader
                                                ? "bg-gradient-to-tr from-amber-500 to-orange-600"
                                                : "bg-gradient-to-tr from-cyan-600 to-blue-600"
                                            }`}>
                                              {contact.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                              <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-sm font-bold text-white truncate">{contact.name}</p>
                                                {contact.is_leader ? (
                                                  <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[9px] font-mono font-bold flex items-center gap-1">
                                                    <Crown className="w-2.5 h-2.5" /> LEADER
                                                  </span>
                                                ) : isSelf ? (
                                                  <span className="px-1.5 py-0.5 rounded bg-emerald-400/20 text-emerald-300 text-[9px] font-mono font-bold">
                                                    YOU
                                                  </span>
                                                ) : (
                                                  <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 text-[9px] font-mono font-semibold">
                                                    SQUAD MEMBER
                                                  </span>
                                                )}
                                              </div>
                                              <p className="text-xs text-white/40 truncate">
                                                {contact.college} • {contact.skills}
                                              </p>
                                            </div>
                                          </div>

                                          {contact.linkedin && (
                                            <a
                                              href={contact.linkedin}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition shrink-0"
                                              title="LinkedIn Profile"
                                            >
                                              <Linkedin className="w-4 h-4" />
                                            </a>
                                          )}
                                        </div>

                                        {contact.email && (
                                          <div className="pt-2.5 border-t border-white/[0.05] flex items-center justify-between gap-2 text-xs font-mono">
                                            <div className="flex items-center gap-1.5 text-white/70 truncate">
                                              <Mail className="w-3 h-3 text-cyan-400 shrink-0" />
                                              <a href={`mailto:${contact.email}`} className="hover:text-cyan-300 truncate underline underline-offset-2">
                                                {contact.email}
                                              </a>
                                            </div>
                                            <button
                                              onClick={() => copyText(contact.email, `contact-email-${contact.id}`)}
                                              className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white transition shrink-0 cursor-pointer"
                                              title="Copy email address"
                                            >
                                              {copiedItem === `contact-email-${contact.id}` ? (
                                                <>
                                                  <Check className="w-3 h-3 text-green-400" />
                                                  <span className="text-[10px] text-green-300">Copied</span>
                                                </>
                                              ) : (
                                                <>
                                                  <Copy className="w-3 h-3" />
                                                  <span className="text-[10px]">Copy</span>
                                                </>
                                              )}
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* ─── SECTION 3: YOUR PENDING APPLICATIONS ─── */}
                  <div className="space-y-4 pt-4 border-t border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <h3 className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
                          Your Pending Applications ({manageData?.pendingApplications.length || 0})
                        </h3>
                      </div>
                      <span className="text-xs text-white/40 font-mono">
                        Awaiting decision by the Team Leader
                      </span>
                    </div>

                    {!manageData?.pendingApplications || manageData.pendingApplications.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-center text-xs text-white/35 font-mono">
                        You have no pending join requests.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {manageData.pendingApplications.map((app) => {
                          const isActionLoading = manageActionLoading?.includes(app.team.id)
                          return (
                            <div
                              key={app.application_id}
                              className="mac-window p-5 space-y-4 flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <span className="text-[10px] text-purple-400 font-mono uppercase font-semibold">
                                    {app.team.hackathon_name}
                                  </span>
                                  <span className="px-2 py-0.5 rounded bg-amber-400/15 text-amber-300 text-[10px] font-mono font-bold flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5 animate-pulse" /> PENDING LEADER APPROVAL
                                  </span>
                                </div>

                                <h4 className="text-lg font-bold text-white mb-1">
                                  {app.team.team_name || `${app.team.creator_name}'s Team`}
                                </h4>
                                <p className="text-xs text-white/40 mb-3">
                                  Leader: <strong className="text-white/70">{app.team.creator_name}</strong> ({app.team.creator_college})
                                </p>

                                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs text-amber-200/80 mb-3">
                                  Your request was delivered to the Team Leader. They have full authority to approve or decline your squad membership.
                                </div>
                              </div>

                              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
                                <button
                                  onClick={() => openTeamDetails(app.team)}
                                  className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>View Team Info</span>
                                </button>

                                <button
                                  onClick={() => {
                                    if (confirm(`Withdraw your application for ${app.team.team_name || "this team"}?`)) {
                                      handleManageAction("cancel_application", app.team.id)
                                    }
                                  }}
                                  disabled={isActionLoading}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-white/60 hover:text-white border border-white/[0.08] transition cursor-pointer disabled:opacity-50"
                                >
                                  {isActionLoading ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <X className="w-3.5 h-3.5" />
                                  )}
                                  <span>Withdraw Request</span>
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* ═══ JOIN TEAM MODAL ═══ */}
      <AnimatePresence>
        {joiningTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={resetJoinForm}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar rounded-2xl"
            >
              <div className="mac-window">
                <div className="p-6 sm:p-8 max-h-[calc(90vh-44px)] overflow-y-auto no-scrollbar">
                  {/* Close Button */}
                  <button
                    onClick={resetJoinForm}
                    className="absolute top-14 right-4 p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {joinSuccess ? (
                    <div className="text-center py-4">
                      <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mx-auto mb-5">
                        <Clock className="w-8 h-8 text-amber-400 animate-pulse" />
                      </div>
                      <h3
                        className="text-xl font-bold text-white mb-2"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        Request Sent to Leader!
                      </h3>
                      <p className="text-white/50 text-sm mb-4 max-w-sm mx-auto">
                        Your application to join <span className="text-white font-semibold">{joiningTeam.team_name || `${joiningTeam.creator_name}'s Team`}</span> has been submitted.
                      </p>
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300/90 font-mono mb-6 max-w-sm mx-auto">
                        The Team Leader ({joiningTeam.creator_name}) will review your skills and college to approve or decline your squad request.
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                          onClick={() => {
                            resetJoinForm()
                            setActiveTab("my-teams")
                          }}
                          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white text-black hover:bg-white/90 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Clock className="w-3.5 h-3.5 text-black" />
                          <span>Check Application Status</span>
                        </button>
                        <button
                          onClick={resetJoinForm}
                          className="px-4 py-2.5 rounded-xl text-xs font-medium text-white/50 bg-white/[0.04] border border-white/[0.08] hover:text-white transition cursor-pointer"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Team Info Header */}
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-1">
                          <Trophy className="w-3.5 h-3.5 text-amber-400/70" />
                          <span
                            className="text-[0.65rem] text-amber-400/70 uppercase tracking-wider font-semibold"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            {joiningTeam.hackathon_name}
                          </span>
                        </div>
                        <h3
                          className="text-xl font-bold text-white mb-1"
                          style={{ fontFamily: "var(--font-serif)" }}
                        >
                          Join {joiningTeam.team_name || `${joiningTeam.creator_name}'s Team`}
                        </h3>
                        <p className="text-xs text-white/30">
                          {joiningTeam.member_count}/{joiningTeam.max_members} members •{" "}
                          {joiningTeam.max_members - joiningTeam.member_count} spots left
                        </p>
                      </div>

                      {joinError && (
                        <div className="mb-5 p-3.5 bg-red-500/15 border border-red-500/30 text-red-300 rounded-xl text-xs font-semibold flex items-center gap-2.5">
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                          <span>{joinError}</span>
                        </div>
                      )}

                      <form onSubmit={handleJoinTeam}>
                        <div className="space-y-4">
                          {/* Name */}
                          <div>
                            <label
                              className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                              style={{ fontFamily: "var(--font-mono)" }}
                              htmlFor="join-name"
                            >
                              <span className="inline-flex items-center gap-1.5">
                                <User className="w-3 h-3" />
                                Your Name <span className="text-red-400">*</span>
                              </span>
                            </label>
                            <input
                              id="join-name"
                              type="text"
                              className="input-mac"
                              placeholder="John Doe"
                              value={joinForm.member_name}
                              onChange={e => {
                                setJoinForm({ ...joinForm, member_name: e.target.value })
                                if (joinError && joinError.includes("name")) setJoinError(null)
                              }}
                              required
                              maxLength={100}
                            />
                          </div>

                          {/* Email */}
                          <div>
                            <label
                              className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                              style={{ fontFamily: "var(--font-mono)" }}
                              htmlFor="join-email"
                            >
                              <span className="inline-flex items-center gap-1.5">
                                <Mail className="w-3 h-3" />
                                Email <span className="text-red-400">*</span>
                              </span>
                            </label>
                            <input
                              id="join-email"
                              type="email"
                              className="input-mac"
                              placeholder="john@example.com"
                              value={joinForm.member_email}
                              onChange={e => {
                                setJoinForm({ ...joinForm, member_email: e.target.value })
                                if (joinError && joinError.includes("email")) setJoinError(null)
                              }}
                              required
                              maxLength={100}
                            />
                          </div>

                          {/* LinkedIn */}
                          <div>
                            <label
                              className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                              style={{ fontFamily: "var(--font-mono)" }}
                              htmlFor="join-linkedin"
                            >
                              <span className="inline-flex items-center gap-1.5">
                                <Linkedin className="w-3 h-3" />
                                LinkedIn URL <span className="text-red-400">*</span>
                              </span>
                            </label>
                            <input
                              id="join-linkedin"
                              type="url"
                              className="input-mac"
                              placeholder="https://linkedin.com/in/johndoe"
                              value={joinForm.member_linkedin}
                              onChange={e => {
                                setJoinForm({ ...joinForm, member_linkedin: e.target.value })
                                if (joinError && joinError.includes("LinkedIn")) setJoinError(null)
                              }}
                              required
                              maxLength={300}
                            />
                          </div>

                          {/* College */}
                          <div>
                            <label
                              className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                              style={{ fontFamily: "var(--font-mono)" }}
                              htmlFor="join-college"
                            >
                              <span className="inline-flex items-center gap-1.5">
                                <GraduationCap className="w-3 h-3" />
                                College <span className="text-red-400">*</span>
                              </span>
                            </label>
                            <input
                              id="join-college"
                              type="text"
                              className="input-mac"
                              placeholder="IIT Delhi"
                              value={joinForm.member_college}
                              onChange={e => {
                                setJoinForm({ ...joinForm, member_college: e.target.value })
                                if (joinError && joinError.includes("college")) setJoinError(null)
                              }}
                              required
                              maxLength={200}
                            />
                          </div>

                          {/* Skills */}
                          <div>
                            <label
                              className="block text-white/40 text-xs font-medium mb-2 uppercase tracking-wider"
                              style={{ fontFamily: "var(--font-mono)" }}
                            >
                              <span className="inline-flex items-center gap-1.5">
                                <Code2 className="w-3 h-3" />
                                Your Skills <span className="text-red-400">* (Click tags to select)</span>
                              </span>
                            </label>
                            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto no-scrollbar p-0.5">
                              {SKILL_SUGGESTIONS.map(skill => {
                                const isSelected = joinSelectedSkills.includes(skill)
                                return (
                                  <button
                                    key={skill}
                                    type="button"
                                    onClick={() => toggleSkill(skill, true)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                                      isSelected
                                        ? "bg-white text-black font-bold border-white shadow-sm scale-105"
                                        : "bg-white/[0.03] border-white/[0.08] text-white/50 hover:text-white hover:border-white/20"
                                    }`}
                                    style={{ fontFamily: "var(--font-mono)" }}
                                  >
                                    {skill} {isSelected && "✓"}
                                  </button>
                                )
                              })}
                            </div>
                            {joinSelectedSkills.length > 0 ? (
                              <p className="text-[0.7rem] text-emerald-400 mt-2 font-mono flex items-center gap-1">
                                <span>Selected ({joinSelectedSkills.length}):</span>{" "}
                                <strong className="text-white">{joinSelectedSkills.join(", ")}</strong>
                              </p>
                            ) : (
                              <p className="text-[0.65rem] text-white/30 mt-2 font-mono">
                                Click on one or more skills above to highlight your expertise
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-white text-black hover:bg-white/90 active:scale-[0.99] transition-all shadow-md mt-6 disabled:opacity-50 cursor-pointer"
                          disabled={joining}
                        >
                          {joining ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-black" />
                              <span>Submitting Request to Leader...</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 text-black" />
                              <span>Submit Request to Team Leader</span>
                              <ArrowRight className="w-4 h-4 text-black" />
                            </>
                          )}
                        </button>
                        <p className="text-center text-[0.65rem] text-white/30 mt-2.5 font-mono">
                          Leader approval is required. Once approved, you will be added to the official squad.
                        </p>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ TEAM DETAILS PANEL ═══ */}
      <AnimatePresence>
        {viewingTeam && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setViewingTeam(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar rounded-2xl"
            >
              <div className="mac-window">
                <div className="p-6 sm:p-8 max-h-[calc(90vh-44px)] overflow-y-auto no-scrollbar">
                  <button
                    onClick={() => setViewingTeam(null)}
                    className="absolute top-14 right-4 p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/40 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Hackathon Name */}
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-amber-400/70" />
                    <span
                      className="text-[0.7rem] text-amber-400/70 uppercase tracking-wider font-semibold"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {viewingTeam.hackathon_name}
                    </span>
                  </div>

                  <h3
                    className="text-2xl font-bold text-white mb-1"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {viewingTeam.team_name || `${viewingTeam.creator_name}'s Team`}
                  </h3>

                  <div className="flex items-center gap-3 mb-6">
                    <span
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-[0.65rem] text-cyan-400 font-bold"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      {viewingTeam.team_code}
                    </span>
                    <span className="text-xs text-white/30">
                      {viewingTeam.member_count}/{viewingTeam.max_members} members
                    </span>
                  </div>

                  {(() => {
                    const userEmail = user?.email?.toLowerCase()
                    const isLeader = Boolean(
                      userEmail &&
                        (viewingTeam.creator_email?.toLowerCase() === userEmail ||
                          manageData?.teamsLed.some(t => t.id === viewingTeam.id))
                    )
                    const isApprovedMember = Boolean(
                      userEmail &&
                        manageData?.teamsJoined.some(tj => tj.team.id === viewingTeam.id)
                    )
                    const isSquadMember = isLeader || isApprovedMember
                    const isPendingApplicant = Boolean(
                      userEmail &&
                        manageData?.pendingApplications.some(pa => pa.team.id === viewingTeam.id)
                    )
                    const isActionLoading = manageActionLoading?.includes(viewingTeam.id)

                    // Collect all squad emails for direct communication
                    const membersList = viewingTeam.members || []
                    const allSquadEmails = [
                      viewingTeam.creator_email,
                      ...membersList.map(m => m?.email),
                    ].filter(Boolean) as string[]

                    return (
                      <>
                        {/* ── Squad Contact Access Status Banner ── */}
                        {isSquadMember ? (
                          <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                              <div>
                                <p className="text-xs font-bold text-emerald-300">
                                  Squad Contact Directory Unlocked
                                </p>
                                <p className="text-[11px] text-emerald-300/70 font-mono">
                                  {isLeader ? "You lead this squad" : "You are a confirmed squad member"}
                                </p>
                              </div>
                            </div>

                            {allSquadEmails.length > 0 && (
                              <div className="flex items-center gap-2 flex-wrap">
                                <a
                                  href={`mailto:${allSquadEmails.join(",")}?subject=${encodeURIComponent(`[CodeNeuraX BuddyKid] ${viewingTeam.team_name || viewingTeam.hackathon_name} Squad Sync`)}`}
                                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-cyan-300 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 transition-all cursor-pointer"
                                  title="Send an email to everyone in the squad"
                                >
                                  <Send className="w-3 h-3 text-cyan-400" />
                                  <span>Email Squad</span>
                                </a>
                                <button
                                  onClick={() => copyText(allSquadEmails.join(", "), `modal-squad-emails-${viewingTeam.id}`)}
                                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-white/70 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] transition-all cursor-pointer"
                                  title="Copy all squad emails"
                                >
                                  {copiedItem === `modal-squad-emails-${viewingTeam.id}` ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span className="text-[10px] text-emerald-300">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3 text-white/50" />
                                      <span className="text-[10px]">Copy All</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="mb-5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-2.5 text-xs text-white/40">
                            <Lock className="w-4 h-4 text-white/30 shrink-0" />
                            <span>Teammate contact details (Email & LinkedIn) unlock once you join and are approved by the Team Leader.</span>
                          </div>
                        )}

                        {/* ── Creator / Leader Contact Card ── */}
                        <div className="mb-5">
                          <div className="flex items-center justify-between mb-2">
                            <p
                              className="text-[0.6rem] text-white/25 uppercase tracking-wider font-semibold"
                              style={{ fontFamily: "var(--font-mono)" }}
                            >
                              Team Leader
                            </p>
                            {isLeader && (
                              <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[9px] font-mono font-bold">
                                YOU (LEADER)
                              </span>
                            )}
                          </div>
                          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-sm">
                                  {(viewingTeam.creator_name || "L").charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-white truncate">{viewingTeam.creator_name || "Team Leader"}</p>
                                  <p className="text-[0.7rem] text-white/35 truncate">{viewingTeam.creator_college || "Leader"}</p>
                                </div>
                              </div>

                              {isSquadMember && viewingTeam.creator_linkedin && (
                                <a
                                  href={viewingTeam.creator_linkedin}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-300 hover:bg-blue-500/20 transition cursor-pointer shrink-0"
                                  title="View LinkedIn Profile"
                                >
                                  <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                                  <span>LinkedIn</span>
                                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                                </a>
                              )}
                            </div>

                            {/* Leader Contact Details if Squad Member */}
                            {isSquadMember && viewingTeam.creator_email && (
                              <div className="pt-2.5 border-t border-white/[0.04] flex items-center justify-between gap-2 text-xs font-mono">
                                <div className="flex items-center gap-1.5 text-white/70 truncate">
                                  <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                  <a href={`mailto:${viewingTeam.creator_email}`} className="hover:text-cyan-300 truncate underline underline-offset-2">
                                    {viewingTeam.creator_email}
                                  </a>
                                </div>
                                <button
                                  onClick={() => copyText(viewingTeam.creator_email!, `modal-creator-email-${viewingTeam.id}`)}
                                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white transition shrink-0 cursor-pointer"
                                  title="Copy leader email"
                                >
                                  {copiedItem === `modal-creator-email-${viewingTeam.id}` ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span className="text-[10px] text-emerald-300">Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span className="text-[10px]">Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Creator Skills */}
                        <div className="mb-5">
                          <p
                            className="text-[0.6rem] text-white/25 uppercase tracking-wider mb-2 font-semibold"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            Leader Skills
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {(viewingTeam.creator_skills || "General Developer").split(",").map((skill, i) => {
                              const trimmed = skill.trim()
                              if (!trimmed) return null
                              return (
                                <span
                                  key={i}
                                  className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/15 text-purple-300/80 text-[0.65rem] font-medium"
                                  style={{ fontFamily: "var(--font-mono)" }}
                                >
                                  {trimmed}
                                </span>
                              )
                            })}
                          </div>
                        </div>

                        {/* Looking For */}
                        {viewingTeam.looking_for && (
                          <div className="mb-5 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
                            <p
                              className="text-[0.6rem] text-cyan-400/50 uppercase tracking-wider mb-1 font-semibold"
                              style={{ fontFamily: "var(--font-mono)" }}
                            >
                              Looking For
                            </p>
                            <p className="text-sm text-white/50">{viewingTeam.looking_for}</p>
                          </div>
                        )}

                        {/* Confirmed Teammates */}
                        {membersList.length > 0 && (
                          <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                              <p
                                className="text-[0.6rem] text-white/25 uppercase tracking-wider font-semibold"
                                style={{ fontFamily: "var(--font-mono)" }}
                              >
                                Confirmed Teammates ({membersList.length})
                              </p>
                              {isSquadMember && (
                                <span className="text-[10px] font-mono text-emerald-400/80">
                                  Contacts Unlocked
                                </span>
                              )}
                            </div>
                            <div className="space-y-2.5">
                              {membersList.map((m, i) => {
                                const isMemberSelf = userEmail && m.email?.toLowerCase() === userEmail
                                return (
                                  <div
                                    key={i}
                                    className={`p-3 rounded-xl border transition-all ${
                                      isSquadMember
                                        ? "bg-white/[0.03] border-white/[0.08]"
                                        : "bg-white/[0.02] border-white/[0.04]"
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                                          {m.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                          <div className="flex items-center gap-1.5 flex-wrap">
                                            <p className="text-xs font-semibold text-white/90 truncate">{m.name}</p>
                                            {isMemberSelf && (
                                              <span className="px-1.5 py-0.2 rounded bg-emerald-400/20 text-emerald-300 text-[8px] font-mono font-bold">
                                                YOU
                                              </span>
                                            )}
                                          </div>
                                          <p className="text-[0.65rem] text-white/35 truncate">
                                            {m.college} • {m.skills}
                                          </p>
                                        </div>
                                      </div>

                                      {isSquadMember && m.linkedin && (
                                        <a
                                          href={m.linkedin}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition shrink-0"
                                          title="View LinkedIn Profile"
                                        >
                                          <Linkedin className="w-3.5 h-3.5" />
                                        </a>
                                      )}
                                    </div>

                                    {/* Member Email if Squad Member */}
                                    {isSquadMember && m.email && (
                                      <div className="pt-2 mt-2 border-t border-white/[0.04] flex items-center justify-between gap-2 text-xs font-mono">
                                        <div className="flex items-center gap-1.5 text-white/70 truncate">
                                          <Mail className="w-3 h-3 text-cyan-400 shrink-0" />
                                          <a href={`mailto:${m.email}`} className="hover:text-cyan-300 truncate underline underline-offset-2 text-[11px]">
                                            {m.email}
                                          </a>
                                        </div>
                                        <button
                                          onClick={() => copyText(m.email!, `modal-member-email-${m.id || i}`)}
                                          className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white transition shrink-0 cursor-pointer"
                                          title="Copy email"
                                        >
                                          {copiedItem === `modal-member-email-${m.id || i}` ? (
                                            <>
                                              <Check className="w-3 h-3 text-emerald-400" />
                                              <span className="text-[9px] text-emerald-300">Copied</span>
                                            </>
                                          ) : (
                                            <>
                                              <Copy className="w-3 h-3" />
                                              <span className="text-[9px]">Copy</span>
                                            </>
                                          )}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* ── Contextual Action Button ── */}
                        {isLeader ? (
                          <div className="flex flex-col sm:flex-row items-center gap-2">
                            <button
                              onClick={() => {
                                setViewingTeam(null)
                                setActiveTab("my-teams")
                              }}
                              className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-amber-400/15 border border-amber-400/30 text-amber-300 hover:bg-amber-400/25 transition-all shadow-md cursor-pointer"
                            >
                              <Crown className="w-4 h-4 text-amber-400" />
                              <span>Manage Squad (You are Leader)</span>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to permanently delete "${viewingTeam.team_name || "this team"}"? All members and pending join requests will be deleted. This cannot be undone.`)) {
                                  handleManageAction("delete_team", viewingTeam.id)
                                }
                              }}
                              disabled={isActionLoading}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 transition-all shadow-md cursor-pointer disabled:opacity-50"
                              title="Disband and permanently delete this squad"
                            >
                              {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin text-red-300" /> : <Trash2 className="w-4 h-4 text-red-400" />}
                              <span>Delete Squad</span>
                            </button>
                          </div>
                        ) : isApprovedMember ? (
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to leave ${viewingTeam.team_name || "this team"}? You will need leader approval to rejoin.`)) {
                                setViewingTeam(null)
                                handleManageAction("leave_team", viewingTeam.id)
                              }
                            }}
                            disabled={isActionLoading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 transition-all shadow-md cursor-pointer disabled:opacity-50"
                          >
                            {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4 text-red-400" />}
                            <span>Leave Squad</span>
                          </button>
                        ) : isPendingApplicant ? (
                          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                            <div className="flex items-center justify-center gap-2 text-amber-300 text-sm font-semibold mb-1">
                              <Clock className="w-4 h-4 animate-pulse text-amber-400" />
                              <span>Application Pending Review</span>
                            </div>
                            <p className="text-white/40 text-xs mb-3">
                              The Team Leader has not reviewed your application yet.
                            </p>
                            <button
                              onClick={() => {
                                setViewingTeam(null)
                                handleManageAction("cancel_application", viewingTeam.id)
                              }}
                              disabled={isActionLoading}
                              className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-white/60 hover:text-white border border-white/[0.08] transition cursor-pointer"
                            >
                              Withdraw Request
                            </button>
                          </div>
                        ) : viewingTeam.member_count < viewingTeam.max_members ? (
                          <button
                            onClick={() => {
                              const target = viewingTeam
                              setViewingTeam(null)
                              handleJoinClick(target)
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold bg-white text-black hover:bg-white/90 transition-all shadow-md cursor-pointer"
                          >
                            <UserPlus className="w-4 h-4 text-black" />
                            <span>Apply to Join This Team</span>
                            <ArrowRight className="w-4 h-4 text-black" />
                          </button>
                        ) : (
                          <div className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white/30 bg-white/[0.03] border border-white/[0.06]">
                            <Users className="w-4 h-4" />
                            Team is Full
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-white/[0.04] py-10 relative">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/20 text-xs tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
            BuddyKid by Team CodeNeuraX 💙
          </p>
        </div>
      </footer>

      {showAuthModal && <AuthModal type={authType} onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}
