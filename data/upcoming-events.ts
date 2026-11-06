import { getAssetUrl } from "@/lib/storage"

/** Bump when event copy or images change (forces browsers to refetch) */
export const UPCOMING_EVENTS_VERSION = "10"

export type UpcomingEvent = {
  id: string
  title: string
  subtitle?: string
  date: string
  time: string
  location: string
  type: string
  description: string
  status: "registration-open" | "upcoming" | "Ongoing" | string
  registrationLink: string
  image: string
  speaker?: string
  organizer?: string
  registrationPlatform?: string
  entryFee?: string
  prizes?: string
  highlights?: string[]
  mode?: "Offline" | "Online" | "Hybrid"
  deadline?: string
}

export const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: "neurasprint-2026",
    title: "NeuraSprint 2026 — 24-Hour Web Development Challenge",
    subtitle: "Build. Solve. Deploy. Present.",
    date: "December 28-29, 2026",
    time: "12:00 AM - 12:00 AM IST (24 Hours)",
    location: "Online (Anywhere)",
    type: "Online Hackathon",
    description:
      "A 24-hour online Web Development Challenge bringing together students, developers, and working professionals to build practical solutions using modern development tools and AI-assisted coding. AI tools, agents, libraries, and frameworks are fully allowed. Total cash prize pool ₹7,500+ and certificates for all who submit.",
    status: "registration-open",
    registrationLink: "/neurasprint",
    image: "/images/neuraknockout-2026.jpg",
    organizer: "CodeNeuraX",
    entryFee: "₹99",
    prizes: "₹7,500+ Cash Prizes (1st: ₹3,500 | 2nd: ₹2,500 | 3rd: ₹1,500)",
    highlights: [
      "🏆 ₹7,500+ Cash Prizes",
      "🤖 AI Tools & Agents Allowed",
      "⚡ 24-Hour Online Challenge",
      "📜 Certificates for All",
    ],
    mode: "Online",
    deadline: "December 27, 2026",
  },
]