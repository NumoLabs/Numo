import { VaultStats } from "@/components/home/vault-stats"
import { VaultHero } from "@/components/home/vault-hero"
import { VaultFeatures } from "@/components/home/vault-features"
import { VaultStrategies } from "@/components/home/vault-strategies"
import { VaultCTA } from "@/components/home/vault-cta"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gray-100 dark:bg-gray-900/20 -z-10" />
      <Header />
      <VaultHero />
      <main className="flex-1">
        <VaultStats />
        <VaultFeatures />
        <VaultStrategies />
        <VaultCTA />
      </main>
      <Footer />
    </div>
  )
}
