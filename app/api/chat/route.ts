import { NextResponse } from "next/server"
import { SITE_KNOWLEDGE_CHUNKS } from "@/data/site-knowledge"
import { retrieveRelevantChunks, chunksToContext } from "@/lib/chatbot/retrieve"
import { composeRetrievalReply } from "@/lib/chatbot/compose-retrieval-reply"
import { checkRateLimit } from "@/lib/rate-limiter"

export const dynamic = "force-dynamic"

type HistoryTurn = { role: "user" | "assistant"; content: string }

async function completeWithOpenAICompatible(
  endpoint: string,
  apiKey: string,
  model: string,
  userMessage: string,
  history: HistoryTurn[],
  context: string,
): Promise<string | null> {
  const system = `You are the official CodeNeuraX website assistant. Answer using ONLY the CONTEXT below (from the site's knowledge base). If something is not clearly covered, say you're not sure and suggest the closest page or WhatsApp link from CONTEXT. Be concise and friendly; use short bullet lists when helpful. Never invent emails, URLs, or WhatsApp links that are not in CONTEXT.

CONTEXT:
${context}`

  const messages: { role: string; content: string }[] = [
    { role: "system", content: system },
    ...history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ]

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.35,
        max_tokens: 800,
      }),
    })
    if (!res.ok) {
      console.error("Chat LLM HTTP error", res.status, await res.text())
      return null
    }
    const json = await res.json()
    const text = json.choices?.[0]?.message?.content
    return typeof text === "string" ? text.trim() : null
  } catch (e) {
    console.error("Chat LLM fetch failed", e)
    return null
  }
}

export async function POST(req: Request) {
  // Rate limiting: 20 requests per minute per IP
  const rateLimit = checkRateLimit(req, {
    windowMs: 60 * 1000,
    maxRequests: 20,
    message: "Too many chat messages. Please wait a moment before sending another.",
  })
  if (!rateLimit.allowed && rateLimit.response) {
    return rateLimit.response
  }

  try {
    const body = await req.json()
    const message = typeof body.message === "string" ? body.message.trim() : ""
    const history: HistoryTurn[] = Array.isArray(body.history) ? body.history : []

    if (!message || message.length > 4000) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 })
    }

    const chunks = retrieveRelevantChunks(message, SITE_KNOWLEDGE_CHUNKS, 10)
    const context = chunksToContext(chunks, 14_000)

    const groqKey = process.env.GROQ_API_KEY
    const openaiKey = process.env.OPENAI_API_KEY

    let text: string | null = null

    if (groqKey) {
      text = await completeWithOpenAICompatible(
        "https://api.groq.com/openai/v1/chat/completions",
        groqKey,
        process.env.GROQ_CHAT_MODEL || "llama-3.3-70b-versatile",
        message,
        history,
        context,
      )
    }

    if (!text && openaiKey) {
      text = await completeWithOpenAICompatible(
        "https://api.openai.com/v1/chat/completions",
        openaiKey,
        process.env.OPENAI_CHAT_MODEL || "gpt-4o-mini",
        message,
        history,
        context,
      )
    }

    const { links } = composeRetrievalReply(chunks)

    if (text) {
      return NextResponse.json({ text, links, source: "llm" as const })
    }

    const fallback = composeRetrievalReply(chunks)
    return NextResponse.json({ ...fallback, source: "retrieval" as const })
  } catch (e) {
    console.error("POST /api/chat", e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
