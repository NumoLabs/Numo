"use client"
import { useCallback, useEffect, useState } from 'react'
import { Button } from "./button"
import { useCavosAuthContext } from '@/components/cavos-auth-provider'
import { CavosAuthModal } from './cavos-auth-modal'
import { User, LogOut, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function WalletConnector() {
  const { 
    isAuthenticated: isCavosAuthenticated, 
    signOut: cavosSignOut,
    isInitialized,
    isLoading
  } = useCavosAuthContext()
  const pathname = usePathname()
  const router = useRouter()
  
  // Local auth state as fallback to force immediate re-render on mobile
  const checkLocalStorageAuth = useCallback(() => {
    if (typeof window === 'undefined') return false
    
    const accessToken = localStorage.getItem('cavos_access_token')
    const refreshToken = localStorage.getItem('cavos_refresh_token')
    const storedUser = localStorage.getItem('cavos_user')
    
    return !!(
      accessToken && 
      accessToken !== 'undefined' && 
      accessToken !== 'null' &&
      accessToken.trim().length > 0 &&
      refreshToken && 
      refreshToken !== 'undefined' && 
      refreshToken !== 'null' &&
      refreshToken.trim().length > 0 &&
      storedUser && 
      storedUser !== 'undefined' && 
      storedUser !== 'null' &&
      storedUser.trim().length > 0
    )
  }, [])
  
  const [localAuthState, setLocalAuthState] = useState(() => checkLocalStorageAuth())
  
  // Sync local state with context state whenever context changes
  useEffect(() => {
    if (isInitialized) {
      // Always sync with context state when initialized
      setLocalAuthState(isCavosAuthenticated)
    }
  }, [isCavosAuthenticated, isInitialized])
  
  // Listen for auth update events and sync with localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    let mounted = true
    
    const handleAuthUpdate = () => {
      if (!mounted) return
      // Update local state immediately when event fires
      const hasAuth = checkLocalStorageAuth()
      console.log('[WalletConnector] Auth update event received, hasAuth:', hasAuth)
      setLocalAuthState(hasAuth)
    }
    
    // Listen for auth update events
    window.addEventListener('cavos-auth-update', handleAuthUpdate)
    
    // Also sync with localStorage periodically for the first few seconds (mobile fallback)
    // This ensures we catch auth state changes even if events are missed
    let checkCount = 0
    const maxChecks = 50 // 5 seconds at 100ms intervals
    const interval = setInterval(() => {
      if (!mounted) {
        clearInterval(interval)
        return
      }
      
      checkCount++
      const hasAuth = checkLocalStorageAuth()
      setLocalAuthState(prev => {
        if (prev !== hasAuth) {
          console.log('[WalletConnector] LocalStorage changed, updating state. hasAuth:', hasAuth)
          return hasAuth
        }
        return prev
      })
      
      // Stop checking after maxChecks or if we're authenticated and context is ready
      if (checkCount >= maxChecks || (hasAuth && isInitialized && isCavosAuthenticated)) {
        clearInterval(interval)
      }
    }, 100)
    
    const timeout = setTimeout(() => {
      clearInterval(interval)
    }, 5000) // Stop checking after 5 seconds
    
    // Initial check in case auth was set before component mounted
    const initialAuth = checkLocalStorageAuth()
    setLocalAuthState(prev => {
      if (prev !== initialAuth) {
        return initialAuth
      }
      return prev
    })
    
    return () => {
      mounted = false
      window.removeEventListener('cavos-auth-update', handleAuthUpdate)
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [checkLocalStorageAuth, isInitialized, isCavosAuthenticated])
  
  // Use context state as source of truth when initialized
  // Use localAuthState only as fallback when not initialized
  const effectiveIsAuthenticated = isInitialized 
    ? isCavosAuthenticated
    : localAuthState

  const handleCavosSuccess = useCallback(() => {
    // Authentication successful callback
    // Update local state immediately
    setLocalAuthState(true)
  }, [])

  const handleCavosSignOut = useCallback(async () => {
    // Update local state immediately before sign out
    setLocalAuthState(false)
    await cavosSignOut()
    // Ensure local state is cleared
    setLocalAuthState(false)
    // Redirect to landing page after sign out
    router.push('/')
  }, [cavosSignOut])

  // Check if we're on the dashboard or a dashboard-related page
  const dashboardPages = ['/dashboard', '/history', '/bonds', '/forecast', '/marketplace', '/learn', '/vaults']
  const isOnDashboard = dashboardPages.some(page => pathname === page || pathname.startsWith(`${page}/`))

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
  if (!effectiveIsAuthenticated) {
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
  // When on dashboard, don't show anything (Sign Out is in the profile dropdown)
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
      {/* Sign Out button - only visible on desktop */}
      <div className="hidden sm:block">
        <Button
          onClick={handleCavosSignOut}
          variant="ghost"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 px-3 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-sm focus-visible:shadow-sm text-sm"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
