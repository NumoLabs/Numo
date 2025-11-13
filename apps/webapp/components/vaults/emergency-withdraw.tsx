'use client';

import { useState, useEffect } from 'react';
import { useVesuVault, type PoolProps } from '@/hooks/use-vesu-vault';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export function EmergencyWithdraw() {
  const { 
    emergencyWithdraw, 
    emergencyWithdrawPool, 
    getAllowedPools, 
    isPending, 
    isConnected, 
    error 
  } = useVesuVault();
  const { toast } = useToast();
  
  const [pools, setPools] = useState<PoolProps[]>([]);
  const [isLoadingPools, setIsLoadingPools] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  useEffect(() => {
    const loadPools = async () => {
      if (!isConnected) return;
      
      setIsLoadingPools(true);
      try {
        const poolsData = await getAllowedPools();
        if (poolsData) {
          setPools(poolsData);
        }
      } catch (err) {
        console.error('Failed to load pools:', err);
        toast({
          title: 'Error',
          description: 'Failed to load pools',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingPools(false);
      }
    };

    if (isConnected) {
      loadPools();
    }
  }, [isConnected, getAllowedPools, toast]);

  const handleEmergencyWithdrawAll = async () => {
    setIsWithdrawing(true);
    try {
      const txHash = await emergencyWithdraw();
      toast({
        title: 'Success',
        description: `Emergency withdraw transaction submitted: ${txHash.slice(0, 10)}...`,
      });
    } catch (err: unknown) {
      console.error('Emergency withdraw failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Emergency withdraw failed';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleEmergencyWithdrawPool = async (poolIndex: number) => {
    setIsWithdrawing(true);
    try {
      const txHash = await emergencyWithdrawPool(poolIndex);
      toast({
        title: 'Success',
        description: `Emergency withdraw pool transaction submitted: ${txHash.slice(0, 10)}...`,
      });
    } catch (err: unknown) {
      console.error('Emergency withdraw pool failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Emergency withdraw pool failed';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Emergency Withdraw</CardTitle>
          <CardDescription>Connect your wallet to use emergency withdraw</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Emergency Withdraw
        </CardTitle>
        <CardDescription>
          Emergency withdraw all funds from pools. Use with caution.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Warning */}
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> Emergency withdraw will withdraw all funds from the vault pools. 
            This action should only be used in emergency situations.
          </AlertDescription>
        </Alert>

        {/* Withdraw All Pools */}
        <div className="space-y-4 border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Withdraw All Pools</h3>
              <p className="text-sm text-muted-foreground">
                Withdraw all funds from all pools in the vault
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isLoadingPools || isWithdrawing || isPending}
                >
                  {isWithdrawing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Withdrawing...
                    </>
                  ) : (
                    'Withdraw All'
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will withdraw all funds from all pools in the vault. 
                    This action cannot be undone. Are you sure you want to continue?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleEmergencyWithdrawAll}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Yes, Withdraw All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Withdraw Specific Pool */}
        {pools.length > 0 && (
          <div className="space-y-4 border rounded-lg p-4">
            <h3 className="font-semibold">Withdraw Specific Pool</h3>
            <p className="text-sm text-muted-foreground">
              Withdraw all funds from a specific pool
            </p>

            {isLoadingPools ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">Loading pools...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {pools.map((pool, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Pool {index + 1}</span>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>
                          <strong>Pool Address:</strong> {pool.pool_id.slice(0, 10)}...{pool.pool_id.slice(-8)}
                        </div>
                        <div>
                          <strong>vToken Address:</strong> {pool.v_token.slice(0, 10)}...{pool.v_token.slice(-8)}
                        </div>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isWithdrawing || isPending}
                        >
                          Withdraw
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Withdraw from Pool {index + 1}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will withdraw all funds from Pool {index + 1}. 
                            This action cannot be undone. Are you sure you want to continue?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleEmergencyWithdrawPool(index)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Yes, Withdraw
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}


