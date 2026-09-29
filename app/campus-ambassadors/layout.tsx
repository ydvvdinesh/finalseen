import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Campus Ambassadors | CodeNeuraX",
  description:
    "Meet our incredible Campus Ambassadors representing CodeNeuraX across universities. Join the program and become a leader on your campus.",
  openGraph: {
    title: "Campus Ambassadors | CodeNeuraX",
    description:
      "Meet our incredible Campus Ambassadors representing CodeNeuraX across universities.",
  },
}

export default function CampusAmbassadorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
