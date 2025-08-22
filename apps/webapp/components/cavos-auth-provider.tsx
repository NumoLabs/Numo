"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import { useCavosAuth } from '@/hooks/use-cavos-auth'

// Create context for Cavos authentication
const CavosAuthContext = createContext<ReturnType<typeof useCavosAuth> | null>(null)

// Provider component
export function CavosAuthProvider({ children }: { children: ReactNode }) {
  const auth = useCavosAuth()

  return (
    <CavosAuthContext.Provider value={auth}>
      {children}
    </CavosAuthContext.Provider>
  )
}

// Hook to use Cavos authentication context
export function useCavosAuthContext() {
  const context = useContext(CavosAuthContext)
  if (!context) {
    throw new Error('useCavosAuthContext must be used within a CavosAuthProvider')
  }
  return context
}
