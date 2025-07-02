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
      "/marketplace",
      "/learn"
    ]

    // Check if current route is protected
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    )

    // Redirect if on protected route without wallet
    if (isProtectedRoute && !isConnected) {
      // Small delay to prevent flash and ensure clean redirect
      const timeoutId = setTimeout(() => {
        router.push("/")
      }, 100)
      
      return () => clearTimeout(timeoutId)
    }
  }, [isConnected, pathname, router])

  return {
    address,
    isAuthenticated: isConnected,
    isProtectedRoute: pathname !== "/" && !pathname.startsWith("/#")
  }
} 