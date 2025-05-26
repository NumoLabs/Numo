"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/header"
import { WalletBalanceCard } from "@/components/deposit/wallet-balance-card"
import { VaultInfoCard } from "@/components/deposit/vault-info-card"
import { DepositOptions } from "@/components/deposit/deposit-options"
import { AmountInput } from "@/components/deposit/amount-input"
import { DepositSummary } from "@/components/deposit/deposit-summary"
import { DepositActions } from "@/components/deposit/deposit-actions"
import { useToast } from "@/hooks/use-toast"
import {
  walletBalance,
  vaultInfo,
  depositOptions,
  calculateDepositEstimate,
  getDepositOptionById,
} from "@/lib/deposit-data"

export default function DepositPage() {
  const [selectedOption, setSelectedOption] = useState("standard")
  const [amount, setAmount] = useState("")
  const [selectedToken, setSelectedToken] = useState<"btc" | "wbtc">("btc")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

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
        title: "Depósito exitoso",
        description: `Tu depósito de ${amount} ${selectedToken.toUpperCase()} ha sido procesado exitosamente.`,
      })

      // Redirect to dashboard
      // router.push('/dashboard')
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu depósito. Inténtalo de nuevo.",
        variant: "destructive",    
      })
      console.error(error);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="dashboard" />
      <main className="flex-1 p-4 md:p-8 pt-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Volver al Dashboard
              </Button>
            </Link>
            <div className="ml-4">
              <h1 className="text-3xl font-bold">Depositar BTC</h1>
              <p className="text-muted-foreground mt-1">
                Deposita BTC o WBTC en la vault para comenzar a generar rendimientos automáticamente
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2 space-y-6">
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
            <div className="space-y-6">
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
