import { DashboardLayout } from "@/components/dashboard/layout"
import { CavosAuthGuard } from "@/components/auth"

export default function ProfilePage() {
  return (
    <CavosAuthGuard>
      <DashboardLayout />
    </CavosAuthGuard>
  )
}

