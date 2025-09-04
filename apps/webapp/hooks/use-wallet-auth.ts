import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useWalletStatus } from "./use-wallet"
import { useCavosAuth } from "./use-cavos-auth"

/**
 * Custom hook to handle wallet authentication and automatic redirect
 * Redirects to home page when wallet is disconnected from protected routes
 */
export function useWalletAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const { isConnected, address } = useWalletStatus()
  
  // Get Cavos auth state
  const cavosAuth = useCavosAuth()
  const isCavosAuthenticated = cavosAuth?.isAuthenticated || false

  useEffect(() => {
    // Define routes that require wallet connection
    const protectedRoutes = [
      "/dashboard",
      "/deposit",
      "/withdraw", 
      "/history",
      "/pools",
      "/bonds",
      "/forecast"
    ]

    // Define public routes that don't require wallet connection
    const publicRoutes = ["/learn", "/marketplace"]

    // Check if current route is protected (not public)
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    )
    const isPublicRoute = publicRoutes.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    )

    // Check if user is authenticated (either wallet or Cavos)
    const isAuthenticated = isConnected || isCavosAuthenticated

    // Redirect if on protected route without authentication (but not on public routes)
    if (isProtectedRoute && !isPublicRoute && !isAuthenticated) {
      // Small delay to prevent flash and ensure clean redirect
      const timeoutId = setTimeout(() => {
        router.push("/")
      }, 100)
      
      return () => clearTimeout(timeoutId)
    }
  }, [isConnected, isCavosAuthenticated, pathname, router])

  return {
    address,
    isAuthenticated: isConnected || isCavosAuthenticated,
    isProtectedRoute: pathname !== "/" && !pathname.startsWith("/#")
  }
} 