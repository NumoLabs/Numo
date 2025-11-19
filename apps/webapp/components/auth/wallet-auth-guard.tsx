"use client"

import { useEffect } from 'react'
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

  useEffect(() => {
    if (isConnected === undefined) {
      return
    }

    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    )

    if (!isConnected || !address) {
      if (!isPublicRoute) {
        router.push(redirectTo)
      }
    }
  }, [isConnected, address, pathname, router, redirectTo, publicRoutes])

  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // If not connected and not on a public route, don't render children
  if (!isConnected || !address) {
    if (!isPublicRoute) {
      return <>{fallback}</>
    }
  }

  // Render children if connected or on public route
  return <>{children}</>
}

