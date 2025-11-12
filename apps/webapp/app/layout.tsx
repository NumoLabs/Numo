import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Numo',
  description: 'Grow your BTC safely, automatically, and transparently with auto-rebalancing vaults, fixed-term bonds, strategy sharing, and forecasting tools on Starknet.',
  icons: {
    icon: '/numo-logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} text-white`} style={{ backgroundColor: '#000000' }}>
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
