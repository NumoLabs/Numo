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
          All
        </TabsTrigger>  
        <TabsTrigger value="deposits" className="gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          Deposits
        </TabsTrigger>
        <TabsTrigger value="withdrawals" className="gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          Withdrawals
        </TabsTrigger>
        <TabsTrigger value="rebalances" className="gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          Rebalances
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <TransactionList
          transactions={allTransactions}
          title="All Transactions"
          description="Complete history of your vault activity"
          showLoadMore={true}
        />
      </TabsContent>

      <TabsContent value="deposits">
        <TransactionList
          transactions={deposits}
          title="Deposit History"
          description="All your vault deposits"
        />
      </TabsContent>

      <TabsContent value="withdrawals">
        <TransactionList
          transactions={withdrawals}
          title="Withdrawal History"
          description="All your vault withdrawals"
        />
      </TabsContent>

      <TabsContent value="rebalances">
        <TransactionList
          transactions={rebalances}
          title="Rebalance History"
          description="All automatic vault rebalances"
        />
      </TabsContent>
    </Tabs>
  )
}
