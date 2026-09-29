import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Campus Ambassador Program & Careers | CodeNeuraX',
  description:
    'Join CodeNeuraX as a Campus Ambassador, Student Leader, or Volunteer. Represent CodeNeuraX at your university and gain invaluable leadership experience.',
  alternates: {
    canonical: 'https://www.codeneurax.in/work-with-us',
  },
  openGraph: {
    title: 'Campus Ambassador Program & Careers | CodeNeuraX',
    description:
      'Lead your campus tech community, organize hackathons, and collaborate with top student developers nationwide.',
    url: 'https://www.codeneurax.in/work-with-us',
    siteName: 'CodeNeuraX',
    images: [{ url: '/images/codeneurax-logo.png', width: 1200, height: 630, alt: 'CodeNeuraX Campus Ambassadors' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Campus Ambassador Program & Careers | CodeNeuraX',
    description:
      'Lead your campus tech community, organize hackathons, and collaborate with top student developers nationwide.',
    images: ['/images/codeneurax-logo.png'],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
