import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | CodeNeuraX',
  description: 'Privacy Policy for CodeNeuraX community platform.',
  alternates: {
    canonical: 'https://www.codeneurax.in/privacy',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
