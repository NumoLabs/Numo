'use client';

import { useState } from 'react';
import { useVesuVault } from '@/hooks/use-vesu-vault';
import { useAccount } from '@starknet-react/core';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Gift, Info, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function SimpleClaimRewards() {
  const { 
    isPending, 
    isConnected, 
    contractAddress,
    error 
  } = useVesuVault();
  const { address } = useAccount();
  const { toast } = useToast();
  
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaim = async () => {
    if (!isConnected || !address || !contractAddress) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet first',
        variant: 'destructive',
      });
      return;
    }

    setIsClaiming(true);
    try {
      
      toast({
        title: 'Rewards Claim',
        description: 'Claim functionality requires reward data from the distributor. This is typically handled automatically by the vault admin or requires integration with a rewards API.',
        variant: 'default',
      });
      
    } catch (err: unknown) {
      console.error('Claim failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to claim rewards. Please try again later.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsClaiming(false);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-bitcoin-orange" />
            Claim Rewards
          </CardTitle>
          <CardDescription>
            Connect your wallet to claim rewards from DeFi Spring
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-bitcoin-orange" />
          Claim Rewards
        </CardTitle>
        <CardDescription>
          Claim your rewards from DeFi Spring and add them to the vault
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rewards Status Card */}
        <div className="p-6 bg-gradient-to-br from-bitcoin-gold/20 via-bitcoin-orange/10 to-bitcoin-gold/20 border border-bitcoin-gold/30 rounded-xl space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-bitcoin-gold/20 rounded-full">
              <Sparkles className="h-6 w-6 text-bitcoin-gold" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-bitcoin-gold">Rewards Available</p>
              <p className="text-sm text-muted-foreground mt-1">
                Claim rewards and they&apos;ll be swapped to wBTC
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">How it works:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>Rewards are distributed from DeFi Spring to eligible vault participants</li>
            <li>Click &quot;Claim Rewards&quot; to claim and automatically swap to wBTC</li>
            <li>Rewards are added to the vault and increase your position value</li>
          </ul>
        </div>

        {/* Claim Button */}
        <Button
          onClick={handleClaim}
          disabled={isClaiming || isPending}
          className="w-full bg-gradient-to-r from-bitcoin-orange to-bitcoin-gold hover:from-bitcoin-orange/90 hover:to-bitcoin-gold/90 text-white"
          size="lg"
        >
          {isClaiming || isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Gift className="mr-2 h-5 w-5" />
              Claim Rewards
            </>
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Info Notice */}
        <Alert className="border-blue-500/50 bg-blue-500/10">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-200 text-sm">
            <strong>Note:</strong> Reward claiming requires reward data from the distributor contract. 
            If you have reward data available, contact support or use the advanced form in the vault admin panel.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

