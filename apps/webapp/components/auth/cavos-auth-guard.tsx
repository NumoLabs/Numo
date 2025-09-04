"use client"

import { useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useCavosAuth } from '@/hooks/use-cavos-auth'

interface CavosAuthGuardProps {
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
  publicRoutes?: string[]
}

export function CavosAuthGuard({ 
  children, 
  fallback = null, 
  redirectTo = '/',
  publicRoutes = ['/']
}: CavosAuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isInitialized, isLoading } = useCavosAuth()

  useEffect(() => {
    // Don't redirect while auth is initializing or loading
    if (!isInitialized || isLoading) {
      return
    }

    // Check if current route is public
    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    )

    // If not authenticated and not on a public route, redirect
    if (!isAuthenticated && !isPublicRoute) {
      router.push(redirectTo)
    }
  }, [isAuthenticated, isInitialized, isLoading, pathname, router, redirectTo, publicRoutes])

  // Show fallback while auth is initializing or loading
  if (!isInitialized || isLoading) {
    return <>{fallback}</>
  }

  // Check if current route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // If not authenticated and not on a public route, don't render children
  if (!isAuthenticated && !isPublicRoute) {
    return <>{fallback}</>
  }

  // Render children if authenticated or on public route
  return <>{children}</>
}
