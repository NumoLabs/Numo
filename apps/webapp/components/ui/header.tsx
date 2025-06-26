"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, LayoutDashboard } from "lucide-react"
import { useAccount } from '@starknet-react/core'
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import WalletConnector from "@/components/ui/connectWallet"
import { cn } from "@/lib/utils"

interface HeaderProps {
  variant?: "auto" | "landing" | "dashboard"
}

export function Header({ variant = "auto" }: HeaderProps) {
  const pathname = usePathname()
  const { address } = useAccount()

  // Auto-detect variant based on pathname
  const getVariant = () => {
    if (variant !== "auto") return variant
    return pathname === "/" ? "landing" : "dashboard"
  }

  const currentVariant = getVariant()

  if (currentVariant === "landing") {
    return (
      <header className="sticky top-0 z-50 mx-auto mt-6 max-w-4xl rounded-2xl bg-background/80 border shadow-xl transition-all animate-float animate-header-fadein">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center group cursor-pointer">
              <Image
                src="/numo-logo.png"
                alt="Numo Logo"
                width={40}
                height={40}
                className="h-14 w-14 transition-transform duration-300 group-hover:scale-110 animate-logo-bounce"
              />
              <span className="text-lg font-bold -ml-1 transition-transform duration-300 group-hover:scale-110 animate-logo-bounce">
                umo
              </span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-8 ml-12">
            <Link
              href="#stats"
              className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors after:absolute after:left-0 after:-bottom-1 after:w-0 hover:after:w-full after:h-0.5 after:bg-black after:transition-all after:duration-300"
            >
              Statistics
            </Link>
            <Link
              href="#features"
              className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors after:absolute after:left-0 after:-bottom-1 after:w-0 hover:after:w-full after:h-0.5 after:bg-black after:transition-all after:duration-300"
            >
              Features
            </Link>
            <Link
              href="#strategies"
              className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors after:absolute after:left-0 after:-bottom-1 after:w-0 hover:after:w-full after:h-0.5 after:bg-black after:transition-all after:duration-300"
            >
              Strategies
            </Link>
            <Button
              asChild
              variant="default"
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 hover:from-cyan-400 hover:via-blue-400 hover:to-cyan-400 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-cyan-500/50 hover:shadow-xl hover:shadow-cyan-400/60 focus-visible:shadow-xl transform hover:-translate-y-1 hover:scale-105 focus-visible:-translate-y-1 focus-visible:scale-105"
            >
              <Link href="#waitlist">
                Waitlist
              </Link>
            </Button>
          </nav>
          {/* <div className="flex items-center gap-6 ml-auto pl-12">
            {address && (
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 hover:from-black hover:via-gray-800 hover:to-black text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl focus-visible:shadow-xl transform hover:-translate-y-1 hover:scale-105 focus-visible:-translate-y-1 focus-visible:scale-105 flex items-center gap-2 border border-gray-600 hover:border-gray-500">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            )}
            <WalletConnector />
          </div> */}
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 mx-auto max-w-3xl rounded-2xl bg-background/80 border shadow-xl transition-all animate-float animate-header-fadein">
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
                {address && (
                  <>
                    <Link
                      href="/dashboard"
                      className={cn(
                        "hover:text-foreground",
                        pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/deposit"
                      className={cn(
                        "hover:text-foreground",
                        pathname === "/deposit" ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      Deposit
                    </Link>
                    <Link
                      href="/withdraw"
                      className={cn(
                        "hover:text-foreground",
                        pathname === "/withdraw" ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      Withdraw
                    </Link>
                    <Link
                      href="/history"
                      className={cn(
                        "hover:text-foreground",
                        pathname === "/history" ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      History
                    </Link>
                    <Link
                      href="/pools"
                      className={cn(
                        "hover:text-foreground",
                        pathname === "/pools" ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      Custom Pools
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
                    <Link
                      href="/settings"
                      className={cn(
                        "hover:text-foreground",
                        pathname === "/settings" ? "text-foreground" : "text-muted-foreground",
                      )}
                    >
                      Settings
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
              className="h-14 w-14 transition-transform duration-300 group-hover:scale-110 animate-logo-bounce"
            />
            <span className="text-lg font-bold -ml-1 transition-transform duration-300 group-hover:scale-110 animate-logo-bounce">
              umo
            </span>
          </Link>
          <nav className="hidden md:flex gap-8 ml-10">
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
              href="/deposit"
              className={cn(
                "text-sm font-medium",
                pathname === "/deposit" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              Deposit
            </Link>
            <Link
              href="/withdraw"
              className={cn(
                "text-sm font-medium",
                pathname === "/withdraw" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              Withdraw
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
              href="/pools"
              className={cn(
                "text-sm font-medium",
                pathname === "/pools" ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              Pools
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
        <div className="flex items-center gap-6 ml-auto pl-12">
          <WalletConnector />
        </div>
      </div>
    </header>
  )
}
