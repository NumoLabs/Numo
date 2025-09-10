import { Account, Call, CallData, RpcProvider, Contract } from "starknet"

// VesuRebalance contract ABI (simplified - you'll need the full ABI)
export const VESU_REBALANCE_ABI = [
  {
    "name": "rebalance",
    "type": "function",
    "inputs": [
      {
        "name": "actions",
        "type": "Array<struct>",
        "members": [
          { "name": "pool_id", "type": "felt252" },
          { "name": "amount", "type": "u256" },
          { "name": "feature", "type": "enum" }
        ]
      }
    ],
    "outputs": []
  },
  {
    "name": "rebalance_weights",
    "type": "function",
    "inputs": [
      {
        "name": "actions",
        "type": "Array<struct>"
      }
    ],
    "outputs": []
  },
  {
    "name": "compute_yield",
    "type": "function",
    "inputs": [],
    "outputs": [
      { "name": "yield", "type": "u256" },
      { "name": "total_amount", "type": "u256" }
    ]
  },
  {
    "name": "get_allowed_pools",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "pools",
        "type": "Array<struct>",
        "members": [
          { "name": "pool_id", "type": "felt252" },
          { "name": "v_token", "type": "ContractAddress" },
          { "name": "max_weight", "type": "u32" }
        ]
      }
    ]
  },
  {
    "name": "get_settings",
    "type": "function",
    "inputs": [],
    "outputs": [
      {
        "name": "settings",
        "type": "struct",
        "members": [
          { "name": "default_pool_index", "type": "u32" },
          { "name": "fee_bps", "type": "u32" },
          { "name": "fee_receiver", "type": "ContractAddress" }
        ]
      }
    ]
  },
  {
    "name": "harvest",
    "type": "function",
    "inputs": [
      { "name": "rewardsContract", "type": "ContractAddress" },
      { "name": "claim", "type": "struct" },
      { "name": "proof", "type": "Array<felt252>" },
      { "name": "swapInfo", "type": "struct" }
    ],
    "outputs": []
  },
  {
    "name": "emergency_withdraw",
    "type": "function",
    "inputs": [],
    "outputs": []
  },
  {
    "name": "emergency_withdraw_pool",
    "type": "function",
    "inputs": [
      { "name": "pool_index", "type": "u32" }
    ],
    "outputs": []
  },
  // ERC4626 functions
  {
    "name": "deposit",
    "type": "function",
    "inputs": [
      { "name": "assets", "type": "u256" },
      { "name": "receiver", "type": "ContractAddress" }
    ],
    "outputs": [{ "name": "shares", "type": "u256" }]
  },
  {
    "name": "withdraw",
    "type": "function",
    "inputs": [
      { "name": "assets", "type": "u256" },
      { "name": "receiver", "type": "ContractAddress" },
      { "name": "owner", "type": "ContractAddress" }
    ],
    "outputs": [{ "name": "shares", "type": "u256" }]
  },
  {
    "name": "total_assets",
    "type": "function",
    "inputs": [],
    "outputs": [{ "name": "assets", "type": "u256" }]
  },
  {
    "name": "total_supply",
    "type": "function",
    "inputs": [],
    "outputs": [{ "name": "supply", "type": "u256" }]
  },
  {
    "name": "balance_of",
    "type": "function",
    "inputs": [
      { "name": "account", "type": "ContractAddress" }
    ],
    "outputs": [{ "name": "balance", "type": "u256" }]
  },
  {
    "name": "convert_to_assets",
    "type": "function",
    "inputs": [
      { "name": "shares", "type": "u256" }
    ],
    "outputs": [{ "name": "assets", "type": "u256" }]
  },
  {
    "name": "convert_to_shares",
    "type": "function",
    "inputs": [
      { "name": "assets", "type": "u256" }
    ],
    "outputs": [{ "name": "shares", "type": "u256" }]
  }
] as const

// Types for the contract
export interface PoolProps {
  poolId: string
  vToken: string
  maxWeight: number
}

export interface RebalanceAction {
  poolId: string
  amount: bigint
  feature: 'DEPOSIT' | 'WITHDRAW'
}

export interface VaultSettings {
  defaultPoolIndex: number
  feeBps: number
  feeReceiver: string
}

export interface YieldInfo {
  yield: bigint
  totalAmount: bigint
}

export interface HarvestClaim {
  // Define based on your Claim struct
  amount: bigint
  index: bigint
  merkleProof: string[]
}

