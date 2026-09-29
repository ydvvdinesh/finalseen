"use client"

import { useState } from "react"
import Image from "next/image"
import { Linkedin, Instagram } from "lucide-react"
import type { SponsorshipPerson } from "@/data/sponsorship"

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

type PersonCardProps = {
  person: SponsorshipPerson
  photoSize?: "team" | "speaker"
  showHighlights?: boolean
}

export function PersonPhoto({
  person,
  size = "team",
}: {
  person: SponsorshipPerson
  size?: "team" | "speaker"
}) {
  const [imgError, setImgError] = useState(false)
  const sizeClass =
    size === "speaker"
      ? "w-32 h-32 sm:w-40 sm:h-40 rounded-2xl"
      : "w-24 h-24 sm:w-28 sm:h-28 rounded-2xl"

  if (person.image && !imgError) {
    return (
      <div className={`relative ${sizeClass} mx-auto shrink-0 overflow-hidden border border-white/10 bg-white/5`}>
        <Image
          src={person.image}
          alt={person.name}
          fill
          className="object-cover"
          sizes={size === "speaker" ? "160px" : "112px"}
          onError={() => setImgError(true)}
        />
      </div>
    )
  }

  return (
    <div
      className={`${sizeClass} mx-auto shrink-0 flex items-center justify-center bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-white/10 text-xl font-bold text-white`}
    >
      {initials(person.name)}
    </div>
  )
}

function SocialLinks({
  person,
  align = "center",
}: {
  person: SponsorshipPerson
  align?: "center" | "start"
}) {
  if (!person.linkedin && !person.instagram) return null

  return (
    <div
      className={`flex gap-2 mt-4 ${align === "start" ? "justify-center md:justify-start" : "justify-center"}`}
    >
      {person.linkedin && (
        <a
          href={person.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${person.name} on LinkedIn`}
          className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:text-blue-400 hover:border-blue-400/20 transition-all text-white/50"
        >
          <Linkedin className="w-4 h-4" />
        </a>
      )}
      {person.instagram && (
        <a
          href={person.instagram}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${person.name} on Instagram`}
          className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:text-pink-400 hover:border-pink-400/20 transition-all text-white/50"
        >
          <Instagram className="w-4 h-4" />
        </a>
      )}
    </div>
  )
}

export default function SponsorshipPersonCard({
  person,
  photoSize = "team",
  showHighlights = false,
}: PersonCardProps) {
  const isSpeaker = photoSize === "speaker"

  if (isSpeaker) {
    return (
      <div className="glass-card p-6 md:p-8 h-full">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <PersonPhoto person={person} size="speaker" />
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{person.name}</h3>
            {person.tagline && (
              <p className="text-amber-400/80 text-xs font-medium mb-3" style={{ fontFamily: "var(--font-mono)" }}>{person.tagline}</p>
            )}
            {person.highlights && (
              <ul className="space-y-1.5 text-left">
                {person.highlights.map((point) => (
                  <li key={point} className="flex gap-2 text-white/40 text-xs leading-relaxed">
                    <span className="text-amber-400/80 shrink-0">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            )}
            <SocialLinks person={person} align="start" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group glass-card p-6 h-full flex flex-col text-center">
      <PersonPhoto person={person} size="team" />
      <h3 className="text-base font-bold text-white mt-4 mb-1 group-hover:text-amber-300 transition-colors">
        {person.name}
      </h3>
      <p className="text-amber-400/80 font-medium text-xs mb-1" style={{ fontFamily: "var(--font-mono)" }}>{person.role}</p>
      {person.department && (
        <p className="text-white/30 text-xs mb-3">{person.department}</p>
      )}
      {showHighlights && person.highlights && (
        <p className="text-white/40 text-xs leading-relaxed mb-2 flex-1">{person.highlights[0]}</p>
      )}
      <SocialLinks person={person} />
    </div>
  )
}
