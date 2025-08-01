import type { Metadata, Viewport } from 'next'
import './globals.css'
import PerformanceMonitor from '@/components/ui/performance-monitor'

export const metadata: Metadata = {
  title: 'CodeNeuraX | Student-Led Tech Community & Coding Resources',
  description: 'Join CodeNeuraX, a vibrant student-led tech community offering coding challenges, events, resources, mentorship, and career support for aspiring developers and students.',
  generator: 'CodeNeuraX',
  metadataBase: new URL('https://www.codeneurax.in'),
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
  robots: {
    index: true,
    follow: true,
  },
}

// ✅ NEW: Move viewport to separate export
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/images/codeneurax-logo.webp" as="image" type="image/webp" />
        <link rel="preload" href="/images/Founder - CNX -1.webp" as="image" type="image/webp" />
        
        {/* Resource hints for better performance */}
        <link rel="prefetch" href="/events" />
        <link rel="prefetch" href="/econtent" />
        <link rel="prefetch" href="/study" />
      </head>
      <body className="bg-black text-white antialiased">
        <PerformanceMonitor />
        {children}
      </body>
    </html>
  )
}
