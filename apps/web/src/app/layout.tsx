import { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kinben KPN System Master Workbook',
  description: 'Advanced multi-level hierarchy management system for electronic components, PCBs, assemblies, and complete systems',
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