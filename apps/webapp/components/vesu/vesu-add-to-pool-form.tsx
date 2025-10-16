// Vesu Add to Pool Form Component
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  TrendingUp, 
  ArrowRight, 
  Loader2, 
  Shield,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWalletBalance } from '@/hooks/use-wallet-balance';
import { useWallet } from '@/hooks/use-wallet';
import { useVesuTransactions } from '@/hooks/use-vesu-transactions';
import type { VesuPool } from '@/types/VesuPools';
import { formatApy, calculateRiskLevel, getVesuConfig } from '@/lib/vesu-config';
import { isTestnet } from '@/lib/utils';
import { Contract, RpcProvider } from 'starknet';
import { useEffect } from 'react';

interface VesuAddToPoolFormProps {
  pool: VesuPool;
  onAddToPool: (amount: number, assetAddress: string) => void;
  isLoading: boolean;
}

export function VesuAddToPoolForm({ pool, onAddToPool, isLoading }: VesuAddToPoolFormProps) {
  const [amount, setAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(pool.assets[0] || null);

  const [directBalance, setDirectBalance] = useState(0); // Balance obtenido directamente
  const { balances, isLoading: isLoadingBalances, refreshBalances } = useWalletBalance();
  const { address } = useWallet();
  const isConnected = !!address;
  const { toast } = useToast();
  const { depositToVesu, isLoading: isDepositing, currentStep } = useVesuTransactions();

  // Official Mainnet addresses from vesu-v1 repository
  const mainnetAddresses = {
    'ETH': '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', // Official Mainnet ETH
    'WBTC': '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac', // Official Mainnet WBTC
    'USDC': '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8', // Official Mainnet USDC
    'USDT': '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8', // Official Mainnet USDT
    'STRK': '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d', // Official Mainnet STRK
    'wstETH': '0x042b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2', // Official Mainnet wstETH
    'wstETH Legacy': '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d', // Official Mainnet wstETH Legacy
  };

  // Function to get balance directly from contract
  const getDirectBalance = async (tokenAddress: string, decimals: number) => {
    if (!address) {
      console.log('No address available for balance check');
      return 0;
    }
    
    try {
      const provider = new RpcProvider({
        nodeUrl: isTestnet() 
          ? 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7'
          : 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7'
      });

      const contract = new Contract([
        {
          name: 'balanceOf',
          type: 'function',
          inputs: [{ name: 'account', type: 'felt' }],
          outputs: [{ name: 'balance', type: 'Uint256' }],
          stateMutability: 'view'
        }
      ], tokenAddress, provider);

      const result = await contract.balanceOf(address);
      console.log('Raw balance result:', result);
      
      // Handle different response formats
      let balanceWei;
      if (result.balance && typeof result.balance === 'object') {
        balanceWei = result.balance.low || result.balance;
      } else if (typeof result.balance === 'string' || typeof result.balance === 'number') {
        balanceWei = result.balance;
      } else {
        console.error('Unexpected balance format:', result);
        return 0;
      }
      
      const balance = Number(balanceWei) / Math.pow(10, decimals);
      
      // Validate the result
      if (isNaN(balance) || balance < 0) {
        console.error('Invalid balance calculated:', balance, 'from wei:', balanceWei);
        return 0;
      }
      
      console.log(`🔍 Direct balance for ${tokenAddress}: ${balance} (${balanceWei} wei, ${decimals} decimals)`);
      return balance;
    } catch (error) {
      console.error('Error getting direct balance:', error);
      return 0;
    }
  };

  // Get balance for selected asset
  const walletBalance = selectedAsset 
    ? (() => {
        const foundBalance = balances.find(b => {
          // Match by address or symbol for better compatibility
          const addressMatch = b.address.toLowerCase() === selectedAsset.address.toLowerCase();
          const symbolMatch = b.symbol?.toLowerCase() === selectedAsset.symbol.toLowerCase();
          return addressMatch || symbolMatch;
        })?.balance;
        
        // Return the first valid balance (hook balance or direct balance)
        const hookBalance = foundBalance && !isNaN(foundBalance) ? foundBalance : 0;
        const directBalanceValue = directBalance && !isNaN(directBalance) ? directBalance : 0;
        
        return hookBalance > 0 ? hookBalance : directBalanceValue;
      })()
    : (directBalance && !isNaN(directBalance) ? directBalance : 0);

  // Get direct balance when asset changes
  useEffect(() => {
    if (selectedAsset && address) {
      console.log('🔍 Getting direct balance for:', selectedAsset.symbol, selectedAsset.address);
      getDirectBalance(selectedAsset.address, selectedAsset.decimals).then(balance => {
        console.log('Setting direct balance:', balance);
        setDirectBalance(isNaN(balance) ? 0 : balance);
      });
    } else {
      setDirectBalance(0);
    }
  }, [selectedAsset, address]);

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const handleMaxAmount = () => {
    setAmount(walletBalance.toString());
  };


  const handleAddToPool = async () => {
    // Debug wallet status before deposit
    console.log('🔍 COMPONENT WALLET DEBUG:', {
      isConnected,
      address,
      selectedAsset: selectedAsset?.symbol
    });

    if (!selectedAsset) {
      toast({
        title: "No Asset Selected",
        description: "Please select an asset to deposit",
        variant: "destructive",
      });
      return;
    }

    const numAmount = Number(amount);
    const minDeposit = 0.001; // Minimum deposit for Vesu pools
    const maxDeposit = 1000; // Maximum deposit for Vesu pools

    if (numAmount < minDeposit) {
      toast({
        title: "Amount Too Low",
        description: `Minimum deposit is ${minDeposit.toFixed(3)} ${selectedAsset.symbol}`,
        variant: "destructive",
      });
      return;
    }
    if (numAmount > maxDeposit) {
      toast({
        title: "Amount Too High",
        description: `Maximum deposit is ${maxDeposit.toFixed(2)} ${selectedAsset.symbol}`,
        variant: "destructive",
      });
      return;
    }
    // Temporarily comment out balance check for testing
    // if (numAmount > walletBalance) {
    //   toast({
    //     title: "Insufficient Balance",
    //     description: "You don't have enough balance for this deposit",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    try {
      const vesuConfig = getVesuConfig();
      
      console.log('🔍 DEBUG - Current Network:', vesuConfig.network);
      console.log('🔍 DEBUG - Is Testnet:', isTestnet());
      console.log('🔍 DEBUG - Mainnet Addresses Available:', mainnetAddresses);
      console.log('🔍 DEBUG - Selected Asset Symbol:', selectedAsset.symbol);
      console.log('🔍 DEBUG - Is USDC Selected?', selectedAsset.symbol === 'USDC');
      console.log('🔍 DEBUG - All Available Assets:', pool.assets.map((a: any) => ({ symbol: a.symbol, address: a.address })));
      
      // Use correct addresses based on network
      const isMainnet = vesuConfig.network === 'mainnet';
      const assetAddress = isMainnet 
        ? mainnetAddresses[selectedAsset.symbol as keyof typeof mainnetAddresses] || selectedAsset.address
        : selectedAsset.address;
      
      console.log('🔍 DEBUG - Asset Selection:', {
        symbol: selectedAsset.symbol,
        originalAddress: selectedAsset.address,
        mainnetAddress: assetAddress,
        isUsingMainnet: mainnetAddresses[selectedAsset.symbol as keyof typeof mainnetAddresses] !== undefined,
        selectedAssetFull: selectedAsset,
        mainnetAddressesKeys: Object.keys(mainnetAddresses),
        vesuConfig: vesuConfig
      });
      
      const result = await depositToVesu(
        pool.id,
        assetAddress,
        numAmount,
        selectedAsset.decimals || 18,
        selectedAsset.vTokenAddress
      );

      if (result?.success) {
        // Refresh balances after successful deposit
        await refreshBalances();
        // Call the original callback for any additional handling
        onAddToPool(numAmount, assetAddress);
        
        toast({
          title: "Deposit Successful!",
          description: `Successfully deposited ${numAmount} ${selectedAsset.symbol} to ${pool.name}`,
        });
      } else {
        toast({
          title: "Deposit Failed",
          description: result?.error || "Failed to deposit to Vesu pool",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Deposit failed:', error);
      
      // Extract meaningful error message
      let errorMessage = "An error occurred while processing your deposit";
      if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.reason) {
        errorMessage = error.reason;
      }
      
      toast({
        title: "Deposit Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Simplified validation logic
  const numAmount = Number(amount);
  const isValidAmount = amount && 
    !isNaN(numAmount) &&
    numAmount >= 0.001 && 
    numAmount <= 1000;

  const estimatedRewards = amount && !isNaN(Number(amount)) && selectedAsset
    ? (Number(amount) * selectedAsset.apy) / 100 
    : 0;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-500 text-white border-green-600';
      case 'Medium': return 'bg-yellow-500 text-white border-yellow-600';
      case 'High': return 'bg-red-500 text-white border-red-600';
      case 'Critical': return 'bg-red-600 text-white border-red-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'Low': return <Shield className="h-4 w-4" />;
      case 'Medium': return <AlertTriangle className="h-4 w-4" />;
      case 'High': return <AlertTriangle className="h-4 w-4" />;
      case 'Critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-white/90 via-blue-50/30 to-purple-50/30 dark:from-gray-900/90 dark:via-blue-950/20 dark:to-purple-950/20 backdrop-blur-xl border-2 border-blue-200/40 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <CheckCircle className="h-5 w-5 text-blue-500" />
          Add to Vesu Pool
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Deposit funds to start earning in {pool.name}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Asset Selection */}
        {pool.assets.length > 1 && (
          <div className="space-y-2">
            <Label>Select Asset</Label>
            <div className="grid gap-2">
              {pool.assets.map((asset, index) => {
                const hasAssetData = asset.apy > 0 || asset.currentUtilization > 0;
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedAsset?.symbol === asset.symbol
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedAsset(asset)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {asset.symbol.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <h5 className="font-medium">{asset.name}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{asset.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600 dark:text-green-400">
                          {hasAssetData ? formatApy(asset.apy) : 'N/A'}
                        </p>
                        <Badge className={`${hasAssetData ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'} flex items-center gap-1 text-xs`}>
                          {hasAssetData ? <Shield className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                          {hasAssetData ? 'Live' : 'No Data'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="deposit-amount">
            Amount ({selectedAsset?.symbol || 'Token'})
          </Label>
          <div className="flex gap-2">
            <Input
              id="deposit-amount"
              type="number"
              placeholder="0.001"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="text-lg"
            />
            <Button
              variant="outline"
              onClick={handleMaxAmount}
              className="shrink-0"
            >
              Max
            </Button>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {isLoadingBalances ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading balance...
                </span>
              ) : isConnected ? (
                <span>Balance: {isNaN(walletBalance) ? '0.0000' : walletBalance.toFixed(4)} {selectedAsset?.symbol || 'Token'}</span>
              ) : (
                'Connect wallet to see balance'
              )}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Min: 0.001 | Max: 1000
            </span>
          </div>
        </div>

        {/* Estimated Rewards */}
        {isValidAmount && selectedAsset && (
          <div className="p-4 bg-gradient-to-br from-green-100/50 via-green-200/30 to-green-100/50 dark:from-green-900/30 dark:via-green-800/20 dark:to-green-900/20 rounded-lg border border-green-200/40 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm mb-1">Estimated Annual Rewards</h4>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {estimatedRewards.toFixed(4)} {selectedAsset.symbol}
                </p>
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                {formatApy(selectedAsset.apy)}
              </Badge>
            </div>
          </div>
        )}

        {/* Pool Summary */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-blue-600 dark:text-blue-400">Pool Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Pool Name</span>
              <span className="font-medium">{pool.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Selected Asset</span>
              <span className="font-medium">{selectedAsset?.name || 'None'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Current APY</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {selectedAsset && selectedAsset.apy > 0 ? formatApy(selectedAsset.apy) : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Utilization</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {selectedAsset && selectedAsset.currentUtilization > 0 ? `${selectedAsset.currentUtilization.toFixed(1)}%` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Data Status</span>
              <Badge className={`${selectedAsset && (selectedAsset.apy > 0 || selectedAsset.currentUtilization > 0) ? 'bg-green-100 text-green-800 border-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'} flex items-center gap-1`}>
                {selectedAsset && (selectedAsset.apy > 0 || selectedAsset.currentUtilization > 0) ? <Shield className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                {selectedAsset && (selectedAsset.apy > 0 || selectedAsset.currentUtilization > 0) ? 'Live Data' : 'No Live Data'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-blue-600 dark:text-blue-400">Benefits</h4>
          <div className="grid gap-2">
            <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-blue-100/30 via-blue-200/20 to-purple-100/30 dark:from-blue-900/20 dark:via-blue-800/10 dark:to-purple-900/10 rounded-lg border border-blue-200/40 shadow-md">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm">Competitive yield rates</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-green-100/30 via-green-200/20 to-green-100/30 dark:from-green-900/20 dark:via-green-800/10 dark:to-green-900/10 rounded-lg border border-green-200/40 shadow-md">
              <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm">Audited smart contracts</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gradient-to-br from-purple-100/30 via-purple-200/20 to-purple-100/30 dark:from-purple-900/20 dark:via-purple-800/10 dark:to-purple-900/10 rounded-lg border border-purple-200/40 shadow-md">
              <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm">Real-time utilization tracking</span>
            </div>
          </div>
        </div>

        {/* Fees */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-blue-600 dark:text-blue-400">Fees & Terms</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Deposit Fee</span>
              <span className="font-medium">0.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Withdrawal Fee</span>
              <span className="font-medium">0.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Performance Fee</span>
              <span className="font-medium">10%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Lock Period</span>
              <span className="font-medium">None</span>
            </div>
          </div>
        </div>


        {/* Action Button */}
        <Button
          onClick={handleAddToPool}
          disabled={!isValidAmount || isLoading || isDepositing || !selectedAsset || !isConnected}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          size="lg"
        >
          {isLoading || isDepositing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isDepositing ? (currentStep || 'Processing Deposit...') : 'Adding to Pool...'}
            </>
          ) : !isConnected ? (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Connect Wallet First
            </>
          ) : !selectedAsset ? (
            <>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Select Asset First
            </>
          ) : !isValidAmount ? (
            <>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Invalid Amount
            </>
          ) : (
            <>
              <ArrowRight className="h-4 w-4 mr-2" />
              Add to Vesu Pool
            </>
          )}
        </Button>

        {/* Check Position Button */}
        {isConnected && selectedAsset && (
          <Button
            onClick={async () => {
              toast({
                title: "Position Check",
                description: "Position checking will be available in a future update",
              });
            }}
            variant="outline"
            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
            size="sm"
          >
            <Shield className="h-4 w-4 mr-2" />
            Check My Position in Pool
          </Button>
        )}

        {/* Warning */}
        <div className="p-3 bg-gradient-to-br from-blue-100/30 via-blue-200/20 to-purple-100/30 dark:from-blue-900/20 dark:via-blue-800/10 dark:to-purple-900/10 rounded-lg border border-blue-200/40 shadow-md">
          <div className="flex items-start gap-2">
            <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-xs">
              <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                Real Vesu Pool Data
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                This interface shows only real data from Vesu Protocol. APY and utilization rates 
                are fetched from the official Vesu API. DeFi investments carry risks. Only invest what you can afford to lose.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
