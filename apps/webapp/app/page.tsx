import { VaultStats } from "@/components/home/vault-stats"
import { VaultHero } from "@/components/home/vault-hero"
import { VaultFeatures } from "@/components/home/vault-features"
import { VaultCTA } from "@/components/home/vault-cta"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { SectionDivider } from "@/components/ui/section-divider"

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-black">
      <div className="absolute top-0 left-0 w-full h-[600px] bg-bitcoin-gradient -z-10" />
      <Header />
      <VaultHero />
      
      {/* Divider between Hero and Stats */}
      <SectionDivider variant="bitcoin" />
      
      <main className="flex-1">
        <VaultStats />
        
        {/* Divider between Stats and Features */}
        <SectionDivider variant="default" />
        
        <VaultFeatures />
        
        {/* Divider between Features and CTA */}
        <SectionDivider variant="minimal" />
        
        <VaultCTA />
      </main>
      
      {/* Divider before Footer */}
      <SectionDivider variant="default" />
      
      <Footer />
    </div>
  )
}
