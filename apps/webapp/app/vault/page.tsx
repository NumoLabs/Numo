"use client"

import type React from "react"
import { useState } from "react"
import { VaultContent } from "@/components/vault/vault-content"

export default function VaultPage() {
  const [selectedVaultId, setSelectedVaultId] = useState<string | undefined>()
  const [userAddress] = useState<string | undefined>("0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4") // Mock user address

  const handleVaultSelect = (vaultId: string) => {
    setSelectedVaultId(vaultId)
  }

  const handleBack = () => {
    setSelectedVaultId(undefined)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {selectedVaultId && (
          <div className="mb-6">
            <button
              onClick={handleBack}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Vaults
            </button>
          </div>
        )}
        
        <VaultContent
          selectedVaultId={selectedVaultId}
          userAddress={userAddress}
          onVaultSelect={handleVaultSelect}
        />
      </div>
    </div>
  )
}
