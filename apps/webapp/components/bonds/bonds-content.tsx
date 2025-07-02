"use client"

import { useState } from "react"
import { BondsHero } from "@/components/bonds/bonds-hero"
import { BondOptionCard } from "@/components/bonds/bond-option-card"
import { BondAmountInput } from "@/components/bonds/bond-amount-input"
import { BondSummary } from "@/components/bonds/bond-summary"
import { BondActions } from "@/components/bonds/bond-actions"
import { ActiveBonds } from "@/components/bonds/active-bonds"
import { useToast } from "@/hooks/use-toast"
import { useWalletAuth } from "@/hooks/use-wallet-auth"
import { bondOptions, getBondOptionById, getActiveBonds, calculateBondEstimate } from "@/lib/bonds-data"

export function BondsContent() {
  // Use centralized wallet system to prevent extension activation
  useWalletAuth()
  const [selectedOption, setSelectedOption] = useState("30-day")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const selectedBondOption = getBondOptionById(selectedOption)
  const activeBonds = getActiveBonds()
  const maxAmount = "2.45 WBTC" // Mock wallet balance

  const estimate = selectedBondOption && amount ? calculateBondEstimate(amount, selectedBondOption) : null

  const isValidAmount =
    amount &&
    Number.parseFloat(amount) > 0 &&
    Number.parseFloat(amount) <= Number.parseFloat(maxAmount.replace(" WBTC", "")) &&
    selectedBondOption &&
    Number.parseFloat(amount) >= Number.parseFloat(selectedBondOption.minAmount.replace(" WBTC", ""))

  const handleMaxClick = () => {
    setAmount(maxAmount.replace(" WBTC", ""))
  }

  const handleLock = async () => {
    if (!isValidAmount || !selectedBondOption) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000))

      toast({
        title: "Bond created successfully",
        description: `Your ${amount} WBTC has been locked for ${selectedBondOption.duration} at ${selectedBondOption.boostedAPY}% APY.`,
      })

      // Reset form
      setAmount("")
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "There was a problem creating your bond. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <BondsHero />

      {/* Active Bonds Section */}
      {activeBonds.length > 0 && (
        <div>
          <ActiveBonds bonds={activeBonds} />
        </div>
      )}

      {/* Bond Options */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Choose Your Lock Duration</h2>
        <p className="text-muted-foreground mb-6">
          Select a lock period that matches your investment strategy. Longer locks provide higher rewards.
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {bondOptions.map((option) => (
            <BondOptionCard
              key={option.id}
              option={option}
              selectedOption={selectedOption}
              onSelectOption={setSelectedOption}
            />
          ))}
        </div>
      </div>

      {/* Lock Configuration */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BondAmountInput
            amount={amount}
            onAmountChange={setAmount}
            maxAmount={maxAmount}
            onMaxClick={handleMaxClick}
          />
        </div>

        <div className="space-y-6">
          {estimate && selectedBondOption && <BondSummary estimate={estimate} option={selectedBondOption} />}

          <BondActions isValid={!!isValidAmount} isLoading={isLoading} onLock={handleLock} />
        </div>
      </div>
    </div>
  )
}
