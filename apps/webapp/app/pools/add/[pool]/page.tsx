"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { WalletAuthGuard } from "@/components/auth"

export default function AddPoolToVaultPage() {
  const router = useRouter()

  // Redirect to pools page - custom vaults feature not yet available
  useEffect(() => {
    router.replace("/pools")
  }, [router])

  return (
    <WalletAuthGuard>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting...</p>
      </div>
      </div>
    </WalletAuthGuard>
  )
}
