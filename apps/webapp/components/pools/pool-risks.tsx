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
        <CardTitle>Risk Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border p-4 bg-blue-50 dark:bg-blue-950/20">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Risk Level: {pool.risk}</p>
              <p className="text-sm text-muted-foreground mt-1">
                This pool has a {pool.risk.toLowerCase()} risk level. Make sure you understand the risks before
                investing.
              </p>
            </div>
          </div>
        </div>
        {pool.risks && (
          <>
            <div>
              <h4 className="font-medium mb-2">Main Risks</h4>
              <ul className="list-disc pl-5 space-y-2">
                {pool.risks.map((risk, index) => (
                  <li key={index}>{risk}</li>
                ))}
              </ul>
            </div>
            <Separator />
          </>
        )}
        <div>
          <h4 className="font-medium mb-2">Risk Mitigation</h4>
          <p>
            To mitigate these risks, consider diversifying your investments across different pools and protocols. The
            automatic vault can help you manage these risks by automatically rebalancing between different strategies.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
