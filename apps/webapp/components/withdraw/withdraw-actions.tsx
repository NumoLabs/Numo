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
    <Card className="border-0 shadow-xl bg-white dark:bg-gray-800/50 backdrop-blur-sm">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500" />
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          Confirmation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700 dark:text-amber-300 font-medium">
            Once you start the withdrawal, you won&apos;t be able to cancel the operation. Make sure all the data is
            correct.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Checkbox
              id="confirm-risks"
              checked={confirmRisks}
              onCheckedChange={(checked: boolean) => setConfirmRisks(checked as boolean)}
              className="mt-1"
            />
            <label
              htmlFor="confirm-risks"
              className="text-sm leading-relaxed cursor-pointer text-gray-700 dark:text-gray-300"
            >
              I understand that once I withdraw funds, they will no longer generate returns in the vault and that the
              commissions shown are estimated.
            </label>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <Checkbox
              id="confirm-amount"
              checked={confirmAmount}
              onCheckedChange={(checked: boolean) => setConfirmAmount(checked as boolean)}
              className="mt-1"
            />
            <label
              htmlFor="confirm-amount"
              className="text-sm leading-relaxed cursor-pointer text-gray-700 dark:text-gray-300"
            >
              I have verified that the amount and destination address are correct.
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <Button
            onClick={onWithdraw}
            disabled={!canProceed}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                Processing Withdrawal...
              </>
            ) : (
              <>
                <Download className="h-5 w-5 mr-3" />
                Confirm Withdrawal
              </>
            )}
          </Button>

          <div className="flex gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button
                variant="outline"
                className="w-full h-12 font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
              >
                Cancel
              </Button>
            </Link>
            <Link href="/history" className="flex-1">
              <Button
                variant="ghost"
                className="w-full h-12 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              >
                View History
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need help?{" "}
            <Link
              href="/support"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold hover:underline transition-colors duration-300"
            >
              Contact support
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
