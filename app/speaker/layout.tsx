import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Distinguished Speakers & Mentors | CodeNeuraX',
  description:
    'Meet the industry leaders, researchers, AI pioneers, and founders delivering keynote talks and workshops at CodeNeuraX.',
  alternates: {
    canonical: 'https://www.codeneurax.in/speaker',
  },
  openGraph: {
    title: 'Distinguished Speakers & Mentors | CodeNeuraX',
    description:
      'Learn from top engineering leads, AI researchers, and startup founders at CodeNeuraX sessions.',
    url: 'https://www.codeneurax.in/speaker',
    siteName: 'CodeNeuraX',
    images: [{ url: '/images/codeneurax-logo.png', width: 1200, height: 630, alt: 'CodeNeuraX Speakers' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Distinguished Speakers & Mentors | CodeNeuraX',
    description:
      'Learn from top engineering leads, AI researchers, and startup founders at CodeNeuraX sessions.',
    images: ['/images/codeneurax-logo.png'],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
