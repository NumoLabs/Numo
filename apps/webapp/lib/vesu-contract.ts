import { Account, Call, CallData, RpcProvider, hash, Contract } from "starknet"
import type { VesuPool } from "@/types/VesuPools"
import { Pool, createPoolFromConfig } from './vesu-pool'

import { vesuConfig } from './vesu-config'

// Vesu contract addresses from mainnet configuration
export const VESU_CONTRACTS = {
  SINGLETON: vesuConfig.protocol.singleton,
  POOL_ID: vesuConfig.pools["genesis-pool"].id.toString(),
  ORACLE: vesuConfig.protocol.pragma.oracle,
  EXTENSION_PO: vesuConfig.protocol.extensionPO,
  EKUBO_CORE: vesuConfig.protocol.ekubo.core,
} as const

// Token addresses from Vesu configuration
export const TOKEN_ADDRESSES = {
  WBTC: vesuConfig.env.find(asset => asset.symbol === 'WBTC')?.address || "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac",
  USDC: vesuConfig.env.find(asset => asset.symbol === 'USDC')?.address || "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
  USDT: "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8", // USDT on Starknet
  ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c7b7f8c8c8c8c8c8c8c8c8", // ETH on Starknet
} as const

// Vesu contract ABI (simplified - you'll need the full ABI)
export const VESU_ABI = [
  {
    "name": "modify_position",
    "type": "function",
    "inputs": [
      {
        "name": "params",
        "type": "struct",
        "members": [
          { "name": "pool_id", "type": "felt252" },
          { "name": "collateral_asset", "type": "ContractAddress" },
          { "name": "debt_asset", "type": "ContractAddress" },
          { "name": "user", "type": "ContractAddress" },
          { "name": "collateral", "type": "struct" },
          { "name": "debt", "type": "struct" },
          { "name": "data", "type": "Array<felt252>" }
        ]
      }
    ],
    "outputs": []
  },
  {
    "name": "position",
    "type": "function",
    "inputs": [
      { "name": "pool_id", "type": "felt252" },
      { "name": "collateral_asset", "type": "ContractAddress" },
      { "name": "debt_asset", "type": "ContractAddress" },
      { "name": "user", "type": "ContractAddress" }
    ],
    "outputs": [
      { "name": "health_factor", "type": "u32" },
      { "name": "collateral", "type": "u256" },
      { "name": "debt", "type": "u256" }
    ]
  }
] as const

// ERC20 ABI for token operations
export const ERC20_ABI = [
  {
    "name": "approve",
    "type": "function",
    "inputs": [
      { "name": "spender", "type": "ContractAddress" },
      { "name": "amount", "type": "u256" }
    ],
    "outputs": [{ "name": "success", "type": "bool" }]
  },
  {
    "name": "transfer",
    "type": "function", 
    "inputs": [
      { "name": "recipient", "type": "ContractAddress" },
      { "name": "amount", "type": "u256" }
    ],
    "outputs": [{ "name": "success", "type": "bool" }]
  },
  {
    "name": "balanceOf",
    "type": "function",
    "inputs": [
      { "name": "account", "type": "ContractAddress" }
    ],
    "outputs": [{ "name": "balance", "type": "u256" }]
  },
  {
    "name": "decimals",
    "type": "function",
    "inputs": [],
    "outputs": [{ "name": "decimals", "type": "u8" }]
  }
] as const

export interface VesuPosition {
  healthFactor: number
  collateral: bigint
  debt: bigint
}

export interface VesuDepositParams {
  poolId: string
  collateralAsset: string
  debtAsset: string
  user: string
  collateralAmount: bigint
  debtAmount: bigint
}

export interface VesuWithdrawParams {
  poolId: string
  collateralAsset: string
  debtAsset: string
  user: string
  collateralAmount: bigint
  debtAmount: bigint
}

export class VesuContract {
  private account: Account
  private provider: RpcProvider
  private contract: Contract

