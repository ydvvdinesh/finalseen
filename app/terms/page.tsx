import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="container mx-auto px-4 sm:px-6 py-32 max-w-2xl">
        <div className="mono-badge mb-8">
          <span className="dot" />
          Legal
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-6" style={{ fontFamily: "var(--font-serif)" }}>
          Terms of <span className="gradient-text-cyan">Service</span>
        </h1>
        <div className="glass-card p-8 space-y-8">
          <p className="text-white/30 text-xs" style={{ fontFamily: "var(--font-mono)" }}>
            Last updated: September 2026
          </p>

          {/* 1. Acceptance */}
          <section>
            <h2 className="text-lg font-semibold text-white/90 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              1. Acceptance of Terms
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              By accessing or using the CodeNeuraX platform (&quot;Service&quot;), including signing in via Google OAuth
              or browsing as a guest, you agree to be bound by these Terms of Service. If you do not agree to these
              terms, please discontinue use of the Service immediately.
            </p>
          </section>

          {/* 2. Use of Service */}
          <section>
            <h2 className="text-lg font-semibold text-white/90 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              2. Use of Service
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              CodeNeuraX is a student-led technology community platform that provides access to learning resources,
              career opportunities, events, hackathons, and networking tools. You agree to use the Service for lawful
              purposes only and in compliance with all applicable laws and regulations.
            </p>
          </section>

          {/* 3. Account & Authentication */}
          <section>
            <h2 className="text-lg font-semibold text-white/90 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              3. Account &amp; Authentication
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              When you sign in using Google OAuth, we collect and store your name, email address, and profile
              information as provided by Google. You are responsible for maintaining the security of your account
              credentials and for all activities that occur under your account.
            </p>
          </section>

          {/* 4. Communications & Marketing */}
          <section>
            <h2 className="text-lg font-semibold text-white/90 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              4. Communications &amp; Notifications
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              By creating an account or signing in to CodeNeuraX, you consent to receive electronic communications
              from us, including but not limited to: platform updates, new opportunity alerts (internships, hackathons,
              jobs, and tech news), curated career content, event announcements, and occasional promotional messages.
              These communications may be sent to the email address associated with your account. You may contact us
              to adjust your communication preferences at any time.
            </p>
          </section>

          {/* 5. Content & IP */}
          <section>
            <h2 className="text-lg font-semibold text-white/90 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              5. Intellectual Property
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              All content, design, code, branding, and materials on the CodeNeuraX platform are the property of
              CodeNeuraX and its contributors. You may not reproduce, distribute, or create derivative works from
              our content without prior written consent.
            </p>
          </section>

          {/* 6. Privacy */}
          <section>
            <h2 className="text-lg font-semibold text-white/90 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              6. Privacy
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              Your privacy is important to us. Please review our{" "}
              <Link href="/privacy" className="text-purple-400/70 hover:text-purple-400 underline underline-offset-2 transition-colors">
                Privacy Policy
              </Link>{" "}
              to understand how we collect, use, and protect your personal information, including your email address
              and account data.
            </p>
          </section>

          {/* 7. Limitation of Liability */}
          <section>
            <h2 className="text-lg font-semibold text-white/90 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              7. Limitation of Liability
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              CodeNeuraX is provided &quot;as is&quot; without any warranties, express or implied. We do not guarantee
              the accuracy, completeness, or reliability of any content, opportunities, or third-party links shared
              on the platform. CodeNeuraX shall not be liable for any damages arising from your use of the Service.
            </p>
          </section>

          {/* 8. Modifications */}
          <section>
            <h2 className="text-lg font-semibold text-white/90 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              8. Modifications to Terms
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              We reserve the right to modify these Terms at any time. Continued use of the Service after changes
              constitutes acceptance of the updated Terms. We encourage you to review this page periodically.
            </p>
          </section>

          {/* 9. Contact */}
          <section>
            <h2 className="text-lg font-semibold text-white/90 mb-3" style={{ fontFamily: "var(--font-serif)" }}>
              9. Contact Us
            </h2>
            <p className="text-white/40 text-sm leading-relaxed">
              If you have any questions about these Terms, please contact us at{" "}
              <a
                href="mailto:codeneurax@gmail.com"
                className="text-purple-400/70 hover:text-purple-400 underline underline-offset-2 transition-colors"
              >
                codeneurax@gmail.com
              </a>
              .
            </p>
          </section>

          <div className="pt-4 border-t border-white/[0.06]">
            <Link
              href="/"
              className="text-purple-400/70 hover:text-purple-400 font-medium transition-colors text-sm"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
