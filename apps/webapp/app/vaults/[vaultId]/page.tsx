import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { WalletAuthGuard } from "@/components/auth"

export default function VaultDetailPage() {
  return (
    <WalletAuthGuard>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-white">Loading...</div></div>}>
        <DashboardLayout />
      </Suspense>
    </WalletAuthGuard>
  );
}

