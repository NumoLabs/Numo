import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { WalletAuthGuard } from "@/components/auth"

export default function LearnPage() {
  return (
    <WalletAuthGuard>
      <DashboardLayout />
    </WalletAuthGuard>
  )
}
