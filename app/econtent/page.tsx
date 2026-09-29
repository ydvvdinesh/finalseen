"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, FileText, Download } from "lucide-react"
import Header from "@/components/header"
import AuthModal from "@/components/auth-modal"

type Section = {
  title: string;
  description: string;
  link: string;
};

type Category = "Previous Year Question" | "Notes" | "Problem Statement / Practice Question";

const categorizedSections: Record<Category, Section[]> = {
  "Previous Year Question": [
    { title: "Google DSA Ques", description: "150+ previous Google DSA interview questions.", link: "/downloads/Google DSA.pdf" },
    { title: "Microsoft DSA Ques", description: "150+ previous Microsoft DSA interview questions.", link: "/downloads/Microsoft DSA.pdf" },
    { title: "GATE - CS Previous Year Ques", description: "All GATE CSE previous year papers.", link: "/downloads/Computer Science and Information Technology (CS).zip" },
    { title: "GATE - DA Previous Year Ques", description: "All GATE DA previous year papers.", link: "/downloads/Data Science and Artificial Intelligence (DA).zip" },
    { title: "Linkedin DSA Ques", description: "150+ previous Linkedin DSA interview questions.", link: "/downloads/Linkedin DSA.pdf" },
    { title: "Adobe DSA Ques", description: "150+ previous Adobe DSA interview questions.", link: "/downloads/Adobe DSA.pdf" },
    { title: "Amazon DSA Ques", description: "150+ previous Amazon DSA interview questions.", link: "/downloads/Amazon DSA.pdf" },
    { title: "Capgemini DSA Ques", description: "150+ previous Capgemini DSA interview questions.", link: "/downloads/capgemini question.pdf" },
    { title: "Deloitte DSA Ques", description: "150+ previous Deloitte DSA interview questions.", link: "/downloads/deloitte question.pdf" },
    { title: "TCS DSA Ques", description: "150+ previous TCS DSA interview questions.", link: "/downloads/tcs question.pdf" },
  ],
  Notes: [
    { title: "Python Notes", description: "Python Handwritten Notes for beginners and advanced learners.", link: "https://vyyrpodenrxjgjgmlxeu.supabase.co/storage/v1/object/sign/Notes/python%20programming-notes.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMDUxZTBjYS05MDlmLTQxMWItYjc1NC0wODM3NjdlY2YyNjYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJOb3Rlcy9weXRob24gcHJvZ3JhbW1pbmctbm90ZXMucGRmIiwiaWF0IjoxNzU4Mzk2NTU2LCJleHAiOjIwNzM3NTY1NTZ9.6iFn4Jn7CkoWgV1vY5i5SSqrNv8olpmipcAM3r8fAVM" },
    { title: "C Notes", description: "C Handwritten Notes for beginners and advanced learners.", link: "https://vyyrpodenrxjgjgmlxeu.supabase.co/storage/v1/object/sign/Notes/C-Notes.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMDUxZTBjYS05MDlmLTQxMWItYjc1NC0wODM3NjdlY2YyNjYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJOb3Rlcy9DLU5vdGVzLnBkZiIsImlhdCI6MTc1ODM5NjU5MCwiZXhwIjoyMDczNzU2NTkwfQ.1S-kWVF_aRnIpP4RqORy_l83SrO1bAghC8yvjzdP0bU" },
    { title: "C++ Notes", description: "C++ Handwritten Notes for beginners and advanced learners", link: "https://vyyrpodenrxjgjgmlxeu.supabase.co/storage/v1/object/sign/Notes/C++-Notes.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMDUxZTBjYS05MDlmLTQxMWItYjc1NC0wODM3NjdlY2YyNjYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJOb3Rlcy9DKystTm90ZXMucGRmIiwiaWF0IjoxNzU4Mzk2Njg0LCJleHAiOjIwNzM3NTY2ODR9.l1RvMsueT3OMb6ybsMx1tjK3Op8bwYYbXmhyp3WzJAQ" },
    { title: "DSA Notes", description: "DSA Handwritten Notes for beginners and advanced learners", link: "https://vyyrpodenrxjgjgmlxeu.supabase.co/storage/v1/object/sign/Notes/DSA-Notes-min.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMDUxZTBjYS05MDlmLTQxMWItYjc1NC0wODM3NjdlY2YyNjYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJOb3Rlcy9EU0EtTm90ZXMtbWluLnBkZiIsImlhdCI6MTc1ODM5NzQwNywiZXhwIjozMTU1MzU4Mzk3NDA3fQ.lDtEz_liqRBzu6Chy_yAnepyGDT4fYcgzzk6rXDV6Sw" },
    { title: "SQL/DBMS Notes", description: "SQL/DBMS Handwritten Notes for beginners and advanced learners", link: "https://vyyrpodenrxjgjgmlxeu.supabase.co/storage/v1/object/sign/Notes/SQL-Notes.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMDUxZTBjYS05MDlmLTQxMWItYjc1NC0wODM3NjdlY2YyNjYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJOb3Rlcy9TUUwtTm90ZXMucGRmIiwiaWF0IjoxNzU4Mzk2ODU0LCJleHAiOjIwNzM3NTY4NTR9.M13tD1ebPiNn7TRD0lR6JBp6cedNJvNpv0ohRF_CCsU" },
    { title: "OoPs Concept Notes", description: "OoPs Handwritten Notes for beginners and advanced learners", link: "https://vyyrpodenrxjgjgmlxeu.supabase.co/storage/v1/object/sign/Notes/OOPs%20-Notes.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMDUxZTBjYS05MDlmLTQxMWItYjc1NC0wODM3NjdlY2YyNjYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJOb3Rlcy9PT1BzIC1Ob3Rlcy5wZGYiLCJpYXQiOjE3NTgzOTY4ODksImV4cCI6MjA3Mzc1Njg4OX0.ZZbYA3CHKouK9iB2LGZ1TbnlJcUxvCTgE5sUNUP78JQ" },
    { title: "Javascript Concept Notes", description: "Javascript Handwritten Notes for beginners and advanced learners", link: "https://vyyrpodenrxjgjgmlxeu.supabase.co/storage/v1/object/sign/Notes/JavaScript%20Handwritten%20Notes.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMDUxZTBjYS05MDlmLTQxMWItYjc1NC0wODM3NjdlY2YyNjYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJOb3Rlcy9KYXZhU2NyaXB0IEhhbmR3cml0dGVuIE5vdGVzLnBkZiIsImlhdCI6MTc1OTcxMDUwMiwiZXhwIjoyMDc1MDcwNTAyfQ.D8j8dp6CUQZs8lmJKjwJ4rGpphYgY9lyKg8AOdzpQ4o" },
  ],
  "Problem Statement / Practice Question": [
    { title: "Bharatiya Antariksh 2025", description: "Organized by government of India.", link: "/downloads/antariksha problem.pdf" },
    { title: "Intellify Hackathon 2025", description: "Organized by - Marwadi University.", link: "/downloads/intellify_hackathon.pdf" },
    { title: "Code Coalescence-2025", description: "Organized by MITS-DU, Gwalior.", link: "/downloads/Code Coalescence-2025.pdf" },
    { title: "CNX Selected 2025", description: "Selected by CodeNeuraX.", link: "/downloads/cnx-problem statement.pdf" },
    { title: "Online Hackathon 2025", description: "Organized by Cloud Technologies.", link: "/downloads/cloud problem.pdf" },
    { title: "Oddo Hackathon 2025", description: "Organized by Oddo.", link: "/downloads/oddo problem.pdf" },
    { title: "Traffic Hackathon 2024", description: "Organized by - IIT Jammu.", link: "/downloads/Traffic hackathon Problem Statements.pdf" },
    { title: "Smart India Hackathon 2024", description: "Organized by government of India.", link: "/downloads/SIH_PS_2024.xlsx" },
    { title: "Hackfest Hackathon - 2024", description: "Organized by CMR COLLEGE OF ENGINEERING.", link: "/downloads/CMR HACKFEST HACKATHON.pdf" },
    { title: "Python Practice Questions", description: "Python questions for beginners and advanced learners.", link: "/downloads/python-notes.pdf" },
    { title: "C Practice Questions", description: "C questions for beginners and advanced learners.", link: "/downloads/c question.pdf" },
    { title: "C++ Practice Questions", description: "C++ questions for beginners and advanced learners.", link: "/downloads/c++ questions.pdf" },
    { title: "Java Practice Questions", description: "Java questions for beginners and advanced learners.", link: "/downloads/java question.pdf" },
  ],
};