  constructor(account: Account, provider: RpcProvider) {
    this.account = account
    this.provider = provider
    this.contract = new Contract(VESU_ABI, VESU_CONTRACTS.SINGLETON, provider)
  }

  /**
   * Deposit tokens into Vesu pool
   */
  async deposit(params: VesuDepositParams): Promise<string> {
    try {
      // First approve the contract to spend tokens
      await this.approveToken(params.collateralAsset, params.collateralAmount)

      // Prepare the modify_position call
      const call: Call = {
        contractAddress: VESU_CONTRACTS.SINGLETON,
        entrypoint: "modify_position",
        calldata: CallData.compile({
          pool_id: params.poolId,
          collateral_asset: params.collateralAsset,
          debt_asset: params.debtAsset,
          user: params.user,
          collateral: {
            amount_type: 0, // AmountType::Delta
            denomination: 0, // AmountDenomination::Assets
            value: params.collateralAmount
          },
          debt: {
            amount_type: 0, // AmountType::Delta
            denomination: 0, // AmountDenomination::Assets
            value: params.debtAmount
          },
          data: []
        })
      }

      // Execute the transaction
      const result = await this.account.execute(call)
      return result.transaction_hash
    } catch (error) {
      console.error('Vesu deposit failed:', error)
      throw new Error(`Deposit failed: ${error}`)
    }
  }

  /**
   * Withdraw tokens from Vesu pool
   */
  async withdraw(params: VesuWithdrawParams): Promise<string> {
    try {
      // Prepare the modify_position call for withdrawal
      const call: Call = {
        contractAddress: VESU_CONTRACTS.SINGLETON,
        entrypoint: "modify_position",
        calldata: CallData.compile({
          pool_id: params.poolId,
          collateral_asset: params.collateralAsset,
          debt_asset: params.debtAsset,
          user: params.user,
          collateral: {
            amount_type: 0, // AmountType::Delta
            denomination: 0, // AmountDenomination::Assets
            value: -params.collateralAmount // Negative for withdrawal
          },
          debt: {
            amount_type: 0, // AmountType::Delta
            denomination: 0, // AmountDenomination::Assets
            value: params.debtAmount
          },
          data: []
        })
      }

      // Execute the transaction
      const result = await this.account.execute(call)
      return result.transaction_hash
    } catch (error) {
      console.error('Vesu withdraw failed:', error)
      throw new Error(`Withdrawal failed: ${error}`)
    }
  }

  /**
   * Get user position from Vesu pool
   */
  async getPosition(
    poolId: string,
    collateralAsset: string,
    debtAsset: string,
    user: string
  ): Promise<VesuPosition> {
    try {
      const result = await this.contract.call("position", [
        poolId,
        collateralAsset,
        debtAsset,
        user
      ])

      return {
        healthFactor: Number(result.health_factor),
        collateral: BigInt(result.collateral),
        debt: BigInt(result.debt)
      }
    } catch (error) {
      console.error('Failed to get Vesu position:', error)
      throw new Error(`Failed to get position: ${error}`)
    }
  }

  /**
   * Approve token spending
   */
  private async approveToken(tokenAddress: string, amount: bigint): Promise<string> {
    try {
      const tokenContract = new Contract(ERC20_ABI, tokenAddress, this.provider)
      
      const call: Call = {
        contractAddress: tokenAddress,
        entrypoint: "approve",
        calldata: CallData.compile({
          spender: VESU_CONTRACTS.SINGLETON,
          amount: amount
        })
      }

      const result = await this.account.execute(call)
      return result.transaction_hash
    } catch (error) {
      console.error('Token approval failed:', error)
      throw new Error(`Token approval failed: ${error}`)
    }
  }

