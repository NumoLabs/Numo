import { useEffect } from "react"
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

  useEffect(() => {
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
      // Small delay to prevent flash and ensure clean redirect
      const timeoutId = setTimeout(() => {
        router.push("/")
      }, 100)
      
      return () => clearTimeout(timeoutId)
    }
  }, [isConnected, address, pathname, router])

  return {
    address,
    isAuthenticated: isConnected && !!address,
    isProtectedRoute: pathname !== "/" && !pathname.startsWith("/#")
  }
} 