"use client"

import React, { useMemo, useEffect, useRef } from 'react'
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core'
import { WalletContext } from '@/hooks/use-wallet'

interface WalletProviderProps {
  children: React.ReactNode
}

const WALLET_STORAGE_KEY = 'starknet_wallet_connection'

export function WalletProvider({ children }: WalletProviderProps) {
  // Centralized wallet hooks - only executed once here
  const { address, isConnected } = useAccount()
  const { connect, connectors, status: connectStatus } = useConnect()
  const { disconnect, status: disconnectStatus } = useDisconnect()
  const hasAttemptedReconnect = useRef(false)
  const isInitialMount = useRef(true)

  // Persist wallet connection state to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (isConnected && address) {
      let connectorId: string | undefined
      
      try {
        const stored = localStorage.getItem('starknet_last_connector')
        if (stored) {
          connectorId = stored
        }
      } catch {
        // Ignore errors reading internal storage
      }
      
      // If no connectorId found, use first available connector
      if (!connectorId) {
        const availableConnector = connectors.find(c => {
          try {
            return c.available()
          } catch {
            return false
          }
        })
        connectorId = availableConnector?.id || connectors[0]?.id
      }
      
      if (connectorId) {
        localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify({
          address,
          connectorId,
          timestamp: Date.now()
        }))
      }
      // Mark that we're not in initial mount anymore
      isInitialMount.current = false
    }
    // Don't remove localStorage here - let explicit disconnect handle it
  }, [isConnected, address, connectors])

  // Restore wallet connection on mount (persistence)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isConnected) {
      // Reset flag if already connected (in case user manually connected)
      hasAttemptedReconnect.current = false
      isInitialMount.current = false
      return
    }
    if (connectStatus === 'pending') return // Connection in progress
    if (!connectors || connectors.length === 0) return // Connectors not ready yet

    // Only attempt once per session
    if (hasAttemptedReconnect.current) return

    const attemptReconnect = async () => {
      hasAttemptedReconnect.current = true

      try {
        const savedConnection = localStorage.getItem(WALLET_STORAGE_KEY)
        if (!savedConnection) {
          isInitialMount.current = false
          return
        }

        const { connectorId, address: savedAddress } = JSON.parse(savedConnection)
        if (!connectorId || !savedAddress) {
          // Clear invalid data
          localStorage.removeItem(WALLET_STORAGE_KEY)
          isInitialMount.current = false
          return
        }

        // Find the connector that was previously used
        const connector = connectors.find(c => c.id === connectorId)
        if (!connector) {
          // Connector no longer available, clear storage
          localStorage.removeItem(WALLET_STORAGE_KEY)
          isInitialMount.current = false
          return
        }

        // Check if the wallet extension is available
        if (!connector.available()) {
          // Wallet extension not available, but keep storage in case user installs it later
          isInitialMount.current = false
          return
        }

        // Silently reconnect without showing popups
        await connect({ connector })
        isInitialMount.current = false
      } catch (error) {
        console.error('Error restoring wallet connection:', error)
        // Don't clear storage on error - user might want to retry
        isInitialMount.current = false
      }
    }

    // Small delay to ensure connectors are fully initialized
    const timeoutId = setTimeout(attemptReconnect, 200)
    
    return () => clearTimeout(timeoutId)
  }, [isConnected, connectStatus, connectors, connect])

  // Handle explicit disconnect - clear storage
  useEffect(() => {
    if (disconnectStatus === 'success' || disconnectStatus === 'error') {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(WALLET_STORAGE_KEY)
        hasAttemptedReconnect.current = false
        isInitialMount.current = false
      }
    }
  }, [disconnectStatus])

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