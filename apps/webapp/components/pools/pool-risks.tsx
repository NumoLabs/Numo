import { Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Pool } from "@/lib/pools-data"

interface PoolRisksProps {
  pool: Pool
}

export function PoolRisks({ pool }: PoolRisksProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Riesgos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border p-4 bg-blue-50 dark:bg-blue-950/20">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Nivel de Riesgo: {pool.risk}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Este pool tiene un nivel de riesgo {pool.risk.toLowerCase()}. Asegúrate de entender los riesgos antes de
                invertir.
              </p>
            </div>
          </div>
        </div>
        {pool.risks && (
          <>
            <div>
              <h4 className="font-medium mb-2">Riesgos Principales</h4>
              <ul className="list-disc pl-5 space-y-2">
                {pool.risks.map((risk, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<li key={index}>{risk}</li>
                ))}
              </ul>
            </div>
            <Separator />
          </>
        )}
        <div>
          <h4 className="font-medium mb-2">Mitigación de Riesgos</h4>
          <p>
            Para mitigar estos riesgos, considera diversificar tus inversiones entre diferentes pools y protocolos. La
            vault automática puede ayudarte a gestionar estos riesgos al rebalancear automáticamente entre diferentes
            estrategias.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
