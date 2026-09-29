import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Spark 2026 | National AI Innovation & Hackathon Event',
  description:
    'Register for AI Spark 2026 by CodeNeuraX — a premier tech conference and hackathon featuring leading AI researchers, engineers, and student innovators.',
  alternates: {
    canonical: 'https://www.codeneurax.in/aispark',
  },
  openGraph: {
    title: 'AI Spark 2026 | National AI Innovation & Hackathon Event',
    description:
      'Join AI Spark 2026 by CodeNeuraX. Engage in hands-on workshops, keynote sessions, and hackathons with industry leaders.',
    url: 'https://www.codeneurax.in/aispark',
    siteName: 'CodeNeuraX',
    images: [{ url: '/images/codeneurax-logo.png', width: 1200, height: 630, alt: 'AI Spark 2026 - CodeNeuraX' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Spark 2026 | National AI Innovation & Hackathon Event',
    description:
      'Join AI Spark 2026 by CodeNeuraX. Engage in hands-on workshops, keynote sessions, and hackathons with industry leaders.',
    images: ['/images/codeneurax-logo.png'],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
