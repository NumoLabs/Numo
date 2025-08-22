import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { StarknetProvider } from '@/components/starknet-provider'
import { WalletProvider } from '@/components/wallet-provider'
import { CavosAuthProvider } from '@/components/cavos-auth-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Numo - Modular BTC Finance on Starknet',
  description: 'Grow your BTC safely, automatically, and transparently with auto-rebalancing vaults, fixed-term bonds, strategy sharing, and forecasting tools on Starknet.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} text-white`} style={{ backgroundColor: '#000000' }}>
        <StarknetProvider>
          <CavosAuthProvider>
            <WalletProvider>
              {children}
            </WalletProvider>
          </CavosAuthProvider>
        </StarknetProvider>
        <Toaster />
      </body>
    </html>
  )
}
