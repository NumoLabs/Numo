// Real Vesu Implementation based on vesu-v1 repository
// This file contains the actual implementation patterns from the official Vesu repository

import { CallData, CairoCustomEnum, type AccountInterface, type RpcProvider } from 'starknet';
import { getVesuConfig, getVesuV2Config } from './vesu-config';
import { parseVesuAmount } from './utils';

// Constants from vesu-v1/lib/config.ts
export const SCALE = BigInt(10 ** 18);
export const PERCENT = BigInt(10 ** 16);
export const FRACTION = BigInt(10 ** 13);
export const YEAR_IN_SECONDS = 360 * 24 * 60 * 60;

// Vesu Amount structure (from vesu-v1/lib/model.ts)
export interface VesuAmount {
  amount_type: CairoCustomEnum; // Enum variant
  denomination: CairoCustomEnum; // Enum variant
  value: {
    abs: string; // u256 absolute value
    is_negative: number; // core::bool enum variant (0 = False, 1 = True)
  };
}

// Vesu ModifyPositionParams (from vesu-v1/lib/model.ts)
export interface VesuModifyPositionParams {
  pool_id: string;
  collateral_asset: string;
  debt_asset: string;
  user: string;
  collateral: VesuAmount;
  debt: VesuAmount;
  data: unknown[];
}

// Helper function to create Vesu Amount (based on vesu-v1/lib/model.ts)
export function createVesuAmount(value: bigint, isNegative: boolean = false): VesuAmount {
  return {
    amount_type: new CairoCustomEnum({ Delta: {} }), // Delta enum variant
    denomination: new CairoCustomEnum({ Assets: {} }), // Assets enum variant
    value: {
      abs: value.toString(), // u256 absolute value
      is_negative: isNegative ? 1 : 0 // core::bool enum variant (0 = False, 1 = True)
    }
  };
}

// Helper function to create empty Vesu Amount (for debt when lending)
export function createEmptyVesuAmount(): VesuAmount {
  return {
    amount_type: new CairoCustomEnum({ Delta: {} }), // Delta enum variant
    denomination: new CairoCustomEnum({ Assets: {} }), // Assets enum variant
    value: {
      abs: "0", // u256 absolute value
      is_negative: 0 // core::bool enum variant (0 = False)
    }
  };
}

// Real Vesu deposit function (based on createPosition.ts)
export async function createVesuDepositParams(
  poolId: string,
  assetAddress: string,
  amount: number,
  decimals: number,
  userAddress: string
): Promise<VesuModifyPositionParams> {
  console.log('🔧 createVesuDepositParams - Input:', {
    poolId,
    assetAddress,
    amount,
    decimals,
    userAddress
  });
  
  const amountInWei = parseVesuAmount(amount, decimals);
  console.log('🔧 createVesuDepositParams - amountInWei:', amountInWei);
  
  const collateral = createVesuAmount(BigInt(amountInWei), false);
  console.log('🔧 createVesuDepositParams - collateral:', collateral);
  
  const debt = createEmptyVesuAmount();
  console.log('🔧 createVesuDepositParams - debt:', debt);
  
  console.log('🔧 createVesuDepositParams - Creating data...');
  const data: unknown[] = [];
  console.log('🔧 createVesuDepositParams - data:', data);
  
  const result = {
    pool_id: poolId,
    collateral_asset: assetAddress,
    debt_asset: '0x0', // Zero for simple lending
    user: userAddress,
    collateral: collateral,
    debt: debt,
    data: data
  };
  
  console.log('🔧 createVesuDepositParams - Final result:', result);
  return result;
}

// Real Vesu withdrawal function
export async function createVesuWithdrawalParams(
  poolId: string,
  assetAddress: string,
  amount: number,
  decimals: number,
  userAddress: string
): Promise<VesuModifyPositionParams> {
  const amountInWei = parseVesuAmount(amount, decimals);
  
  return {
    pool_id: poolId,
    collateral_asset: assetAddress,
    debt_asset: '0x0', // Zero for simple lending
    user: userAddress,
    collateral: createVesuAmount(BigInt(amountInWei), true), // Negative for withdrawal
    debt: createEmptyVesuAmount(),
    data: CallData.compile([])
  };
}

// Real Vesu borrow function
export async function createVesuBorrowParams(
  poolId: string,
  collateralAsset: string,
  debtAsset: string,
  collateralAmount: number,
  debtAmount: number,
  collateralDecimals: number,
  debtDecimals: number,
  userAddress: string
): Promise<VesuModifyPositionParams> {
  const collateralInWei = parseVesuAmount(collateralAmount, collateralDecimals);
  const debtInWei = parseVesuAmount(debtAmount, debtDecimals);
  
  return {
    pool_id: poolId,
    collateral_asset: collateralAsset,
    debt_asset: debtAsset,
    user: userAddress,
    collateral: createVesuAmount(BigInt(collateralInWei), false), // Positive collateral
    debt: createVesuAmount(BigInt(debtInWei), false), // Positive debt
    data: CallData.compile([])
  };
}

