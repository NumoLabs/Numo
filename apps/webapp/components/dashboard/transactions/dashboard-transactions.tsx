import { Bitcoin, Download, Upload } from "lucide-react"

export function DashboardTransactions() {
  return (
    <div className="space-y-4 md:space-y-8">
      <div className="flex items-start md:items-center gap-3 md:gap-0">
        <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100">
          <Upload className="h-4 w-4 text-yellow-600" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-sm font-medium leading-none text-white">Deposit</p>
          <p className="text-sm text-gray-300 break-words">2 days ago • Tx: 0x1a2b...3c4d</p>
        </div>
        <div className="flex-shrink-0 ml-auto md:ml-auto font-medium text-yellow-400 text-sm md:text-base">+0.5 BTC</div>
      </div>
      <div className="flex items-start md:items-center gap-3 md:gap-0">
        <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100">
          <Bitcoin className="h-4 w-4 text-yellow-600" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-sm font-medium leading-none text-white">Rebalancing</p>
          <p className="text-sm text-gray-300 break-words">2 days ago • Ekubo (70%) / Vesu (30%)</p>
        </div>
        <div className="flex-shrink-0 ml-auto md:ml-auto font-medium text-yellow-400 text-sm md:text-base">+0.3% APY</div>
      </div>
      <div className="flex items-start md:items-center gap-3 md:gap-0">
        <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100">
          <Download className="h-4 w-4 text-yellow-600" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-sm font-medium leading-none text-white">Withdrawal</p>
          <p className="text-sm text-gray-300 break-words">5 days ago • Tx: 0x4e5f...6g7h</p>
        </div>
        <div className="flex-shrink-0 ml-auto md:ml-auto font-medium text-yellow-400 text-sm md:text-base">-0.2 BTC</div>
      </div>
      <div className="flex items-start md:items-center gap-3 md:gap-0">
        <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100">
          <Bitcoin className="h-4 w-4 text-yellow-600" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-sm font-medium leading-none text-white">Rebalancing</p>
          <p className="text-sm text-gray-300 break-words">5 days ago • Ekubo (50%) / Vesu (50%)</p>
        </div>
        <div className="flex-shrink-0 ml-auto md:ml-auto font-medium text-yellow-400 text-sm md:text-base">+0.2% APY</div>
      </div>
      <div className="flex items-start md:items-center gap-3 md:gap-0">
        <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100">
          <Upload className="h-4 w-4 text-yellow-600" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-sm font-medium leading-none text-white">Deposit</p>
          <p className="text-sm text-gray-300 break-words">8 days ago • Tx: 0x8i9j...0k1l</p>
        </div>
        <div className="flex-shrink-0 ml-auto md:ml-auto font-medium text-yellow-400 text-sm md:text-base">+0.95 BTC</div>
      </div>
    </div>
  )
}
