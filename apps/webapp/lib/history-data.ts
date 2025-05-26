export interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "rebalance" | "milestone"
  title: string
  description: string
  date: string
  time: string
  amount?: string
  amountUSD?: string
  txHash?: string
  status: "completed" | "pending" | "failed"
  details?: string
  improvement?: string
  milestone?: string
}

export interface HistoryStats {
  totalDeposited: {
    amount: string
    count: number
  }
  totalWithdrawn: {
    amount: string
    count: number
  }
  totalRebalances: {
    count: number
    lastRebalance: string
  }
  totalYield: {
    amount: string
    percentage: string
  }
}

export const historyStats: HistoryStats = {
  totalDeposited: {
    amount: "1.95 BTC",
    count: 3,
  },
  totalWithdrawn: {
    amount: "0.2 BTC",
    count: 1,
  },
  totalRebalances: {
    count: 4,
    lastRebalance: "2 days ago",
  },
  totalYield: {
    amount: "+0.078 BTC",
    percentage: "+4.2%",
  },
}

export const transactionsData: Transaction[] = [
  {
    id: "tx-001",
    type: "deposit",
    title: "Deposit",
    description: "Successful deposit to vault",
    date: "May 12, 2025",
    time: "14:32",
    amount: "+0.5 BTC",
    amountUSD: "≈ $31,250",
    txHash: "0x1a2b...3c4d",
    status: "completed",
  },
  {
    id: "tx-002",
    type: "rebalance",
    title: "Automatic Rebalance",
    description: "Automatic strategy optimization",
    date: "May 12, 2025",
    time: "14:35",
    details: "Ekubo (70%) ← Vesu (30%)",
    improvement: "+0.3% APY",
    status: "completed",
  },
  {
    id: "tx-003",
    type: "withdrawal",
    title: "Withdrawal",
    description: "Partial funds withdrawal",
    date: "May 9, 2025",
    time: "10:15",
    amount: "-0.2 BTC",
    amountUSD: "≈ $12,500",
    txHash: "0x4e5f...6g7h",
    status: "completed",
  },
  {
    id: "tx-004",
    type: "rebalance",
    title: "Automatic Rebalance",
    description: "Rebalance to optimize returns",
    date: "May 9, 2025",
    time: "10:20",
    details: "Ekubo (50%) ← Vesu (50%)",
    improvement: "+0.2% APY",
    status: "completed",
  },
  {
    id: "tx-005",
    type: "deposit",
    title: "Deposit",
    description: "Initial vault deposit",
    date: "May 6, 2025",
    time: "16:45",
    amount: "+0.95 BTC",
    amountUSD: "≈ $59,375",
    txHash: "0x8i9j...0k1l",
    status: "completed",
  },
  {
    id: "tx-006",
    type: "milestone",
    title: "Milestone Reached",
    description: "First significant gain",
    date: "May 3, 2025",
    time: "12:00",
    milestone: "First 0.05 BTC gain",
    improvement: "🎉 +5% ROI",
    status: "completed",
  },
]

export const getTransactionsByType = (type?: string): Transaction[] => {
  if (!type || type === "all") {
    return transactionsData
  }
  return transactionsData.filter((tx) => tx.type === type)
}

export const getTransactionById = (id: string): Transaction | undefined => {
  return transactionsData.find((tx) => tx.id === id)
}
