import Link from "next/link"
import { Edit, MoreHorizontal, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Pool {
  name: string
  allocation: number
}

interface VaultCardProps {
  name: string
  description: string
  apy: string
  totalValue: string
  pools: Pool[]
  vaultId?: string
}

export function VaultCard({ name, description, apy, totalValue, pools, vaultId }: VaultCardProps) {
  // Color bar según el nombre del pool
  const getPoolColor = (poolName: string) => {
    if (poolName.includes("Vesu")) return "bg-emerald-500"
    if (poolName.includes("Ekubo")) return "bg-amber-500"
    return "bg-gray-500"
  }

  const slug = vaultId || name.toLowerCase().replace(/\//g, "-").replace(/\s+/g, "-")

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">APY</p>
            <p className="text-lg font-semibold">{apy}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-lg font-semibold">{totalValue}</p>
          </div>
        </div>

        <div className="space-y-3">
          {pools.map((pool) => (
            <div key={pool.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{pool.name}</span>
                <span>{pool.allocation}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className={`h-full rounded-full ${getPoolColor(pool.name)}`}
                  style={{ width: `${pool.allocation}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between pt-4">
        <Link href={`/pools/vault/${slug}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
        <Link href={`/pools/deposit/${slug}`}>
          <Button size="sm">Deposit</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
