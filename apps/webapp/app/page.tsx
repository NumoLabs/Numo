import Link from "next/link"
import { ArrowRight, Clock, Plus, Search, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { VaultStats } from "@/components/home/vault-stats"
import { VaultHero } from "@/components/home/vault-hero"
import { VaultFeatures } from "@/components/home/vault-features"
import { VaultStrategies } from "@/components/home/vault-strategies"
import { VaultCTA } from "@/components/home/vault-cta"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/ui/navbar"
import { Footer } from "@/components/ui/footer"
import WalletConnector from "@/components/ui/connectWallet"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
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
