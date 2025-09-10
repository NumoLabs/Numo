"use client"

import { useState, useEffect, useCallback } from "react"
import { getVesuMarkets, getVesuMarketsByToken, getBestVesuMarket, getVesuMarketsByPool } from "@/app/api/vesuMarketsApi"
import type { VesuMarket, ProcessedMarket } from "@/types/VesuMarkets"

export interface VesuMarketsState {
  markets: VesuMarket[]
  processedMarkets: ProcessedMarket[]
  isLoading: boolean
  error: string | null
  bestMarket: ProcessedMarket | null
}

export function useVesuMarkets(token?: string) {
  const [state, setState] = useState<VesuMarketsState>({
    markets: [],
    processedMarkets: [],
    isLoading: true,
    error: null,
    bestMarket: null
  })

  const loadMarkets = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      const markets = await getVesuMarkets()
      let processedMarkets: ProcessedMarket[] = []
      let bestMarket: ProcessedMarket | null = null

      if (token) {
        processedMarkets = await getVesuMarketsByToken(token)
        bestMarket = await getBestVesuMarket(token)
      } else {
        // Process all markets if no token specified
        processedMarkets = markets.map(market => {
          const { processVesuMarket } = require('@/app/api/vesuMarketsApi')
          return processVesuMarket(market)
        })
      }
      
      setState({
        markets,
        processedMarkets,
        isLoading: false,
        error: null,
        bestMarket
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load markets'
      }))
    }
  }, [token])

  const refreshMarkets = useCallback(() => {
    loadMarkets()
  }, [loadMarkets])

  const getMarketsByPool = useCallback(async (poolId: string) => {
    try {
      return await getVesuMarketsByPool(poolId)
    } catch (error) {
      console.error('Failed to load markets by pool:', error)
      return []
    }
  }, [])

  useEffect(() => {
    loadMarkets()
  }, [loadMarkets])

  return {
    ...state,
    refreshMarkets,
    getMarketsByPool
  }
}
