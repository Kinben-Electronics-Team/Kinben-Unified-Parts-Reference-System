import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kinben Admin - Parts Management System',
  description: 'Administrative interface for managing the Kinben parts database',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}