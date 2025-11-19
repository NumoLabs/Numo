import { DashboardLayout } from "@/components/dashboard/layout"
import { WalletAuthGuard } from "@/components/auth"

export default function DashboardPage() {
  return (
    <WalletAuthGuard>
      <DashboardLayout />
    </WalletAuthGuard>
  )
}
