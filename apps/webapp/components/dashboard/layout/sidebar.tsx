"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import {
  LayoutDashboard,
  Upload,
  Download,
  History,
  Target,
  Coins,
  TrendingUp,
  BookOpen,
  Settings,
  X,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, current: true },
  { name: "Deposit", href: "/deposit", icon: Upload, current: false },
  { name: "Withdraw", href: "/withdraw", icon: Download, current: false },
  { name: "History", href: "/history", icon: History, current: false },
  { name: "Custom Pools", href: "/pools", icon: Target, current: false },
  { name: "Bonds", href: "/bonds", icon: Coins, current: false },
  { name: "Forecast", href: "/forecast", icon: TrendingUp, current: false },
  { name: "Marketplace", href: "/marketplace", icon: BarChart3, current: false },
  { name: "Learn DeFi", href: "/learn", icon: BookOpen, current: false },
  { name: "Settings", href: "/settings", icon: Settings, current: false },
]

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-xl">
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
            <Link href="/" className="flex items-center group">
              <Image
                src="/numo-logo.png"
                alt="Numo Logo"
                width={32}
                height={32}
                className="h-8 w-8 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="ml-0 text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                umo
              </span>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="mt-6 px-3">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    pathname === item.href
                      ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-700 dark:text-cyan-300 border-r-2 border-cyan-500"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white",
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 transition-colors",
                      pathname === item.href ? "text-cyan-600" : "text-gray-400 group-hover:text-gray-600",
                    )}
                  />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 shadow-xl">
          <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200/50 dark:border-gray-800/50">
            <Link href="/" className="flex items-center group">
              <Image
                src="/numo-logo.png"
                alt="Numo Logo"
                width={44}
                height={44}
                className="h-11 w-11 transition-transform duration-300 group-hover:scale-110 animate-logo-bounce"
              />
              <span className="ml-0 text-2xl font-bold text-black dark:text-white">umo</span>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col px-4">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-2">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group relative flex gap-x-3 rounded-2xl px-4 py-4 text-sm font-semibold leading-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:-translate-y-0.5",
                          pathname === item.href
                            ? "bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-purple-500/15 text-cyan-700 dark:text-cyan-300 shadow-xl border border-cyan-200/50 dark:border-cyan-800/50 backdrop-blur-sm"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50/80 hover:via-gray-100/60 hover:to-gray-50/80 dark:hover:from-gray-800/80 dark:hover:via-gray-700/60 dark:hover:to-gray-800/80 hover:text-gray-900 dark:hover:text-white hover:shadow-md",
                        )}
                      >
                        {/* Background glow effect for active item */}
                        {pathname === item.href && (
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 blur-sm" />
                        )}

                        {/* Icon container with background */}
                        <div
                          className={cn(
                            "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
                            pathname === item.href
                              ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-110"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-gradient-to-br group-hover:from-cyan-400 group-hover:to-blue-500 group-hover:text-white group-hover:scale-105 group-hover:shadow-md",
                          )}
                        >
                          <item.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                        </div>

                        <span className="relative z-10 transition-all duration-300 group-hover:translate-x-1">
                          {item.name}
                        </span>

                        {/* Active indicator */}
                        {pathname === item.href && (
                          <>
                            <div className="ml-auto h-2 w-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse shadow-sm" />
                            <div className="absolute right-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-l-full bg-gradient-to-b from-cyan-500 to-blue-600 shadow-lg" />
                          </>
                        )}

                        {/* Hover effect line */}
                        <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
