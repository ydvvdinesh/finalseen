import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In | CodeNeuraX Community',
  description:
    'Sign in to your CodeNeuraX account or continue as guest to explore hackathons, internships, events, and developer resources.',
  alternates: {
    canonical: 'https://www.codeneurax.in/login',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
