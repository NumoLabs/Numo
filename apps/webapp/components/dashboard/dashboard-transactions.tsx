import { Bitcoin, Download, Upload } from "lucide-react"

export function DashboardTransactions() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
          <Upload className="h-4 w-4 text-green-600" />
        </div>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Deposit</p>
          <p className="text-sm text-muted-foreground">2 days ago • Tx: 0x1a2b...3c4d</p>
        </div>
        <div className="ml-auto font-medium">+0.5 BTC</div>
      </div>
      <div className="flex items-center">
        <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
          <Bitcoin className="h-4 w-4 text-amber-600" />
        </div>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Rebalancing</p>
          <p className="text-sm text-muted-foreground">2 days ago • Ekubo (70%) / Vesu (30%)</p>
        </div>
        <div className="ml-auto font-medium text-green-600">+0.3% APY</div>
      </div>
      <div className="flex items-center">
        <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
          <Download className="h-4 w-4 text-red-600" />
        </div>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Withdrawal</p>
          <p className="text-sm text-muted-foreground">5 days ago • Tx: 0x4e5f...6g7h</p>
        </div>
        <div className="ml-auto font-medium">-0.2 BTC</div>
      </div>
      <div className="flex items-center">
        <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-amber-100">
          <Bitcoin className="h-4 w-4 text-amber-600" />
        </div>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Rebalancing</p>
          <p className="text-sm text-muted-foreground">5 days ago • Ekubo (50%) / Vesu (50%)</p>
        </div>
        <div className="ml-auto font-medium text-green-600">+0.2% APY</div>
      </div>
      <div className="flex items-center">
        <div className="mr-4 flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
          <Upload className="h-4 w-4 text-green-600" />
        </div>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Deposit</p>
          <p className="text-sm text-muted-foreground">8 days ago • Tx: 0x8i9j...0k1l</p>
        </div>
        <div className="ml-auto font-medium">+0.95 BTC</div>
      </div>
    </div>
  )
}
