"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { VaultDashboard } from "@/components/vault/vault-dashboard"
import { getVaultStrategy } from "@/lib/vault-data"

export default function VaultDetailPage() {
  const params = useParams()
  const router = useRouter()
  const vaultId = params.vaultId as string
  const [userAddress] = useState<string | undefined>("0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4") // Mock user address

  const handleBack = () => {
    router.push('/vault')
  }

  const handleOpenInNewTab = () => {
    window.open(`/vault/${vaultId}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Vaults
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900">Vault Details</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenInNewTab}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open in New Tab
          </Button>
        </div>

        {/* Vault Dashboard */}
        <VaultDashboard
          vaultId={vaultId}
          userAddress={userAddress}
        />
      </div>
    </div>
  )
}
