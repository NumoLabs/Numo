import { Info, Clock, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { WithdrawEstimate, WithdrawOption } from "@/lib/withdraw-data"

interface WithdrawSummaryProps {
  estimate: WithdrawEstimate
  option: WithdrawOption
}

export function WithdrawSummary({ estimate, option }: WithdrawSummaryProps) {
  const getOptionBadge = () => {
    switch (option.id) {
      case "instant":
        return (
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
            Instantáneo
          </Badge>
        )
      case "standard":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Estándar</Badge>
      case "scheduled":
        return (
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">Programado</Badge>
        )
      default:
        return <Badge variant="secondary">Desconocido</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Resumen del Retiro</CardTitle>
          {getOptionBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount Summary */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Cantidad a retirar</span>
            <div className="text-right">
              <span className="font-medium">{estimate.amount}</span>
              <p className="text-xs text-muted-foreground">{estimate.amountUSD}</p>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Comisión ({option.fees})</span>
            <div className="text-right">
              <span className="font-medium text-red-600">-{estimate.fees}</span>
              <p className="text-xs text-muted-foreground">-{estimate.feesUSD}</p>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between">
            <span className="font-medium">Cantidad neta</span>
            <div className="text-right">
              <span className="text-lg font-bold text-green-600">{estimate.netAmount}</span>
              <p className="text-sm text-muted-foreground">{estimate.netAmountUSD}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Transaction Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Tiempo estimado</span>
            </div>
            <span className="font-medium">{estimate.estimatedTime}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Gas estimado</span>
            </div>
            <span className="font-medium">{estimate.gasEstimate}</span>
          </div>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Información importante</p>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Los fondos se retirarán automáticamente de las estrategias activas</li>
                <li>• El tiempo puede variar según las condiciones de la red</li>
                <li>• Las comisiones incluyen costos de desinversión y gas</li>
                <li>• Recibirás una confirmación una vez completado el retiro</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
