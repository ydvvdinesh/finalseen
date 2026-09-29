import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const roleTitle = params.id
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

  return {
    title: `${roleTitle} | Work With CodeNeuraX`,
    description: `Apply for ${roleTitle} role at CodeNeuraX. Join our student team and build impactful initiatives.`,
    alternates: {
      canonical: `https://www.codeneurax.in/work-with-us/${params.id}`,
    },
    openGraph: {
      title: `${roleTitle} | Work With CodeNeuraX`,
      description: `Apply for ${roleTitle} role at CodeNeuraX. Join our student team and build impactful initiatives.`,
      url: `https://www.codeneurax.in/work-with-us/${params.id}`,
      siteName: 'CodeNeuraX',
      images: [{ url: '/images/codeneurax-logo.png', width: 1200, height: 630, alt: `${roleTitle} - CodeNeuraX` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${roleTitle} | Work With CodeNeuraX`,
      description: `Apply for ${roleTitle} role at CodeNeuraX. Join our student team and build impactful initiatives.`,
      images: ['/images/codeneurax-logo.png'],
    },
  }
}

export default function PositionDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
