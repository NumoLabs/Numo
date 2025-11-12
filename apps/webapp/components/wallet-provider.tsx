"use client"

import React, { useMemo } from 'react'
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core'
import { WalletContext } from '@/hooks/use-wallet'

interface WalletProviderProps {
  children: React.ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  // Centralized wallet hooks - only executed once here
  const { address, isConnected } = useAccount()
  const { connect, connectors, status: connectStatus } = useConnect()
  const { disconnect, status: disconnectStatus } = useDisconnect()

  const contextValue = useMemo(() => ({
    address,
    isConnected: isConnected ?? false,
    connect,
    disconnect,
    connectors,
    isConnecting: connectStatus === 'pending',
    isDisconnecting: disconnectStatus === 'pending',
  }), [
    address,
    isConnected,
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