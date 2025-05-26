"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import WalletConnector from "@/components/ui/connectWallet"
import { cn } from "@/lib/utils"

interface HeaderProps {
  variant?: "auto" | "landing" | "dashboard"
}

export function Header({ variant = "auto" }: HeaderProps) {
  const pathname = usePathname()

  // Auto-detect variant based on pathname
  const getVariant = () => {
    if (variant !== "auto") return variant
    return pathname === "/" ? "landing" : "dashboard"
  }

  const currentVariant = getVariant()

  if (currentVariant === "landing") {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">Numo</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#stats" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Statistics
            </Link>
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#strategies" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Strategies
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <WalletConnector />
          </div>
        </div>
      </header>
    )
  }

  // Dashboard variant
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
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
                  <span>Numo</span>
                </Link>
                <Link 
                  href="/dashboard" 
                  className={cn(
                    "hover:text-foreground",
                    pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/deposit" 
                  className={cn(
                    "hover:text-foreground",
                    pathname === "/deposit" ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  Deposit
                </Link>
                <Link 
                  href="/withdraw" 
                  className={cn(
                    "hover:text-foreground",
                    pathname === "/withdraw" ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  Withdraw
                </Link>
                <Link 
                  href="/history" 
                  className={cn(
                    "hover:text-foreground",
                    pathname === "/history" ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  History
                </Link>
                <Link 
                  href="/pools" 
                  className={cn(
                    "hover:text-foreground",
                    pathname === "/pools" ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  Custom Pools
                </Link>
                <Link 
                  href="/learn" 
                  className={cn(
                    "hover:text-foreground",
                    pathname === "/learn" ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  Learn DeFi
                </Link>
                <Link 
                  href="/settings" 
                  className={cn(
                    "hover:text-foreground",
                    pathname === "/settings" ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <span className="hidden md:inline">Numo</span>
          </Link>
          <nav className="hidden md:flex gap-6 ml-6">
            <Link 
              href="/dashboard" 
              className={cn(
                "text-sm font-medium",
                pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Dashboard
            </Link>
            <Link 
              href="/deposit" 
              className={cn(
                "text-sm font-medium",
                pathname === "/deposit" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Deposit
            </Link>
            <Link 
              href="/withdraw" 
              className={cn(
                "text-sm font-medium",
                pathname === "/withdraw" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Withdraw
            </Link>
            <Link 
              href="/history" 
              className={cn(
                "text-sm font-medium",
                pathname === "/history" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              History
            </Link>
            <Link 
              href="/pools" 
              className={cn(
                "text-sm font-medium",
                pathname === "/pools" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Pools
            </Link>
            <Link 
              href="/learn" 
              className={cn(
                "text-sm font-medium",
                pathname === "/learn" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Learn
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <WalletConnector />
        </div>
      </div>
    </header>
  )
}
