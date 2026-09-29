import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'E-Content & Study Material | DSA Notes & GATE Papers',
  description:
    'Free handwritten programming notes (Python, C++, Java, DBMS, OOPs), company DSA interview questions (Google, Amazon, Microsoft), and previous year papers.',
  alternates: {
    canonical: 'https://www.codeneurax.in/econtent',
  },
  openGraph: {
    title: 'E-Content & Study Material | CodeNeuraX',
    description:
      'Access comprehensive study materials, interview prep sheets, and handwritten coding notes for computer science students.',
    url: 'https://www.codeneurax.in/econtent',
    siteName: 'CodeNeuraX',
    images: [{ url: '/images/codeneurax-logo.png', width: 1200, height: 630, alt: 'CodeNeuraX E-Content' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'E-Content & Study Material | CodeNeuraX',
    description:
      'Access comprehensive study materials, interview prep sheets, and handwritten coding notes for computer science students.',
    images: ['/images/codeneurax-logo.png'],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
