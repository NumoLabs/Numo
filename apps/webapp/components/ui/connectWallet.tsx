"use client"
import { useCallback } from 'react'
import { Button } from "./button"
import { useCavosAuthContext } from '@/components/cavos-auth-provider'
import { CavosAuthModal } from './cavos-auth-modal'
import { User, LogOut, LayoutDashboard, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function WalletConnector() {
  const { 
    isAuthenticated: isCavosAuthenticated, 
    signOut: cavosSignOut,
    isInitialized,
    isLoading
  } = useCavosAuthContext()
  const pathname = usePathname()

  const handleCavosSuccess = useCallback(() => {
    // Authentication successful callback
  }, [])

  const handleCavosSignOut = useCallback(() => {
    cavosSignOut()
  }, [cavosSignOut])

  // Check if we're on the dashboard or a dashboard-related page
  const isOnDashboard = pathname === '/dashboard' || pathname.startsWith('/dashboard')

  // Show loading state while initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="flex items-center gap-4">
        <Button
          variant="default"
          disabled
          className="bg-gradient-to-r from-gray-500 via-gray-600 to-gray-500 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 opacity-50 cursor-not-allowed"
        >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </Button>
      </div>
    )
  }

  // Show Cavos authentication if user is not authenticated
  if (!isCavosAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <CavosAuthModal 
          onSuccess={handleCavosSuccess}
          trigger={
            <Button
              variant="default"
              className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-400 hover:via-orange-500 hover:to-orange-400 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-orange-500/50 hover:shadow-xl hover:shadow-orange-400/60 focus-visible:shadow-xl transform hover:-translate-y-1 hover:scale-105 focus-visible:-translate-y-1 focus-visible:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <User className="mr-2 h-4 w-4" />
            Register/Login
            </Button>
          }
        />
      </div>
    )
  }

  // Show authenticated state
  if (isOnDashboard) {
    return null
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/dashboard">
        <Button
          onClick={handleCavosSignOut}
          variant="ghost"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-sm focus-visible:shadow-sm"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </Link>
    </div>
  )
}
