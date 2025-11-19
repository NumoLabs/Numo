"use client"

import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { WalletAuthGuard } from "@/components/auth"

export default function BondsPage() {
  return (
    <WalletAuthGuard>
      <DashboardLayout />
    </WalletAuthGuard>
  )
}
