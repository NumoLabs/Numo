"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useWalletStatus } from '@/hooks/use-wallet'

interface WalletAuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
  publicRoutes?: string[]
}

export function WalletAuthGuard({ 
  children, 
  fallback = null, 
  redirectTo = '/',
  publicRoutes = ['/']
}: WalletAuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isConnected, address } = useWalletStatus()
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    // Give auto-reconnect time to work (2.5 seconds)
    const initTimeout = setTimeout(() => {
      setIsInitializing(false)
    }, 2500)

    return () => clearTimeout(initTimeout)
  }, [])

  useEffect(() => {
    if (isConnected === undefined || isInitializing) {
      return
    }

    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    )

    if (!isConnected || !address) {
      if (!isPublicRoute) {
        // Delay to allow auto-reconnect to complete before redirecting
        const timeoutId = setTimeout(() => {
          router.push(redirectTo)
        }, 100) // Short delay since we already waited during initialization
        
        return () => clearTimeout(timeoutId)
      }
    }
  }, [isConnected, address, pathname, router, redirectTo, publicRoutes, isInitializing])

  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  if (isInitializing) {
    return <>{children}</> // Show content while initializing
  }

  // If not connected and not on a public route, don't render children
  if (!isConnected || !address) {
    if (!isPublicRoute) {
      return <>{fallback}</>
    }
  }

  // Render children if connected or on public route
  return <>{children}</>
}