// Asset index mapping (based on vesu-v1 configuration)
export function getAssetIndex(assetAddress: string, isTestnet: boolean = true): number {
  // This should match the asset order in the pool configuration from vesu-v1
  const testnetAssets = [
    '0x7809bb63f557736e49ff0ae4a64bd8aa6ea60e3f77f26c520cb92c24e3700d3', // ETH
    '0x63d32a3fa6074e72e7a1e06fe78c46a0c8473217773e19f11d8c8cbfc4ff8ca', // WBTC
    '0x27ef4670397069d7d5442cb7945b27338692de0d8896bdb15e6400cf5249f94', // USDC (corrected)
    '0x2cd937c3dccd4a4e125011bbe3189a6db0419bb6dd95c4b5ce5f6d834d8996', // USDT
    '0x01b13a244e499b9baf6b82900dced05fbf4a44274d87f1000f500d465da12669', // wstETH
    '0x57181b39020af1416747a7d0d2de6ad5a5b721183136585e8774e1425efd5d2', // wstETH Legacy
    '0x772131070c7d56f78f3e46b27b70271d8ca81c7c52e3f62aa868fab4b679e43', // STRK
  ];
  
  const mainnetAssets = [
    '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', // ETH
    '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac', // WBTC
    '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8', // USDC
    '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8', // USDT
    '0x042b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2', // wstETH
    '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d', // wstETH Legacy
    '0x0057912720381af14b0e5c87aa4718ed5e527eab60b3801ebf702ab09139e38b', // STRK
  ];
  
  const assets = isTestnet ? testnetAssets : mainnetAssets;
  const index = assets.findIndex(addr => addr.toLowerCase() === assetAddress.toLowerCase());
  
  return index >= 0 ? index : 0; // Default to 0 if not found
}

// VToken ABI for deposit, withdraw, and redeem functions
// withdraw: Burns shares and sends exactly the requested amount of underlying assets
// redeem: Burns exact shares and sends the corresponding amount of underlying assets
// Currently unused but kept for reference
/*
const VTOKEN_ABI = [
  {
    "name": "deposit",
    "type": "function",
    "inputs": [
      { "name": "assets", "type": "Uint256" },
      { "name": "receiver", "type": "felt" }
    ],
    "outputs": [
      { "name": "shares", "type": "Uint256" }
    ],
    "stateMutability": "external"
  },
  {
    "name": "withdraw",
    "type": "function",
    "inputs": [
      { "name": "assets", "type": "Uint256" },
      { "name": "receiver", "type": "felt" },
      { "name": "owner", "type": "felt" }
    ],
    "outputs": [
      { "name": "shares", "type": "Uint256" }
    ],
    "stateMutability": "external"
  },
  {
    "name": "redeem",
    "type": "function",
    "inputs": [
      { "name": "shares", "type": "Uint256" },
      { "name": "receiver", "type": "felt" },
      { "name": "owner", "type": "felt" }
    ],
    "outputs": [
      { "name": "assets", "type": "Uint256" }
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
  }
];
*/

// Vesu V2 Transaction Flow
export class VesuV2TransactionFlow {
  private vesuV2Config = getVesuV2Config();
  
