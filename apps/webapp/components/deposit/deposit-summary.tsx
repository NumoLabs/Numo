import { TrendingUp, Clock, DollarSign, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { DepositEstimate, DepositOption } from "@/lib/deposit-data"

interface DepositSummaryProps {
  estimate: DepositEstimate
  option: DepositOption
  selectedToken: "btc" | "wbtc"
}

export function DepositSummary({ estimate, option, selectedToken }: DepositSummaryProps) {
  const getOptionBadge = () => {
    switch (option.id) {
      case "priority":
        return (
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
            Prioritario
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

  const getTokenBadge = () => {
    return selectedToken === "btc" ? (
      <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">BTC</Badge>
    ) : (
      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">WBTC</Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Resumen del Depósito</CardTitle>
          <div className="flex gap-2">
            {getTokenBadge()}
            {getOptionBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount Summary */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Cantidad a depositar</span>
            <div className="text-right">
              <span className="font-medium">{estimate.amount}</span>
              <p className="text-xs text-muted-foreground">{estimate.amountUSD}</p>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Comisión de depósito</span>
            <div className="text-right">
              <span className="font-medium text-green-600">{estimate.fees || "Gratis"}</span>
              <p className="text-xs text-muted-foreground">{estimate.feesUSD || "$0.00"}</p>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between">
            <span className="font-medium">Cantidad neta en vault</span>
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

        <Separator />

        {/* Projected Yields */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="font-medium">Rendimientos Proyectados (5.8% APY)</span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
              <p className="text-xs text-muted-foreground">Diario</p>
              <p className="text-sm font-semibold text-green-600">{estimate.projectedYield.daily}</p>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
              <p className="text-xs text-muted-foreground">Mensual</p>
              <p className="text-sm font-semibold text-green-600">{estimate.projectedYield.monthly}</p>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded border border-green-200 dark:border-green-800">
              <p className="text-xs text-muted-foreground">Anual</p>
              <p className="text-sm font-semibold text-green-600">{estimate.projectedYield.yearly}</p>
            </div>
          </div>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Después del depósito</p>
              <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Tus fondos se distribuirán automáticamente según la estrategia actual</li>
                <li>• Comenzarás a generar rendimientos inmediatamente</li>
                <li>• Puedes retirar en cualquier momento sin penalizaciones</li>
                <li>• La vault rebalanceará automáticamente para optimizar APY</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
