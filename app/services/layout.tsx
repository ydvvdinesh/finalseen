import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professional Tech Services & Career Guidance | CodeNeuraX',
  description:
    'Web development, brand promotion, event management, tech workshops, and dedicated 1-on-1 career guidance provided by CodeNeuraX.',
  alternates: {
    canonical: 'https://www.codeneurax.in/services',
  },
  openGraph: {
    title: 'Professional Tech Services & Career Guidance | CodeNeuraX',
    description:
      'Empowering students and startups with industry-level web solutions, career mentoring, and workshop execution.',
    url: 'https://www.codeneurax.in/services',
    siteName: 'CodeNeuraX',
    images: [{ url: '/images/codeneurax-logo.png', width: 1200, height: 630, alt: 'CodeNeuraX Services' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Tech Services & Career Guidance | CodeNeuraX',
    description:
      'Empowering students and startups with industry-level web solutions, career mentoring, and workshop execution.',
    images: ['/images/codeneurax-logo.png'],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
