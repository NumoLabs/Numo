import { DashboardLayout } from "@/components/dashboard/layout"
import { CavosAuthGuard } from "@/components/auth"

export default function DashboardPage() {
  return (
    <CavosAuthGuard>
      <DashboardLayout />
    </CavosAuthGuard>
  )
}
