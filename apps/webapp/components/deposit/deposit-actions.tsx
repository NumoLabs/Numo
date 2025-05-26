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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Confirmation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Wallet className="h-4 w-4" />
          <AlertDescription>
            Make sure you have enough ETH in your wallet to cover the gas fees of the transaction.
          </AlertDescription>
        </Alert>

        {selectedToken === "btc" && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your BTC will be automatically converted to WBTC for operating in DeFi protocols. This conversion may take
              additional minutes.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="confirm-terms"
              checked={confirmTerms}
              onCheckedChange={(checked: boolean) => setConfirmTerms(checked as boolean)}
            />
            <label htmlFor="confirm-terms" className="text-sm leading-relaxed cursor-pointer">
              I understand that my funds will be deposited in an automated vault that invests in DeFi protocols and that there is a risk of capital loss.
            </label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="confirm-strategy"
              checked={confirmStrategy}
              onCheckedChange={(checked: boolean) => setConfirmStrategy(checked as boolean)}
            />
            <label htmlFor="confirm-strategy" className="text-sm leading-relaxed cursor-pointer">
              I accept that the vault will automatically rebalance my funds between different strategies to optimize returns.
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={onDeposit} disabled={!canProceed} className="w-full" size="lg">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processing Deposit...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Confirm Deposit
              </>
            )}
          </Button>

          <div className="flex gap-2">
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
            <Link href="/pools" className="flex-1">
              <Button variant="ghost" className="w-full">
                View Pools
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Have questions?{" "}
          <Link href="/learn/defi-basics" className="text-blue-600 hover:underline">
            Learn about DeFi
          </Link>{" "}
          or{" "}
          <Link href="/support" className="text-blue-600 hover:underline">
            contact support
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
