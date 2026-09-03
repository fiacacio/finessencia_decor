import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Finessência | Decor aromático',
  description: 'Essências que transformam ambientes, despertam memórias e acompanham momentos especiais.',
  icons: {
    icon: '/Logo PNG Caramelo.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#3a2419',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
