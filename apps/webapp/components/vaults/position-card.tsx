'use client';

import { useState, useEffect } from 'react';
import { useVesuVault } from '@/hooks/use-vesu-vault';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Wallet, TrendingUp } from 'lucide-react';

export function VesuVaultPosition() {
  const [userPosition, setUserPosition] = useState<{
    shares: bigint;
    assets: bigint;
    formatted: string;
    usdValue?: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getUserPosition, checkVaultShares, isConnected, account } = useVesuVault();

  const loadUserPosition = async () => {
    if (!isConnected || !account) return;
    
    setIsLoading(true);
    try {
      const position = await getUserPosition();
      setUserPosition(position || null);
    } catch (err) {
      console.error('Failed to load user position:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && account) {
      loadUserPosition();
    }
  }, [isConnected, account]);

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Your Position
          </CardTitle>
          <CardDescription>
            Connect your wallet to view your position in the Vesu Vault
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="h-56">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Your Position
          <Button
            variant="ghost"
            size="sm"
            onClick={loadUserPosition}
            disabled={isLoading}
            className="ml-auto"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
        <CardDescription>
          Your current position in the Vesu Vault
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading position...</span>
          </div>
        ) : userPosition ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {userPosition.formatted}
                </div>
                <div className="text-sm text-muted-foreground">wBTC Value</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  ${userPosition.usdValue?.toFixed(2) || '0.00'}
                </div>
                <div className="text-sm text-muted-foreground">USD Value</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {userPosition.shares.toString()}
                </div>
                <div className="text-sm text-muted-foreground">Vault Shares</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No position found. Make a deposit to start earning yield.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
