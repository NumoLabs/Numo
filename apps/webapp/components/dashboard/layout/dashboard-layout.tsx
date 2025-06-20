"use client"

import { usePathname } from "next/navigation"
import { useState } from "react"
import { Footer } from "@/components/ui/footer"
import { Sidebar } from "./sidebar"
import { TopNavigation } from "./top-navigation"
import { DashboardHero } from "@/components/dashboard/dashboard-hero"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { HistoryContent } from "@/components/history/history-content"
import { PoolsContent } from "@/components/pools/pools-content"
import { CreateVaultContent } from "@/components/pools/create-vault-content"
import { PoolDetailContent } from "@/components/pools/pool-detail-content"
import AddPoolToVaultContent from "@/components/pools/add-pool-to-vault-content"
import { VaultDetailContent } from "@/components/pools/vault-detail-content"
import { VaultDepositContent } from "@/components/pools/vault-deposit-content"
import { BondsContent } from "@/components/bonds/bonds-content"
import { ForecastContent } from "@/components/forecast/forecast-content"
import { MarketplaceContent } from "@/components/marketplace/marketplace-content"
import { LearnContent } from "@/components/learn/learn-content"

export function DashboardLayout() {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    if (pathname === "/") {
      return null // Let the home page handle its own layout
    }
    if (pathname === "/history") {
      return <HistoryContent />
    }
    if (pathname === "/bonds") {
      return <BondsContent />
    }
    if (pathname === "/forecast") {
      return <ForecastContent />
    }
    if (pathname === "/marketplace") {
      return <MarketplaceContent />
    }
    if (pathname === "/learn") {
      return <LearnContent />
    }
    if (pathname === "/pools") {
      return <PoolsContent />
    }
    if (pathname === "/pools/create") {
      return <CreateVaultContent />
    }
    if (pathname.startsWith("/pools/vault/")) {
      return <VaultDetailContent />
    }
    if (pathname.startsWith("/pools/deposit/")) {
      return <VaultDepositContent />
    }
    if (pathname.startsWith("/pools/add/")) {
      return <AddPoolToVaultContent />
    }
    if (
      pathname.startsWith("/pools/") &&
      pathname !== "/pools" &&
      pathname !== "/pools/create" &&
      !pathname.startsWith("/pools/vault/") &&
      !pathname.startsWith("/pools/deposit/")
    ) {
      return <PoolDetailContent />
    }
    if (pathname.startsWith("/pools/")) {
      // Para otras rutas dinámicas de pools, mantenemos el contenido específico
      return null // Esto permitirá que las páginas individuales manejen su propio contenido
    }
    // Dashboard por defecto
    return (
      <>
        <DashboardHero />
        <DashboardContent />
      </>
    )
  }

  const content = renderContent()

  // Si content es null, significa que es una página que maneja su propio layout
  if (content === null) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="lg:pl-72">
        <TopNavigation setSidebarOpen={setSidebarOpen} />

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{content}</div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
