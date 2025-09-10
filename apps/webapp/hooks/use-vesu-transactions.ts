"use client"

import { useState, useCallback } from "react"
import { useAccount, useProvider } from "@starknet-react/core"
import { VesuContract, createVesuContract, createDepositParams, createWithdrawParams, getTokenAddress } from "@/lib/vesu-contract"
import { 
  VesuSingletonContract,
  createVesuSingletonContract,
  createDepositParams as createSingletonDepositParams,
  createWithdrawParams as createSingletonWithdrawParams,
  createBorrowParams as createSingletonBorrowParams,
  createRepayParams as createSingletonRepayParams
} from "@/lib/vesu-singleton-contract"
import { useToast } from "@/hooks/use-toast"
import type { VesuPool } from "@/types/VesuPools"

export interface VesuTransactionState {
  isDepositing: boolean
  isWithdrawing: boolean
  isBorrowing: boolean
  isRepaying: boolean
  isApproving: boolean
  isGettingPosition: boolean
  error: string | null
  transactionHash: string | null
}

export interface VesuPosition {
  healthFactor: number
  collateral: string
  debt: string
}

export function useVesuTransactions() {
  const { account } = useAccount()
  const { provider } = useProvider()
  const { toast } = useToast()
  
  const [state, setState] = useState<VesuTransactionState>({
    isDepositing: false,
    isWithdrawing: false,
    isBorrowing: false,
    isRepaying: false,
    isApproving: false,
    isGettingPosition: false,
    error: null,
    transactionHash: null
  })

  const vesuContract = account && provider ? createVesuContract(account, provider) : null
  const vesuSingletonContract = account && provider ? 
    createVesuSingletonContract(account, provider, "0x1234567890abcdef1234567890abcdef12345678") : null // Replace with actual Singleton address

  const deposit = useCallback(async (
    pool: VesuPool,
    amount: string,
    tokenSymbol: string = 'WBTC'
  ) => {
    if (!vesuSingletonContract || !account) {
      throw new Error('Account not connected')
    }

    setState(prev => ({ ...prev, isDepositing: true, error: null }))

    try {
      // Get token address
      const tokenAddress = getTokenAddress(tokenSymbol)
      
      // Convert amount to proper format (WBTC has 8 decimals)
      const amountBigInt = BigInt(Math.floor(parseFloat(amount) * 1e8))
      
      // Create deposit parameters for Singleton
      const depositParams = createSingletonDepositParams(
        pool.poolId || "0x1", // Pool ID
        tokenAddress, // Collateral asset (WBTC)
        tokenAddress, // Debt asset (same as collateral for deposit)
        account.address, // User
        amountBigInt // Amount
      )

      // Execute deposit using Singleton
      const txHash = await vesuSingletonContract.modifyPosition(depositParams)
      
      setState(prev => ({ 
        ...prev, 
        isDepositing: false, 
        transactionHash: txHash 
      }))

      toast({
        title: "Deposit Successful",
        description: `Successfully deposited ${amount} ${tokenSymbol} to ${pool.name}`,
      })

      return txHash
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Deposit failed'
      setState(prev => ({ 
        ...prev, 
        isDepositing: false, 
        error: errorMessage 
      }))
      
      toast({
        title: "Deposit Failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      throw error
    }
  }, [vesuSingletonContract, account, toast])

  const withdraw = useCallback(async (
    pool: VesuPool,
    amount: string,
    tokenSymbol: string = 'WBTC'
  ) => {
    if (!vesuSingletonContract || !account) {
      throw new Error('Account not connected')
    }

    setState(prev => ({ ...prev, isWithdrawing: true, error: null }))

    try {
      // Get token address
      const tokenAddress = getTokenAddress(tokenSymbol)
      
      // Convert amount to proper format (WBTC has 8 decimals)
      const amountBigInt = BigInt(Math.floor(parseFloat(amount) * 1e8))
      
      // Create withdraw parameters for Singleton
      const withdrawParams = createSingletonWithdrawParams(
        pool.poolId || "0x1", // Pool ID
        tokenAddress, // Collateral asset (WBTC)
        tokenAddress, // Debt asset (same as collateral for withdraw)
        account.address, // User
        amountBigInt // Amount
      )

      // Execute withdrawal using Singleton
      const txHash = await vesuSingletonContract.modifyPosition(withdrawParams)
      
      setState(prev => ({ 
        ...prev, 
        isWithdrawing: false, 
        transactionHash: txHash 
      }))

      toast({
        title: "Withdrawal Successful",
        description: `Successfully withdrew ${amount} ${tokenSymbol} from ${pool.name}`,
      })

      return txHash
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Withdrawal failed'
      setState(prev => ({ 
        ...prev, 
        isWithdrawing: false, 
        error: errorMessage 
      }))
      
      toast({
        title: "Withdrawal Failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      throw error
    }
  }, [vesuSingletonContract, account, toast])

  const borrow = useCallback(async (
    pool: VesuPool,
    amount: string,
    tokenSymbol: string = 'WBTC'
  ) => {
    if (!vesuSingletonContract || !account) {
      throw new Error('Account not connected')
    }

    setState(prev => ({ ...prev, isBorrowing: true, error: null }))

    try {
      // Get token address
      const tokenAddress = getTokenAddress(tokenSymbol)
      
      // Convert amount to proper format (WBTC has 8 decimals)
      const amountBigInt = BigInt(Math.floor(parseFloat(amount) * 1e8))
      
      // Create borrow parameters for Singleton
      const borrowParams = createSingletonBorrowParams(
        pool.poolId || "0x1", // Pool ID
        tokenAddress, // Collateral asset (WBTC)
        tokenAddress, // Debt asset (WBTC)
        account.address, // User
        amountBigInt // Amount
      )

      // Execute borrow using Singleton
      const txHash = await vesuSingletonContract.modifyPosition(borrowParams)
      
      setState(prev => ({ 
        ...prev, 
        isBorrowing: false, 
        transactionHash: txHash 
      }))

      toast({
        title: "Borrow Successful",
        description: `Successfully borrowed ${amount} ${tokenSymbol} from ${pool.name}`,
      })

      return txHash
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Borrow failed'
      setState(prev => ({ 
        ...prev, 
        isBorrowing: false, 
        error: errorMessage 
      }))
      
      toast({
        title: "Borrow Failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      throw error
    }
  }, [vesuSingletonContract, account, toast])

  const repay = useCallback(async (
    pool: VesuPool,
    amount: string,
    tokenSymbol: string = 'WBTC'
  ) => {
    if (!vesuSingletonContract || !account) {
      throw new Error('Account not connected')
    }

    setState(prev => ({ ...prev, isRepaying: true, error: null }))

    try {
      // Get token address
      const tokenAddress = getTokenAddress(tokenSymbol)
      
      // Convert amount to proper format (WBTC has 8 decimals)
      const amountBigInt = BigInt(Math.floor(parseFloat(amount) * 1e8))
      
      // Create repay parameters for Singleton
      const repayParams = createSingletonRepayParams(
        pool.poolId || "0x1", // Pool ID
        tokenAddress, // Collateral asset (WBTC)
        tokenAddress, // Debt asset (WBTC)
        account.address, // User
        amountBigInt // Amount
      )

      // Execute repay using Singleton
      const txHash = await vesuSingletonContract.modifyPosition(repayParams)
      
      setState(prev => ({ 
        ...prev, 
        isRepaying: false, 
        transactionHash: txHash 
      }))

      toast({
        title: "Repay Successful",
        description: `Successfully repaid ${amount} ${tokenSymbol} to ${pool.name}`,
      })

      return txHash
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Repay failed'
      setState(prev => ({ 
        ...prev, 
        isRepaying: false, 
        error: errorMessage 
      }))
      
      toast({
        title: "Repay Failed",
        description: errorMessage,
        variant: "destructive"
      })
      
      throw error
    }
  }, [vesuSingletonContract, account, toast])

  const getPosition = useCallback(async (
    pool: VesuPool,
    userAddress: string
  ): Promise<VesuPosition | null> => {
    if (!vesuSingletonContract) {
      throw new Error('Contract not initialized')
    }

    setState(prev => ({ ...prev, isGettingPosition: true, error: null }))

    try {
      const tokenAddress = getTokenAddress('WBTC')
      const positionInfo = await vesuSingletonContract.getPosition(
        pool.poolId || "0x1", // Pool ID
        tokenAddress, // Collateral asset
        tokenAddress, // Debt asset
        userAddress
      )

      // Convert from 8 decimals to display format
      const collateral = (Number(positionInfo.collateral) / 1e8).toString()
      const debt = (Number(positionInfo.debt) / 1e8).toString()

      // Calculate health factor (simplified)
      const collateralValue = parseFloat(collateral)
      const debtValue = parseFloat(debt)
      const healthFactor = debtValue > 0 ? (collateralValue / debtValue) * 100 : 100

      setState(prev => ({ ...prev, isGettingPosition: false }))

      return {
        healthFactor,
        collateral,
        debt
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get position'
      setState(prev => ({ 
        ...prev, 
        isGettingPosition: false, 
        error: errorMessage 
      }))
      
      throw error
    }
  }, [vesuSingletonContract])

  const getTokenBalance = useCallback(async (
    tokenSymbol: string,
    userAddress: string
  ): Promise<string> => {
    if (!vesuContract) {
      throw new Error('Contract not initialized')
    }

    try {
      const tokenAddress = getTokenAddress(tokenSymbol)
      const balance = await vesuContract.getTokenBalance(tokenAddress, userAddress)
      return await vesuContract.parseTokenAmount(tokenAddress, balance)
    } catch (error) {
      console.error('Failed to get token balance:', error)
      throw error
    }
  }, [vesuContract])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  const clearTransactionHash = useCallback(() => {
    setState(prev => ({ ...prev, transactionHash: null }))
  }, [])

  return {
    ...state,
    deposit,
    withdraw,
    borrow,
    repay,
    getPosition,
    getTokenBalance,
    clearError,
    clearTransactionHash,
    isConnected: !!account && !!provider
  }
}
