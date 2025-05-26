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
        <CardTitle className="text-lg">Confirmación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Una vez iniciado el retiro, no podrás cancelar la operación. Asegúrate de que todos los datos sean
            correctos.
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
              Entiendo que al retirar fondos, estos dejarán de generar rendimientos en la vault y que las comisiones
              mostradas son estimadas.
            </label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="confirm-amount"
              checked={confirmAmount}
              onCheckedChange={(checked: boolean) => setConfirmAmount(checked as boolean)}
            />
            <label htmlFor="confirm-amount" className="text-sm leading-relaxed cursor-pointer">
              He verificado que la cantidad y la dirección de destino son correctas.
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button onClick={onWithdraw} disabled={!canProceed} className="w-full" size="lg">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Procesando Retiro...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Confirmar Retiro
              </>
            )}
          </Button>

          <div className="flex gap-2">
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full">
                Cancelar
              </Button>
            </Link>
            <Link href="/app/history" className="flex-1">
              <Button variant="ghost" className="w-full">
                Ver Historial
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          ¿Necesitas ayuda?{" "}
          <Link href="/support" className="text-blue-600 hover:underline">
            Contacta soporte
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
