import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface VaultActionsProps {
  vaultSlug: string
}

export function VaultActions({ vaultSlug }: VaultActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones</CardTitle>
        <CardDescription>Gestiona tu vault personalizada</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link href={`/pools/deposit/${vaultSlug}`}>
          <Button className="w-full">Depositar</Button>
        </Link>
        <Link href={`/pools/withdraw/${vaultSlug}`}>
          <Button variant="outline" className="w-full">
            Retirar
          </Button>
        </Link>
        <Link href={`/pools/edit/${vaultSlug}`}>
          <Button variant="outline" className="w-full">
            Editar Vault
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

export function AddToVaultActions({ poolSlug }: { poolSlug: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Añadir a Vault</CardTitle>
        <CardDescription>Añade este pool a una vault personalizada o crea una nueva.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link href={`/pools/add/${poolSlug}`}>
          <Button className="w-full">Añadir a Vault Existente</Button>
        </Link>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">O</span>
          </div>
        </div>
        <Link href="/pools/create">
          <Button variant="outline" className="w-full">
            Crear Nueva Vault
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
