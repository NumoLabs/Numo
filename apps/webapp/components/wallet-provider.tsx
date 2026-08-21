"use client"

import type React from 'react'
import { useMemo, useEffect, useRef, useCallback } from 'react'
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core'
import { WalletContext } from '@/hooks/use-wallet'
import { useWalletSession } from '@/hooks/use-wallet-session'

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

  // Prompts for a signature once per connected wallet and establishes the
  // server session. The user row is created by /api/auth/login, after the
  // signature is verified — previously a plain GET with a spoofable header
  // created it, so anyone could seed rows for wallets they did not own.
  const session = useWalletSession()
  const { signOut } = session
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (isConnected) {
      // Reset flag if already connected (in case user manually connected)
      hasAttemptedReconnect.current = false
      isInitialMount.current = false
      return
    }

    if (!isInitialMount.current && !isConnected && !address) {
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
        for (const key of keysToRemove) localStorage.removeItem(key)
        
        hasAttemptedReconnect.current = false
      } catch (error) {
        console.warn('Error clearing localStorage on disconnect:', error)
      }
    }
    
    // Mark initial mount as complete after a short delay to allow auto-reconnect
    const timeoutId = setTimeout(() => {
      isInitialMount.current = false
    }, 2000) // Give auto-reconnect 2 seconds to work
    
    return () => clearTimeout(timeoutId)
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
          for (const key of keysToRemove) localStorage.removeItem(key)
        } catch (error) {
          console.warn('Error clearing localStorage on disconnect:', error)
        }
        
        hasAttemptedReconnect.current = false
        isInitialMount.current = false
      }
    }
  }, [disconnectStatus])


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
        for (const key of keysToRemove) localStorage.removeItem(key)
      } catch (error) {
        console.warn('Error clearing localStorage before disconnect:', error)
      }
    }
    
    // Reset flags
    hasAttemptedReconnect.current = false

    // Drop the server session too, otherwise the cookie outlives the wallet
    // connection and the next visitor on this browser inherits it.
    await signOut()

    // Now disconnect
    await disconnect()
  }, [disconnect, signOut])

  const contextValue = useMemo(() => ({
    address,
    isConnected: isConnected ?? false,
    connect,
    disconnect: handleDisconnect,
    connectors,
    isConnecting: connectStatus === 'pending',
    isDisconnecting: disconnectStatus === 'pending',
    isAuthenticated: session.isAuthenticated,
    sessionStatus: session.status,
    sessionError: session.error,
    signIn: session.signIn,
  }), [
    address,
    isConnected,
    connect,
    handleDisconnect,
    connectors,
    connectStatus,
    disconnectStatus,
    session.isAuthenticated,
    session.status,
    session.error,
    session.signIn
  ])

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  )
} 