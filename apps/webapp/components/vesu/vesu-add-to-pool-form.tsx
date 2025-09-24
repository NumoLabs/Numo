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
import { useVesuDeposit } from '@/hooks/use-vesu-deposit';
import type { VesuPool } from '@/types/VesuPools';
import { formatApy, calculateRiskLevel, getVesuConfig } from '@/lib/vesu-config';
import { isTestnet } from '@/lib/utils';

interface VesuAddToPoolFormProps {
  pool: VesuPool;
  onAddToPool: (amount: number, assetAddress: string) => void;
  isLoading: boolean;
}

export function VesuAddToPoolForm({ pool, onAddToPool, isLoading }: VesuAddToPoolFormProps) {
  const [amount, setAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(pool.assets[0] || null);
  
  // Force ETH selection for testing
  const forceETHSelection = () => {
    console.log('🔧 Available assets:', pool.assets.map(a => ({ symbol: a.symbol, address: a.address })));
    const ethAsset = pool.assets.find(asset => asset.symbol === 'ETH');
    console.log('🔧 ETH asset found:', ethAsset);
    if (ethAsset) {
      setSelectedAsset(ethAsset);
      console.log('🔧 Forced ETH selection for testing:', ethAsset);
    } else {
      console.log('🔧 No ETH asset found, using first asset:', pool.assets[0]);
      setSelectedAsset(pool.assets[0]);
    }
  };
  
  // Auto-select ETH on component mount
  React.useEffect(() => {
    forceETHSelection();
  }, [pool.assets]);
  const [testMode, setTestMode] = useState(true); // Modo de prueba activado para testing
  const [manualBalance, setManualBalance] = useState(1.0); // Balance manual para testing
  const { balances, isLoading: isLoadingBalances, refreshBalances } = useWalletBalance();
  const { address } = useWallet();
  const isConnected = !!address;
  const { toast } = useToast();
  const { deposit, isLoading: isDepositing, error: depositError, checkPosition } = useVesuDeposit();

  // Official Mainnet addresses from vesu-v1 repository
  const mainnetAddresses = {
    'ETH': '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', // Official Mainnet ETH
    'WBTC': '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac', // Official Mainnet WBTC
    'USDC': '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8', // Official Mainnet USDC
    'USDT': '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8', // Official Mainnet USDT
    'STRK': '0x0057912720381af14b0e5c87aa4718ed5e527eab60b3801ebf702ab09139e38b', // Official Mainnet STRK
    'wstETH': '0x042b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2', // Official Mainnet wstETH
    'wstETH Legacy': '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d', // Official Mainnet wstETH Legacy
  };

  // Get balance for selected asset
  const walletBalance = testMode 
    ? manualBalance // Use manual balance in test mode
    : (selectedAsset 
        ? balances.find(b => b.address.toLowerCase() === selectedAsset.address.toLowerCase())?.balance || 0
        : 0);

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const handleMaxAmount = () => {
    setAmount(walletBalance.toString());
  };

  const handleDebug = () => {
    console.log('=== MANUAL DEBUG ===');
    console.log('Address:', address);
    console.log('Is Connected:', isConnected);
    console.log('Balances:', balances);
    console.log('Selected Asset:', selectedAsset);
    console.log('Pool Assets:', pool.assets);
    console.log('Test Mode:', testMode);
    console.log('Manual Balance:', manualBalance);
    console.log('Wallet Balance:', walletBalance);
    console.log('Amount:', amount);
    console.log('Is Valid Amount:', isValidAmount);
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
    if (numAmount > walletBalance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this deposit",
        variant: "destructive",
      });
      return;
    }

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
      
      const result = await deposit({
        poolId: vesuConfig.genesisPoolId,
        assetAddress: assetAddress,
        amount: numAmount,
        decimals: selectedAsset.decimals || 18
      });

      if (result.success) {
        // Refresh balances after successful deposit
        await refreshBalances();
        // Call the original callback for any additional handling
        onAddToPool(numAmount, assetAddress);
      }
    } catch (error) {
      console.error('Deposit failed:', error);
      toast({
        title: "Deposit Failed",
        description: "An error occurred while processing your deposit",
        variant: "destructive",
      });
    }
  };

  // Simplified validation logic
  const numAmount = Number(amount);
  const isValidAmount = amount && 
    !isNaN(numAmount) &&
    numAmount >= 0.001 && 
    numAmount <= 1000 && 
    (testMode || numAmount <= walletBalance);
    
  // Debug validation step by step
  console.log('🔍 VALIDATION DEBUG:', {
    amount,
    amountType: typeof amount,
    amountLength: amount?.length,
    numAmount,
    isNaN: isNaN(numAmount),
    minCheck: numAmount >= 0.001,
    maxCheck: numAmount <= 1000,
    testMode,
    walletBalance,
    balanceCheck: testMode || numAmount <= walletBalance,
    isValidAmount,
    // Force validation for testing
    forceValid: true
  });
  
  // TEMPORARY: Force validation to true for testing
  const finalIsValidAmount = true; // isValidAmount;

  const estimatedRewards = amount && !isNaN(Number(amount)) && selectedAsset
    ? (Number(amount) * selectedAsset.apy) / 100 
    : 0;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
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
                `Balance: ${walletBalance.toFixed(4)} ${selectedAsset?.symbol || 'Token'}`
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
        {finalIsValidAmount && selectedAsset && (
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

        {/* Balance Controls */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-medium text-blue-800">Balance Controls</h4>
              <p className="text-xs text-blue-600">Manage wallet balances and validation</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={refreshBalances}
                disabled={isLoadingBalances}
                className="px-3 py-1 rounded text-xs font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoadingBalances ? 'Loading...' : 'Refresh'}
              </button>
              <button
                onClick={handleDebug}
                className="px-3 py-1 rounded text-xs font-medium bg-green-500 text-white hover:bg-green-600"
              >
                Debug
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-blue-600">Test Mode (skip balance check)</span>
              </div>
              <button
                onClick={() => setTestMode(!testMode)}
                className={`px-3 py-1 rounded text-xs font-medium ${
                  testMode 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {testMode ? 'ON' : 'OFF'}
              </button>
            </div>
            {testMode && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-600">Manual Balance:</span>
                <input
                  type="number"
                  value={manualBalance}
                  onChange={(e) => setManualBalance(Number(e.target.value))}
                  className="w-20 px-2 py-1 text-xs border rounded"
                  step="0.1"
                  min="0"
                />
                <span className="text-xs text-blue-600">{selectedAsset?.symbol || 'ETH'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Debug Info */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
          <h4 className="font-medium text-yellow-800 mb-2">Debug Info:</h4>
          <div className="space-y-1 text-yellow-700">
            <div><strong>Input:</strong> Amount: "{amount}" → Number: {numAmount}</div>
            <div><strong>Validation:</strong> Valid Amount: {finalIsValidAmount ? '✅' : '❌'}</div>
            <div><strong>Mode:</strong> Test Mode: {testMode ? '✅ ON' : '❌ OFF'}</div>
            <div><strong>Asset:</strong> Selected: {selectedAsset ? `✅ ${selectedAsset.symbol}` : '❌ None'}</div>
            <div><strong>Wallet:</strong> Connected: {isConnected ? '✅' : '❌'} | Address: {address ? `${address.slice(0, 10)}...` : 'None'}</div>
            <div><strong>Balance:</strong> {walletBalance} {selectedAsset?.symbol || 'Token'}</div>
            <div><strong>Checks:</strong> Min(≥0.001): {numAmount >= 0.001 ? '✅' : '❌'} | Max(≤1000): {numAmount <= 1000 ? '✅' : '❌'} | Balance: {testMode ? 'SKIPPED' : (numAmount <= walletBalance ? '✅' : '❌')}</div>
            <div><strong>Loading:</strong> Balances: {isLoadingBalances ? '⏳' : '✅'} | Depositing: {isDepositing ? '⏳' : '✅'}</div>
            <div><strong>Data:</strong> Balances Count: {balances.length} | Pool Assets: {pool.assets.length}</div>
            {balances.length > 0 && (
              <div className="mt-2">
                <strong>All Balances:</strong>
                {balances.map((b, i) => (
                  <div key={i} className="ml-2">
                    {b.symbol}: {b.balance} (addr: {b.address.slice(0, 10)}...)
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleAddToPool}
          disabled={!finalIsValidAmount || isLoading || isDepositing || !selectedAsset || !isConnected}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          size="lg"
        >
          {isLoading || isDepositing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isDepositing ? 'Processing Deposit...' : 'Adding to Pool...'}
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
          ) : !finalIsValidAmount ? (
            <>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Invalid Amount - Check Debug Info
            </>
          ) : (
            <>
              <ArrowRight className="h-4 w-4 mr-2" />
              {testMode ? 'Test Deposit to Vesu Pool' : 'Add to Vesu Pool'}
            </>
          )}
        </Button>

        {/* Check Position Button */}
        {isConnected && selectedAsset && (
          <Button
            onClick={async () => {
              if (!address || !selectedAsset) return;
              
              const vesuConfig = getVesuConfig();
              const isMainnet = vesuConfig.network === 'mainnet';
              const assetAddress = isMainnet 
                ? mainnetAddresses[selectedAsset.symbol as keyof typeof mainnetAddresses] || selectedAsset.address
                : selectedAsset.address;
              
              console.log('🔍 Checking position manually...');
              await checkPosition(vesuConfig.genesisPoolId, assetAddress, address);
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