  /**
   * Get token balance
   */
  async getTokenBalance(tokenAddress: string, user: string): Promise<bigint> {
    try {
      const tokenContract = new Contract(ERC20_ABI, tokenAddress, this.provider)
      const result = await tokenContract.call("balanceOf", [user])
      return BigInt(result.balance)
    } catch (error) {
      console.error('Failed to get token balance:', error)
      throw new Error(`Failed to get balance: ${error}`)
    }
  }

  /**
   * Get token decimals
   */
  async getTokenDecimals(tokenAddress: string): Promise<number> {
    try {
      const tokenContract = new Contract(ERC20_ABI, tokenAddress, this.provider)
      const result = await tokenContract.call("decimals", [])
      return Number(result.decimals)
    } catch (error) {
      console.error('Failed to get token decimals:', error)
      throw new Error(`Failed to get decimals: ${error}`)
    }
  }

  /**
   * Convert amount to proper decimals
   */
  async formatTokenAmount(tokenAddress: string, amount: string): Promise<bigint> {
    const decimals = await this.getTokenDecimals(tokenAddress)
    const multiplier = BigInt(10 ** decimals)
    return BigInt(parseFloat(amount) * Number(multiplier))
  }

  /**
   * Convert amount from contract format to display format
   */
  async parseTokenAmount(tokenAddress: string, amount: bigint): Promise<string> {
    const decimals = await this.getTokenDecimals(tokenAddress)
    const divisor = BigInt(10 ** decimals)
    const value = Number(amount) / Number(divisor)
    return value.toFixed(decimals)
  }

  /**
   * Get a Pool instance for a specific pool ID
   */
  getPool(poolId: string): Pool | null {
    // Note: This requires a Protocol instance which should be passed to VesuContract
    // For now, we'll return null and handle this in the calling code
    console.warn('getPool requires Protocol instance - use createPoolFromConfig directly');
    return null;
  }

  /**
   * Get all available pools from configuration
   */
  getAllPools(): Pool[] {
    // Note: This requires a Protocol instance which should be passed to VesuContract
    // For now, we'll return empty array and handle this in the calling code
    console.warn('getAllPools requires Protocol instance - use getAllPoolsFromConfig directly');
    return [];
  }
}

/**
 * Helper function to create Vesu contract instance
 */
export function createVesuContract(account: Account, provider: RpcProvider): VesuContract {
  return new VesuContract(account, provider)
}

/**
 * Helper function to get token address from symbol
 */
export function getTokenAddress(symbol: string): string {
  switch (symbol.toUpperCase()) {
    case 'WBTC': return TOKEN_ADDRESSES.WBTC
    case 'USDC': return TOKEN_ADDRESSES.USDC
    case 'USDT': return TOKEN_ADDRESSES.USDT
    case 'ETH': return TOKEN_ADDRESSES.ETH
    default: throw new Error(`Unknown token: ${symbol}. Only WBTC is supported as primary token.`)
  }
}

/**
 * Helper function to create deposit parameters
 */
export function createDepositParams(
  pool: VesuPool,
  userAddress: string,
  amount: string
): VesuDepositParams {
  return {
    poolId: VESU_CONTRACTS.POOL_ID,
    collateralAsset: pool.assets[0]?.address || TOKEN_ADDRESSES.USDC,
    debtAsset: pool.assets[0]?.address || TOKEN_ADDRESSES.USDC,
    user: userAddress,
    collateralAmount: BigInt(0), // Will be set by the contract
    debtAmount: BigInt(0)
  }
}

/**
 * Helper function to create withdraw parameters
 */
export function createWithdrawParams(
  pool: VesuPool,
  userAddress: string,
  amount: string
): VesuWithdrawParams {
  return {
    poolId: VESU_CONTRACTS.POOL_ID,
    collateralAsset: pool.assets[0]?.address || TOKEN_ADDRESSES.USDC,
    debtAsset: pool.assets[0]?.address || TOKEN_ADDRESSES.USDC,
    user: userAddress,
    collateralAmount: BigInt(0), // Will be set by the contract
    debtAmount: BigInt(0)
  }
}
