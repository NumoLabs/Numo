"use client"

import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { useWalletAuth } from "@/hooks/use-wallet-auth"

export default function BondsPage() {
  // Use centralized wallet auth to prevent extension activation
  useWalletAuth()
  
  return <DashboardLayout />
}