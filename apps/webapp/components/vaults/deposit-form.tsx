'use client';

import { useState } from 'react';
import { useVesuVault } from '@/hooks/use-vesu-vault';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function VesuVaultDepositForm() {
  const [amount, setAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const { deposit, totalAssets, wbtcBalance, isPending, isSuccess, error, contractAddress, isConnected } = useVesuVault();

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }

    setIsDepositing(true);
    try {
      await deposit(amount);
    } catch (err) {
      console.error('Deposit failed:', err);
    } finally {
      setIsDepositing(false);
    }
  };

  const formatTotalAssets = (assets: bigint | null | undefined) => {
    if (!assets) return '0';
    return (Number(assets) / 1e18).toFixed(6);
  };

  const formatWbtcBalance = (balance: bigint | null | undefined) => {
    if (!balance) return '0';
    return (Number(balance) / 1e8).toFixed(8);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Deposit to Vesu Vault</CardTitle>
        <CardDescription>
          Deposit wBTC to earn yield through Vesu V2
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contract Info */}
        <div className="text-sm text-muted-foreground">
          <p><strong>Contract:</strong> {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}</p>
          <p><strong>Total Assets:</strong> {formatTotalAssets(totalAssets)} wBTC</p>
          <p><strong>Your wBTC Balance:</strong> {formatWbtcBalance(wbtcBalance)} wBTC</p>
          <p><strong>Wallet:</strong> {isConnected ? 'Connected' : 'Not connected'}</p>
        </div>

        {/* Wallet Connection Alert */}
        {!isConnected && (
          <Alert className="border-orange-500/50 bg-orange-500/10">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="text-orange-200">
              Please connect your StarkNet wallet using the button above to make a deposit.
            </AlertDescription>
          </Alert>
        )}

        {/* Deposit Form */}
        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-2">
              Amount (wBTC)
            </label>
            <Input
              id="amount"
              type="number"
              step="0.000001"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.001"
              className="w-full"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!isConnected || !amount || parseFloat(amount) <= 0 || isPending || isDepositing}
          >
            {isPending || isDepositing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Depositing...
              </>
            ) : (
              'Deposit wBTC'
            )}
          </Button>
        </form>

        {/* Status Messages */}
        {isSuccess && (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-200">
              Deposit successful! Your wBTC has been deposited to the Vesu Vault.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Deposit failed: {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Make sure you have wBTC in your wallet</p>
          <p>• Approval and deposit will be executed in a single transaction</p>
          <p>• The vault will automatically manage your position in Vesu V2</p>
          <p>• You&apos;ll receive vault tokens representing your share</p>
        </div>
      </CardContent>
    </Card>
  );
}
