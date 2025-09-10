"use client"

import { useState, useCallback, useEffect } from "react"
import { useAccount, useProvider } from "@starknet-react/core"
import { 
  VesuRebalanceContract, 
  createVesuRebalanceContract, 
  createRebalanceActions,
  createMultipleRebalanceActions,
  type RebalanceAction,
  type PoolProps,
  type VaultSettings,
  type YieldInfo
} from "@/lib/vesu-rebalance-contract"
import { useToast } from "@/hooks/use-toast"

export interface RebalanceStrategy {
  id: string
  name: string
  description: string
  algorithm: 'yield_optimization' | 'weight_balancing' | 'risk_parity' | 'momentum'
  parameters: {
    minYieldImprovement: number // minimum yield improvement required
    maxSlippage: number // maximum acceptable slippage
    rebalanceThreshold: number // threshold for triggering rebalance
    maxPoolWeight: number // maximum weight per pool
  }
}

export interface RebalanceState {
  isRebalancing: boolean
  isComputingYield: boolean
  isGettingPools: boolean
  error: string | null
  transactionHash: string | null
  currentYield: YieldInfo | null
  allowedPools: PoolProps[]
  settings: VaultSettings | null
  lastRebalance: string | null
}

export function useVesuRebalance(contractAddress: string) {
  const { account } = useAccount()
  const { provider } = useProvider()
  const { toast } = useToast()
  
  const [state, setState] = useState<RebalanceState>({
    isRebalancing: false,
    isComputingYield: false,
    isGettingPools: false,
    error: null,
    transactionHash: null,
    currentYield: null,
    allowedPools: [],
    settings: null,
    lastRebalance: null
  })

  const rebalanceContract = account && provider ? 
    createVesuRebalanceContract(account, provider, contractAddress) : null

  // Load initial data
  useEffect(() => {
    if (rebalanceContract) {
      loadInitialData()
    }
  }, [rebalanceContract])

  const loadInitialData = useCallback(async () => {
    if (!rebalanceContract) return

    try {
      // Load pools and settings in parallel
      const [pools, settings, yieldInfo] = await Promise.all([
        rebalanceContract.getAllowedPools(),
        rebalanceContract.getSettings(),
        rebalanceContract.computeYield()
      ])

      setState(prev => ({
        ...prev,
        allowedPools: pools,
        settings,
        currentYield: yieldInfo
      }))
    } catch (error) {
      console.error('Failed to load initial data:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load data'
      }))
    }
  }, [rebalanceContract])

  const computeYield = useCallback(async () => {
    if (!rebalanceContract) return

    setState(prev => ({ ...prev, isComputingYield: true, error: null }))

    try {
      const yieldInfo = await rebalanceContract.computeYield()
      setState(prev => ({ 
        ...prev, 
        isComputingYield: false, 
        currentYield: yieldInfo 
      }))
      return yieldInfo
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to compute yield'
      setState(prev => ({ 
        ...prev, 
        isComputingYield: false, 
        error: errorMessage 
      }))
      throw error
    }
  }, [rebalanceContract])

  const rebalance = useCallback(async (actions: RebalanceAction[]) => {
    if (!rebalanceContract || !account) {
      throw new Error('Contract not initialized or account not connected')
    }

    setState(prev => ({ ...prev, isRebalancing: true, error: null }))

    try {
      const txHash = await rebalanceContract.rebalance(actions)
      
      setState(prev => ({ 
        ...prev, 
        isRebalancing: false, 
        transactionHash: txHash,
        lastRebalance: new Date().toISOString()
      }))

      toast({
        title: "Rebalancing Successful",
        description: "Vault has been successfully rebalanced to optimize yield",
      })

      // Refresh yield data after rebalancing
      await computeYield()

      return txHash
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Rebalancing failed'
      setState(prev => ({ 
        ...prev, 
        isRebalancing: false, 
        error: errorMessage 
      }))
      
      toast({
        title: "Rebalancing Failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      throw error
    }
  }, [rebalanceContract, account, computeYield, toast])

  const rebalanceWeights = useCallback(async (actions: RebalanceAction[]) => {
    if (!rebalanceContract || !account) {
      throw new Error('Contract not initialized or account not connected')
    }

    setState(prev => ({ ...prev, isRebalancing: true, error: null }))

    try {
      const txHash = await rebalanceContract.rebalanceWeights(actions)
      
      setState(prev => ({ 
        ...prev, 
        isRebalancing: false, 
        transactionHash: txHash,
        lastRebalance: new Date().toISOString()
      }))

      toast({
        title: "Weight Rebalancing Successful",
        description: "Pool weights have been successfully rebalanced",
      })

      return txHash
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Weight rebalancing failed'
      setState(prev => ({ 
        ...prev, 
        isRebalancing: false, 
        error: errorMessage 
      }))
      
      toast({
        title: "Weight Rebalancing Failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      throw error
    }
  }, [rebalanceContract, account, toast])

  const harvest = useCallback(async (
    rewardsContract: string,
    claim: any, // Define proper type based on your Claim struct
    proof: string[],
    swapInfo: any // Define proper type based on your SwapInfo
  ) => {
    if (!rebalanceContract || !account) {
      throw new Error('Contract not initialized or account not connected')
    }

    setState(prev => ({ ...prev, isRebalancing: true, error: null }))

    try {
      const txHash = await rebalanceContract.harvest(rewardsContract, claim, proof, swapInfo)
      
      setState(prev => ({ 
        ...prev, 
        isRebalancing: false, 
        transactionHash: txHash
      }))

      toast({
        title: "Harvest Successful",
        description: "Rewards have been successfully harvested and swapped",
      })

      // Refresh yield data after harvest
      await computeYield()

      return txHash
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Harvest failed'
      setState(prev => ({ 
        ...prev, 
        isRebalancing: false, 
        error: errorMessage 
      }))
      
      toast({
        title: "Harvest Failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      throw error
    }
  }, [rebalanceContract, account, computeYield, toast])

  const emergencyWithdraw = useCallback(async () => {
    if (!rebalanceContract || !account) {
      throw new Error('Contract not initialized or account not connected')
    }

    setState(prev => ({ ...prev, isRebalancing: true, error: null }))

    try {
      const txHash = await rebalanceContract.emergencyWithdraw()
      
      setState(prev => ({ 
        ...prev, 
        isRebalancing: false, 
        transactionHash: txHash
      }))

      toast({
        title: "Emergency Withdraw Successful",
        description: "All funds have been withdrawn from pools",
      })

      return txHash
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Emergency withdraw failed'
      setState(prev => ({ 
        ...prev, 
        isRebalancing: false, 
        error: errorMessage 
      }))
      
      toast({
        title: "Emergency Withdraw Failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      throw error
    }
  }, [rebalanceContract, account, toast])

  // Strategy-based rebalancing
  const executeStrategy = useCallback(async (strategy: RebalanceStrategy) => {
    if (!state.allowedPools.length || !state.currentYield) {
      throw new Error('Pools or yield data not available')
    }

    const actions: RebalanceAction[] = []

    switch (strategy.algorithm) {
      case 'yield_optimization':
        // Find the pool with highest yield and rebalance towards it
        const highestYieldPool = state.allowedPools.reduce((max, pool) => 
          pool.maxWeight > max.maxWeight ? pool : max
        )
        
        // Create actions to move funds to highest yield pool
        actions.push(...createRebalanceActions(
          highestYieldPool.poolId,
          BigInt(1000000), // Example amount - should be calculated based on strategy
          'DEPOSIT'
        ))
        break

      case 'weight_balancing':
        // Rebalance to equal weights across all pools
        const equalWeight = 10000 / state.allowedPools.length // 10000 = 100%
        
        state.allowedPools.forEach(pool => {
          if (pool.maxWeight !== equalWeight) {
            const amount = BigInt(equalWeight * 1000000) // Example calculation
            actions.push(...createRebalanceActions(
              pool.poolId,
              amount,
              pool.maxWeight > equalWeight ? 'WITHDRAW' : 'DEPOSIT'
            ))
          }
        })
        break

      case 'risk_parity':
        // Implement risk parity strategy
        // This would require more complex calculations based on pool risk metrics
        break

      case 'momentum':
        // Implement momentum strategy
        // This would require historical data and trend analysis
        break
    }

    if (actions.length > 0) {
      return await rebalance(actions)
    } else {
      throw new Error('No rebalancing actions generated for this strategy')
    }
  }, [state.allowedPools, state.currentYield, rebalance])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  const clearTransactionHash = useCallback(() => {
    setState(prev => ({ ...prev, transactionHash: null }))
  }, [])

  return {
    ...state,
    rebalance,
    rebalanceWeights,
    harvest,
    emergencyWithdraw,
    executeStrategy,
    computeYield,
    clearError,
    clearTransactionHash,
    isConnected: !!account && !!provider,
    contractAddress
  }
}
