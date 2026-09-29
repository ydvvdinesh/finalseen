import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sponsorship Proposal | AI Spark 2026 | CodeNeuraX",
  description:
    "Partner with CodeNeuraX for AI Spark 2026 — a two-day tech event at Marwadi University. Explore sponsorship tiers, brand visibility, and community reach.",
  openGraph: {
    title: "Sponsorship Proposal | AI Spark 2026 | CodeNeuraX",
    description:
      "Partner with CodeNeuraX for AI Spark 2026. Silver, Gold, and Platinum sponsorship tiers with extensive brand visibility.",
    images: [{ url: "/images/aispark-2026-hero.png", alt: "AI Spark 2026" }],
  },
  alternates: {
    canonical: 'https://www.codeneurax.in/sponsorship',
  },
}

export default function SponsorshipLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
