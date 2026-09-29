import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reset Password | CodeNeuraX',
  description: 'Reset your CodeNeuraX account password.',
  alternates: {
    canonical: 'https://www.codeneurax.in/reset-password',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black">
      {children}
    </div>
  )
}