  async deposit(
    poolId: string,
    assetAddress: string,
    amount: number,
    decimals: number,
    userAddress: string,
    account: AccountInterface,
    provider: RpcProvider,
    vTokenAddress: string
  ): Promise<{ approvalTx: string; depositTx: string }> {
    console.log('🚀 VesuV2TransactionFlow.deposit - Starting V2 deposit transaction');
    console.log('🔧 vToken Address:', vTokenAddress);
    
    // Step 0: Validate inputs and check balances
    const amountInWei = parseVesuAmount(amount, decimals);
    console.log('🔧 Deposit amount in wei:', amountInWei);
    
    // Check user's token balance
    try {
      const balanceResult = await provider.callContract({
        contractAddress: assetAddress,
        entrypoint: 'balanceOf',
        calldata: [userAddress]
      });
      
      const userBalance = getContractResult(balanceResult, 'balanceOf');
      console.log('🔍 User token balance:', userBalance);
      console.log('🔍 Required amount:', amountInWei);
      
      if (BigInt(userBalance) < BigInt(amountInWei)) {
        throw new Error(`Insufficient balance. You have ${userBalance} but need ${amountInWei}`);
      }
    } catch (balanceError) {
      console.error('❌ Balance check failed:', balanceError);
      const errorMessage = balanceError instanceof Error ? balanceError.message : String(balanceError);
      throw new Error(`Balance check failed: ${errorMessage}`);
    }
    
    // Check current allowance
    try {
      const allowanceResult = await provider.callContract({
        contractAddress: assetAddress,
        entrypoint: 'allowance',
        calldata: [userAddress, vTokenAddress]
      });
      
      const currentAllowance = getContractResult(allowanceResult, 'allowance');
      console.log('🔍 Current allowance:', currentAllowance);
      
      if (BigInt(currentAllowance) >= BigInt(amountInWei)) {
        console.log('✅ Sufficient allowance already exists, skipping approval');
        // Skip approval if allowance is sufficient
      } else {
        console.log('⚠️ Insufficient allowance, proceeding with approval');
      }
    } catch (allowanceError) {
      console.warn('⚠️ Allowance check failed, proceeding with approval:', allowanceError);
    }
    
    // Step 1: Execute approval transaction to vToken (only if needed)
    let approvalResult = null;
    let approvalTxHash = '';
    
    // Validate account before proceeding
    if (!account) {
      throw new Error('Account is not available. Please ensure your wallet is connected.');
    }
    
    console.log('🔍 Account validation:', {
      hasAccount: !!account,
      accountType: account?.constructor?.name,
      hasExecute: typeof account?.execute === 'function',
      address: userAddress
    });
    
    try {
      // Check if we need approval
      console.log('🔍 Checking allowance before approval...');
      console.log('🔍 Allowance check params:', {
        contractAddress: assetAddress,
        entrypoint: 'allowance',
        owner: userAddress,
        spender: vTokenAddress
      });
      
      let currentAllowance = BigInt(0);
      try {
        const allowanceResult = await provider.callContract({
          contractAddress: assetAddress,
          entrypoint: 'allowance',
          calldata: [userAddress, vTokenAddress]
        });
        
        currentAllowance = BigInt(getContractResult(allowanceResult, 'allowance'));
        console.log('✅ Allowance check successful:', currentAllowance.toString());
      } catch (allowanceError: any) {
        console.warn('⚠️ Allowance check failed, proceeding with approval anyway:', allowanceError?.message || allowanceError);
        // If allowance check fails, we'll proceed with approval to be safe
        currentAllowance = BigInt(0);
      }
      
      if (currentAllowance < BigInt(amountInWei)) {
        console.log('🔧 Executing approval transaction...');
        console.log('🔧 Approval params:', {
          contractAddress: assetAddress,
          entrypoint: 'approve',
          spender: vTokenAddress,
          amount: { low: BigInt(amountInWei), high: BigInt(0) }
        });
        
        try {
          console.log('🔧 About to call account.execute for approval...');
          console.log('🔧 Account details:', {
            hasAccount: !!account,
            accountAddress: account?.address,
            accountType: account?.constructor?.name,
            hasExecute: typeof account?.execute === 'function',
            hasProvider: !!account?.provider
          });
          
          approvalResult = await account.execute({
            contractAddress: assetAddress,
            entrypoint: 'approve',
            calldata: CallData.compile([
              vTokenAddress,
              { low: BigInt(amountInWei), high: BigInt(0) }
            ])
          });
          
          approvalTxHash = approvalResult.transaction_hash;
          console.log('✅ V2 Approval transaction submitted:', approvalTxHash);
        } catch (executeError: any) {
          console.error('❌ Account.execute error details:', {
            error: executeError,
            errorType: executeError?.constructor?.name,
            errorMessage: executeError instanceof Error ? executeError.message : String(executeError),
            errorStack: executeError instanceof Error ? executeError.stack : undefined,
            errorCode: executeError?.code,
            errorName: executeError?.name,
            accountAvailable: !!account,
            accountAddress: account?.address,
            accountMethods: account ? Object.keys(account).slice(0, 20) : [],
            accountProvider: account?.provider ? 'has provider' : 'no provider'
          });
          
          // Re-throw with more context
          const errorMsg = executeError instanceof Error 
            ? executeError.message 
            : String(executeError);
          throw new Error(`Failed to execute approval transaction: ${errorMsg}`);
        }
        
        // Wait for approval confirmation
        try {
          await provider.waitForTransaction(approvalTxHash, {
            retryInterval: 2000
          });
          console.log('✅ V2 Approval transaction confirmed');
        } catch {
          console.warn('⚠️ V2 Approval transaction confirmation timeout, continuing...');
        }
      } else {
        console.log('✅ Sufficient allowance exists, skipping approval');
      }
    } catch (approvalError) {
      console.error('❌ V2 Approval transaction failed:', approvalError);
      const errorMessage = approvalError instanceof Error ? approvalError.message : String(approvalError);
      throw new Error(`V2 Token approval failed: ${errorMessage}`);
    }
    
    // Step 2: Execute vToken deposit transaction
    // According to Vesu V2 documentation:
    // deposit(assets: u256, receiver: ContractAddress) -> u256
    // Mints Vault shares to `receiver` by depositing exactly `assets` of underlying tokens.
    console.log('🔧 Executing V2 vToken deposit...');
    console.log('🔧 Deposit params:', {
      contractAddress: vTokenAddress,
      entrypoint: 'deposit',
      assets: { low: BigInt(amountInWei), high: BigInt(0) },
      receiver: userAddress
    });
    
    let depositResult;
    try {
      if (!account) {
        throw new Error('Account is not available for deposit transaction');
      }
      
      depositResult = await account.execute({
        contractAddress: vTokenAddress,
        entrypoint: 'deposit',
        calldata: CallData.compile([
          { low: BigInt(amountInWei), high: BigInt(0) }, // assets: u256 - amount to deposit
          userAddress // receiver: ContractAddress - address to receive the minted shares
        ])
      });
    } catch (depositError) {
      console.error('❌ V2 Deposit transaction failed:', depositError);
      const errorMessage = depositError instanceof Error ? depositError.message : String(depositError);
      throw new Error(`V2 vToken deposit failed: ${errorMessage}`);
    }
    
    console.log('✅ V2 vToken deposit transaction submitted:', depositResult.transaction_hash);
    
    // Wait for deposit confirmation
    try {
      await provider.waitForTransaction(depositResult.transaction_hash, {
        retryInterval: 2000
      });
      console.log('✅ V2 vToken deposit transaction confirmed');
    } catch {
      console.warn('⚠️ V2 Deposit transaction confirmation timeout, continuing...');
    }
    
    return {
      approvalTx: approvalTxHash || 'skipped',
      depositTx: depositResult.transaction_hash
    };
  }
  
