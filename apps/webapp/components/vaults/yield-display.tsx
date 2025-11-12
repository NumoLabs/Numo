'use client';

import { useEffect, useState } from 'react';
import { useVesuVault } from '@/hooks/use-vesu-vault';
import { type YieldInfo } from '@/types/VesuVault';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function YieldDisplay() {
  const { computeYield, isConnected } = useVesuVault();
  const [yieldInfo, setYieldInfo] = useState<YieldInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadYield = async () => {
    if (!isConnected) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await computeYield();
      if (result === null) {
        // Yield computation returned null - could be network error, pool configuration, or no pools
        // Don't show error for network issues (they're handled gracefully in computeYield)
        // Only show error if it's a configuration issue
        setError(null); // Clear error - network issues are handled gracefully
        setYieldInfo(null);
      } else {
        setYieldInfo(result);
        setError(null); // Clear any previous errors on success
      }
    } catch (err) {
      // This catch should rarely be hit since computeYield handles errors internally
      console.error('Failed to load yield:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load yield';
      
      // Only show error if it's not a network error (network errors are handled in computeYield)
      if (!errorMessage.includes('Failed to fetch') && 
          !errorMessage.includes('NetworkError') &&
          !errorMessage.includes('timeout')) {
        setError(errorMessage);
      } else {
        setError(null);
      }
      setYieldInfo(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      loadYield();
    }
  }, [isConnected]);

  // Format large numbers
  const formatNumber = (value: string | null): string => {
    if (!value) return '0';
    try {
      const num = BigInt(value);
      // Convert to readable format (divide by 10^18 for typical yield calculations)
      // Adjust based on your actual yield calculation
      const divisor = BigInt(10 ** 18);
      const quotient = num / divisor;
      const remainder = num % divisor;
      const remainderStr = remainder.toString().padStart(18, '0');
      const trimmed = remainderStr.replace(/0+$/, '');
      return trimmed ? `${quotient}.${trimmed}` : quotient.toString();
    } catch {
      return value;
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Yield</CardTitle>
          <CardDescription>Connect your wallet to view yield information</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Current Yield</CardTitle>
            <CardDescription>Weighted average yield across all pools</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadYield}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading yield...</span>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.includes('Input too long') || error.includes('too long for arguments') 
                ? 'Unable to compute yield. One or more pools may not be properly configured. Please check your pool configuration.'
                : error}
            </AlertDescription>
          </Alert>
        ) : yieldInfo ? (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Weighted Average Yield</div>
              <div className="text-2xl font-bold">
                {formatNumber(yieldInfo.yield)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Amount Across Pools</div>
              <div className="text-lg font-semibold">
                {formatNumber(yieldInfo.totalAmount)} wBTC
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8 space-y-2">
            <p>No yield data available</p>
            <p className="text-sm">This may be due to network connectivity or pool configuration. Please try refreshing.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

