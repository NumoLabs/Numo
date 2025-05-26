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
        <CardTitle className="text-lg">Confirmación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Wallet className="h-4 w-4" />
          <AlertDescription>
            Asegúrate de tener suficiente ETH en tu wallet para cubrir las comisiones de gas de la transacción.
          </AlertDescription>
        </Alert>

        {selectedToken === "btc" && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Tu BTC será convertido automáticamente a WBTC para operar en protocolos DeFi. Esta conversión puede tomar
              unos minutos adicionales.
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
              Entiendo que mis fondos se depositarán en una vault automatizada que invierte en protocolos DeFi y que
              existe riesgo de pérdida de capital.
            </label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="confirm-strategy"
              checked={confirmStrategy}
              onCheckedChange={(checked: boolean) => setConfirmStrategy(checked as boolean)}
            />
            <label htmlFor="confirm-strategy" className="text-sm leading-relaxed cursor-pointer">
              Acepto que la vault rebalanceará automáticamente mis fondos entre diferentes estrategias para optimizar
              rendimientos.
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={onDeposit} disabled={!canProceed} className="w-full" size="lg">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Procesando Depósito...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Confirmar Depósito
              </>
            )}
          </Button>

          <div className="flex gap-2">
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
            <Link href="/pools" className="flex-1">
              <Button variant="ghost" className="w-full">
                Ver Pools
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          ¿Tienes dudas?{" "}
          <Link href="/learn/defi-basics" className="text-blue-600 hover:underline">
            Aprende sobre DeFi
          </Link>{" "}
          o{" "}
          <Link href="/support" className="text-blue-600 hover:underline">
            contacta soporte
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
