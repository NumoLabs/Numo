"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PoolSelectorProps {
  onAddPool: (newPool: { id: string; name: string; apy: number }) => void
}

/**
 * Muestra un diálogo para elegir rápidamente un pool predefinido
 * y la asignación inicial que tendrá dentro de un vault personalizado.
 */
export function PoolSelector({ onAddPool }: PoolSelectorProps) {
  const [open, setOpen] = useState(false)
  const [selectedPool, setSelectedPool] = useState("")
  const [allocation, setAllocation] = useState("20")

  const poolMap: Record<string, { name: string; apy: number }> = {
    "ekubo-btc-usdc": { name: "Ekubo BTC/USDC", apy: 4.8 },
    "ekubo-btc-eth": { name: "Ekubo BTC/ETH", apy: 5.2 },
    "ekubo-btc-usdt": { name: "Ekubo BTC/USDT", apy: 5.0 },
    "ekubo-btc-dai": { name: "Ekubo BTC/DAI", apy: 4.9 },
    "vesu-btc-lending": { name: "Vesu BTC Lending", apy: 5.8 },
    "vesu-btc-vault": { name: "Vesu BTC Vault", apy: 6.0 },
  }

  const handleAdd = () => {
    if (!selectedPool) return
    const pool = poolMap[selectedPool]
    if (pool) {
      onAddPool({
        id: selectedPool,
        name: pool.name,
        apy: pool.apy,
      })
      // reset
      setOpen(false)
      setSelectedPool("")
      setAllocation("20")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-1">
          <Plus className="h-4 w-4" />
          Add Pool
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Pool</DialogTitle>
          <DialogDescription>Select a pool to add to your custom vault.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Pool selector */}
          <div className="space-y-2">
            <Label htmlFor="pool">Pool</Label>
            <Select value={selectedPool} onValueChange={setSelectedPool}>
              <SelectTrigger id="pool">
                <SelectValue placeholder="Select a pool" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(poolMap).map(([value, { name }]) => (
                  <SelectItem key={value} value={value}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Allocation percentage */}
          <div className="space-y-2">
            <Label htmlFor="allocation">Allocation (%)</Label>
            <Input
              id="allocation"
              type="number"
              min="1"
              max="100"
              value={allocation}
              onChange={(e) => setAllocation(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">The sum of all allocations must be 100%.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!selectedPool}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
