"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { VaultBuilder } from "@/components/vault/vault-builder"
import type { VaultStrategy } from "@/types/Vault"

export default function CreateVaultPage() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  const handleBack = () => {
    router.push('/vault')
  }

  const handleSave = async (vault: VaultStrategy) => {
    setIsCreating(true)
    try {
      // TODO: Implement actual vault creation logic
      console.log('Creating vault:', vault)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to the new vault
      router.push(`/vault/${vault.id}`)
    } catch (error) {
      console.error('Failed to create vault:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <VaultBuilder
          onBack={handleBack}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}