  async withdraw(
    poolId: string,
    assetAddress: string,
    amount: number,
    decimals: number,
    userAddress: string,
    account: AccountInterface,
    provider: RpcProvider,
    vTokenAddress: string
  ): Promise<{ withdrawalTx: string }> {
    console.log('🚀 VesuV2TransactionFlow.withdraw - Starting V2 withdrawal transaction');
    console.log('🔧 vToken Address:', vTokenAddress);
    
    // Convert amount to wei
    const amountInWei = parseVesuAmount(amount, decimals);
    console.log('🔧 V2 Withdrawal amount in wei:', amountInWei);
    
    // Execute vToken withdraw transaction
    // According to Vesu V2 documentation:
    // withdraw(assets: u256, receiver: ContractAddress, owner: ContractAddress) -> u256
    // Burns shares from `owner` and sends exactly `assets` of underlying tokens to `receiver`.
    let withdrawalResult;
    try {
      withdrawalResult = await account.execute({
        contractAddress: vTokenAddress,
        entrypoint: 'withdraw',
        calldata: CallData.compile([
          { low: BigInt(amountInWei), high: BigInt(0) }, // assets: u256 - amount to withdraw
          userAddress, // receiver: ContractAddress - address to receive the underlying tokens
          userAddress  // owner: ContractAddress - address that owns the shares to burn
        ])
      });
    } catch (withdrawalError) {
      console.error('❌ V2 Withdrawal transaction failed:', withdrawalError);
      const errorMessage = withdrawalError instanceof Error ? withdrawalError.message : String(withdrawalError);
      throw new Error(`V2 vToken withdrawal failed: ${errorMessage}`);
    }
    
    console.log('✅ V2 vToken withdraw transaction submitted:', withdrawalResult.transaction_hash);
    
    // Wait for withdrawal confirmation
    try {
      await provider.waitForTransaction(withdrawalResult.transaction_hash, {
        retryInterval: 2000
      });
      console.log('✅ V2 vToken withdraw transaction confirmed');
    } catch {
      console.warn('⚠️ V2 Withdrawal transaction confirmation timeout, continuing...');
    }
    
    return {
      withdrawalTx: withdrawalResult.transaction_hash
    };
  }

  // Helper function to get vToken balance (shares) for V2
  async getVTokenBalance(
    vTokenAddress: string,
    userAddress: string,
    provider: RpcProvider
  ): Promise<{ shares: string; assets: string }> {
    console.log('🔍 Getting V2 vToken balance for user:', userAddress);
    
    try {
      // Validate inputs
      if (!vTokenAddress || !userAddress || !provider) {
        throw new Error('Invalid parameters for V2 vToken balance check');
      }
      
      // Get vToken balance (shares)
      const balanceResult = await provider.callContract({
        contractAddress: vTokenAddress,
        entrypoint: 'balanceOf',
        calldata: [userAddress]
      });
      
      const shares = getContractResult(balanceResult, 'vToken balanceOf');
      
      if (!shares || shares === "0") {
        console.warn('⚠️ No balance result returned from V2 vToken');
        return {
          shares: "0",
          assets: "0"
        };
      }
      console.log('📊 V2 vToken shares balance:', shares);
      
      return {
        shares: shares,
        assets: shares // Simplified - should calculate actual assets from shares
      };
    } catch (error) {
      console.error('❌ Error getting V2 vToken balance:', error);
      console.error('❌ Error details:', {
        vTokenAddress,
        userAddress,
        error: error instanceof Error ? error.message : String(error)
      });
      return {
        shares: "0",
        assets: "0"
      };
    }
  }
}

