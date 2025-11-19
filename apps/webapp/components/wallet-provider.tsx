"use client"

import React, { useMemo, useEffect, useRef, useCallback } from 'react'
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
  const hasCreatedUser = useRef(false)

  // Create user in database when wallet connects
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!isConnected || !address) return
    if (hasCreatedUser.current) return // Only create once per connection

    const createUserProfile = async () => {
      try {
        // Silently create user profile by calling the profile API
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-wallet-address': address,
            'x-wallet-network': 'mainnet', // Default to mainnet, can be updated later
          },
        })

        if (response.ok) {
          hasCreatedUser.current = true
          // User created or already exists - no need to show anything
        } else {
          // Log error but don't show to user (silent failure)
          console.warn('Failed to create user profile:', await response.text().catch(() => 'Unknown error'))
        }
      } catch (error) {
        // Silent error - don't interrupt user experience
        console.warn('Error creating user profile:', error)
      }
    }

    // Small delay to avoid race conditions
    const timeoutId = setTimeout(createUserProfile, 500)
    
    return () => clearTimeout(timeoutId)
  }, [isConnected, address])
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (isConnected) {
      // Reset flag if already connected (in case user manually connected)
      hasAttemptedReconnect.current = false
      isInitialMount.current = false
      return
    }

    if (!isConnected && !address) {
      try {
        localStorage.removeItem(WALLET_STORAGE_KEY)
        localStorage.removeItem('starknet_last_connector')
        localStorage.removeItem('walletStarknetkitLatest')
        // Clear any other potential storage keys
        const keysToRemove: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && (
            key.includes('starknet') || 
            key.includes('wallet') ||
            key.includes('connector')
          )) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key))
        
        hasAttemptedReconnect.current = false
        hasCreatedUser.current = false
      } catch (error) {
        console.warn('Error clearing localStorage on disconnect:', error)
      }
    }
    
    isInitialMount.current = false
  }, [isConnected, address])

  useEffect(() => {
    if (disconnectStatus === 'success' || disconnectStatus === 'error') {
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(WALLET_STORAGE_KEY)
          localStorage.removeItem('starknet_last_connector')
          localStorage.removeItem('walletStarknetkitLatest')
          
          // Clear any other potential storage keys
          const keysToRemove: string[] = []
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && (
              key.includes('starknet') || 
              key.includes('wallet') ||
              key.includes('connector')
            )) {
              keysToRemove.push(key)
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key))
        } catch (error) {
          console.warn('Error clearing localStorage on disconnect:', error)
        }
        
        hasAttemptedReconnect.current = false
        isInitialMount.current = false
        hasCreatedUser.current = false // Reset so user can be created again on reconnect
      }
    }
  }, [disconnectStatus])

  // Clear any stored connection data on mount to force modal selection
  useEffect(() => {
    if (typeof window === 'undefined') return
    // Only run once on initial mount
    if (isInitialMount.current === false) return
    
    try {
      localStorage.removeItem('starknet_last_connector')
      // Also clear any starknetkit storage
      localStorage.removeItem('walletStarknetkitLatest')
    } catch (error) {
      // Ignore localStorage errors
      console.warn('Error clearing localStorage:', error)
    }
  }, []) // Only run once on mount

  const handleDisconnect = useCallback(async () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(WALLET_STORAGE_KEY)
        localStorage.removeItem('starknet_last_connector')
        localStorage.removeItem('walletStarknetkitLatest')
        
        // Clear any other potential storage keys
        const keysToRemove: string[] = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && (
            key.includes('starknet') || 
            key.includes('wallet') ||
            key.includes('connector')
          )) {
            keysToRemove.push(key)
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key))
      } catch (error) {
        console.warn('Error clearing localStorage before disconnect:', error)
      }
    }
    
    // Reset flags
    hasAttemptedReconnect.current = false
    hasCreatedUser.current = false
    
    // Now disconnect
    await disconnect()
  }, [disconnect])

  const contextValue = useMemo(() => ({
    address,
    isConnected: isConnected ?? false,
    connect,
    disconnect: handleDisconnect,
    connectors,
    isConnecting: connectStatus === 'pending',
    isDisconnecting: disconnectStatus === 'pending',
  }), [
    address,
    isConnected,
    connect,
    handleDisconnect,
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