"use client"

import { useState, useEffect, useCallback } from "react"
import { getRealVesuVaults, getRealVesuVault, getRecommendedVesuVault } from "@/app/api/vesuVaultsApi"
import type { VaultStrategy } from "@/types/Vault"

export interface VesuVaultsState {
  vaults: VaultStrategy[]
  isLoading: boolean
  error: string | null
  recommendedVault: VaultStrategy | null
}

export function useVesuVaults() {
  const [state, setState] = useState<VesuVaultsState>({
    vaults: [],
    isLoading: true,
    error: null,
    recommendedVault: null
  })

  const loadVaults = useCallback(async () => {
    console.log('🔄 Loading vaults...')
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      console.log('📡 Calling getRealVesuVaults...')
      const vaults = await getRealVesuVaults()
      console.log('✅ Vaults loaded:', vaults)
      
      const recommendedVault = vaults.length > 0 ? vaults[0] : null
      console.log('✅ Recommended vault:', recommendedVault)
      
      setState({
        vaults,
        isLoading: false,
        error: null,
        recommendedVault
      })
    } catch (error) {
      console.error('❌ Error loading vaults:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load vaults'
      }))
    }
  }, [])

  const refreshVaults = useCallback(() => {
    loadVaults()
  }, [loadVaults])

  const getVaultById = useCallback(async (vaultId: string) => {
    try {
      return await getRealVesuVault(vaultId)
    } catch (error) {
      console.error('Failed to load vault:', error)
      return null
    }
  }, [])

  const getRecommendedVault = useCallback(async (riskTolerance: 'Low' | 'Medium' | 'High' = 'Medium') => {
    try {
      return await getRecommendedVesuVault(riskTolerance)
    } catch (error) {
      console.error('Failed to get recommended vault:', error)
      return null
    }
  }, [])

  useEffect(() => {
    loadVaults()
  }, [loadVaults])

  return {
    ...state,
    refreshVaults,
    getVaultById,
    getRecommendedVault
  }
}
