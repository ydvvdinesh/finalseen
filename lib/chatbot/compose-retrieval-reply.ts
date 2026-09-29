import type { SiteKnowledgeChunk } from "@/data/site-knowledge"

export type ChatLink = { label: string; href: string }

export function composeRetrievalReply(chunks: SiteKnowledgeChunk[]): {
  text: string
  links: ChatLink[]
} {
  if (chunks.length === 0) {
    return {
      text: "I couldn’t match that to a specific page. Try: joining WhatsApp, events, study login, services, e-content, or campus ambassadors — or open the menu on the site.",
      links: [
        { label: "Home", href: "/" },
        { label: "Events", href: "/events" },
      ],
    }
  }

  const lines = chunks.slice(0, 5).map((c) => {
    const excerpt =
      c.body.length > 420 ? `${c.body.slice(0, 417).trim()}…` : c.body
    return `• ${c.title}: ${excerpt}`
  })

  const linkMap = new Map<string, string>()
  for (const c of chunks) {
    if (!c.path) continue
    const label = c.pathLabel ?? c.title
    if (!linkMap.has(c.path)) linkMap.set(c.path, label)
  }

  const links: ChatLink[] = [...linkMap.entries()].slice(0, 6).map(([href, label]) => ({
    label,
    href,
  }))

  return {
    text: `From the CodeNeuraX website:\n\n${lines.join("\n\n")}`,
    links,
  }
}
