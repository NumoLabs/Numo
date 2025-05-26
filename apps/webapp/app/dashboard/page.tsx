import { Header } from "@/components/ui/header"
import { HeroSection } from "@/components/dashboard/hero-section"
import { PerformanceIndicators } from "@/components/dashboard/performance-indicators"
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs"
import { AdvancedFeatures } from "@/components/dashboard/advanced-features"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <Header />
      <main className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {/* Hero Section */}
        <HeroSection />

        {/* Performance Indicators */}
        <PerformanceIndicators />

        {/* Main Dashboard Content */}
        <DashboardTabs />

        {/* Advanced Features Section */}
        <AdvancedFeatures />
      </main>
    </div>
  )
}
