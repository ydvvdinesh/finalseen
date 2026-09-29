import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Instrument_Serif } from 'next/font/google'
import './globals.css'
import { GoogleAnalytics } from '@next/third-parties/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://www.codeneurax.in'),
  title: {
    default: 'CodeNeuraX | India\'s Student-Led Tech Community & Coding Platform',
    template: '%s | CodeNeuraX',
  },
  description:
    'Join CodeNeuraX, India\'s premier student-led tech community. Access curated internships, hackathons, coding challenges, free DSA notes, tech events, and career mentorship.',
  keywords: [
    'CodeNeuraX',
    'Tech Community India',
    'Student Developer Community',
    'Internships for Students',
    'Hackathons 2026',
    'AI Spark 2026',
    'DSA Handwritten Notes',
    'Computer Science Study Material',
    'Coding Challenges',
    'Tech News',
    'Dinesh Yadav CodeNeuraX',
    'Student Tech Hub',
    'Developer Mentorship',
  ],
  applicationName: 'CodeNeuraX',
  authors: [{ name: 'Dinesh Yadav', url: 'https://www.linkedin.com/in/dinesh-yadav-1b462831a/' }],
  generator: 'Next.js',
  creator: 'CodeNeuraX Team',
  publisher: 'CodeNeuraX',
  category: 'technology',
  alternates: {
    canonical: 'https://www.codeneurax.in',
    languages: {
      'en-IN': 'https://www.codeneurax.in',
      'en-US': 'https://www.codeneurax.in',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.codeneurax.in/',
    siteName: 'CodeNeuraX',
    title: 'CodeNeuraX | India\'s Student-Led Tech Community & Coding Platform',
    description:
      'Join CodeNeuraX, India\'s premier student-led tech community. Access curated internships, hackathons, coding challenges, free DSA notes, tech events, and career mentorship.',
    images: [
      {
        url: '/images/codeneurax-logo.png',
        width: 1200,
        height: 630,
        alt: 'CodeNeuraX - Student-Led Tech Community',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeNeuraX | India\'s Student-Led Tech Community & Coding Platform',
    description:
      'Join CodeNeuraX, India\'s premier student-led tech community. Access curated internships, hackathons, coding challenges, free DSA notes, tech events, and career mentorship.',
    images: ['/images/codeneurax-logo.png'],
    creator: '@codeneurax',
    site: '@codeneurax',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'G-38QJS834B2',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#050505' },
    { media: '(prefers-color-scheme: light)', color: '#050505' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} scroll-smooth dark`}>
      <head>
        {/* Comprehensive Structured Data (Organization + WebSite Schema) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://www.codeneurax.in/#organization',
                  name: 'CodeNeuraX',
                  url: 'https://www.codeneurax.in',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://www.codeneurax.in/android-chrome-512x512.png',
                    width: 512,
                    height: 512,
                  },
                  image: 'https://www.codeneurax.in/images/codeneurax-logo.png',
                  description:
                    'CodeNeuraX is India’s premier student-led tech community providing resources, internships, hackathons, and mentorship to computer science students.',
                  founder: {
                    '@type': 'Person',
                    name: 'Dinesh Yadav',
                    url: 'https://www.linkedin.com/in/dinesh-yadav-1b462831a/',
                  },
                  sameAs: [
                    'https://www.linkedin.com/company/codeneurax',
                    'https://www.instagram.com/codeneurax',
                    'https://www.youtube.com/@CodeNeuraX',
                    'https://whatsapp.com/channel/0029VbC93H2HVvTiyyFL9C0Y',
                  ],
                  contactPoint: {
                    '@type': 'ContactPoint',
                    email: 'team@codeneurax.in',
                    contactType: 'customer support',
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://www.codeneurax.in/#website',
                  url: 'https://www.codeneurax.in',
                  name: 'CodeNeuraX',
                  description:
                    'Student-Led Tech Community for coding, internships, and developer events.',
                  publisher: {
                    '@id': 'https://www.codeneurax.in/#organization',
                  },
                  inLanguage: 'en-IN',
                },
              ],
            }),
          }}
        />
      </head>
      <body className="bg-[#050505] min-h-screen text-white antialiased font-sans">
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-38QJS834B2"} />
        {children}
      </body>
    </html>
  )
}
