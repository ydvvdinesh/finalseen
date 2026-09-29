import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verify Registration | CodeNeuraX',
  description: 'Verify your CodeNeuraX account registration.',
  alternates: {
    canonical: 'https://www.codeneurax.in/verify-registration',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function VerifyRegistrationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
