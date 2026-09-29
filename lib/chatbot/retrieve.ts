import type { SiteKnowledgeChunk } from "@/data/site-knowledge"

const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "must",
  "shall",
  "can",
  "need",
  "dare",
  "ought",
  "used",
  "to",
  "of",
  "in",
  "for",
  "on",
  "with",
  "at",
  "by",
  "from",
  "as",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "between",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "just",
  "and",
  "but",
  "if",
  "or",
  "because",
  "until",
  "while",
  "about",
  "against",
  "between",
  "into",
  "through",
  "i",
  "you",
  "he",
  "she",
  "it",
  "we",
  "they",
  "what",
  "which",
  "who",
  "whom",
  "this",
  "that",
  "these",
  "those",
  "am",
  "me",
  "my",
  "our",
  "your",
  "his",
  "her",
  "its",
  "their",
  "tell",
  "want",
  "know",
  "get",
  "give",
  "please",
  "hi",
  "hello",
  "hey",
  "thanks",
  "thank",
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s#+]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w))
}

function scoreChunk(queryTokens: string[], chunk: SiteKnowledgeChunk): number {
  const titleLower = chunk.title.toLowerCase()
  const bodyLower = chunk.body.toLowerCase()
  const tagStr = chunk.tags.join(" ").toLowerCase()
  let score = 0
  for (const t of queryTokens) {
    if (t.length < 2) continue
    if (titleLower.includes(t)) score += 5
    if (tagStr.includes(t)) score += 4
    if (bodyLower.includes(t)) score += 1.5
    chunk.tags.forEach((tag) => {
      if (tag.includes(t) || t.includes(tag)) score += 3
    })
  }
  if (queryTokens.length === 0 && chunk.id === "overview") score += 0.5
  return score
}

export function retrieveRelevantChunks(
  query: string,
  chunks: SiteKnowledgeChunk[],
  topK = 6,
): SiteKnowledgeChunk[] {
  const tokens = tokenize(query)
  const scored = chunks
    .map((c) => ({ c, s: scoreChunk(tokens, c) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)

  if (scored.length === 0) {
    return chunks.filter((c) => c.id === "overview" || c.id === "nav").slice(0, topK)
  }

  return scored.slice(0, topK).map(({ c }) => c)
}

export function chunksToContext(chunks: SiteKnowledgeChunk[], maxChars = 12000): string {
  let out = ""
  for (const c of chunks) {
    const block = `### ${c.title}\n${c.body}\n${c.path ? `Link: ${c.pathLabel ?? c.title}: ${c.path}\n` : ""}\n`
    if (out.length + block.length > maxChars) break
    out += block
  }
  return out.trim()
}
