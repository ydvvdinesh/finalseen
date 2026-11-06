import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "NeuraSprint 2026 — 24-Hour Web Dev Challenge | CodeNeuraX",
  description:
    "NeuraSprint 2026: A 24-hour online web development challenge by CodeNeuraX. Build, solve, deploy and present. ₹7,500+ prize pool. Register now for just ₹99!",
  openGraph: {
    title: "NeuraSprint 2026 — 24-Hour Web Dev Challenge",
    description:
      "Build practical solutions with modern tools and AI-assisted coding. ₹7,500+ prize pool. Dec 28-29, 2026.",
    type: "website",
  },
}

export default function NeuraSprintLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
