"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/header"
import { VaultBalanceCard } from "@/components/withdraw/vault-balance-card"
import { WithdrawOptions } from "@/components/withdraw/withdraw-options"
import { AmountInput } from "@/components/withdraw/amount-input"
import { WithdrawSummary } from "@/components/withdraw/withdraw-summary"
import { WithdrawActions } from "@/components/withdraw/withdraw-actions"
import { useToast } from "@/hooks/use-toast"
import { vaultBalance, withdrawOptions, calculateWithdrawEstimate, getWithdrawOptionById } from "@/lib/withdraw-data"

export default function WithdrawPage() {
  const router = useRouter()
  const [selectedOption, setSelectedOption] = useState("standard")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

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
        title: "Retiro iniciado",
        description: `Tu retiro de ${amount} BTC ha sido procesado exitosamente.`,
      })

      // Redirect to history
      router.push('/history')
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu retiro. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header variant="dashboard" />
      <main className="flex-1 p-4 md:p-8 pt-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center mb-6">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-1">
                <ArrowLeft className="h-4 w-4" />
                Volver al Dashboard
              </Button>
            </Link>
            <div className="ml-4">
              <h1 className="text-3xl font-bold">Retirar BTC</h1>
              <p className="text-muted-foreground mt-1">Retira tus fondos de la vault en cualquier momento</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <VaultBalanceCard balance={vaultBalance} />

              <WithdrawOptions
                options={withdrawOptions}
                selectedOption={selectedOption}
                onSelectOption={setSelectedOption}
              />

              <AmountInput
                amount={amount}
                onAmountChange={setAmount}
                maxAmount={vaultBalance.totalBalance}
                onMaxClick={handleMaxClick}
              />
            </div>

            {/* Right Column - Summary and Actions */}
            <div className="space-y-6">
              {estimate && selectedWithdrawOption && (
                <WithdrawSummary estimate={estimate} option={selectedWithdrawOption} />
              )}

              <WithdrawActions isValid={!!isValidAmount} isLoading={isLoading} onWithdraw={handleWithdraw} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
