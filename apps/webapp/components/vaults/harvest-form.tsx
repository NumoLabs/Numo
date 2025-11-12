'use client';

import { useState, useEffect } from 'react';
import { useVesuVault, WBTC_ADDRESS } from '@/hooks/use-vesu-vault';
import { type Claim, type AvnuMultiRouteSwap, type Route } from '@/types/VesuVault';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function HarvestForm() {
  const { 
    harvest, 
    isPending, 
    isConnected, 
    account,
    contractAddress,
    error 
  } = useVesuVault();
  const { toast } = useToast();
  
  const [rewardsContract, setRewardsContract] = useState<string>('');
  const [claim, setClaim] = useState<Claim>({
    id: '',
    claimee: '',
    amount: '',
  });
  const [proof, setProof] = useState<string[]>([]);
  const [proofInput, setProofInput] = useState<string>('');
  const [swapInfo, setSwapInfo] = useState<AvnuMultiRouteSwap>({
    token_from_address: '',
    token_from_amount: '',
    token_to_address: WBTC_ADDRESS,
    token_to_amount: '',
    token_to_min_amount: '',
    beneficiary: contractAddress || '',
    integrator_fee_amount_bps: '0',
    integrator_fee_recipient: contractAddress || '',
    routes: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update beneficiary and integrator_fee_recipient when contractAddress changes
  useEffect(() => {
    if (contractAddress) {
      setSwapInfo(prev => ({
        ...prev,
        beneficiary: contractAddress,
        integrator_fee_recipient: contractAddress,
      }));
    }
  }, [contractAddress]);

  const addProofItem = () => {
    if (proofInput.trim()) {
      setProof([...proof, proofInput.trim()]);
      setProofInput('');
    }
  };

  const removeProofItem = (index: number) => {
    setProof(proof.filter((_, i) => i !== index));
  };

  const addRoute = () => {
    setSwapInfo({
      ...swapInfo,
      routes: [
        ...swapInfo.routes,
        {
          token_from: '',
          token_to: '',
          exchange_address: '',
          percent: '',
          additional_swap_params: [],
        },
      ],
    });
  };

  const removeRoute = (index: number) => {
    setSwapInfo({
      ...swapInfo,
      routes: swapInfo.routes.filter((_, i) => i !== index),
    });
  };

  const updateRoute = (index: number, field: keyof Route, value: string | string[]) => {
    const updated = [...swapInfo.routes];
    updated[index] = { ...updated[index], [field]: value };
    setSwapInfo({ ...swapInfo, routes: updated });
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!rewardsContract || !claim.id || !claim.claimee || !claim.amount) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (!swapInfo.token_from_address || !swapInfo.token_from_amount || !swapInfo.token_to_address) {
      toast({
        title: 'Error',
        description: 'Please fill all swap info fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const txHash = await harvest(rewardsContract, claim, proof, swapInfo);
      
      toast({
        title: 'Success',
        description: `Harvest transaction submitted: ${txHash.slice(0, 10)}...`,
      });

      // Reset form
      setRewardsContract('');
      setClaim({ id: '', claimee: '', amount: '' });
      setProof([]);
      setProofInput('');
      setSwapInfo({
        token_from_address: '',
        token_from_amount: '',
        token_to_address: WBTC_ADDRESS,
        token_to_amount: '',
        token_to_min_amount: '',
        beneficiary: contractAddress || '',
        integrator_fee_amount_bps: '0',
        integrator_fee_recipient: contractAddress || '',
        routes: [],
      });
    } catch (err: any) {
      console.error('Harvest failed:', err);
      toast({
        title: 'Error',
        description: err?.message || 'Harvest failed',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Harvest Rewards</CardTitle>
          <CardDescription>Connect your wallet to harvest rewards</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Harvest Rewards</CardTitle>
        <CardDescription>
          Claim rewards from Vesu and swap them to the vault asset
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rewards Contract */}
        <div className="space-y-2">
          <Label>Rewards Contract Address</Label>
          <Input
            type="text"
            placeholder="0x..."
            value={rewardsContract}
            onChange={(e) => setRewardsContract(e.target.value)}
            disabled={isSubmitting || isPending}
          />
          <p className="text-xs text-muted-foreground">
            The contract address of the rewards distributor (e.g., DeFi Spring or BTCFi distributor)
          </p>
        </div>

        {/* Claim */}
        <div className="space-y-4 border rounded-lg p-4">
          <Label>Claim Information</Label>
          
          <div className="space-y-2">
            <Label>Claim ID (u64)</Label>
            <Input
              type="text"
              placeholder="0"
              value={claim.id}
              onChange={(e) => setClaim({ ...claim, id: e.target.value })}
              disabled={isSubmitting || isPending}
            />
          </div>

          <div className="space-y-2">
            <Label>Claimee Address</Label>
            <Input
              type="text"
              placeholder="0x..."
              value={claim.claimee}
              onChange={(e) => setClaim({ ...claim, claimee: e.target.value })}
              disabled={isSubmitting || isPending}
            />
          </div>

          <div className="space-y-2">
            <Label>Amount (u128)</Label>
            <Input
              type="text"
              placeholder="0"
              value={claim.amount}
              onChange={(e) => setClaim({ ...claim, amount: e.target.value })}
              disabled={isSubmitting || isPending}
            />
          </div>
        </div>

        {/* Proof */}
        <div className="space-y-4 border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <Label>Proof (Array&lt;felt252&gt;)</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={addProofItem}
              disabled={!proofInput.trim() || isSubmitting || isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="0x..."
              value={proofInput}
              onChange={(e) => setProofInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addProofItem()}
              disabled={isSubmitting || isPending}
            />
          </div>

          {proof.length > 0 && (
            <div className="space-y-2">
              {proof.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <code className="text-xs">{item.slice(0, 20)}...</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProofItem(index)}
                    disabled={isSubmitting || isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Swap Info */}
        <div className="space-y-4 border rounded-lg p-4">
          <Label>Swap Information</Label>
          
          <div className="space-y-2">
            <Label>Token From Address</Label>
            <Input
              type="text"
              placeholder="0x..."
              value={swapInfo.token_from_address}
              onChange={(e) => setSwapInfo({ ...swapInfo, token_from_address: e.target.value })}
              disabled={isSubmitting || isPending}
            />
          </div>

          <div className="space-y-2">
            <Label>Token From Amount (u256)</Label>
            <Input
              type="text"
              placeholder="0"
              value={swapInfo.token_from_amount}
              onChange={(e) => setSwapInfo({ ...swapInfo, token_from_amount: e.target.value })}
              disabled={isSubmitting || isPending}
            />
          </div>

          <div className="space-y-2">
            <Label>Token To Address</Label>
            <Input
              type="text"
              placeholder={WBTC_ADDRESS}
              value={swapInfo.token_to_address}
              onChange={(e) => setSwapInfo({ ...swapInfo, token_to_address: e.target.value })}
              disabled={isSubmitting || isPending}
            />
          </div>

          <div className="space-y-2">
            <Label>Token To Amount (u256)</Label>
            <Input
              type="text"
              placeholder="0"
              value={swapInfo.token_to_amount}
              onChange={(e) => setSwapInfo({ ...swapInfo, token_to_amount: e.target.value })}
              disabled={isSubmitting || isPending}
            />
          </div>

          <div className="space-y-2">
            <Label>Token To Min Amount (u256)</Label>
            <Input
              type="text"
              placeholder="0"
              value={swapInfo.token_to_min_amount}
              onChange={(e) => setSwapInfo({ ...swapInfo, token_to_min_amount: e.target.value })}
              disabled={isSubmitting || isPending}
            />
          </div>

          <div className="space-y-2">
            <Label>Integrator Fee Amount BPS (u128)</Label>
            <Input
              type="text"
              placeholder="0"
              value={swapInfo.integrator_fee_amount_bps}
              onChange={(e) => setSwapInfo({ ...swapInfo, integrator_fee_amount_bps: e.target.value })}
              disabled={isSubmitting || isPending}
            />
            <p className="text-xs text-muted-foreground">
              Basis points (typically 0)
            </p>
          </div>

          {/* Routes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Routes</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addRoute}
                disabled={isSubmitting || isPending}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Route
              </Button>
            </div>

            {swapInfo.routes.map((route, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Route {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRoute(index)}
                    disabled={isSubmitting || isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Token From</Label>
                    <Input
                      type="text"
                      placeholder="0x..."
                      value={route.token_from}
                      onChange={(e) => updateRoute(index, 'token_from', e.target.value)}
                      disabled={isSubmitting || isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Token To</Label>
                    <Input
                      type="text"
                      placeholder="0x..."
                      value={route.token_to}
                      onChange={(e) => updateRoute(index, 'token_to', e.target.value)}
                      disabled={isSubmitting || isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Exchange Address</Label>
                    <Input
                      type="text"
                      placeholder="0x..."
                      value={route.exchange_address}
                      onChange={(e) => updateRoute(index, 'exchange_address', e.target.value)}
                      disabled={isSubmitting || isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Percent (u128)</Label>
                    <Input
                      type="text"
                      placeholder="10000"
                      value={route.percent}
                      onChange={(e) => updateRoute(index, 'percent', e.target.value)}
                      disabled={isSubmitting || isPending}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || isPending}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Harvesting...
            </>
          ) : (
            'Harvest'
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Info Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> Harvest requires the RELAYER role. 
            The beneficiary and integrator_fee_recipient are set to the vault address.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

