import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const eventTitle = params.id
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

  return {
    title: `${eventTitle} | CodeNeuraX Event`,
    description: `Discover all details, schedule, speakers, and registration information for ${eventTitle} at CodeNeuraX.`,
    alternates: {
      canonical: `https://www.codeneurax.in/events/${params.id}`,
    },
    openGraph: {
      title: `${eventTitle} | CodeNeuraX Event`,
      description: `Discover all details, schedule, speakers, and registration information for ${eventTitle} at CodeNeuraX.`,
      url: `https://www.codeneurax.in/events/${params.id}`,
      siteName: 'CodeNeuraX',
      images: [{ url: '/images/codeneurax-logo.png', width: 1200, height: 630, alt: `${eventTitle} - CodeNeuraX` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${eventTitle} | CodeNeuraX Event`,
      description: `Discover all details, schedule, speakers, and registration information for ${eventTitle} at CodeNeuraX.`,
      images: ['/images/codeneurax-logo.png'],
    },
  }
}

export default function EventDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
