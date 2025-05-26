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
        <CardTitle>Actions</CardTitle>
        <CardDescription>Manage your custom vault</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link href={`/pools/deposit/${vaultSlug}`}>
          <Button className="w-full">Deposit</Button>
        </Link>
        <Link href={`/pools/withdraw/${vaultSlug}`}>
          <Button variant="outline" className="w-full">
            Withdraw
          </Button>
        </Link>
        <Link href={`/pools/edit/${vaultSlug}`}>
          <Button variant="outline" className="w-full">
            Edit Vault
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
        <CardTitle>Add to Vault</CardTitle>
        <CardDescription>Add this pool to a custom vault or create a new one.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link href={`/pools/add/${poolSlug}`}>
          <Button className="w-full">Add to Existing Vault</Button>
        </Link>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        <Link href="/pools/create">
          <Button variant="outline" className="w-full">
            Create New Vault
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
