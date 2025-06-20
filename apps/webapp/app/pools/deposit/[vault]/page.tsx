// import { ArrowLeft } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Header } from "@/components/ui/header"
// import { VaultDepositContent } from "@/components/pools/vault-deposit-content"
import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"

// type Props = {
//   params: Promise<{ vault: string }>
// }

export default async function DepositPage(
//   {
//   params,
// }: Props
) {
  // const resolvedParams = await params
  // // In a real application, we would get vault data from an API
  // // Here we use example data based on the URL parameter

  // const vaultData = {
  //   name: "My Balanced Vault",
  //   apy: "5.4%",
  //   totalValue: "0.32 BTC",
  //   walletBalance: "2.45 BTC",
  //   pools: [
  //     { name: "Vesu BTC Lending", allocation: 50 },
  //     { name: "Ekubo BTC/USDC", allocation: 30 },
  //     { name: "Ekubo BTC/ETH", allocation: 20 },
  //   ],
  // }

  return (
    <DashboardLayout />
    // <div className="flex min-h-screen flex-col">
    //   <Header variant="dashboard" />
    //   <main className="flex-1 p-4 md:p-8 pt-6">
    //     <div className="max-w-4xl mx-auto">
    //       <div className="flex items-center mb-6">
    //         <Link href={`/pools/vault/${resolvedParams.vault}`}>
    //           <Button variant="ghost" size="sm" className="gap-1">
    //             <ArrowLeft className="h-4 w-4" />
    //             Back to Vault
    //           </Button>
    //         </Link>
    //       </div>
    //       <VaultDepositContent vaultData={vaultData} />
    //     </div>
    //   </main>
    // </div>
  )
}