// Legacy V1 transaction flow for backward compatibility
export class VesuTransactionFlow {
  private vesuConfig = getVesuConfig();
  
  async deposit(
    poolId: string,
    assetAddress: string,
    amount: number,
    decimals: number,
    userAddress: string,
    account: AccountInterface,
    provider: RpcProvider,
    vTokenAddress: string
  ): Promise<{ approvalTx: string; depositTx: string }> {
    console.log('🚀 VesuTransactionFlow.deposit - Starting real vToken deposit transaction');
    console.log('🔧 vToken Address:', vTokenAddress);
    
    // Step 0: Validate inputs and check balances
    const amountInWei = parseVesuAmount(amount, decimals);
    console.log('🔧 Deposit amount in wei:', amountInWei);
    
    // Check user's token balance
    try {
      const balanceResult = await provider.callContract({
        contractAddress: assetAddress,
        entrypoint: 'balanceOf',
        calldata: [userAddress]
      });
      
      const userBalance = getContractResult(balanceResult, 'balanceOf');
      console.log('🔍 User token balance:', userBalance);
      console.log('🔍 Required amount:', amountInWei);
      
      if (BigInt(userBalance) < BigInt(amountInWei)) {
        throw new Error(`Insufficient balance. You have ${userBalance} but need ${amountInWei}`);
      }
    } catch (balanceError) {
      console.error('❌ Balance check failed:', balanceError);
      const errorMessage = balanceError instanceof Error ? balanceError.message : String(balanceError);
      throw new Error(`Balance check failed: ${errorMessage}`);
    }
    
    // Step 1: Execute approval transaction to vToken (only if needed)
    let approvalResult = null;
    let approvalTxHash = '';
    
    try {
      // Check if we need approval
      const allowanceResult = await provider.callContract({
        contractAddress: assetAddress,
        entrypoint: 'allowance',
        calldata: [userAddress, vTokenAddress]
      });
      
      const currentAllowance = getContractResult(allowanceResult, 'allowance');
      
      if (BigInt(currentAllowance) < BigInt(amountInWei)) {
        console.log('🔧 Executing approval transaction...');
        approvalResult = await account.execute({
          contractAddress: assetAddress,
          entrypoint: 'approve',
          calldata: CallData.compile([
            vTokenAddress,
            { low: BigInt(amountInWei), high: BigInt(0) }
          ])
        });
        
        approvalTxHash = approvalResult.transaction_hash;
        console.log('✅ Approval transaction submitted:', approvalTxHash);
        
        // Wait for approval confirmation
        try {
          await provider.waitForTransaction(approvalTxHash, {
            retryInterval: 2000
          });
          console.log('✅ Approval transaction confirmed');
        } catch {
          console.warn('⚠️ Approval transaction confirmation timeout, continuing...');
        }
      } else {
        console.log('✅ Sufficient allowance exists, skipping approval');
      }
    } catch (approvalError) {
      console.error('❌ Approval transaction failed:', approvalError);
      const errorMessage = approvalError instanceof Error ? approvalError.message : String(approvalError);
      throw new Error(`Token approval failed: ${errorMessage}`);
    }
    
    // Step 2: Execute vToken deposit transaction
    console.log('🔧 Executing vToken deposit...');
    let depositResult;
    try {
      depositResult = await account.execute({
        contractAddress: vTokenAddress,
        entrypoint: 'deposit',
        calldata: CallData.compile([
          { low: BigInt(amountInWei), high: BigInt(0) }, // assets
          userAddress // receiver
        ])
      });
    } catch (depositError) {
      console.error('❌ Deposit transaction failed:', depositError);
      const errorMessage = depositError instanceof Error ? depositError.message : String(depositError);
      throw new Error(`vToken deposit failed: ${errorMessage}`);
    }
    
    console.log('✅ vToken deposit transaction submitted:', depositResult.transaction_hash);
    
    // Wait for deposit confirmation
    try {
      await provider.waitForTransaction(depositResult.transaction_hash, {
        retryInterval: 2000
      });
      console.log('✅ vToken deposit transaction confirmed');
    } catch {
      console.warn('⚠️ Deposit transaction confirmation timeout, continuing...');
    }
    
    return {
      approvalTx: approvalTxHash || 'skipped',
      depositTx: depositResult.transaction_hash
    };
  }
  
