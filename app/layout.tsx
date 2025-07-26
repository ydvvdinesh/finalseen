import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CodeNeuraX | Student-Led Tech Community & Coding Resources',
  description: 'Join CodeNeuraX, a vibrant student-led tech community offering coding challenges, events, resources, mentorship, and career support for aspiring developers and students.',
  generator: 'CodeNeuraX',
  openGraph: {
    title: 'CodeNeuraX | Student-Led Tech Community & Coding Resources',
    description: 'Join CodeNeuraX, a vibrant student-led tech community offering coding challenges, events, resources, mentorship, and career support for aspiring developers and students.',
    url: 'https://www.codeneurax.in/',
    siteName: 'CodeNeuraX',
    images: [
      {
        url: '/images/codeneurax-logo.png',
        width: 1200,
        height: 630,
        alt: 'CodeNeuraX Logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeNeuraX | Student-Led Tech Community & Coding Resources',
    description: 'Join CodeNeuraX, a vibrant student-led tech community offering coding challenges, events, resources, mentorship, and career support for aspiring developers and students.',
    images: ['/images/codeneurax-logo.png'],
    creator: '@codeneurax',
  },
  icons: {
    icon: '/favicon_io/favicon.ico',
  },
  alternates: {
    canonical: 'https://www.codeneurax.in/',
  },
  authors: [{ name: 'Dinesh Yadav' }],
  other: {
    author: 'Dinesh Yadav',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
