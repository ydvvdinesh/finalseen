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
    {
      title: "Google DSA Ques",
      description: "150+ previous Google DSA interview questions.",
      link: "/downloads/Google DSA.pdf",
    },
    {
      title: "Microsoft DSA Ques",
      description: "150+ previous Microsoft DSA interview questions.",
      link: "/downloads/Microsoft DSA.pdf",
    },
    {
      title: "GATE - CS Previous Year Ques",
      description: "All GATE CSE previous year papers.",
      link: "/downloads/Computer Science and Information Technology (CS).zip",
    },
    {
      title: "GATE - DA Previous Year Ques",
      description: "All GATE DA previous year papers.",
      link: "/downloads/Data Science and Artificial Intelligence (DA).zip",
    },
    {
      title: "Linkedin DSA Ques",
      description: "150+ previous Linkedin DSA interview questions.",
      link: "/downloads/Linkedin DSA.pdf",
    },
    {
      title: "Adobe DSA Ques",
      description: "150+ previous Adobe DSA interview questions.",
      link: "/downloads/Adobe DSA.pdf",
    },
    {
      title: "Amazon DSA Ques",
      description: "150+ previous Amazon DSA interview questions.",
      link: "/downloads/Amazon DSA.pdf",
    },
    {
      title: "Capgemini DSA Ques",
      description: "150+ previous Capgemini DSA interview questions.",
      link: "/downloads/capgemini question.pdf",
    },
    {
      title: "Deloitte DSA Ques",
      description: "150+ previous Deloitte DSA interview questions.",
      link: "/downloads/deloitte question.pdf",
    },
    {
      title: "TCS DSA Ques",
      description: "150+ previous TCS DSA interview questions.",
      link: "/downloads/tcs question.pdf",
    },
  ],
  Notes: [
    {
      title: "Python Notes",
      description: "Python Handwritten Notes for beginners and advanced learners.",
      link: "https://vyyrpodenrxjgjgmlxeu.supabase.co/storage/v1/object/sign/Notes/python%20programming-notes.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMDUxZTBjYS05MDlmLTQxMWItYjc1NC0wODM3NjdlY2YyNjYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJOb3Rlcy9weXRob24gcHJvZ3JhbW1pbmctbm90ZXMucGRmIiwiaWF0IjoxNzU4Mzk2NTU2LCJleHAiOjIwNzM3NTY1NTZ9.6iFn4Jn7CkoWgV1vY5i5SSqrNv8olpmipcAM3r8fAVM",
    },
       {
      title: "C Notes",
      description: "C Handwritten Notes for beginners and advanced learners.",
      link: "https://vyyrpodenrxjgjgmlxeu.supabase.co/storage/v1/object/sign/Notes/C-Notes.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMDUxZTBjYS05MDlmLTQxMWItYjc1NC0wODM3NjdlY2YyNjYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJOb3Rlcy9DLU5vdGVzLnBkZiIsImlhdCI6MTc1ODM5NjU5MCwiZXhwIjoyMDczNzU2NTkwfQ.1S-kWVF_aRnIpP4RqORy_l83SrO1bAghC8yvjzdP0bU",
    },
        {
      title: "C++ Notes",
      description: "C++ Handwritten Notes for beginners and advanced learners",
      link: "https://vyyrpodenrxjgjgmlxeu.supabase.co/storage/v1/object/sign/Notes/C++-Notes.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMDUxZTBjYS05MDlmLTQxMWItYjc1NC0wODM3NjdlY2YyNjYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJOb3Rlcy9DKystTm90ZXMucGRmIiwiaWF0IjoxNzU4Mzk2Njg0LCJleHAiOjIwNzM3NTY2ODR9.l1RvMsueT3OMb6ybsMx1tjK3Op8bwYYbXmhyp3WzJAQ",

    },
        {
      title: "DSA Notes",
      description: "DSA Handwritten Notes for beginners and advanced learners",
      link: "/downloads/DSA-Notes.pdf",
    },
    {
      title: "SQL Notes",
      description: "SQL Handwritten Notes for beginners and advanced learners",
      link: "https://vyyrpodenrxjgjgmlxeu.supabase.co/storage/v1/object/sign/Notes/SQL-Notes.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMDUxZTBjYS05MDlmLTQxMWItYjc1NC0wODM3NjdlY2YyNjYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJOb3Rlcy9TUUwtTm90ZXMucGRmIiwiaWF0IjoxNzU4Mzk2ODU0LCJleHAiOjIwNzM3NTY4NTR9.M13tD1ebPiNn7TRD0lR6JBp6cedNJvNpv0ohRF_CCsU",
    },
    {
      title: "OoPs Concept Notes",
      description: "OoPs Handwritten Notes for beginners and advanced learners",
      link: "https://vyyrpodenrxjgjgmlxeu.supabase.co/storage/v1/object/sign/Notes/OOPs%20-Notes.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wMDUxZTBjYS05MDlmLTQxMWItYjc1NC0wODM3NjdlY2YyNjYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJOb3Rlcy9PT1BzIC1Ob3Rlcy5wZGYiLCJpYXQiOjE3NTgzOTY4ODksImV4cCI6MjA3Mzc1Njg4OX0.ZZbYA3CHKouK9iB2LGZ1TbnlJcUxvCTgE5sUNUP78JQ",
    },
  ],
  "Problem Statement / Practice Question": [
    {
      title: "Bharatiya Antariksh 2025",
      description: "Organized by government of India.",
      link: "/downloads/antariksha problem.pdf",
    },
    {
      title: "Intellify Hackathon 2025",
      description: "Organized by - Marwadi University.",
      link: "/downloads/intellify_hackathon.pdf",
    },
    {
      title: "Code Coalescence-2025",
      description: "Organized by MITS-DU, Gwalior.",
      link: "/downloads/Code Coalescence-2025.pdf",
    },
    {
      title: "CNX Selected 2025",
      description: "Selected by CodeNeuraX.",
      link: "/downloads/cnx-problem statement.pdf",
    },
    {
      title: "Online Hackathon 2025",
      description: "Organized by Cloud Technologies.",
      link: "/downloads/cloud problem.pdf",
    },
    {
      title: "Oddo Hackathon 2025",
      description: "Organized by Oddo.",
      link: "/downloads/oddo problem.pdf",
    },
    {
      title: "Traffic Hackathon 2024",
      description: "Organized by - IIT Jammu.",
      link: "/downloads/Traffic hackathon Problem Statements.pdf",
    },
    {
      title: "Smart India Hackathon 2024",
      description: "Organized by government of India.",
      link: "/downloads/SIH_PS_2024.xlsx",
    },
    {
      title: "Hackfest Hackathon - 2024",
      description: "Organized by CMR COLLEGE OF ENGINEERING.",
      link: "/downloads/CMR HACKFEST HACKATHON.pdf",
    },
       {
      title: "Python Practice Questions",
      description: "Python questions for beginners and advanced learners.",
      link: "/downloads/python-notes.pdf",
    },
       {
      title: "C Practice Questions",
      description: "C questions for beginners and advanced learners.",
      link: "/downloads/c question.pdf",
    },
        {
      title: "C++ Practice Questions",
      description: "C++ questions for beginners and advanced learners.",
      link: "/downloads/c++ questions.pdf",

    },
        {
      title: "Java Practice Questions",
      description: "Java questions for beginners and advanced learners.",
      link: "/downloads/java question.pdf",
    },
  ],
};

