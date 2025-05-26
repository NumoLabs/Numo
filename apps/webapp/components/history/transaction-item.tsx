import { Bitcoin, Download, Upload, ExternalLink, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Transaction } from "@/lib/history-data"

interface TransactionItemProps {
  transaction: Transaction
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const getIcon = () => {
    switch (transaction.type) {
      case "deposit":
        return <Upload className="h-6 w-6 text-green-600" />
      case "withdrawal":
        return <Download className="h-6 w-6 text-red-600" />
      case "rebalance":
        return <Bitcoin className="h-6 w-6 text-blue-600" />
      case "milestone":
        return <Award className="h-6 w-6 text-purple-600" />
      default:
        return <Bitcoin className="h-6 w-6 text-gray-600" />
    }
  }

  const getBackgroundColor = () => {
    switch (transaction.type) {
      case "deposit":
        return "bg-gradient-to-r from-green-50/50 to-transparent dark:from-green-950/20"
      case "withdrawal":
        return "bg-gradient-to-r from-red-50/50 to-transparent dark:from-red-950/20"
      case "rebalance":
        return "bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20"
      case "milestone":
        return "bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-950/20"
      default:
        return "bg-gradient-to-r from-gray-50/50 to-transparent dark:from-gray-950/20"
    }
  }

  const getBadgeColor = () => {
    switch (transaction.type) {
      case "deposit":
        return "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-800/30 dark:text-green-300"
      case "withdrawal":
        return "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-800/30 dark:text-red-300"
      case "rebalance":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-800/30 dark:text-blue-300"
      case "milestone":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80 dark:bg-purple-800/30 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-800/30 dark:text-gray-300"
    }
  }

  const getAmountColor = () => {
    switch (transaction.type) {
      case "deposit":
        return "text-green-600"
      case "withdrawal":
        return "text-red-600"
      case "rebalance":
        return "text-blue-600"
      case "milestone":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border ${getBackgroundColor()} hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm">
          {getIcon()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold">{transaction.title}</p>
            <Badge className={getBadgeColor()}>
              {transaction.status === "completed"
                ? "Completado"
                : transaction.status === "pending"
                  ? "Pendiente"
                  : "Fallido"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {transaction.date} • {transaction.time}
          </p>
          {transaction.txHash && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Tx: {transaction.txHash}</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          )}
          {transaction.details && <p className="text-sm text-blue-600 mt-1 font-medium">{transaction.details}</p>}
          {transaction.milestone && <p className="text-sm text-purple-600 mt-1 font-medium">{transaction.milestone}</p>}
        </div>
      </div>
      <div className="text-right">
        {transaction.amount && <p className={`text-lg font-bold ${getAmountColor()}`}>{transaction.amount}</p>}
        {transaction.amountUSD && <p className="text-sm text-muted-foreground">{transaction.amountUSD}</p>}
        {transaction.improvement && (
          <p className={`text-lg font-bold ${getAmountColor()}`}>{transaction.improvement}</p>
        )}
        {transaction.type === "rebalance" && !transaction.improvement && (
          <p className="text-sm text-muted-foreground">Optimización</p>
        )}
      </div>
    </div>
  )
}
