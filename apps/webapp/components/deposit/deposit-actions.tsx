"use client"

import { useState } from "react"
import Link from "next/link"
import { Upload, AlertTriangle, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DepositActionsProps {
  isValid: boolean
  isLoading?: boolean
  selectedToken: "btc" | "wbtc"
  onDeposit: () => void
}

export function DepositActions({ isValid, isLoading = false, selectedToken, onDeposit }: DepositActionsProps) {
  const [confirmTerms, setConfirmTerms] = useState(false)
  const [confirmStrategy, setConfirmStrategy] = useState(false)

  const canProceed = isValid && confirmTerms && confirmStrategy && !isLoading

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Confirmation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
          <Wallet className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            Make sure you have enough ETH in your wallet to cover the gas fees of the transaction.
          </AlertDescription>
        </Alert>

        {selectedToken === "btc" && (
          <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800 dark:text-orange-200">
              Your BTC will be automatically converted to WBTC for operating in DeFi protocols. This conversion may take
              additional minutes.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <Card className="p-3 border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="confirm-terms"
                checked={confirmTerms}
                onCheckedChange={(checked: boolean) => setConfirmTerms(checked as boolean)}
              />
              <label
                htmlFor="confirm-terms"
                className="text-sm leading-relaxed cursor-pointer text-gray-700 dark:text-gray-300"
              >
                I understand that my funds will be deposited in an automated vault that invests in DeFi protocols and
                that there is a risk of capital loss.
              </label>
            </div>
          </Card>

          <Card className="p-3 border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="confirm-strategy"
                checked={confirmStrategy}
                onCheckedChange={(checked: boolean) => setConfirmStrategy(checked as boolean)}
              />
              <label
                htmlFor="confirm-strategy"
                className="text-sm leading-relaxed cursor-pointer text-gray-700 dark:text-gray-300"
              >
                I accept that the vault will automatically rebalance my funds between different strategies to optimize
                returns.
              </label>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <Button
            onClick={onDeposit}
            disabled={!canProceed}
            className="w-full h-12 font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 group"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processing Deposit...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                Confirm Deposit
              </>
            )}
          </Button>

          <div className="flex gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button
                variant="outline"
                className="w-full h-12 font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Cancel
              </Button>
            </Link>
            <Link href="/pools" className="flex-1">
              <Button
                variant="ghost"
                className="w-full h-12 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                View Pools
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
          Have questions?{" "}
          <Link href="/learn/defi-basics" className="text-blue-600 hover:underline transition-colors duration-300">
            Learn about DeFi
          </Link>{" "}
          or{" "}
          <Link href="/support" className="text-blue-600 hover:underline transition-colors duration-300">
            contact support
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
