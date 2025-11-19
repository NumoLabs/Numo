import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useWalletStatus } from "./use-wallet"

/**
 * Custom hook to handle wallet authentication and automatic redirect
 * Redirects to home page when wallet is disconnected from protected routes
 */
export function useWalletAuth() {
  const router = useRouter()
  const pathname = usePathname()
  const { isConnected, address } = useWalletStatus()
  const [isInitializing, setIsInitializing] = useState(true)

  // Give auto-reconnect time to work (2.5 seconds)
  useEffect(() => {
    const initTimeout = setTimeout(() => {
      setIsInitializing(false)
    }, 2500)

    return () => clearTimeout(initTimeout)
  }, [])

  useEffect(() => {
    // Wait for initialization to complete before checking
    if (isInitializing) {
      return
    }
    // Define routes that require wallet connection
    const protectedRoutes = [
      "/dashboard",
      "/deposit",
      "/withdraw", 
      "/history",
      "/pools",
      "/bonds",
      "/forecast",
      "/profile",
      "/vaults"
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

    const isAuthenticated = isConnected && !!address

    // Redirect if on protected route without authentication (but not on public routes)
    if (isProtectedRoute && !isPublicRoute && !isAuthenticated) {
      // Short delay since we already waited during initialization
      const timeoutId = setTimeout(() => {
        router.push("/")
      }, 100)
      
      return () => clearTimeout(timeoutId)
    }
  }, [isConnected, address, pathname, router, isInitializing])

  return {
    address,
    isAuthenticated: isConnected && !!address,
    isProtectedRoute: pathname !== "/" && !pathname.startsWith("/#")
  }
} 