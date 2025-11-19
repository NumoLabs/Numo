"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import Image from "next/image"
import { } from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import WalletConnector from "@/components/ui/connectWallet"
import { useWalletStatus } from "@/hooks/use-wallet"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface HeaderProps {
  variant?: "auto" | "landing" | "dashboard"
}

export function Header({ variant = "auto" }: HeaderProps) {
  const pathname = usePathname()
  const { isConnected, address } = useWalletStatus()
  
  const shouldShowDashboard = isConnected && !!address

  const getVariant = () => {
    if (variant !== "auto") return variant
    return pathname === "/" ? "landing" : "dashboard"
  }

  const currentVariant = getVariant()

  if (currentVariant === "landing") {
    return (
      <motion.header 
        className="sticky top-0 z-50 mx-auto mt-6 max-w-4xl rounded-2xl backdrop-blur-xl border border-orange-600/50 shadow-bitcoin transition-all animate-float"
        style={{ backgroundColor: '#000000' }}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.22, 1, 0.36, 1],
          delay: 0.1
        }}
      >
        <div className="container flex h-16 items-center justify-between px-6">
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/" className="flex items-center group cursor-pointer mr-2">
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.68, -0.55, 0.265, 1.55] }}
                whileHover={{ scale: 1.1, rotate: 5, transition: { duration: 0.2 } }}
              >
                <Image
                  src="/numo-logo-blanco.png"
                  alt="Numo Logo"
                  width={40}
                  height={40}
                  className="h-14 w-14 transition-transform duration-300 group-hover:scale-110"
                />
              </motion.div>
              <motion.span 
                className="text-lg font-bold -ml-1 transition-transform duration-300 group-hover:scale-110 text-white"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                umo
              </motion.span>
            </Link>
          </motion.div>
          <nav className="hidden md:flex items-center gap-7 ml-16">
            <Link
              href="#stats"
              className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors after:absolute after:left-0 after:-bottom-1 after:w-0 hover:after:w-full after:h-0.5 after:bg-orange-500 after:transition-all after:duration-300"
            >
              Statistics
            </Link>
            <Link
              href="#features"
              className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors after:absolute after:left-0 after:-bottom-1 after:w-0 hover:after:w-full after:h-0.5 after:bg-orange-500 after:transition-all after:duration-300"
            >
              Features
            </Link>
            <Link
              href="#waitlist"
              className="relative text-sm font-medium text-gray-300 hover:text-white transition-colors after:absolute after:left-0 after:-bottom-1 after:w-0 hover:after:w-full after:h-0.5 after:bg-orange-500 after:transition-all after:duration-300"
            >
              Join
            </Link>
            {shouldShowDashboard ? (
              <Button
                asChild
                variant="default"
                className={cn(
                  "bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500",
                  "hover:from-orange-400 hover:via-orange-500 hover:to-orange-400",
                  "text-white",
                  "px-6 py-1.5",
                  "font-medium",
                  "rounded-lg",
                  "transition-all duration-200",
                  "shadow-lg shadow-orange-500/50",
                  "hover:shadow-xl hover:shadow-orange-400/60",
                  "focus-visible:shadow-xl",
                  "transform",
                  "hover:-translate-y-1 hover:scale-105",
                  "focus-visible:-translate-y-1 focus-visible:scale-105",
                  "ml-4"
                )}
              >
                <Link href="/dashboard">
                  Dashboard
                </Link>
              </Button>
            ) : null}
          </nav>
          <div className={cn(
            "flex items-center gap-6 ml-auto",
            shouldShowDashboard ? "pl-8" : "pl-16"
          )}>
            <WalletConnector />
          </div>
        </div>
      </motion.header>
    )
  }

  return (
    <header className="sticky top-0 z-50 mx-auto max-w-3xl rounded-2xl backdrop-blur-xl border border-orange-500/50 shadow-bitcoin transition-all animate-float" style={{ backgroundColor: '#000000' }}>
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[280px]">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2 text-lg font-bold">
                  <Image src="/numo-logo.png" alt="Numo Logo" width={40} height={40} className="h-14 w-14" />
                  <span>Numo</span>
                </Link>
                {shouldShowDashboard && (
                  <>
                    <Link
                      href="/dashboard"
                      className={cn(
                        "hover:text-foreground transition-colors",
                        pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/bonds"
                      className={cn(
                        "hover:text-foreground",
                        pathname === "/bonds" ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      Bonds
                    </Link>
                    <Link
                      href="/forecast"
                      className={cn(
                        "hover:text-foreground",
                        pathname === "/forecast" ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      Forecast
                    </Link>
                    <Link
                      href="/marketplace"
                      className={cn(
                        "hover:text-foreground",
                        pathname === "/marketplace" ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      Marketplace
                    </Link>
                    <Link
                      href="/learn"
                      className={cn(
                        "hover:text-foreground",
                        pathname === "/learn" ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      Learn DeFi
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center group cursor-pointer">
            <Image
              src="/numo-logo.png"
              alt="Numo Logo"
              width={40}
              height={40}
              className="h-14 w-14 transition-transform duration-300 group-hover:scale-110"
            />
            <span className="text-lg font-bold -ml-1 transition-transform duration-300 group-hover:scale-110 text-white">
              umo
            </span>
          </Link>
          <nav className="hidden md:flex row-gap-4 ml-10">
            <Link
              href="/dashboard"
              className={cn(
                "text-sm font-medium",
                pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/history"
              className={cn(
                "text-sm font-medium",
                pathname === "/history" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              History
            </Link>
            <Link
              href="/bonds"
              className={cn(
                "text-sm font-medium",
                pathname === "/bonds" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              Bonds
            </Link>
            <Link
              href="/forecast"
              className={cn(
                "text-sm font-medium",
                pathname === "/forecast" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              Forecast
            </Link>
            <Link
              href="/marketplace"
              className={cn(
                "text-sm font-medium",
                pathname === "/marketplace" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              Marketplace
            </Link>
            <Link
              href="/learn"
              className={cn(
                "text-sm font-medium",
                pathname === "/learn" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              Learn
            </Link>
          </nav>
        </div>
        {/* WalletConnector removed from dashboard pages - connection is done in landing */}
      </div>
    </header>
  )
}
