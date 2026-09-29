import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const speakerName = params.id
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

  return {
    title: `${speakerName} | Speaker Profile | CodeNeuraX`,
    description: `Read the bio, background, sessions, and achievements of ${speakerName}, keynote speaker and mentor at CodeNeuraX.`,
    alternates: {
      canonical: `https://www.codeneurax.in/speaker/${params.id}`,
    },
    openGraph: {
      title: `${speakerName} | Speaker Profile | CodeNeuraX`,
      description: `Read the bio, background, sessions, and achievements of ${speakerName}, keynote speaker and mentor at CodeNeuraX.`,
      url: `https://www.codeneurax.in/speaker/${params.id}`,
      siteName: 'CodeNeuraX',
      images: [{ url: '/images/codeneurax-logo.png', width: 1200, height: 630, alt: `${speakerName} - CodeNeuraX` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${speakerName} | Speaker Profile | CodeNeuraX`,
      description: `Read the bio, background, sessions, and achievements of ${speakerName}, keynote speaker and mentor at CodeNeuraX.`,
      images: ['/images/codeneurax-logo.png'],
    },
  }
}

export default function SpeakerDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
