"use client"

import React, { useMemo } from 'react'
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core'
import { WalletContext } from '@/hooks/use-wallet'

interface WalletProviderProps {
  children: React.ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  // Centralized wallet hooks - only executed once here
  const { address, status } = useAccount()
  const { connect, connectors, status: connectStatus } = useConnect()
  const { disconnect, status: disconnectStatus } = useDisconnect()

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    address,
    connect,
    disconnect,
    connectors,
    isConnecting: connectStatus === 'pending',
    isDisconnecting: disconnectStatus === 'pending',
  }), [
    address,
    connect,
    disconnect,
    connectors,
    connectStatus,
    disconnectStatus
  ])

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  )
} 