  async withdraw(
    poolId: string,
    assetAddress: string,
    amount: number,
    decimals: number,
    userAddress: string,
    account: AccountInterface,
    provider: RpcProvider,
    vTokenAddress: string
  ): Promise<{ withdrawalTx: string }> {
    console.log('🚀 VesuTransactionFlow.withdraw - Starting real vToken withdrawal transaction');
    console.log('🔧 vToken Address:', vTokenAddress);
    
    // Convert amount to wei
    const amountInWei = parseVesuAmount(amount, decimals);
    console.log('🔧 Withdrawal amount in wei:', amountInWei);
    
    // Execute vToken withdraw transaction
    // The withdraw function burns shares and sends exactly the requested amount of underlying assets
    let withdrawalResult;
    try {
      withdrawalResult = await account.execute({
        contractAddress: vTokenAddress,
        entrypoint: 'withdraw',
        calldata: CallData.compile([
          { low: BigInt(amountInWei), high: BigInt(0) }, // assets to withdraw
          userAddress, // receiver
          userAddress  // owner
        ])
      });
    } catch (withdrawalError) {
      console.error('❌ Withdrawal transaction failed:', withdrawalError);
      const errorMessage = withdrawalError instanceof Error ? withdrawalError.message : String(withdrawalError);
      throw new Error(`vToken withdrawal failed: ${errorMessage}`);
    }
    
    console.log('✅ vToken withdraw transaction submitted:', withdrawalResult.transaction_hash);
    
    // Wait for withdrawal confirmation
    try {
      await provider.waitForTransaction(withdrawalResult.transaction_hash, {
        retryInterval: 2000
      });
      console.log('✅ vToken withdraw transaction confirmed');
    } catch {
      console.warn('⚠️ Withdrawal transaction confirmation timeout, continuing...');
    }
    
    return {
      withdrawalTx: withdrawalResult.transaction_hash
    };
  }

  // Helper function to get vToken balance (shares)
  async getVTokenBalance(
    vTokenAddress: string,
    userAddress: string,
    provider: RpcProvider
  ): Promise<{ shares: string; assets: string }> {
    console.log('🔍 Getting vToken balance for user:', userAddress);
    
    try {
      // Validate inputs
      if (!vTokenAddress || !userAddress || !provider) {
        throw new Error('Invalid parameters for vToken balance check');
      }
      
      // Get vToken balance (shares)
      const balanceResult = await provider.callContract({
        contractAddress: vTokenAddress,
        entrypoint: 'balanceOf',
        calldata: [userAddress]
      });
      
      const shares = getContractResult(balanceResult, 'vToken balanceOf');
      
      if (!shares || shares === "0") {
        console.warn('⚠️ No balance result returned from vToken');
        return {
          shares: "0",
          assets: "0"
        };
      }
      console.log('📊 vToken shares balance:', shares);
      
      // For now, we'll return the shares as assets (1:1 ratio)
      // In a real implementation, you'd need to convert shares to assets using the vault's conversion rate
      return {
        shares: shares,
        assets: shares // Simplified - should calculate actual assets from shares
      };
    } catch (error) {
      console.error('❌ Error getting vToken balance:', error);
      console.error('❌ Error details:', {
        vTokenAddress,
        userAddress,
        error: error instanceof Error ? error.message : String(error)
      });
      return {
        shares: "0",
        assets: "0"
      };
    }
  }
}

// Protocol and Pool interfaces based on vesu-v1/lib/protocol.ts and vesu-v1/lib/pool.ts
export interface VesuProtocol {
  singleton: string;
  extensionPO: string;
  pragma: {
    oracle: string;
    summary_stats: string;
  };
  assets: string[];
}

export interface VesuPool {
  id: string;
  name: string;
  params: {
    pool_name: string;
    asset_params: Array<{
      asset: string;
      floor: bigint;
      max_utilization: bigint;
      fee_rate: bigint;
    }>;
    interest_rate_configs: Array<{
      target_utilization: bigint;
      zero_utilization_rate: bigint;
      target_rate_percent: bigint;
    }>;
  };
}

// Real pool data based on vesu-v1 configuration
export const VESU_PROTOCOLS: Record<string, VesuProtocol> = {
  sepolia: {
    singleton: '0x2110b3cde727cd34407e257e1070857a06010cf02a14b1ee181612fb1b61c30',
    extensionPO: '0x274669f178d303cdd92638ab2aee6d5cb75d72baf79606a02b749552fc17759',
    pragma: {
      oracle: '0x2314ba454f4b8a597d8627db25b9302b9ab3e24ebe315cb60cc71ea6f1b0b89',
      summary_stats: '0x566a1e45805aff7d4331614f8af70bb8d0527cddcf088b3a8cf20e53c0dc3c1'
    },
    assets: [
      '0x7809bb63f557736e49ff0ae4a64bd8aa6ea60e3f77f26c520cb92c24e3700d3', // ETH
      '0x63d32a3fa6074e72e7a1e06fe78c46a0c8473217773e19f11d8c8cbfc4ff8ca', // WBTC
      '0x27ef4670397069d7d5442cb7945b27338692de0d8896bdb15e6400cf5249f94', // USDC
      '0x2cd937c3dccd4a4e125011bbe3189a6db0419bb6dd95c4b5ce5f6d834d8996', // USDT
      '0x01b13a244e499b9baf6b82900dced05fbf4a44274d87f1000f500d465da12669', // wstETH
      '0x57181b39020af1416747a7d0d2de6ad5a5b721183136585e8774e1425efd5d2', // wstETH Legacy
      '0x772131070c7d56f78f3e46b27b70271d8ca81c7c52e3f62aa868fab4b679e43', // STRK
    ]
  },
  mainnet: {
    singleton: '0x2545b2e5d519fc230e9cd781046d3a64e092114f07e44771e0d719d148725ef',
    extensionPO: '0x7cf3881eb4a58e76b41a792fa151510e7057037d80eda334682bd3e73389ec0',
    pragma: {
      oracle: '0x2a85bd616f912537c50a49a4076db02c00b29b2cdc8a197ce92ed1837fa875b',
      summary_stats: '0x049eefafae944d07744d07cc72a5bf14728a6fb463c3eae5bca13552f5d455fd'
    },
    assets: [
      '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', // ETH
      '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac', // WBTC
      '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8', // USDC
      '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8', // USDT
      '0x042b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2', // wstETH
      '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d', // wstETH Legacy
      '0x0057912720381af14b0e5c87aa4718ed5e527eab60b3801ebf702ab09139e38b', // STRK
    ]
  }
};