export default function EContentPage() {
  const [authModal, setAuthModal] = useState<{ type: "login" | "signup" } | null>(null)
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("Previous Year Question");

  const HELLO_URL = process.env.NEXT_PUBLIC_HELLO_URL || "https://forms.gle/qPwKoUDGnvjfKzQB8";

  const handleAuth = (type: "login" | "signup") => {
    setAuthModal({ type })
  }

  const closeAuthModal = () => {
    setAuthModal(null)
  }

  const filteredSections = categorizedSections[activeCategory].filter(
    (section: Section) =>
      section.title.toLowerCase().includes(search.toLowerCase()) ||
      section.description.toLowerCase().includes(search.toLowerCase())
  );

  const categoryList: Category[] = [
    "Previous Year Question",
    "Notes",
    "Problem Statement / Practice Question",
  ];

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      <Header onAuth={handleAuth} />
      {authModal && (
        <AuthModal type={authModal.type} onClose={closeAuthModal} />
      )}

      <section className="relative pt-36 pb-20 overflow-hidden">
        {/* Ambient glows */}
        <div className="ambient-glow w-[500px] h-[500px] -top-40 right-0" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)' }} />
        <div className="ambient-glow w-[400px] h-[400px] top-60 -left-20" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.06), transparent 70%)' }} />

        <div className="container mx-auto px-4 relative z-10">
          {/* Mono badge */}
          <div className="flex justify-center mb-8">
            <div className="mono-badge">
              <span className="dot" />
              Download Premium Study Materials
            </div>
          </div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto mb-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: "var(--font-serif)" }}>
              <span className="text-white">CodeNeuraX </span>
              <span className="gradient-text-purple">Library</span>
            </h1>
            <p className="text-base md:text-lg text-white/40 mb-6 leading-relaxed">
              Access notes, previous year papers, and resources for your success.
            </p>

            {/* LeetCode button */}
            <div className="flex justify-center mt-4">
              <a
                href={HELLO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-premium text-sm"
              >
                <BookOpen className="w-4 h-4" />
                Click here to get all Company LeetCode Question With Leetcode Link
              </a>
            </div>
          </motion.div>

          {/* Search bar */}
          <div className="flex justify-center mb-6">
            <div className="relative w-full max-w-2xl">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                </svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by title or description..."
                className="input-mac pl-10 w-full"
              />
            </div>
          </div>

          {/* Category filter pills */}
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-medium transition-all duration-300 focus:outline-none ${
                  activeCategory === cat
                    ? "bg-white/10 text-white border border-white/20"
                    : "bg-transparent text-white/40 border border-white/[0.06] hover:text-white/70 hover:border-white/15"
                }`}
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="mb-16" id={activeCategory.replace(/ /g, '-').toLowerCase()}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSections.length === 0 ? (
                <div className="text-white/30 col-span-full text-center text-sm" style={{ fontFamily: "var(--font-mono)" }}>
                  No content available yet.
                </div>
              ) : (
                filteredSections.map((section: Section, idx: number) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <div className="glass-card p-7 h-full flex flex-col items-center text-center">
                      <FileText className="w-7 h-7 text-white/20 mb-4 group-hover:text-white/50 transition-colors duration-300" />
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {section.title}
                      </h3>
                      <p className="text-white/35 text-sm mb-5 leading-relaxed">
                        {section.description}
                      </p>
                      <a
                        href={section.link}
                        download
                        className="btn-premium text-xs py-2 px-5 mt-auto"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.04] py-10 relative">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/20 text-xs tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
            Team CodeNeuraX 💙
          </p>
        </div>
      </footer>
    </div>
  )
}