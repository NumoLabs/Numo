"use client"

import { useState } from "react"
import { Footer } from "@/components/ui/footer"
import { Sidebar } from "./sidebar"
import { TopNavigation } from "./top-navigation"
import { DashboardHero } from "../dashboard-hero"
import { DashboardContent } from "../dashboard-content"

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="lg:pl-72">
        <TopNavigation setSidebarOpen={setSidebarOpen} />

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <DashboardHero />
            <DashboardContent />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}
