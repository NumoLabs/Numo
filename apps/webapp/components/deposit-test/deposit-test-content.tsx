"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Wallet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { BitcoinWalletConnect } from "@/components/deposit-test/bitcoin-wallet-connect"
import { BitcoinSwap } from "@/components/deposit-test/bitcoin-swap"
import { StarknetWalletInput } from "@/components/deposit-test/starknet-wallet-input"
import { DepositSummary } from "@/components/deposit-test/deposit-summary"

export function DepositTestContent() {
  const [currentStep, setCurrentStep] = useState(1)
  const [bitcoinWallet, setBitcoinWallet] = useState("")
  const [starknetWallet, setStarknetWallet] = useState("")
  const [swapAmount, setSwapAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const steps = [
    { id: 1, name: "Connect Bitcoin Wallet", description: "Connect your Bitcoin wallet" },
    { id: 2, name: "StarkNet Wallet", description: "Enter your StarkNet wallet address" },
    { id: 3, name: "Bridge BTC to WBTC", description: "Bridge Bitcoin to Wrapped Bitcoin using LayerSwap" },
    { id: 4, name: "Complete Deposit", description: "Deposit WBTC to dashboard" },
  ]

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleBitcoinWalletConnect = (wallet: string) => {
    setBitcoinWallet(wallet)
    handleNextStep()
  }

  const handleStarknetWalletSubmit = (wallet: string) => {
    setStarknetWallet(wallet)
    handleNextStep()
  }

  const handleSwapSubmit = (amount: string) => {
    setSwapAmount(amount)
    handleNextStep()
  }

  const handleFinalDeposit = async () => {
    setIsLoading(true)
    try {
      // Simulate deposit process
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Deposit Successful",
        description: "Successfully deposited WBTC to dashboard",
      })
      // Mark step as completed by incrementing currentStep
      setCurrentStep(currentStep + 1)
    } catch {
      toast({
        title: "Error",
        description: "Failed to process deposit. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-900 to-yellow-600 dark:from-orange-100 dark:to-yellow-300 bg-clip-text text-transparent">
            Bitcoin Bridge & Deposit
          </h1>
          <p className="text-muted-foreground mt-2">
            Bridge your Bitcoin to WBTC and deposit to your dashboard
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Flow Steps */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step Content */}
          <div className="space-y-6">
            {currentStep === 1 && (
              <BitcoinWalletConnect
                onWalletConnect={handleBitcoinWalletConnect}
                currentWallet={bitcoinWallet}
              />
            )}

            {currentStep === 2 && (
              <StarknetWalletInput
                onWalletSubmit={handleStarknetWalletSubmit}
                currentWallet={starknetWallet}
              />
            )}

            {currentStep === 3 && (
              <BitcoinSwap
                onSwapSubmit={handleSwapSubmit}
                currentAmount={swapAmount}
                bitcoinWallet={bitcoinWallet}
                starknetWallet={starknetWallet}
              />
            )}

            {currentStep === 4 && (
              <DepositSummary
                onDeposit={handleFinalDeposit}
                isLoading={isLoading}
                bitcoinWallet={bitcoinWallet}
                starknetWallet={starknetWallet}
                swapAmount={swapAmount}
              />
            )}

            {currentStep > 4 && (
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-orange-200/50 dark:border-orange-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-orange-500" />
                    Bridge & Deposit Completed!
                  </CardTitle>
                  <CardDescription>
                    Your Bitcoin has been successfully bridged and deposited
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50 rounded-lg border border-orange-200/50">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-orange-800 dark:text-orange-200 mb-1">
                          Bridge & Deposit Successful!
                        </p>
                        <p className="text-orange-700 dark:text-orange-300 text-xs">
                          Your Bitcoin has been successfully bridged to WBTC and deposited to your dashboard. You can now view your balance and start earning returns.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/50 dark:to-orange-950/50 rounded-lg border border-yellow-200/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Wallet className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium text-sm">Source Wallet</span>
                        </div>
                        <div className="max-w-full overflow-hidden">
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all word-break-all leading-relaxed">
                            {bitcoinWallet}
                          </p>
                        </div>
                        <Badge variant="outline" className="mt-2">Bitcoin</Badge>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50 rounded-lg border border-orange-200/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Wallet className="h-4 w-4 text-orange-500" />
                          <span className="font-medium text-sm">Destination Wallet</span>
                        </div>
                        <div className="max-w-full overflow-hidden">
                          <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all word-break-all leading-relaxed">
                            {starknetWallet}
                          </p>
                        </div>
                        <Badge variant="outline" className="mt-2">StarkNet</Badge>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-lg border border-green-200/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Final Deposit Amount</h4>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            {(Number(swapAmount) * 0.999).toFixed(4)} WBTC
                          </p>
                        </div>
                        <Badge variant="outline" className="bg-green-100 dark:bg-green-900/20">
                          Deposited
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1"
                    >
                      Start New Deposit
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/dashboard'}
                      className="flex-1"
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Column - Progress and Info */}
        <div className="space-y-6 sticky top-6">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-orange-200/50 dark:border-orange-800/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-orange-500" />
                Bridge Progress
              </CardTitle>
              <CardDescription>
                Complete all steps to bridge Bitcoin to WBTC and deposit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                      step.id <= currentStep
                        ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800"
                        : "bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                        currentStep === step.id
                          ? "bg-orange-500 text-white"
                          : currentStep > step.id
                          ? "bg-orange-500 text-white"
                          : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{step.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {step.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Step Info */}
              {currentStep <= steps.length && (
                <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50 rounded-lg border border-orange-200/50">
                  <h4 className="font-semibold text-sm mb-2">Current Step: {steps[currentStep - 1]?.name}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {steps[currentStep - 1]?.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
              className="flex-1"
            >
              Previous
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={currentStep === steps.length}
              className="flex-1"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 