"use client"
import { Button } from "./button"
import { Wallet, User, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useWalletStatus } from '@/hooks/use-wallet'
import { useWallet } from '@/hooks/use-wallet'
import { useConnect } from '@starknet-react/core'
import { StarknetkitConnector, useStarknetkitConnectModal } from 'starknetkit'

export default function WalletConnector() {
  const pathname = usePathname()
  const { isConnected, address } = useWalletStatus()
  const { connectAsync, connectors } = useConnect()
  const { isConnecting } = useWallet()
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[],
    modalTheme: 'dark',
  })

  // Check if we're on the dashboard or a dashboard-related page
  const dashboardPages = ['/dashboard', '/history', '/bonds', '/forecast', '/marketplace', '/learn', '/vaults', '/profile']
  const isOnDashboard = dashboardPages.some(page => pathname === page || pathname.startsWith(`${page}/`))

  // If wallet is connected, show dashboard link or nothing on dashboard pages
  if (isConnected && address) {
    if (isOnDashboard) {
      return null
    }

    return (
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Dashboard button - only visible on mobile */}
        <Link href="/dashboard" className="sm:hidden">
          <Button
            variant="default"
            className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-400 hover:via-orange-500 hover:to-orange-400 text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-400/60 focus-visible:shadow-xl transform hover:-translate-y-1 hover:scale-105 focus-visible:-translate-y-1 focus-visible:scale-105 text-xs"
          >
            <User className="mr-1 h-3 w-3" />
            Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  // Handle wallet connection using StarknetKit modal
  const handleConnectWallet = async () => {
    try {
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('starknet_last_connector')
          localStorage.removeItem('walletStarknetkitLatest')
          localStorage.removeItem('starknet_wallet_connection')
        } catch (error) {
          // Ignore localStorage errors
          console.warn('Error clearing localStorage before modal:', error)
        }
      }
        
      const { connector } = await starknetkitConnectModal()
      
      if (!connector) {
        // User cancelled or no connector selected
        return
      }
      
      await connectAsync({ connector })
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="default"
        onClick={handleConnectWallet}
        disabled={isConnecting}
        className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-400 hover:via-orange-500 hover:to-orange-400 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-400/60 focus-visible:shadow-xl transform hover:-translate-y-1 hover:scale-105 focus-visible:-translate-y-1 focus-visible:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </>
        )}
      </Button>
    </div>
  )
}
