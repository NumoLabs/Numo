import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Pool } from "@/lib/pools-data"

interface PoolDetailsProps {
  pool: Pool
}

export function PoolDetails({ pool }: PoolDetailsProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles del Pool</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{pool.details}</p>
        <Separator />
        {pool.benefits && (
          <>
            <div>
              <h4 className="font-medium mb-2">Beneficios</h4>
              <ul className="list-disc pl-5 space-y-1">
                {pool.benefits.map((benefit, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<li key={index} className="text-sm">
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <Separator />
          </>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Protocolo</p>
            <p className="font-medium">{pool.protocol}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Tokens</p>
            <p className="font-medium">{pool.tokens.join(" / ")}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Tipo</p>
            <p className="font-medium">Pool de Liquidez AMM</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PoolPerformance({ pool }: PoolDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">APY Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-2xl font-bold">{pool.apy}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">+0.2% en los últimos 7 días</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">TVL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pool.tvl}</div>
          <p className="text-xs text-muted-foreground mt-1">+5.3% en los últimos 30 días</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Volumen (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$342K</div>
          <p className="text-xs text-muted-foreground mt-1">-2.1% vs día anterior</p>
        </CardContent>
      </Card>
    </div>
  )
}

export function PoolStatistics({ pool }: PoolDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">APY</span>
            <span className="font-medium">{pool.apy}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Valor Total</span>
            <span className="font-medium">{pool.tvl}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Volumen (24h)</span>
            <span className="font-medium">$342K</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Comisión</span>
            <span className="font-medium">0.3%</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Creado</span>
            <span className="font-medium">Hace 6 meses</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
