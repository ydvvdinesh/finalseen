import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const serviceTitle = params.slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())

  return {
    title: `${serviceTitle} | CodeNeuraX Services`,
    description: `Learn more about our ${serviceTitle} offerings, deliverables, process, and support provided by CodeNeuraX.`,
    alternates: {
      canonical: `https://www.codeneurax.in/services/${params.slug}`,
    },
    openGraph: {
      title: `${serviceTitle} | CodeNeuraX Services`,
      description: `Learn more about our ${serviceTitle} offerings, deliverables, process, and support provided by CodeNeuraX.`,
      url: `https://www.codeneurax.in/services/${params.slug}`,
      siteName: 'CodeNeuraX',
      images: [{ url: '/images/codeneurax-logo.png', width: 1200, height: 630, alt: `${serviceTitle} - CodeNeuraX` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${serviceTitle} | CodeNeuraX Services`,
      description: `Learn more about our ${serviceTitle} offerings, deliverables, process, and support provided by CodeNeuraX.`,
      images: ['/images/codeneurax-logo.png'],
    },
  }
}

export default function ServiceDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
