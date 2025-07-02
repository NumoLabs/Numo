"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WalletBalanceCard } from "@/components/deposit/wallet-balance-card"
import { VaultInfoCard } from "@/components/deposit/vault-info-card"
import { DepositOptions } from "@/components/deposit/deposit-options"
import { AmountInput } from "@/components/deposit/amount-input"
import { DepositSummary } from "@/components/deposit/deposit-summary"
import { DepositActions } from "@/components/deposit/deposit-actions"
import { useToast } from "@/hooks/use-toast"
import { useWalletAuth } from "@/hooks/use-wallet-auth"
import {
  walletBalance,
  vaultInfo,
  depositOptions,
  calculateDepositEstimate,
  getDepositOptionById,
} from "@/lib/deposit-data"

export default function DepositPage() {
  const { isAuthenticated, isProtectedRoute } = useWalletAuth()
  const [selectedOption, setSelectedOption] = useState("standard")
  const [amount, setAmount] = useState("")
  const [selectedToken, setSelectedToken] = useState<"btc" | "wbtc">("btc")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Show nothing while redirecting to prevent flash of content
  if (isProtectedRoute && !isAuthenticated) {
    return null
  }

  const selectedDepositOption = getDepositOptionById(selectedOption)

  const getMaxAmount = () => {
    return selectedToken === "btc"
      ? Number.parseFloat(walletBalance.btc.replace(" BTC", ""))
      : Number.parseFloat(walletBalance.wbtc.replace(" WBTC", ""))
  }

  const estimate = selectedDepositOption && amount ? calculateDepositEstimate(amount, selectedDepositOption) : null

  const isValidAmount =
    amount &&
    Number.parseFloat(amount) > 0 &&
    Number.parseFloat(amount) <= getMaxAmount() &&
    selectedDepositOption &&
    Number.parseFloat(amount) >= Number.parseFloat(selectedDepositOption.minAmount.replace(/\s(BTC|WBTC)/, ""))

  const handleDeposit = async () => {
    if (!isValidAmount || !selectedDepositOption) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      toast({
        title: "Successful Deposit",
        description: `Your deposit of ${amount} ${selectedToken.toUpperCase()} has been processed successfully.`,
      })

      // Redirect to dashboard
      // router.push('/dashboard')
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem processing your deposit. Please try again.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-950 dark:via-blue-950/30 dark:to-purple-950/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 px-4 py-12 md:px-8">
          <div className="mx-auto max-w-4xl">
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-white hover:bg-white/20 hover:text-white mb-6 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Deposit BTC
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                Start earning returns on your BTC by depositing into our automated vault strategy
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 p-4 md:p-8 pt-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-3" style={{ animation: "fadeInUp 0.6s ease-out" }}>
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2 space-y-6" style={{ animation: "fadeInUp 0.6s ease-out 0.1s both" }}>
              <div className="grid gap-6 md:grid-cols-2">
                <WalletBalanceCard balance={walletBalance} />
                <VaultInfoCard vaultInfo={vaultInfo} />
              </div>

              <DepositOptions
                options={depositOptions}
                selectedOption={selectedOption}
                onSelectOption={setSelectedOption}
              />

              <AmountInput
                amount={amount}
                onAmountChange={setAmount}
                selectedToken={selectedToken}
                onTokenChange={setSelectedToken}
                walletBalance={walletBalance}
              />
            </div>

            {/* Right Column - Summary and Actions */}
            <div className="space-y-6 sticky top-6" style={{ animation: "fadeInUp 0.6s ease-out 0.2s both" }}>
              {estimate && selectedDepositOption && (
                <DepositSummary estimate={estimate} option={selectedDepositOption} selectedToken={selectedToken} />
              )}

              <DepositActions
                isValid={!!isValidAmount}
                isLoading={isLoading}
                selectedToken={selectedToken}
                onDeposit={handleDeposit}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
