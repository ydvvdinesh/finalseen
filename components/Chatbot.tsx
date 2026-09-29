"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { MessageCircle, X, Send, Bot, User, ExternalLink } from "lucide-react"

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  /** Onboarding chips (first message only) */
  quickActions?: QuickAction[]
  /** Open page / WhatsApp from API */
  links?: ChatLink[]
}

interface ChatLink {
  label: string
  href: string
}

interface QuickAction {
  label: string
  action: string
}

const PRESETS: Record<string, { userLabel: string; query: string }> = {
  about: {
    userLabel: "About CodeNeuraX",
    query:
      "What is CodeNeuraX, who founded it, what are WhatsApp groups, and what does the community offer students?",
  },
  join: {
    userLabel: "Join Community",
    query:
      "How do I join CodeNeuraX? List WhatsApp groups for community, coding challenges, discussions, events, learning, and careers with invite links from the site.",
  },
  events: {
    userLabel: "Upcoming Events",
    query: "Where can I see CodeNeuraX events and webinars? What is on the events page?",
  },
  resources: {
    userLabel: "Learning Resources",
    query: "Where are learning resources and the e-content library on the website?",
  },
}

type HistoryTurn = { role: "user" | "assistant"; content: string }

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [requestError, setRequestError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addBotMessage = (text: string, quickActions?: QuickAction[], links?: ChatLink[]) => {
    const message: Message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text,
      isBot: true,
      timestamp: new Date(),
      quickActions,
      links,
    }
    setMessages((prev) => [...prev, message])
  }

  const welcomeSentRef = useRef(false)

  useEffect(() => {
    if (!isOpen) {
      welcomeSentRef.current = false
      return
    }
    if (messages.length > 0 || welcomeSentRef.current) return
    const t = setTimeout(() => {
      welcomeSentRef.current = true
      addBotMessage(
        "Hi! 👋 I'm tuned to the CodeNeuraX website. Ask anything about the community, events, WhatsApp groups, AISPARK area, services, or contact — or pick a quick topic below.",
        [
          { label: "About CodeNeuraX", action: "about" },
          { label: "Join Community", action: "join" },
          { label: "Upcoming Events", action: "events" },
          { label: "Learning Resources", action: "resources" },
        ],
      )
    }, 400)
    return () => clearTimeout(t)
  }, [isOpen, messages.length])

  const addUserMessage = (text: string) => {
    const message: Message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text,
      isBot: false,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, message])
  }

  const buildHistory = useCallback((prior: Message[]): HistoryTurn[] => {
    return prior
      .filter((m) => m.text.trim())
      .map((m) => ({
        role: m.isBot ? ("assistant" as const) : ("user" as const),
        content: m.text,
      }))
  }, [])

  const sendToAssistant = async (apiMessage: string, priorMessages: Message[]) => {
    setIsTyping(true)
    setRequestError(null)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: apiMessage,
          history: buildHistory(priorMessages),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`)
      }
      const text = typeof data.text === "string" ? data.text : ""
      const links: ChatLink[] = Array.isArray(data.links) ? data.links : []
      addBotMessage(text || "I didn’t get a response. Please try again.", undefined, links)
    } catch (e) {
      console.error(e)
      setRequestError(e instanceof Error ? e.message : "Something went wrong")
      addBotMessage(
        "Sorry — I couldn’t reach the assistant. Check your connection and try again. You can still use the main menu on the website.",
      )
    } finally {
      setIsTyping(false)
    }
  }

  const handleSendMessage = () => {
    const raw = inputValue.trim()
    if (!raw || isTyping) return

    addUserMessage(raw)
    setInputValue("")
    const prior = messages
    sendToAssistant(raw, prior)
  }

  const handleQuickAction = (action: string) => {
    if (isTyping) return
    const preset = PRESETS[action]
    if (preset) {
      addUserMessage(preset.userLabel)
      const prior = [...messages]
      sendToAssistant(preset.query, prior)
      return
    }
    addUserMessage(action)
    sendToAssistant(action, messages)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className={`fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110 ${
          isOpen ? "hidden" : "flex"
        } items-center justify-center`}
        aria-label="Open chat assistant"
      >
        <MessageCircle size={24} />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">
          AI
        </span>
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[min(100vw-1.5rem,24rem)] h-[min(100dvh-5rem,500px)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="bg-white bg-opacity-20 p-2 rounded-full shrink-0">
                <Bot size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold truncate">CodeNeuraX Assistant</h3>
                <p className="text-xs opacity-90 truncate">Answers from site knowledge + optional AI</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors shrink-0"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {requestError && (
            <div className="px-3 py-2 text-xs text-amber-800 bg-amber-50 border-b border-amber-100">
              Last error: {requestError}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[85%] ${message.isBot ? "order-2" : "order-1"}`}>
                  <div
                    className={`p-3 rounded-2xl ${
                      message.isBot
                        ? "bg-gray-100 text-gray-800"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>

                  {message.quickActions && message.quickActions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.quickActions.map((action, index) => (
                        <button
                          type="button"
                          key={`${action.action}-${index}`}
                          onClick={() => handleQuickAction(action.action)}
                          disabled={isTyping}
                          className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors border border-blue-200 disabled:opacity-50"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {message.links && message.links.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1.5">
                      {message.links.map((link) => (
                        <a
                          key={`${link.href}-${link.label}`}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs inline-flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isBot ? "order-1 mr-2 bg-gradient-to-r from-blue-600 to-purple-600" : "order-2 ml-2 bg-gray-300"
                  }`}
                >
                  {message.isBot ? <Bot size={16} className="text-white" /> : <User size={16} className="text-gray-600" />}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-2 bg-gradient-to-r from-blue-600 to-purple-600">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="bg-gray-100 p-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 shrink-0">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about the site…"
                disabled={isTyping}
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60"
              />
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-full hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Chatbot
