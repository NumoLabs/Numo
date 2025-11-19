import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { WalletAuthGuard } from "@/components/auth"

export const dynamic = 'force-dynamic'

export default function PoolsVaultPage() {
  return (
    <WalletAuthGuard>
      <DashboardLayout />
    </WalletAuthGuard>
  )
} 