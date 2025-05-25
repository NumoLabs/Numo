import Link from "next/link"
import { Button } from "@/components/ui/button"
import WalletConnector from "@/components/ui/connectWallet"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">Numo</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Características
          </Link>
          <Link href="#strategies" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Estrategias
          </Link>
          <Link href="#stats" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Estadísticas
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
          <WalletConnector />
        </div>
      </div>
    </header>
  )
}
