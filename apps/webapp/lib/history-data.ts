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
    lastRebalance: "hace 2 días",
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
    title: "Depósito",
    description: "Depósito exitoso en la vault",
    date: "12 Mayo, 2025",
    time: "14:32",
    amount: "+0.5 BTC",
    amountUSD: "≈ $31,250",
    txHash: "0x1a2b...3c4d",
    status: "completed",
  },
  {
    id: "tx-002",
    type: "rebalance",
    title: "Rebalanceo Automático",
    description: "Optimización automática de la estrategia",
    date: "12 Mayo, 2025",
    time: "14:35",
    details: "Ekubo (70%) ← Vesu (30%)",
    improvement: "+0.3% APY",
    status: "completed",
  },
  {
    id: "tx-003",
    type: "withdrawal",
    title: "Retiro",
    description: "Retiro parcial de fondos",
    date: "9 Mayo, 2025",
    time: "10:15",
    amount: "-0.2 BTC",
    amountUSD: "≈ $12,500",
    txHash: "0x4e5f...6g7h",
    status: "completed",
  },
  {
    id: "tx-004",
    type: "rebalance",
    title: "Rebalanceo Automático",
    description: "Rebalanceo para optimizar rendimientos",
    date: "9 Mayo, 2025",
    time: "10:20",
    details: "Ekubo (50%) ← Vesu (50%)",
    improvement: "+0.2% APY",
    status: "completed",
  },
  {
    id: "tx-005",
    type: "deposit",
    title: "Depósito",
    description: "Depósito inicial en la vault",
    date: "6 Mayo, 2025",
    time: "16:45",
    amount: "+0.95 BTC",
    amountUSD: "≈ $59,375",
    txHash: "0x8i9j...0k1l",
    status: "completed",
  },
  {
    id: "tx-006",
    type: "milestone",
    title: "Milestone Alcanzado",
    description: "Primera ganancia significativa",
    date: "3 Mayo, 2025",
    time: "12:00",
    milestone: "Primera ganancia de 0.05 BTC",
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
