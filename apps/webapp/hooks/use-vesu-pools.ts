"use client"

import { useState, useEffect, useCallback } from "react"
import { getVesuPools, getBestVesuPool } from "@/app/api/vesuApi"
import type { VesuPool } from "@/types/VesuPools"

export interface VesuPoolsState {
  pools: VesuPool[]
  isLoading: boolean
  error: string | null
  bestPool: VesuPool | null
}

export function useVesuPools() {
  const [state, setState] = useState<VesuPoolsState>({
    pools: [],
    isLoading: true,
    error: null,
    bestPool: null
  })

  const loadPools = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const pools = await getVesuPools()
      const bestPool = await getBestVesuPool('WBTC')
      
      setState({
        pools,
        isLoading: false,
        error: null,
        bestPool
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load pools'
      }))
    }
  }, [])

  const refreshPools = useCallback(() => {
    loadPools()
  }, [loadPools])

  useEffect(() => {
    loadPools()
  }, [loadPools])

  return {
    ...state,
    refreshPools
  }
}
