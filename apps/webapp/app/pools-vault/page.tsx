import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { CavosAuthGuard } from "@/components/auth"

export default function PoolsVaultPage() {
  return (
    <CavosAuthGuard>
      <DashboardLayout />
    </CavosAuthGuard>
  )
} 