export default function EContentPage() {
  const [authModal, setAuthModal] = useState<{ type: "login" | "signup" } | null>(null)
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("Previous Year Question");

  const handleAuth = (type: "login" | "signup") => {
    setAuthModal({ type })
  }

  const closeAuthModal = () => {
    setAuthModal(null)
  }

  // Filtered sections based on search and active category
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
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Header onAuth={handleAuth} />
      {authModal && (
        <AuthModal type={authModal.type} onClose={closeAuthModal} />
      )}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Animated background */}
        <div className="pointer-events-none absolute inset-0 z-0">
          {/* Black background with a small purple glow in the top-right corner */}
          <div className="absolute inset-0 bg-black" />
          <div
            className="fixed top-0 right-0 w-[140px] h-[140px] md:w-[220px] md:h-[220px] bg-gradient-to-br from-pink-700 via-pink-500/80 to-transparent opacity-40 blur-[90px] rounded-full z-50 pointer-events-none translate-x-1/3 -translate-y-1/3 md:translate-x-1/2 md:-translate-y-1/2"
            style={{ animation: 'purpleBlink 3s ease-in-out infinite' }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          {/* Download Premium Study Materials pill */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-purple-800/50 border border-purple-700/50 rounded-full px-4 py-2 backdrop-blur-sm">
              <BookOpen className="w-4 h-4 text-purple-400 animate-pulse" />
              <span className="text-purple-300 text-xs font-medium tracking-wide">
                Download Premium Study Materials
              </span>
            </div>
          </div>
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto mb-6"
          >
            <h1 className="text-5xl md:text-6xl font-black mb-3 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
              CodeNeuraX Library
            </h1>
            <p className="text-base md:text-lg text-gray-300 mb-5 leading-relaxed">
              Access notes, previous year papers, and resources for your success.
            </p>
          </motion.div>
          {/* Search bar */}
          <div className="flex justify-center mb-6">
            <div className="relative w-full max-w-2xl">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
                </svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by title or description..."
                className="w-full pl-10 pr-3 py-2 rounded-xl bg-gray-900/80 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm shadow"
              />
            </div>
          </div>
          {/* Category filter pills */}
          <div className="flex justify-center gap-2 mb-10">
            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow"
                    : "bg-black text-white border border-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 hover:text-white hover:shadow-lg hover:scale-105"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Cards for filtered sections */}
          <div className="mb-16" id={activeCategory.replace(/ /g, '-').toLowerCase()}>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSections.length === 0 ? (
                <div className="text-gray-400 col-span-full text-center">No content available yet.</div>
              ) : (
                filteredSections.map((section: Section, idx: number) => (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative"
                  >
                    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 hover:border-purple-500/30 transition-all duration-500 hover:scale-105 relative overflow-hidden">
                      <div className="relative z-10 flex flex-col items-center">
                        <FileText className="w-10 h-10 text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                          {section.title}
                        </h3>
                        <p className="text-gray-300 mb-4 text-center">
                          {section.description}
                        </p>
                        <a
                          href={section.link}
                          download
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/30"
                        >
                          <Download className="w-5 h-5" />
                          Download
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-gray-800/50 py-12 relative mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-lg">Team CodeNeuraX 💙</p>
        </div>
      </footer>
    </div>
  )
}
/*
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Clock, Upload } from "lucide-react"
import Header from "@/components/header"
import AuthModal from "@/components/auth-modal"

export default function EContentPage() {
	const [authModal, setAuthModal] = useState<{ type: "login" | "signup" } | null>(null)

	const handleAuth = (type: "login" | "signup") => {
		setAuthModal({ type })
	}

	const closeAuthModal = () => {
		setAuthModal(null)
	}

	return (
		<div className="min-h-screen bg-black relative overflow-hidden">
			<Header onAuth={handleAuth} />
			
			{ /*AuthModal }
			{authModal && (
				<AuthModal type={authModal.type} onClose={closeAuthModal} />
			)}

			<section className="relative pt-32 pb-20">
				<div className="container mx-auto px-4 relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="text-center max-w-4xl mx-auto"
					>
						<div className="inline-flex items-center gap-2 bg-purple-800/50 border border-purple-700/50 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
							<Clock className="w-5 h-5 text-purple-400 animate-pulse" />
							<span className="text-purple-300 text-sm font-medium tracking-wide">
								Under Development
							</span>
						</div>
						<h1 className="text-6xl md:text-7xl font-black mb-8 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
							E-Content Library
						</h1>
						<p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
							We're working hard to bring you premium study materials. Stay tuned!
						</p>
						
						<motion.div
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="flex justify-center"
						>
							<button className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30 text-lg">
								<Upload className="w-6 h-6" />
								Coming Soon
							</button>
						</motion.div>
					</motion.div>
				</div>
			</section>
			<footer className="border-t border-gray-800/50 py-12 relative mt-16">
				<div className="container mx-auto px-4 text-center">
					<p className="text-gray-400 text-lg">Team CodeNeuraX</p>
				</div>
			</footer>
		</div>
	)
}*/