export interface SwapInfo {
  tokenFromAddress: string
  tokenToAddress: string
  tokenFromAmount: bigint
  routes: any[] // Define based on your swap routes
}

export class VesuRebalanceContract {
  private account: Account
  private provider: RpcProvider
  private contract: Contract

  constructor(account: Account, provider: RpcProvider, contractAddress: string) {
    this.account = account
    this.provider = provider
    this.contract = new Contract(VESU_REBALANCE_ABI, contractAddress, provider)
  }

  /**
   * Execute rebalancing actions to optimize yield
   */
  async rebalance(actions: RebalanceAction[]): Promise<string> {
    try {
      const call: Call = {
        contractAddress: this.contract.address,
        entrypoint: "rebalance",
        calldata: CallData.compile({
          actions: actions.map(action => ({
            pool_id: action.poolId,
            amount: action.amount,
            feature: action.feature === 'DEPOSIT' ? 0 : 1 // 0 = DEPOSIT, 1 = WITHDRAW
          }))
        })
      }

      const result = await this.account.execute(call)
      return result.transaction_hash
    } catch (error) {
      console.error('Rebalance failed:', error)
      throw new Error(`Rebalance failed: ${error}`)
    }
  }

  /**
   * Rebalance weights across pools
   */
  async rebalanceWeights(actions: RebalanceAction[]): Promise<string> {
    try {
      const call: Call = {
        contractAddress: this.contract.address,
        entrypoint: "rebalance_weights",
        calldata: CallData.compile({
          actions: actions.map(action => ({
            pool_id: action.poolId,
            amount: action.amount,
            feature: action.feature === 'DEPOSIT' ? 0 : 1
          }))
        })
      }

      const result = await this.account.execute(call)
      return result.transaction_hash
    } catch (error) {
      console.error('Rebalance weights failed:', error)
      throw new Error(`Rebalance weights failed: ${error}`)
    }
  }

  /**
   * Compute current yield across all pools
   */
  async computeYield(): Promise<YieldInfo> {
    try {
      const result = await this.contract.call("compute_yield", [])
      return {
        yield: BigInt(result.yield),
        totalAmount: BigInt(result.total_amount)
      }
    } catch (error) {
      console.error('Failed to compute yield:', error)
      throw new Error(`Failed to compute yield: ${error}`)
    }
  }

  /**
   * Get allowed pools configuration
   */
  async getAllowedPools(): Promise<PoolProps[]> {
    try {
      const result = await this.contract.call("get_allowed_pools", [])
      return result.pools.map((pool: any) => ({
        poolId: pool.pool_id,
        vToken: pool.v_token,
        maxWeight: Number(pool.max_weight)
      }))
    } catch (error) {
      console.error('Failed to get allowed pools:', error)
      throw new Error(`Failed to get allowed pools: ${error}`)
    }
  }

  /**
   * Get vault settings
   */
  async getSettings(): Promise<VaultSettings> {
    try {
      const result = await this.contract.call("get_settings", [])
      return {
        defaultPoolIndex: Number(result.settings.default_pool_index),
        feeBps: Number(result.settings.fee_bps),
        feeReceiver: result.settings.fee_receiver
      }
    } catch (error) {
      console.error('Failed to get settings:', error)
      throw new Error(`Failed to get settings: ${error}`)
    }
  }

  /**
   * Harvest rewards and swap to base token
   */
  async harvest(
    rewardsContract: string,
    claim: HarvestClaim,
    proof: string[],
    swapInfo: SwapInfo
  ): Promise<string> {
    try {
      const call: Call = {
        contractAddress: this.contract.address,
        entrypoint: "harvest",
        calldata: CallData.compile({
          rewardsContract,
          claim: {
            amount: claim.amount,
            index: claim.index,
            merkleProof: claim.merkleProof
          },
          proof,
          swapInfo: {
            tokenFromAddress: swapInfo.tokenFromAddress,
            tokenToAddress: swapInfo.tokenToAddress,
            tokenFromAmount: swapInfo.tokenFromAmount,
            routes: swapInfo.routes
          }
        })
      }

      const result = await this.account.execute(call)
      return result.transaction_hash
    } catch (error) {
      console.error('Harvest failed:', error)
      throw new Error(`Harvest failed: ${error}`)
    }
  }

