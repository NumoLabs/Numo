import Link from "next/link"
import { Info } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PoolCardProps {
  name: string
  description: string
  apy: string
  tvl: string
  protocol: string
  risk: string
  tokens: string[]
  poolId?: string
}

export function PoolCard({ name, description, apy, tvl, protocol, risk, tokens, poolId }: PoolCardProps) {
  // Determinar color según riesgo
  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:text-white border-green-600"
      case "medium":
        return "bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:text-white border-yellow-600"
      case "medium-high":
        return "bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:text-white border-orange-600"
      case "high":
        return "bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:text-white border-red-600"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-800/30 dark:text-gray-300"
    }
  }

  const slug = poolId ?? name.toLowerCase().replace(/\//g, "-").replace(/\s+/g, "-")

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{name}</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                  <span className="sr-only">Information</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Click on &quot;View Details&quot; to get more information about this pool, including risks, strategies
                  and historical performance.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">APY</p>
            <p className="text-lg font-semibold">{apy}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">TVL</p>
            <p className="text-lg font-semibold">{tvl}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{protocol}</Badge>
          <Badge className={getRiskColor(risk)}>{risk}</Badge>
          {tokens.map((token) => (
            <Badge key={token} variant="outline">
              {token}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-center">
        <Link href={`/pools/${slug}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
        {/* Hidden: Custom vaults feature not yet available */}
        <Link href={`/pools/add/${slug}`} className="hidden">
          <Button size="sm">Add to Vault</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
