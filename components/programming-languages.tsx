"use client"

import { motion, Variants } from "framer-motion"

export default function ProgrammingLanguages() {
  const languages = [
    {
      name: "Python",
      symbol: "🐍",
      color: "from-yellow-400 to-blue-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      name: "JavaScript",
      symbol: "JS",
      color: "from-yellow-300 to-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      name: "C++",
      symbol: "C++",
      color: "from-blue-400 to-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      name: "Java",
      symbol: "☕",
      color: "from-orange-400 to-red-500",
      bgColor: "bg-orange-500/10",
    },
    {
      name: "Go",
      symbol: "Go",
      color: "from-cyan-400 to-blue-500",
      bgColor: "bg-cyan-500/10",
    },
    {
      name: "C",
      symbol: "C",
      color: "from-gray-400 to-gray-600",
      bgColor: "bg-gray-500/10",
    },
  ]

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  }

  const floatingAnimation = {
    y: [-10, 10, -10],
    rotate: [-5, 5, -5],
    transition: {
      duration: 4,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  }

  return (
    <div className="relative py-8 sm:py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8"
      >
        {languages.map((lang, index) => (
          <motion.div
            key={lang.name}
            variants={itemVariants}
            animate={floatingAnimation}
            style={{ animationDelay: `${index * 0.5}s` }}
            whileHover={{
              scale: 1.2,
              rotate: 360,
              transition: { duration: 0.5 },
            }}
            className={`group relative ${lang.bgColor} backdrop-blur-sm border border-gray-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 cursor-pointer hover:border-cyan-400/50 transition-all duration-500`}
          >
            {/* Glow effect - always visible now */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${lang.color} opacity-40 rounded-xl sm:rounded-2xl blur-xl transition-opacity duration-500`}
            />

            <div className="relative z-10 text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2 font-bold">{lang.symbol}</div>
              <div
                className={`text-xs sm:text-sm font-bold bg-gradient-to-r ${lang.color} bg-clip-text text-transparent group-hover:text-white transition-all duration-300`}
              >
                {lang.name}
              </div>
            </div>

            {/* Animated border */}
            <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div
                className={`absolute inset-0 bg-gradient-to-r ${lang.color} rounded-xl sm:rounded-2xl blur-sm animate-pulse`}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  )
}
