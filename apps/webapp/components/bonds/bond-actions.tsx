"use client"

import { useState } from "react"
import Link from "next/link"
import { Lock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BondActionsProps {
  isValid: boolean
  isLoading?: boolean
  onLock: () => void
}

export function BondActions({ isValid, isLoading = false, onLock }: BondActionsProps) {
  const [confirmLock, setConfirmLock] = useState(false)
  const [confirmTerms, setConfirmTerms] = useState(false)

  const canProceed = isValid && confirmLock && confirmTerms && !isLoading

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Confirmation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Once locked, your WBTC cannot be withdrawn until the lock period expires. This action cannot be undone.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="confirm-lock"
              checked={confirmLock}
              onCheckedChange={(checked: boolean | "indeterminate") => setConfirmLock(checked as boolean)}
            />
            <label htmlFor="confirm-lock" className="text-sm leading-relaxed cursor-pointer">
              I understand that my WBTC will be locked for the selected duration and cannot be withdrawn early.
            </label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="confirm-terms"
              checked={confirmTerms}
              onCheckedChange={(checked: boolean | "indeterminate") => setConfirmTerms(checked as boolean)}
            />
            <label htmlFor="confirm-terms" className="text-sm leading-relaxed cursor-pointer">
              I accept the bond terms and understand the risks associated with locking my funds.
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={onLock} disabled={!canProceed} className="w-full" size="lg">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Locking WBTC...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Lock WBTC
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
          Need help?{" "}
          <Link href="/learn/defi-basics" className="text-blue-600 hover:underline">
            Learn about bonds
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
