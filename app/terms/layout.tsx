import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | CodeNeuraX',
  description: 'Terms and Conditions for using the CodeNeuraX platform.',
  alternates: {
    canonical: 'https://www.codeneurax.in/terms',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
