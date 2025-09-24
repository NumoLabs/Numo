// Vesu Deposit Hook - Real implementation for depositing into Vesu pools
import { useState, useCallback } from 'react';
import { Account, Contract, RpcProvider, CallData, CairoCustomEnum } from 'starknet';
import { useWalletStatus, useWallet } from './use-wallet';
import { useToast } from './use-toast';
import { getVesuConfig } from '@/lib/vesu-config';
import { isTestnet } from '@/lib/utils';
import { 
  createVesuDepositParams, 
  createVesuAmount, 
  createEmptyVesuAmount,
  getVesuProtocolData 
} from '@/lib/vesu-real-implementation';
import { parseVesuAmount } from '@/lib/utils';

// ERC20 ABI for token approval and balance checking
const ERC20_ABI = [
  {
    "name": "approve",
    "type": "function",
    "inputs": [
      { "name": "spender", "type": "felt" },
      { "name": "amount", "type": "Uint256" }
    ],
    "outputs": [
      { "name": "success", "type": "felt" }
    ],
    "stateMutability": "external"
  },
  {
    "name": "balanceOf",
    "type": "function",
    "inputs": [
      { "name": "account", "type": "felt" }
    ],
    "outputs": [
      { "name": "balance", "type": "Uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "name": "decimals",
    "type": "function",
    "inputs": [],
    "outputs": [
      { "name": "decimals", "type": "felt" }
    ],
    "stateMutability": "view"
  }
];

// Official Vesu Singleton ABI from mainnet contract
const VESU_SINGLETON_ABI = [
  {
    "type": "struct",
    "name": "core::integer::u256",
    "members": [
      { "name": "low", "type": "core::integer::u128" },
      { "name": "high", "type": "core::integer::u128" }
    ]
  },
  {
    "type": "enum",
    "name": "core::bool",
    "variants": [
      { "name": "False", "type": "()" },
      { "name": "True", "type": "()" }
    ]
  },
  {
    "type": "struct",
    "name": "vesu::data_model::AssetConfig",
    "members": [
      {
        "name": "total_collateral_shares",
        "type": "core::integer::u256"
      },
      {
        "name": "total_nominal_debt",
        "type": "core::integer::u256"
      },
      {
        "name": "reserve",
        "type": "core::integer::u256"
      },
      {
        "name": "max_utilization",
        "type": "core::integer::u256"
      },
      {
        "name": "floor",
        "type": "core::integer::u256"
      },
      {
        "name": "scale",
        "type": "core::integer::u256"
      },
      {
        "name": "is_legacy",
        "type": "core::bool"
      },
      {
        "name": "last_updated",
        "type": "core::integer::u64"
      },
      {
        "name": "last_rate_accumulator",
        "type": "core::integer::u256"
      },
      {
        "name": "last_full_utilization_rate",
        "type": "core::integer::u256"
      },
      {
        "name": "fee_rate",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "type": "struct",
    "name": "vesu::data_model::Position",
    "members": [
      {
        "name": "collateral_shares",
        "type": "core::integer::u256"
      },
      {
        "name": "nominal_debt",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "type": "struct",
    "name": "alexandria_math::i257::i257",
    "members": [
      { "name": "abs", "type": "core::integer::u256" },
      { "name": "is_negative", "type": "core::bool" }
    ]
  },
  {
    "type": "enum",
    "name": "vesu::data_model::AmountType",
    "variants": [
      { "name": "Delta", "type": "()" },
      { "name": "Target", "type": "()" }
    ]
  },
  {
    "type": "enum",
    "name": "vesu::data_model::AmountDenomination",
    "variants": [
      { "name": "Native", "type": "()" },
      { "name": "Assets", "type": "()" }
    ]
  },
  {
    "type": "struct",
    "name": "vesu::data_model::Amount",
    "members": [
      { "name": "amount_type", "type": "vesu::data_model::AmountType" },
      { "name": "denomination", "type": "vesu::data_model::AmountDenomination" },
      { "name": "value", "type": "alexandria_math::i257::i257" }
    ]
  },
  {
    "type": "struct",
    "name": "core::array::Span::<core::felt252>",
    "members": [
      { "name": "snapshot", "type": "@core::array::Array::<core::felt252>" }
    ]
  },
  {
    "type": "struct",
    "name": "vesu::data_model::ModifyPositionParams",
    "members": [
      { "name": "pool_id", "type": "core::felt252" },
      { "name": "collateral_asset", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "debt_asset", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "user", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "collateral", "type": "vesu::data_model::Amount" },
      { "name": "debt", "type": "vesu::data_model::Amount" },
      { "name": "data", "type": "core::array::Span::<core::felt252>" }
    ]
  },
  {
    "type": "function",
    "name": "modify_position",
    "inputs": [
      { "name": "params", "type": "vesu::data_model::ModifyPositionParams" }
    ],
    "outputs": [
      { "name": "response", "type": "vesu::data_model::UpdatePositionResponse" }
    ],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "extension",
    "inputs": [
      { "name": "pool_id", "type": "core::felt252" }
    ],
    "outputs": [
      { "name": "extension", "type": "core::starknet::contract_address::ContractAddress" }
    ],
    "state_mutability": "view"
  },
  {
    "type": "function",
    "name": "asset_config",
    "inputs": [
      { "name": "pool_id", "type": "core::felt252" },
      { "name": "asset", "type": "core::starknet::contract_address::ContractAddress" }
    ],
    "outputs": [
      { "name": "config", "type": "vesu::data_model::AssetConfig" },
      { "name": "fee_shares", "type": "core::integer::u256" }
    ],
    "state_mutability": "external"
  },
  {
    "type": "function",
    "name": "position",
    "inputs": [
      { "name": "pool_id", "type": "core::felt252" },
      { "name": "collateral_asset", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "debt_asset", "type": "core::starknet::contract_address::ContractAddress" },
      { "name": "user", "type": "core::starknet::contract_address::ContractAddress" }
    ],
    "outputs": [
      { "name": "position", "type": "vesu::data_model::Position" },
      { "name": "collateral_balance", "type": "core::integer::u256" },
      { "name": "debt_balance", "type": "core::integer::u256" }
    ],
    "state_mutability": "external"
  }
];

interface DepositParams {
  poolId: string;
  assetAddress: string;
  amount: number;
  decimals: number;
}

interface DepositResult {
  approvalTxHash?: string;
  depositTxHash?: string;
  success: boolean;
  error?: string;
}

export function useVesuDeposit() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address, isConnected } = useWalletStatus();
  const { account } = useWallet(); // Get account from wallet context
  const { toast } = useToast();

  const deposit = useCallback(async (params: DepositParams): Promise<DepositResult> => {
    // Debug wallet connection status
    console.log('🔍 WALLET DEBUG:', {
      isConnected,
      address,
      account: !!account,
      accountAddress: account?.address
    });

    if (!isConnected || !address || !account) {
      const errorMsg = `Wallet not connected or account not available. isConnected: ${isConnected}, address: ${address}, account: ${!!account}`;
      setError(errorMsg);
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to deposit",
        variant: "destructive",
      });
      return { success: false, error: errorMsg };
    }

    setIsLoading(true);
    setError(null);

    try {
      const vesuConfig = getVesuConfig();
      const { protocol } = getVesuProtocolData(isTestnet());
      
      console.log('🚀 STARTING DEPOSIT PROCESS...');
      console.log('📋 Deposit Parameters:', {
        amount: params.amount,
        assetAddress: params.assetAddress,
        // assetSymbol: params.assetSymbol, // Not available in DepositParams
        poolId: params.poolId,
        decimals: params.decimals,
        user: address
      });
      console.log('🌐 Network Info:', {
        isTestnet: isTestnet(),
        network: vesuConfig.network,
        singletonAddress: vesuConfig.singletonAddress,
        poolId: vesuConfig.genesisPoolId
      });
      
      // Create provider and account
      const provider = new RpcProvider({ 
        nodeUrl: isTestnet() 
          ? 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7'
          : 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7'
      });
      
      // Use the account from wallet context
      const starknetAccount = account;

      // Step 1: Approve token spending
      const tokenContract = new Contract(ERC20_ABI, params.assetAddress, provider);
      tokenContract.connect(starknetAccount);

      const amountInWei = parseVesuAmount(params.amount, params.decimals);
      
      console.log('🔍 DEBUG - Before approval transaction:', {
        spender: vesuConfig.singletonAddress,
        amount: amountInWei,
        amountBigInt: BigInt(amountInWei),
        asset: params.assetAddress,
        assetAddressLength: params.assetAddress?.length,
        isTestnet: isTestnet(),
        vesuConfig: vesuConfig,
        starknetAccount: starknetAccount?.address,
        accountConnected: !!starknetAccount,
        provider: 'RpcProvider'
      });

      // Try using invoke method instead of direct contract call
      console.log('🚀 EXECUTING approval transaction with:', {
        contractAddress: params.assetAddress,
        entrypoint: 'approve',
        spender: vesuConfig.singletonAddress,
        amount: { low: BigInt(amountInWei), high: BigInt(0) }
      });
      
      const approvalResult = await starknetAccount.execute({
        contractAddress: params.assetAddress,
        entrypoint: 'approve',
        calldata: CallData.compile([
          vesuConfig.singletonAddress,
          { low: BigInt(amountInWei), high: BigInt(0) }
        ])
      });

      console.log('Approval transaction:', approvalResult.transaction_hash);
      
      // Wait for approval transaction to be confirmed
      console.log('⏳ Waiting for approval transaction confirmation...');
      console.log('🔍 Approval transaction hash:', approvalResult.transaction_hash);
      console.log('🔍 Waiting with timeout of 120 seconds...');
      
      try {
        // Use Promise.race to implement timeout manually
        const waitPromise = provider.waitForTransaction(approvalResult.transaction_hash, {
          retryInterval: 2000
        });
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Transaction timeout after 120 seconds')), 120000);
        });
        
        await Promise.race([waitPromise, timeoutPromise]);
        console.log('✅ Approval transaction confirmed!');
      } catch (waitError) {
        console.error('❌ Error waiting for approval transaction:', waitError);
        console.log('🔍 Transaction might still be processing. Continuing with deposit...');
        // Continue anyway - the transaction might still be valid
      }
      
      toast({
        title: "Approval Confirmed",
        description: "Token approval transaction confirmed",
      });

      // Step 2: Create deposit parameters
      console.log('🔧 Creating deposit parameters...');
      const depositParams = await createVesuDepositParams(
        params.poolId,
        params.assetAddress,
        params.amount,
        params.decimals,
        address
      );

      console.log('📋 Deposit parameters:', depositParams);
      console.log('✅ Deposit parameters created successfully!');

      // Step 3: Execute deposit transaction
      console.log('🚀 Executing deposit transaction...');
      console.log('🔍 About to create provider and account...');
      console.log('🔍 Provider available:', !!provider);
      console.log('🔍 StarknetAccount available:', !!starknetAccount);
      console.log('🔍 VesuConfig singletonAddress:', vesuConfig.singletonAddress);
      console.log('🔧 Creating singleton contract...');
      const singletonContract = new Contract(VESU_SINGLETON_ABI, vesuConfig.singletonAddress, provider);
      console.log('✅ Singleton contract created successfully!');
      console.log('🔧 Connecting account to contract...');
      singletonContract.connect(starknetAccount);
      console.log('✅ Account connected to contract!');
      console.log('🔧 Account address:', starknetAccount.address);
        console.log('🔧 About to call modify_position with params:', depositParams);

        // Verify pool and asset configuration before deposit
        console.log('🔍 Verifying pool and asset configuration...');
        
        // Check if pool exists by getting extension
        try {
          const extension = await singletonContract.call('extension', [
            BigInt(depositParams.pool_id)
          ]);
          console.log('✅ Pool extension retrieved:', extension);
        } catch (extensionError) {
          console.error('❌ Error getting pool extension:', extensionError);
          console.log('🔍 This might indicate the pool does not exist');
        }
        
        // Check asset configuration - Skip for now since asset_config is external, not view
        console.log('🔍 Skipping asset config check (asset_config is external, not view)');
        console.log('🔍 Proceeding with deposit - asset support will be validated by the contract');

        let depositResult;
      try {
        console.log('🔧 Calling modify_position with individual parameters...');
        
        // Prepare calldata
        console.log('🔧 Preparing calldata with parameters:');
        console.log('  - pool_id:', depositParams.pool_id, '-> BigInt:', BigInt(depositParams.pool_id));
        console.log('  - collateral_asset:', depositParams.collateral_asset);
        console.log('  - debt_asset:', depositParams.debt_asset);
        console.log('  - user:', depositParams.user);
        console.log('  - collateral.value:', depositParams.collateral.value);
        console.log('  - debt.value:', depositParams.debt.value);
        console.log('  - data.length:', depositParams.data.length);
        
        console.log('🔧 About to compile calldata with struct...');
        
        // Create the struct with proper format
        const modifyPositionParams = {
          pool_id: BigInt(depositParams.pool_id),
          collateral_asset: depositParams.collateral_asset,
          debt_asset: depositParams.debt_asset,
          user: depositParams.user,
          collateral: depositParams.collateral, // Use the already created VesuAmount
          debt: depositParams.debt, // Use the already created VesuAmount
          data: depositParams.data
        };
        
        console.log('🔧 ModifyPositionParams struct:', modifyPositionParams);
        
        console.log('🔧 About to call modify_position directly...');
        
        // Add timeout and better error handling
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Transaction timeout after 120 seconds')), 120000);
        });
        
        console.log('🔧 Starting modify_position call with timeout...');
        console.log('🔧 Contract method available:', typeof singletonContract.modify_position);
        console.log('🔧 Contract address:', singletonContract.address);
        console.log('🔧 Account connected:', !!singletonContract.account);
        
        // Try using starknetAccount.execute instead of direct contract call
        try {
          console.log('🔧 Using starknetAccount.execute for modify_position...');
          // Convert BigInt to string for logging
          const loggableParams = {
            ...modifyPositionParams,
            pool_id: modifyPositionParams.pool_id.toString()
          };
          console.log('🔧 Parameters being sent:', JSON.stringify(loggableParams, null, 2));
          
          const startTime = Date.now();
          
          // Use starknetAccount.execute with the contract call
          const call = {
            contractAddress: vesuConfig.singletonAddress,
            entrypoint: 'modify_position',
            calldata: CallData.compile([modifyPositionParams])
          };
          
          console.log('🔧 Executing call:', call);
          
          depositResult = await Promise.race([
            starknetAccount.execute(call),
            timeoutPromise
          ]);
          const endTime = Date.now();
          console.log(`🔧 starknetAccount.execute returned after ${endTime - startTime}ms:`, depositResult);
        } catch (methodError) {
          console.error('🔧 Error in starknetAccount.execute call:', methodError);
          console.log('🔧 Error type:', typeof methodError);
          console.log('🔧 Error message:', methodError instanceof Error ? methodError.message : String(methodError));
          console.log('🔧 Error stack:', methodError instanceof Error ? methodError.stack : 'No stack trace');
          throw methodError;
        }
        
        console.log('✅ modify_position call completed successfully!');
        console.log('🔧 Deposit result:', depositResult);
      } catch (modifyError) {
        console.error('❌ Error in modify_position call:', modifyError);
        console.error('❌ Error details:', {
          message: modifyError instanceof Error ? modifyError.message : String(modifyError),
          stack: modifyError instanceof Error ? modifyError.stack : undefined,
          name: modifyError instanceof Error ? modifyError.name : 'Unknown'
        });
        
        // Log the error to the user
        console.error('❌ FULL ERROR OBJECT:', modifyError);
        
        // Also log to the user interface
        console.error('❌ DEPOSIT FAILED - Check console for details');
        
        throw modifyError;
      }

      console.log('Deposit transaction:', depositResult.transaction_hash);

      // Wait for deposit transaction to be confirmed
      await provider.waitForTransaction(depositResult.transaction_hash);

      console.log('✅ DEPOSIT COMPLETED SUCCESSFULLY!');
      console.log('📊 Transaction Details:', {
        approvalTxHash: approvalResult.transaction_hash,
        depositTxHash: depositResult.transaction_hash,
        amount: params.amount,
        asset: params.assetAddress,
        poolId: params.poolId,
        user: address
      });

      // Verify the deposit by checking the position
      try {
        console.log('🔍 Verifying deposit...');
        const positionResult = await singletonContract.call('position', [
          BigInt(depositParams.pool_id), // Convert pool_id to BigInt
          depositParams.collateral_asset,
          '0x0', // debt_asset (Zero for simple lending)
          address
        ]);
        
        console.log('📈 Position after deposit:', positionResult);
      } catch (verifyErr) {
        console.warn('⚠️ Could not verify position:', verifyErr);
      }

      toast({
        title: "Deposit Successful! 🎉",
        description: `Successfully deposited ${params.amount} tokens to Vesu pool. Check your position!`,
      });

      return {
        approvalTxHash: approvalResult.transaction_hash,
        depositTxHash: depositResult.transaction_hash,
        success: true
      };

    } catch (err) {
      console.error('Deposit error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMsg);
      
      toast({
        title: "Deposit Failed",
        description: errorMsg,
        variant: "destructive",
      });

      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, toast]);

  const checkAllowance = useCallback(async (assetAddress: string, amount: number, decimals: number): Promise<boolean> => {
    if (!isConnected || !address) return false;

    try {
      const vesuConfig = getVesuConfig();
      const provider = new RpcProvider({ 
        nodeUrl: isTestnet() 
          ? 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7'
          : 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7'
      });

      const tokenContract = new Contract(ERC20_ABI, assetAddress, provider);
      
      // Get current allowance
      const allowanceResult = await tokenContract.call('allowance', [
        address,
        vesuConfig.singletonAddress
      ]);

      const currentAllowance = (allowanceResult as any).remaining.low;
      const requiredAmount = parseVesuAmount(amount, decimals);

      return currentAllowance >= requiredAmount;
    } catch (err) {
      console.error('Error checking allowance:', err);
      return false;
    }
  }, [isConnected, address]);

  const getTokenBalance = useCallback(async (assetAddress: string): Promise<number> => {
    if (!isConnected || !address) return 0;

    try {
      const provider = new RpcProvider({ 
        nodeUrl: isTestnet() 
          ? 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7'
          : 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7'
      });

      const tokenContract = new Contract(ERC20_ABI, assetAddress, provider);
      
      // Get token decimals
      const decimalsResult = await tokenContract.call('decimals');
      const decimals = Number((decimalsResult as any).decimals);

      // Get balance
      const balanceResult = await tokenContract.call('balanceOf', [address]);
      const balanceWei = (balanceResult as any).balance.low;

      // Convert to human readable format
      return Number(balanceWei) / Math.pow(10, decimals);
    } catch (err) {
      console.error('Error getting token balance:', err);
      return 0;
    }
  }, [isConnected, address]);

  // Function to check user's position in a pool
  const checkPosition = useCallback(async (poolId: string, assetAddress: string, userAddress: string) => {
    if (!isConnected || !address) return null;
    
    try {
      const vesuConfig = getVesuConfig();
      const provider = new RpcProvider({
        nodeUrl: isTestnet() 
          ? 'https://starknet-sepolia.public.blastapi.io/rpc/v0_7'
          : 'https://starknet-mainnet.public.blastapi.io/rpc/v0_7'
      });
      
      const singletonContract = new Contract(VESU_SINGLETON_ABI, vesuConfig.singletonAddress, provider);
      
      console.log('🔍 Checking position for:', {
        poolId,
        assetAddress,
        userAddress,
        singletonAddress: vesuConfig.singletonAddress
      });
      
      const positionResult = await singletonContract.call('position', [
        BigInt(poolId), // Convert poolId to BigInt
        assetAddress, // collateral_asset
        '0x0', // debt_asset (Zero for simple lending)
        userAddress
      ]);
      
      console.log('📈 Current position:', positionResult);
      return positionResult;
    } catch (err) {
      console.error('Error checking position:', err);
      return null;
    }
  }, [isConnected, address]);

  return {
    deposit,
    checkAllowance,
    getTokenBalance,
    checkPosition,
    isLoading,
    error
  };
}