export const VESU_POOLS: Record<string, VesuPool> = {
  sepolia: {
    id: '566154675190438152544449762131613456939576463701265245209877893089848934391',
    name: 'Genesis Pool',
    params: {
      pool_name: 'Genesis Pool',
      asset_params: [
        { asset: '0x7809bb63f557736e49ff0ae4a64bd8aa6ea60e3f77f26c520cb92c24e3700d3', floor: BigInt(100), max_utilization: BigInt(95), fee_rate: BigInt(0) }, // ETH
        { asset: '0x63d32a3fa6074e72e7a1e06fe78c46a0c8473217773e19f11d8c8cbfc4ff8ca', floor: BigInt(100), max_utilization: BigInt(95), fee_rate: BigInt(0) }, // WBTC
        { asset: '0x27ef4670397069d7d5442cb7945b27338692de0d8896bdb15e6400cf5249f94', floor: BigInt(100), max_utilization: BigInt(95), fee_rate: BigInt(0) }, // USDC
        { asset: '0x2cd937c3dccd4a4e125011bbe3189a6db0419bb6dd95c4b5ce5f6d834d8996', floor: BigInt(100), max_utilization: BigInt(95), fee_rate: BigInt(0) }, // USDT
        { asset: '0x01b13a244e499b9baf6b82900dced05fbf4a44274d87f1000f500d465da12669', floor: BigInt(100), max_utilization: BigInt(95), fee_rate: BigInt(0) }, // wstETH
        { asset: '0x57181b39020af1416747a7d0d2de6ad5a5b721183136585e8774e1425efd5d2', floor: BigInt(100), max_utilization: BigInt(95), fee_rate: BigInt(0) }, // wstETH Legacy
        { asset: '0x772131070c7d56f78f3e46b27b70271d8ca81c7c52e3f62aa868fab4b679e43', floor: BigInt(100), max_utilization: BigInt(95), fee_rate: BigInt(0) }, // STRK
      ],
      interest_rate_configs: [
        { target_utilization: BigInt(80), zero_utilization_rate: BigInt(32134073), target_rate_percent: BigInt(20) },
        { target_utilization: BigInt(80), zero_utilization_rate: BigInt(32134073), target_rate_percent: BigInt(20) },
        { target_utilization: BigInt(80), zero_utilization_rate: BigInt(32134073), target_rate_percent: BigInt(20) },
        { target_utilization: BigInt(80), zero_utilization_rate: BigInt(32134073), target_rate_percent: BigInt(20) },
        { target_utilization: BigInt(80), zero_utilization_rate: BigInt(32134073), target_rate_percent: BigInt(20) },
        { target_utilization: BigInt(80), zero_utilization_rate: BigInt(32134073), target_rate_percent: BigInt(20) },
        { target_utilization: BigInt(80), zero_utilization_rate: BigInt(32134073), target_rate_percent: BigInt(20) }
      ]
    }
  },
  mainnet: {
    id: '0x4dc4f0ca6ea4961e4c8373265bfd5317678f4fe374d76f3fd7135f57763bf28',
    name: 'Genesis Pool',
    params: {
      pool_name: 'Genesis Pool',
      asset_params: [
        { asset: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', floor: BigInt(10), max_utilization: BigInt(95), fee_rate: BigInt(0) }, // ETH
        { asset: '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac', floor: BigInt(10), max_utilization: BigInt(95), fee_rate: BigInt(0) }, // WBTC
        { asset: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8', floor: BigInt(10), max_utilization: BigInt(95), fee_rate: BigInt(0) }, // USDC
        { asset: '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8', floor: BigInt(10), max_utilization: BigInt(95), fee_rate: BigInt(0) }, // USDT
        { asset: '0x042b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2', floor: BigInt(10), max_utilization: BigInt(95), fee_rate: BigInt(0) }, // wstETH
        { asset: '0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d', floor: BigInt(10), max_utilization: BigInt(95), fee_rate: BigInt(0) }, // wstETH Legacy
        { asset: '0x0057912720381af14b0e5c87aa4718ed5e527eab60b3801ebf702ab09139e38b', floor: BigInt(10), max_utilization: BigInt(95), fee_rate: BigInt(0) }, // STRK
      ],
      interest_rate_configs: [
        { target_utilization: BigInt(80), zero_utilization_rate: BigInt(32134073), target_rate_percent: BigInt(20) },
        { target_utilization: BigInt(80), zero_utilization_rate: BigInt(32134073), target_rate_percent: BigInt(20) },
        { target_utilization: BigInt(80), zero_utilization_rate: BigInt(32134073), target_rate_percent: BigInt(20) },
        { target_utilization: BigInt(80), zero_utilization_rate: BigInt(32134073), target_rate_percent: BigInt(20) },
        { target_utilization: BigInt(80), zero_utilization_rate: BigInt(32134073), target_rate_percent: BigInt(20) },
        { target_utilization: BigInt(80), zero_utilization_rate: BigInt(32134073), target_rate_percent: BigInt(20) },
        { target_utilization: BigInt(80), zero_utilization_rate: BigInt(32134073), target_rate_percent: BigInt(20) }
      ]
    }
  }
};

// Helper function to get protocol and pool data
export function getVesuProtocolData(isTestnet: boolean = true): { protocol: VesuProtocol; pool: VesuPool } {
  const network = isTestnet ? 'sepolia' : 'mainnet';
  return {
    protocol: VESU_PROTOCOLS[network],
    pool: VESU_POOLS[network]
  };
}

// Helper function to safely get contract result
function getContractResult(result: unknown, operation: string): string {
  console.log(`🔍 Raw ${operation} result:`, result);
  
  if (!result) {
    throw new Error(`No response from ${operation} call`);
  }
  
  // Handle different response formats
  let resultArray: string[];
  if (Array.isArray(result)) {
    // Direct array response: ["0x34b150fc4ad2c3c","0x0"]
    resultArray = result;
  } else if (result && typeof result === 'object' && 'result' in result && Array.isArray(result.result)) {
    // Wrapped response: { result: ["0x34b150fc4ad2c3c","0x0"] }
    resultArray = result.result as string[];
  } else {
    throw new Error(`Invalid result format for ${operation}: ${JSON.stringify(result)}`);
  }
  
  if (resultArray.length === 0) {
    throw new Error(`Empty result array for ${operation}`);
  }
  
  const value = resultArray[0];
  if (value === undefined || value === null) {
    throw new Error(`Null/undefined value in ${operation} result`);
  }
  
  console.log(`🔍 Extracted ${operation} value:`, value);
  return value.toString();
}

// Helper function to validate balance and allowance
export async function validateBalanceAndAllowance(
  assetAddress: string,
  vTokenAddress: string,
  userAddress: string,
  amountInWei: string,
  provider: RpcProvider
): Promise<{ needsApproval: boolean; currentAllowance: string }> {
  console.log('🔍 Validating balance and allowance...');
  
  // Check user's token balance
  try {
    const balanceResult = await provider.callContract({
      contractAddress: assetAddress,
      entrypoint: 'balanceOf',
      calldata: [userAddress]
    });
    
    const userBalance = getContractResult(balanceResult, 'balanceOf');
    console.log('🔍 User token balance:', userBalance);
    console.log('🔍 Required amount:', amountInWei);
    
    if (BigInt(userBalance) < BigInt(amountInWei)) {
      throw new Error(`Insufficient balance. You have ${userBalance} but need ${amountInWei}`);
    }
  } catch (balanceError) {
    console.error('❌ Balance check failed:', balanceError);
    const errorMessage = balanceError instanceof Error ? balanceError.message : String(balanceError);
    throw new Error(`Balance check failed: ${errorMessage}`);
  }
  
  // Check current allowance
  try {
    const allowanceResult = await provider.callContract({
      contractAddress: assetAddress,
      entrypoint: 'allowance',
      calldata: [userAddress, vTokenAddress]
    });
    
    const currentAllowance = getContractResult(allowanceResult, 'allowance');
    console.log('🔍 Current allowance:', currentAllowance);
    
    const needsApproval = BigInt(currentAllowance) < BigInt(amountInWei);
    console.log('🔍 Needs approval:', needsApproval);
    
    return {
      needsApproval,
      currentAllowance
    };
  } catch (allowanceError) {
    console.warn('⚠️ Allowance check failed, assuming approval needed:', allowanceError);
    return {
      needsApproval: true,
      currentAllowance: '0'
    };
  }
}

// Export the transaction flow instances
export const vesuV2TransactionFlow = new VesuV2TransactionFlow();
export const vesuTransactionFlow = new VesuTransactionFlow(); // Legacy V1
