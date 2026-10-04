import { getAssetUrl } from "@/lib/storage"

/** Bump when event copy or images change (forces browsers to refetch) */
export const UPCOMING_EVENTS_VERSION = "9"

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
    id: "neuraknockout-2026",
    title: "CodeNeuraX : NeuraKnockout 2026 — The Ultimate Web Dev Challenge",
    subtitle: "The Ultimate Web Dev Challenge",
    date: "Saturday, October 24, 2026",
    time: "9:00 AM - 4:00 PM IST (7 Hours)",
    location: "Marwadi University, Rajkot (Offline)",
    type: "Offline Hackathon",
    description:
      "An offline web development challenge organised by in collabration with Dept. of AI, ML & DS (Marwadi University) designed to test your web development skills, creativity, problem-solving ability, technical implementation, and practical solutions. Problem statement drops at 12:00 AM Midnight on 24 Oct. AI tools, agents, libraries, and frameworks are fully allowed. Total cash prize pool ₹4,700+ and certificates for all.",
    status: "registration-open",
    registrationLink:
      "https://unstop.com/hackathons/codeneurax-neuraknockout-2026-codeneurax-1765131",
    image: "/images/neuraknockout-2026.jpg",
    organizer: "CodeNeuraX",
    registrationPlatform: "Unstop",
    prizes: "₹4,700+ Cash Prizes (1st: ₹2,100 | 2nd: ₹1,500 | 3rd: ₹1,100)",
    highlights: [
      "🏆 ₹4,700+ Cash Prizes",
      "🤖 AI Tools & Agents Allowed",
      "⚡ 7-Hour Offline Challenge",
      "📜 Certificates for All",
    ],
    mode: "Offline",
    deadline: "October 23, 2026",
  },
  {
    id: "crack-gsoc-amazon-nidhi-singh",
    title: "How to Crack Google Summer of Code & Amazon: From Getting Started to Getting Selected",
    date: "Saturday, October 17, 2026",
    time: "7:30 PM - 9:00 PM GMT+5:30",
    location: "Google Meet (Online)",
    type: "Speaker Session",
    description:
      "CodeNeuraX proudly presents an exclusive open-source and career-focused session featuring Nidhi Singh — GSoC Contributor & Mentor at AOSSIE and Software Engineer at Amazon. Discover how GSoC works, how to get started with open source, find the right organizations, submit winning proposals, avoid common pitfalls, and build a strong software engineering profile for top tech companies like Amazon — followed by a live interactive Q&A.",
    status: "registration-open",
    registrationLink: "https://luma.com/cnojw1t3",
    image: getAssetUrl("/images/gsoc-amazon-event.png"),
    speaker: "Nidhi Singh — GSoC Contributor & Mentor at AOSSIE, Software Engineer at Amazon",
    registrationPlatform: "Lu.ma",
    entryFee: "Free",
    highlights: [
      "⚡ GSoC 2026 Strategy",
      "💼 Amazon SWE Insights",
      "🎯 Live Q&A Session",
    ],
    mode: "Online",
  },
]