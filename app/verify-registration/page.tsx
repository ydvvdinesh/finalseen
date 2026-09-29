"use client"

import { motion } from "framer-motion"
import { ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function VerifyRegistrationPage() {
  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Ambient glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="ambient-glow w-64 md:w-96 h-64 md:h-96 top-1/4 left-1/4" style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.1), transparent 70%)' }} />
        <div className="ambient-glow w-64 md:w-96 h-64 md:h-96 bottom-1/4 right-1/4" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08), transparent 70%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 sm:p-12 text-center border-green-500/10"
        >
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-24 h-24 sm:w-28 sm:h-28 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 border border-green-400/20"
            >
              <ShieldCheck className="w-12 h-12 sm:w-14 sm:h-14 text-green-400/80" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Registration <br className="hidden sm:block" />
              <span className="text-green-400">Verified</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/40 text-base sm:text-lg mb-8"
            >
              This ID card is valid and the registration has been successfully confirmed.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/" className="btn-premium btn-green w-full justify-center">
                Back to Home
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Brand Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-0 right-0 text-center z-10"
      >
        <p className="text-white/20 text-xs font-medium tracking-wider" style={{ fontFamily: "var(--font-mono)" }}>
          Powered by CodeNeuraX
        </p>
      </motion.div>
    </div>
  )
}
