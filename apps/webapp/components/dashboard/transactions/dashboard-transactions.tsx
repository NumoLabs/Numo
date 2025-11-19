"use client"

import { useEffect } from "react"
import { Bitcoin, Loader2, AlertCircle } from "lucide-react"
import { useWalletTransactions } from "@/hooks/use-wallet-transactions"

export function DashboardTransactions() {
  const { transactions, isLoading, error } = useWalletTransactions(5)
  
  // Debug logging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('[DashboardTransactions] State:', { 
        transactionsCount: transactions.length, 
        isLoading, 
        error 
      })
    }
  }, [transactions.length, isLoading, error])

  // Format transaction hash for display
  const formatTxHash = (hash: string) => {
    if (!hash) return "N/A"
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
  }

  // Format date relative to now
  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "Unknown date"
    try {
      const date = new Date(timestamp * 1000) // Convert Unix timestamp to milliseconds
      const now = new Date()
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
      
      if (diffInSeconds < 60) return "just now"
      if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
      }
      if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600)
        return `${hours} hour${hours > 1 ? 's' : ''} ago`
      }
      if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400)
        return `${days} day${days > 1 ? 's' : ''} ago`
      }
      if (diffInSeconds < 2592000) {
        const weeks = Math.floor(diffInSeconds / 604800)
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`
      }
      if (diffInSeconds < 31536000) {
        const months = Math.floor(diffInSeconds / 2592000)
        return `${months} month${months > 1 ? 's' : ''} ago`
      }
      const years = Math.floor(diffInSeconds / 31536000)
      return `${years} year${years > 1 ? 's' : ''} ago`
    } catch {
      return "Unknown date"
    }
  }

  // Determine transaction type and icon based on transaction data
  const getTransactionType = (tx: typeof transactions[0]) => {
    // Try to determine type from transaction data
    // This is a simplified version - you might want to parse events/logs for more accuracy
    if (tx.type === "INVOKE") {
      // Could be deposit, withdraw, or other operation
      // For now, we'll show it as a general transaction
      return {
        type: "Transaction",
        icon: Bitcoin,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      }
    }
    
    // Default
    return {
      type: "Transaction",
      icon: Bitcoin,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
        <span className="ml-2 text-gray-400">Loading transactions...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <AlertCircle className="h-6 w-6 text-red-500" />
        <span className="ml-2 text-red-400">{error}</span>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-400">No transactions found</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {transactions.map((tx) => {
        const { type, icon: Icon, color, bgColor } = getTransactionType(tx)
        
        return (
          <div key={tx.hash} className="flex items-center">
            <div className={`mr-4 flex h-9 w-9 items-center justify-center rounded-full ${bgColor}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div className="ml-4 space-y-1 flex-1">
              <p className="text-sm font-medium leading-none text-white">{type}</p>
              <p className="text-sm text-gray-300">
                {formatDate(tx.timestamp)} • Tx: {formatTxHash(tx.hash)}
              </p>
              {tx.to && (
                <p className="text-xs text-gray-400">To: {formatTxHash(tx.to)}</p>
              )}
            </div>
            <div className={`ml-auto font-medium ${
              tx.status === 'ACCEPTED_ON_L2' || tx.status === 'ACCEPTED_ON_L1' 
                ? 'text-green-400' 
                : tx.status === 'REJECTED'
                ? 'text-red-400'
                : 'text-yellow-400'
            }`}>
              {tx.status === 'ACCEPTED_ON_L2' || tx.status === 'ACCEPTED_ON_L1' 
                ? '✓' 
                : tx.status === 'REJECTED'
                ? '✗'
                : '...'}
            </div>
          </div>
        )
      })}
    </div>
  )
}
