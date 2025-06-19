"use client"
import { PerformanceIndicators } from "./metrics"
import { DashboardTabs } from "./charts"
import { AdvancedFeatures } from "./advanced-features"

export function DashboardContent() {
  return (
    <>
      {/* Performance Indicators */}
      <PerformanceIndicators />

      {/* Dashboard Tabs with Overview, Analytics, Transactions */}
      <DashboardTabs />

      {/* Advanced Features */}
      <div className="mt-8">
        <AdvancedFeatures />
      </div>
    </>
  )
}
