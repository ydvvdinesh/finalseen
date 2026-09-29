/** Bump when event copy or images change (forces browsers to refetch) */
export const UPCOMING_EVENTS_VERSION = "6"

export type UpcomingEvent = {
  id: string
  title: string
  date: string
  time: string
  location: string
  type: string
  description: string
  status: string
  registrationLink: string
  image: string
  speaker?: string
}

export const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: "crack-gsoc-amazon-nidhi-singh",
    title: "How to Crack Google Summer of Code & Amazon: From Getting Started to Getting Selected",
    date: "Saturday, October 17, 2026",
    time: "7:30 PM - 9:00 PM GMT+5:30",
    location: "Google Meet",
    type: "Speaker Session",
    description:
      "CodeNeuraX proudly presents an exclusive open-source and career-focused session featuring Nidhi Singh — GSoC Contributor & Mentor at AOSSIE and Software Engineer at Amazon. Discover how GSoC works, how to get started with open source, find the right organizations, submit winning proposals, avoid common pitfalls, and build a strong software engineering profile for top tech companies like Amazon — followed by a live interactive Q&A.",
    status: "registration-open",
    registrationLink: "https://luma.com/cnojw1t3",
    image: "/images/gsoc-amazon-event.jpg",
    speaker: "Nidhi Singh — GSoC Contributor & Mentor at AOSSIE, Software Engineer at Amazon",
  },
  // Hackathon of CodeNeuraX (commented out as requested, do not remove)
  /*
  {
    id: "hackathon-of-codeneurax",
    title: "Hackathon of CodeNeuraX",
    date: "TBA (To Be Announced)",
    time: "TBA",
    location: "TBA (Online / Hybrid)",
    type: "Hackathon",
    description:
      "Get ready for the Hackathon of CodeNeuraX! Gather your team, build innovative tech solutions, tackle real-world problem statements, and compete for exciting prizes and mentorship. Full schedule, tracks, and registrations to be announced soon.",
    status: "upcoming",
    registrationLink: "https://whatsapp.com/channel/0029VbC93H2HVvTiyyFL9C0Y",
    image: "/images/hackathon.jpg",
  },
  */
]