/*"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, FileText, Download } from "lucide-react"
import Header from "@/components/header"
import AuthModal from "@/components/auth-modal"

const categorizedSections = {
  "Previous Year Question": [
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
      title: "Microsoft DSA Ques",
      description: "150+ previous Microsoft DSA interview questions.",
      link: "/downloads/Microsoft DSA.pdf",
    },
    {
      title: "Google DSA Ques",
      description: "150+ previous Google DSA interview questions.",
      link: "/downloads/Google DSA.pdf",
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
  ],
  Notes: [
    {
      title: "Python Notes",
      description: "Python notes for beginners and advanced learners.",
      link: "/downloads/python-notes.pdf",
    },
	{
		title: "Python Notes",
		description: "Python notes for beginners and advanced learners.",
		link: "/downloads/python-notes.pdf",
	  },
	  {
		title: "Python Notes",
		description: "Python notes for beginners and advanced learners.",
		link: "/downloads/python-notes.pdf",
	  },
	  {
		title: "Python Notes",
		description: "Python notes for beginners and advanced learners.",
		link: "/downloads/python-notes.pdf",
	  },
	  {
		title: "Python Notes",
		description: "Python notes for beginners and advanced learners.",
		link: "/downloads/python-notes.pdf",
	  },
	  {
		title: "Python Notes",
		description: "Python notes for beginners and advanced learners.",
		link: "/downloads/python-notes.pdf",
	  },
	  {
		title: "Python Notes",
		description: "Python notes for beginners and advanced learners.",
		link: "/downloads/python-notes.pdf",
	  },
  ],
  "Problem Statement / Practice Question": [
    // Add items here if needed
  ],
}

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
      {authModal && (
        <AuthModal type={authModal.type} onClose={closeAuthModal} />
      )}
      <section className="relative pt-32 pb-20">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-purple-800/50 border border-purple-700/50 rounded-full px-6 py-3 mb-8 backdrop-blur-sm">
              <BookOpen className="w-5 h-5 text-purple-400 animate-pulse" />
              <span className="text-purple-300 text-sm font-medium tracking-wide">
                Download Premium Study Materials
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black mb-8 bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
              E-Content Library
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-6 leading-relaxed">
              Access notes, previous year papers, and resources for your success.
            </p>
          </motion.div>

          {/* Navigation buttons above the first section }
          <div className="flex justify-center gap-2 mb-8">
            <a href="#previous-year-question" className="px-3 py-1 rounded-full text-xs font-semibold bg-black text-white shadow hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-200">Previous Year Question</a>
            <a href="#notes" className="px-3 py-1 rounded-full text-xs font-semibold bg-black text-white shadow hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-200">Notes</a>
            <a href="#problem-statement" className="px-3 py-1 rounded-full text-xs font-semibold bg-black text-white shadow hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-200">Problem Statement / Practice Question</a>
          </div>

          {Object.entries(categorizedSections).map(([category, sections]) => {
            // Map category to anchor id
            let anchorId = '';
            if (category === 'Previous Year Question') anchorId = 'previous-year-question';
            else if (category === 'Notes') anchorId = 'notes';
            else anchorId = 'problem-statement';
            return (
              <div key={category} className="mb-16" id={anchorId}>
                <h2 className="text-3xl font-bold text-white mb-8">{category}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sections.length === 0 ? (
                    <div className="text-gray-400 col-span-full text-center">No content available yet.</div>
                  ) : (
                    sections.map((section, idx) => (
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
                              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white font-bold px-6 py-3 rounded-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/30"
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
            );
          })}
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
			
			{ /*AuthModal */}
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
}