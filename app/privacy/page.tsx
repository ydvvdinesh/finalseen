import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | CodeNeuraX",
  description: "CodeNeuraX Privacy Policy detailing data collection, account information, cookies, and protection.",
  alternates: {
    canonical: "https://www.codeneurax.in/privacy",
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="container mx-auto px-4 sm:px-6 py-32 max-w-2xl">
        <div className="mono-badge mb-8">
          <span className="dot" />
          Legal
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-serif)" }}>
          Privacy <span className="gradient-text-purple">Policy</span>
        </h1>
        <div className="glass-card p-8 space-y-8">
          <p className="text-white/30 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
            Last updated: September 2026
          </p>

          {/* 1. Introduction */}
          <section>
            <h2 className="text-lg font-semibold text-white/90 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              1. Information We Collect
            </h2>
            <p className="text-white/40 text-sm leading-relaxed mb-3">
              When you use CodeNeuraX, we collect information you provide directly or through third-party authentication:
            </p>
            <ul className="text-white/40 text-sm list-disc pl-5 space-y-1.5 leading-relaxed">
              <li><strong className="text-white/70">Account Data:</strong> When signing in via Google OAuth, we receive your name, email address, and avatar image.</li>
              <li><strong className="text-white/70">Form Submissions:</strong> Information provided when submitting contact inquiries, speaker applications, or campus ambassador requests.</li>
              <li><strong className="text-white/70">Usage &amp; Device Information:</strong> Standard access logs, browser type, device information, and interaction data to optimize website performance.</li>
            </ul>
          </section>

          {/* 2. How We Use Your Data */}
          <section>
            <h2 className="text-lg font-semibold text-white/90 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              2. How We Use Your Information
            </h2>
            <p className="text-white/40 text-sm leading-relaxed mb-3">
              We utilize your collected information to:
            </p>
            <ul className="text-white/40 text-sm list-disc pl-5 space-y-1.5 leading-relaxed">
              <li>Provide and personalize platform access, learning resources, and community features.</li>
              <li>Deliver opportunity updates, hackathon announcements, internships, and platform newsletters.</li>
              <li>Respond to inquiries, support requests, and application reviews.</li>
              <li>Ensure platform security, prevent unauthorized activities, and enforce our terms.</li>
            </ul>
          </section>

          {/* 3. Cookies & Tracking */}
          <section>
            <h2 className="text-lg font-semibold text-white/90 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              3. Cookies &amp; Session Management
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              We use essential session cookies to maintain your login state, guest mode preferences, and secure authentication tokens. These cookies are required for core platform navigation.
            </p>
          </section>

          {/* 4. Data Sharing & Security */}
          <section>
            <h2 className="text-lg font-semibold text-white/90 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              4. Data Sharing &amp; Protection
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              We do not sell, rent, or trade your personal information to third parties. We employ modern cryptographic safeguards and Row Level Security (RLS) across our databases to protect your data from unauthorized access or breaches.
            </p>
          </section>

          {/* 5. Your Rights */}
          <section>
            <h2 className="text-lg font-semibold text-white/90 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              5. Your Rights &amp; Choices
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              You have the right to request access to, correction of, or deletion of your personal account information. You may opt out of automated marketing emails by contacting our support team or using the contact form on our website.
            </p>
          </section>

          {/* 6. Contact */}
          <section>
            <h2 className="text-lg font-semibold text-white/90 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              6. Contact Us
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              If you have any questions or concerns regarding this Privacy Policy, please contact us at{" "}
              <a
                href="mailto:codeneurax@gmail.com"
                className="text-purple-400/70 hover:text-purple-400 underline underline-offset-2 transition-colors"
              >
                codeneurax@gmail.com
              </a>
              .
            </p>
          </section>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <Link
              href="/"
              className="text-purple-400/70 hover:text-purple-400 font-medium transition-colors text-sm"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ← Back to home
            </Link>
            <Link
              href="/terms"
              className="text-purple-400/70 hover:text-purple-400 font-medium transition-colors text-sm"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Terms of Service →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
