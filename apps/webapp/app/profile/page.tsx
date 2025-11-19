import { DashboardLayout } from "@/components/dashboard/layout"
import { WalletAuthGuard } from "@/components/auth"

export default function ProfilePage() {
  return (
    <WalletAuthGuard>
      <DashboardLayout />
    </WalletAuthGuard>
  )
}

