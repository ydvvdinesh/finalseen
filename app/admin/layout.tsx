import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Dashboard | CodeNeuraX',
  description: 'CodeNeuraX admin dashboard for managing community content and events.',
  alternates: {
    canonical: 'https://www.codeneurax.in/admin',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
