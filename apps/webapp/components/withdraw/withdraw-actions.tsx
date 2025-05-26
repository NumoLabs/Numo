"use client"

import { useState } from "react"
import Link from "next/link"
import { Download, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface WithdrawActionsProps {
  isValid: boolean
  isLoading?: boolean
  onWithdraw: () => void
}

export function WithdrawActions({ isValid, isLoading = false, onWithdraw }: WithdrawActionsProps) {
  const [confirmRisks, setConfirmRisks] = useState(false)
  const [confirmAmount, setConfirmAmount] = useState(false)

  const canProceed = isValid && confirmRisks && confirmAmount && !isLoading

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Confirmation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Once you start the withdrawal, you won't be able to cancel the operation. Make sure all the data is
            correct.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="confirm-risks"
              checked={confirmRisks}
              onCheckedChange={(checked: boolean) => setConfirmRisks(checked as boolean)}
            />
            <label htmlFor="confirm-risks" className="text-sm leading-relaxed cursor-pointer">
              I understand that once I withdraw funds, they will no longer generate returns in the vault and that the
              commissions shown are estimated.
            </label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="confirm-amount"
              checked={confirmAmount}
              onCheckedChange={(checked: boolean) => setConfirmAmount(checked as boolean)}
            />
            <label htmlFor="confirm-amount" className="text-sm leading-relaxed cursor-pointer">
              I have verified that the amount and destination address are correct.
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={onWithdraw} disabled={!canProceed} className="w-full" size="lg">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processing Withdrawal...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Confirm Withdrawal
              </>
            )}
          </Button>

          <div className="flex gap-2">
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
            <Link href="/app/history" className="flex-1">
              <Button variant="ghost" className="w-full">
                View History
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Need help?{" "}
          <Link href="/support" className="text-blue-600 hover:underline">
            Contact support
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
