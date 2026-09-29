import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tech Events, Hackathons & Workshops | CodeNeuraX',
  description:
    'Explore upcoming and past hackathons, workshops, and flagship tech events organized by CodeNeuraX for student developers and innovators.',
  alternates: {
    canonical: 'https://www.codeneurax.in/events',
  },
  openGraph: {
    title: 'Tech Events, Hackathons & Workshops | CodeNeuraX',
    description:
      'Join CodeNeuraX tech events, national hackathons, and industry expert workshops.',
    url: 'https://www.codeneurax.in/events',
    siteName: 'CodeNeuraX',
    images: [{ url: '/images/codeneurax-logo.png', width: 1200, height: 630, alt: 'CodeNeuraX Events' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech Events, Hackathons & Workshops | CodeNeuraX',
    description:
      'Join CodeNeuraX tech events, national hackathons, and industry expert workshops.',
    images: ['/images/codeneurax-logo.png'],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
