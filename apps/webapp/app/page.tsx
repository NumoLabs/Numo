import { VaultStats } from "@/components/home/vault-stats"
import { VaultHero } from "@/components/home/vault-hero"
import { VaultFeatures } from "@/components/home/vault-features"
import { VaultStrategies } from "@/components/home/vault-strategies"
import { VaultCTA } from "@/components/home/vault-cta"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <VaultHero />
        <VaultStats />
        <VaultFeatures />
        <VaultStrategies />
        <VaultCTA />
      </main>
      <Footer />
    </div>
  )
}
