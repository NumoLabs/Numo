'use client';

import { useState, useEffect, useCallback } from 'react';
import { useVesuVault } from '@/hooks/use-vesu-vault';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Wallet, TrendingUp } from 'lucide-react';

export function VesuVaultPosition() {
  const [userPosition, setUserPosition] = useState<{
    shares: bigint;
    assets: bigint;
    formatted: string;
    usdValue?: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getUserPosition, isConnected } = useVesuVault();

  const loadUserPosition = useCallback(async () => {
    if (!isConnected) {
      console.log('VesuVaultPosition: Not connected, skipping load');
      return;
    }
    
    console.log('VesuVaultPosition: Loading user position...');
    setIsLoading(true);
    try {
      const position = await getUserPosition();
      console.log('VesuVaultPosition: Position loaded:', position);
      if (position) {
        setUserPosition(position);
      } else {
        console.warn('VesuVaultPosition: getUserPosition returned null/undefined');
        setUserPosition(null);
      }
    } catch (err) {
      console.error('VesuVaultPosition: Failed to load user position:', err);
      setUserPosition(null);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, getUserPosition]);

  useEffect(() => {
    if (isConnected) {
      loadUserPosition();
    } else {
      setUserPosition(null);
    }
  }, [isConnected, loadUserPosition]);

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <Wallet className="h-4 w-4 md:h-5 md:w-5" />
            Your Position
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Connect your wallet to view your position in the Vesu Vault
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="min-h-[280px] md:h-56">
      <CardHeader className="pb-3 md:pb-4">
        <CardTitle className="flex items-center gap-2 text-sm md:text-base">
          <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
          Your Position
          <Button
            variant="ghost"
            size="sm"
            onClick={loadUserPosition}
            disabled={isLoading}
            className="ml-auto h-8 w-8 md:h-9 md:w-9 p-0"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 md:h-4 md:w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5 md:h-4 md:w-4" />
            )}
          </Button>
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Your current position in the Vesu Vault
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-6 md:py-8">
            <Loader2 className="h-5 w-5 md:h-6 md:w-6 animate-spin" />
            <span className="ml-2 text-xs md:text-sm">Loading position...</span>
          </div>
        ) : userPosition ? (
          <div className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <div className="text-center p-3 md:p-4 bg-muted rounded-lg">
                <div className="text-xl md:text-2xl font-bold text-primary break-words">
                  {userPosition.formatted}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">wBTC Value</div>
              </div>
              <div className="text-center p-3 md:p-4 bg-muted rounded-lg">
                <div className="text-xl md:text-2xl font-bold text-green-600 break-words">
                  ${userPosition.usdValue?.toFixed(2) || '0.00'}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">USD Value</div>
              </div>
              <div className="text-center p-3 md:p-4 bg-muted rounded-lg">
                <div className="text-xl md:text-2xl font-bold text-primary break-words">
                  {userPosition.shares.toString()}
                </div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">Vault Shares</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 md:py-8 text-muted-foreground text-xs md:text-sm px-2">
            No position found. Make a deposit to start earning yield.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
