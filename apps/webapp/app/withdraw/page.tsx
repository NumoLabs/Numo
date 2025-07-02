"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VaultBalanceCard } from "@/components/withdraw/vault-balance-card"
import { WithdrawOptions } from "@/components/withdraw/withdraw-options"
import { AmountInput } from "@/components/withdraw/amount-input"
import { WithdrawSummary } from "@/components/withdraw/withdraw-summary"
import { WithdrawActions } from "@/components/withdraw/withdraw-actions"
import { useToast } from "@/hooks/use-toast"
import { useWalletAuth } from "@/hooks/use-wallet-auth"
import { vaultBalance, withdrawOptions, calculateWithdrawEstimate, getWithdrawOptionById } from "@/lib/withdraw-data"

export default function WithdrawPage() {
  const router = useRouter()
  const { isAuthenticated, isProtectedRoute } = useWalletAuth()
  const [selectedOption, setSelectedOption] = useState("standard")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Show nothing while redirecting to prevent flash of content
  if (isProtectedRoute && !isAuthenticated) {
    return null
  }

  const selectedWithdrawOption = getWithdrawOptionById(selectedOption)
  const maxAmount = vaultBalance.totalBalance.replace(" BTC", "")

  const estimate = selectedWithdrawOption && amount ? calculateWithdrawEstimate(amount, selectedWithdrawOption) : null

  const isValidAmount =
    amount &&
    Number.parseFloat(amount) > 0 &&
    Number.parseFloat(amount) <= Number.parseFloat(maxAmount) &&
    selectedWithdrawOption &&
    Number.parseFloat(amount) >= Number.parseFloat(selectedWithdrawOption.minAmount.replace(" BTC", ""))

  const handleMaxClick = () => {
    setAmount(maxAmount)
  }

  const handleWithdraw = async () => {
    if (!isValidAmount || !selectedWithdrawOption) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Withdrawal Initiated",
        description: `Your withdrawal of ${amount} BTC has been processed successfully.`,
      })

      // Redirect to history
      router.push("/history")
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "There was a problem processing your withdrawal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
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
                Withdraw BTC
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl">
                Withdraw your funds from the vault at any time with flexible options and transparent fees
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative -mt-8 px-4 md:px-8 pb-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2 space-y-8">
              <div className="animate-slide-up-fade-in">
                <VaultBalanceCard balance={vaultBalance} />
              </div>

              <div className="animate-slide-up-fade-in" style={{ animationDelay: "0.1s" }}>
                <WithdrawOptions
                  options={withdrawOptions}
                  selectedOption={selectedOption}
                  onSelectOption={setSelectedOption}
                />
              </div>

              <div className="animate-slide-up-fade-in" style={{ animationDelay: "0.2s" }}>
                <AmountInput
                  amount={amount}
                  onAmountChange={setAmount}
                  maxAmount={vaultBalance.totalBalance}
                  onMaxClick={handleMaxClick}
                />
              </div>
            </div>

            {/* Right Column - Summary and Actions */}
            <div className="space-y-8">
              {estimate && selectedWithdrawOption && (
                <div className="animate-slide-up-fade-in" style={{ animationDelay: "0.3s" }}>
                  <WithdrawSummary estimate={estimate} option={selectedWithdrawOption} />
                </div>
              )}

              <div className="animate-slide-up-fade-in" style={{ animationDelay: "0.4s" }}>
                <WithdrawActions isValid={!!isValidAmount} isLoading={isLoading} onWithdraw={handleWithdraw} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
