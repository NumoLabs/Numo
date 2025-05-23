'use client'
import React from 'react'
import WalletConnector from '@/components/ui/connectWallet'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Numo
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Bitcoin Pools. Powered by Numo.
        </p>
        <div className="flex justify-center">
          <WalletConnector />
        </div>
      </div>
    </main>
  )
}
