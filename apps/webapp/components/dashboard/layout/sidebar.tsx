"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { LayoutDashboard, History, Target, Coins, TrendingUp, BookOpen, X, BarChart3, Wallet, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navigation = [
  {
    section: "Core",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, current: true },
      { name: "History", href: "/history", icon: History, current: false },
    ],
  },
  {
    section: "Trading",
    items: [
      { name: "Custom Pools", href: "/pools", icon: Target, current: false },
      { name: "Bonds", href: "/bonds", icon: Coins, current: false },
      { name: "Deposit", href: "/deposit-test", icon: Wallet, current: false },
      { name: "Pools", href: "/pools-vault", icon: Users, current: false },
    ],
  },
  {
    section: "Analytics",
    items: [
      { name: "Forecast", href: "/forecast", icon: TrendingUp, current: false },
      { name: "Marketplace", href: "/marketplace", icon: BarChart3, current: false },
    ],
  },
  {
    section: "Resources",
    items: [{ name: "Learn DeFi", href: "/learn", icon: BookOpen, current: false }],
  },
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
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-black shadow-xl">
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-800">
            <Link href="/" className="flex items-center group">
              <Image
                src="/numo-logo.png"
                alt="Numo Logo"
                width={32}
                height={32}
                className="h-8 w-8 transition-transform duration-300 group-hover:scale-110 brightness-0 invert"
              />
              <span className="ml-0 text-xl font-bold text-white">
                umo
              </span>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="mt-6 px-3">
            <div className="space-y-6">
              {navigation.map((section) => (
                <div key={section.section}>
                  <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {section.section}
                  </h3>
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                          pathname === item.href || 
                          (item.href === "/pools" && pathname.startsWith("/pools") && !pathname.startsWith("/pools-vault")) ||
                          (item.href === "/pools-vault" && pathname.startsWith("/pools-vault"))
                            ? "bg-gradient-to-r from-orange-500/10 to-yellow-500/10 text-orange-300 border-r-2 border-orange-500"
                            : "text-gray-300 hover:bg-gray-800 hover:text-white",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "mr-3 h-5 w-5 transition-colors",
                            pathname === item.href || 
                            (item.href === "/pools" && pathname.startsWith("/pools") && !pathname.startsWith("/pools-vault")) ||
                            (item.href === "/pools-vault" && pathname.startsWith("/pools-vault"))
                              ? "text-orange-500"
                              : "text-gray-400 group-hover:text-gray-300",
                          )}
                        />
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black border-r border-gray-800/50 shadow-xl">
          <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-800/50">
            <Link href="/" className="flex items-center group">
              <Image
                src="/numo-logo.png"
                alt="Numo Logo"
                width={44}
                height={44}
                className="h-11 w-11 transition-transform duration-300 group-hover:scale-110 animate-logo-bounce brightness-0 invert"
              />
              <span className="ml-0 text-2xl font-bold text-white">umo</span>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col px-4">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              {navigation.map((section) => (
                <li key={section.section}>
                  <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider mb-2">
                    {section.section}
                  </div>
                  <ul role="list" className="-mx-2 space-y-1">
                    {section.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex gap-x-3 rounded-xl px-3 py-3 text-sm font-semibold leading-6 transition-all duration-200 hover:scale-[1.02] hover:shadow-md",
                            pathname === item.href || 
                            (item.href === "/pools" && pathname.startsWith("/pools") && !pathname.startsWith("/pools-vault")) ||
                            (item.href === "/pools-vault" && pathname.startsWith("/pools-vault"))
                              ? "bg-gradient-to-r from-orange-500/10 via-orange-500/10 to-yellow-500/10 text-orange-300 shadow-lg border border-orange-500/50"
                              : "text-gray-300 hover:bg-gradient-to-r hover:from-gray-800/80 hover:to-gray-700/80 hover:text-white",
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-5 w-5 shrink-0 transition-all duration-200",
                                                          pathname === item.href || 
                            (item.href === "/pools" && pathname.startsWith("/pools") && !pathname.startsWith("/pools-vault")) ||
                            (item.href === "/pools-vault" && pathname.startsWith("/pools-vault"))
                              ? "text-orange-500 scale-110"
                              : "text-gray-400 group-hover:text-gray-300 group-hover:scale-105",
                            )}
                          />
                          {item.name}

                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
