"use client"

import { Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TransactionItem } from "./transaction-item"
import type { Transaction } from "@/lib/history-data"

interface TransactionListProps {
  transactions: Transaction[]
  title: string
  description: string
  showLoadMore?: boolean
  onLoadMore?: () => void
}

export function TransactionList({
  transactions,
  title,
  description,
  showLoadMore = false,
  onLoadMore,
}: TransactionListProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant="secondary">{transactions.length} transacciones</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>

        {showLoadMore && (
          <div className="flex justify-center mt-6">
            <Button variant="outline" className="gap-2" onClick={onLoadMore}>
              <Clock className="h-4 w-4" />
              Cargar más transacciones
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
