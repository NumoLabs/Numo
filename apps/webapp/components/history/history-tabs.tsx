import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionList } from "./transaction-list"
import { getTransactionsByType } from "@/lib/history-data"

interface HistoryTabsProps {
  searchTerm?: string
}

export function HistoryTabs({ searchTerm }: HistoryTabsProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filterTransactions = (transactions: any[], searchTerm?: string) => {
    if (!searchTerm) return transactions

    return transactions.filter(
      (tx) =>
        tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.txHash?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  const allTransactions = filterTransactions(getTransactionsByType("all"), searchTerm)
  const deposits = filterTransactions(getTransactionsByType("deposit"), searchTerm)
  const withdrawals = filterTransactions(getTransactionsByType("withdrawal"), searchTerm)
  const rebalances = filterTransactions(getTransactionsByType("rebalance"), searchTerm)

  return (
    <Tabs defaultValue="all" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all" className="gap-2">
          <div className="h-2 w-2 rounded-full bg-gray-500" />
          Todas
        </TabsTrigger>  
        <TabsTrigger value="deposits" className="gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          Depósitos
        </TabsTrigger>
        <TabsTrigger value="withdrawals" className="gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          Retiros
        </TabsTrigger>
        <TabsTrigger value="rebalances" className="gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          Rebalanceos
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <TransactionList
          transactions={allTransactions}
          title="Todas las Transacciones"
          description="Historial completo de tu actividad en la vault"
          showLoadMore={true}
        />
      </TabsContent>

      <TabsContent value="deposits">
        <TransactionList
          transactions={deposits}
          title="Historial de Depósitos"
          description="Todos tus depósitos en la vault"
        />
      </TabsContent>

      <TabsContent value="withdrawals">
        <TransactionList
          transactions={withdrawals}
          title="Historial de Retiros"
          description="Todos tus retiros de la vault"
        />
      </TabsContent>

      <TabsContent value="rebalances">
        <TransactionList
          transactions={rebalances}
          title="Historial de Rebalanceos"
          description="Todos los rebalanceos automáticos de la vault"
        />
      </TabsContent>
    </Tabs>
  )
}