  /**
   * Emergency withdraw from all pools
   */
  async emergencyWithdraw(): Promise<string> {
    try {
      const call: Call = {
        contractAddress: this.contract.address,
        entrypoint: "emergency_withdraw",
        calldata: CallData.compile({})
      }

      const result = await this.account.execute(call)
      return result.transaction_hash
    } catch (error) {
      console.error('Emergency withdraw failed:', error)
      throw new Error(`Emergency withdraw failed: ${error}`)
    }
  }

  /**
   * Emergency withdraw from specific pool
   */
  async emergencyWithdrawPool(poolIndex: number): Promise<string> {
    try {
      const call: Call = {
        contractAddress: this.contract.address,
        entrypoint: "emergency_withdraw_pool",
        calldata: CallData.compile({
          pool_index: poolIndex
        })
      }

      const result = await this.account.execute(call)
      return result.transaction_hash
    } catch (error) {
      console.error('Emergency withdraw pool failed:', error)
      throw new Error(`Emergency withdraw pool failed: ${error}`)
    }
  }

  // ERC4626 functions
  async deposit(assets: bigint, receiver: string): Promise<string> {
    try {
      const call: Call = {
        contractAddress: this.contract.address,
        entrypoint: "deposit",
        calldata: CallData.compile({
          assets,
          receiver
        })
      }

      const result = await this.account.execute(call)
      return result.transaction_hash
    } catch (error) {
      console.error('Deposit failed:', error)
      throw new Error(`Deposit failed: ${error}`)
    }
  }

  async withdraw(assets: bigint, receiver: string, owner: string): Promise<string> {
    try {
      const call: Call = {
        contractAddress: this.contract.address,
        entrypoint: "withdraw",
        calldata: CallData.compile({
          assets,
          receiver,
          owner
        })
      }

      const result = await this.account.execute(call)
      return result.transaction_hash
    } catch (error) {
      console.error('Withdraw failed:', error)
      throw new Error(`Withdraw failed: ${error}`)
    }
  }

  async totalAssets(): Promise<bigint> {
    try {
      const result = await this.contract.call("total_assets", [])
      return BigInt(result.assets)
    } catch (error) {
      console.error('Failed to get total assets:', error)
      throw new Error(`Failed to get total assets: ${error}`)
    }
  }

  async totalSupply(): Promise<bigint> {
    try {
      const result = await this.contract.call("total_supply", [])
      return BigInt(result.supply)
    } catch (error) {
      console.error('Failed to get total supply:', error)
      throw new Error(`Failed to get total supply: ${error}`)
    }
  }

  async balanceOf(account: string): Promise<bigint> {
    try {
      const result = await this.contract.call("balance_of", [account])
      return BigInt(result.balance)
    } catch (error) {
      console.error('Failed to get balance:', error)
      throw new Error(`Failed to get balance: ${error}`)
    }
  }

  async convertToAssets(shares: bigint): Promise<bigint> {
    try {
      const result = await this.contract.call("convert_to_assets", [shares])
      return BigInt(result.assets)
    } catch (error) {
      console.error('Failed to convert to assets:', error)
      throw new Error(`Failed to convert to assets: ${error}`)
    }
  }

  async convertToShares(assets: bigint): Promise<bigint> {
    try {
      const result = await this.contract.call("convert_to_shares", [assets])
      return BigInt(result.shares)
    } catch (error) {
      console.error('Failed to convert to shares:', error)
      throw new Error(`Failed to convert to shares: ${error}`)
    }
  }
}

/**
 * Helper function to create VesuRebalance contract instance
 */
export function createVesuRebalanceContract(
  account: Account, 
  provider: RpcProvider, 
  contractAddress: string
): VesuRebalanceContract {
  return new VesuRebalanceContract(account, provider, contractAddress)
}

/**
 * Helper function to create rebalance actions
 */
export function createRebalanceActions(
  poolId: string,
  amount: bigint,
  feature: 'DEPOSIT' | 'WITHDRAW'
): RebalanceAction[] {
  return [{
    poolId,
    amount,
    feature
  }]
}

/**
 * Helper function to create multiple rebalance actions
 */
export function createMultipleRebalanceActions(
  actions: Array<{
    poolId: string
    amount: bigint
    feature: 'DEPOSIT' | 'WITHDRAW'
  }>
): RebalanceAction[] {
  return actions.map(action => ({
    poolId: action.poolId,
    amount: action.amount,
    feature: action.feature
  }))
}
