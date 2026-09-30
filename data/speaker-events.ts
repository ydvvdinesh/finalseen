import { getAssetUrl } from "@/lib/storage"

/** Bump when poster images change so browsers refetch */
export const SPEAKER_IMAGE_VERSION = "3"

export type SpeakerEvent = {
  id: number
  title: string
  description: string
  fullDescription: string
  date: string
  location: string
  expectedAudience: string
  image: string
  category: string
  duration: string
  highlights: string[]
  lookingFor: string[]
  perks: string[]
}

export const SPEAKER_EVENTS: SpeakerEvent[] = [
  {
    id: 1,
    title: "Open Source & GSoC: Your First Contribution",
    description:
      "Help beginners make their first open-source PR and understand GSoC / open-source fellowship pathways.",
    fullDescription:
      "Many of our members want to contribute to open source but don't know where to start. We need a speaker active in OSS—GSoC mentor/alumni, maintainers, or prolific contributors—who can demystify the process.\n\nCover: finding good-first-issues, reading codebases, writing PRs, communication etiquette, and overview of GSoC / LFX / Outreachy. A short live demo of finding and fixing a small issue would be a huge plus. Casual, encouraging tone welcome.",
    date: "October 17, 2026",
    location: "Google Meet",
    expectedAudience: "100+ open-source beginners",
    image: getAssetUrl("/images/CodeNeuraX.webp"),
    category: "Workshop",
    duration: "90 minutes",
    highlights: ["First PR", "GSoC Overview", "Maintainer Tips", "Live Demo"],
    lookingFor: [
      "Active open-source contributor or GSoC alumni/mentor",
      "Patient explainer for absolute beginners",
      "Optional: live demo environment ready",
    ],
    perks: [
      "OSS community cross-promotion",
      "Featured in our newsletter",
      "Long-term speaker pipeline for CNX",
    ],
  },
]

export function getSpeakerEventById(id: string): SpeakerEvent | undefined {
  return SPEAKER_EVENTS.find((e) => String(e.id) === id)
}
  