import { Account, Call, CallData, RpcProvider, Contract } from "starknet"

// Vesu Singleton contract ABI (simplified - you'll need the full ABI)
export const VESU_SINGLETON_ABI = [
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
    "outputs": [
      {
        "name": "response",
        "type": "struct",
        "members": [
          { "name": "collateral_delta", "type": "i257" },
          { "name": "collateral_shares_delta", "type": "i257" },
          { "name": "debt_delta", "type": "i257" },
          { "name": "nominal_debt_delta", "type": "i257" },
          { "name": "bad_debt", "type": "u256" }
        ]
      }
    ]
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
      {
        "name": "position",
        "type": "struct",
        "members": [
          { "name": "collateral_shares", "type": "u256" },
          { "name": "nominal_debt", "type": "u256" }
        ]
      },
      { "name": "collateral", "type": "u256" },
      { "name": "debt", "type": "u256" }
    ]
  },
  {
    "name": "check_collateralization",
    "type": "function",
    "inputs": [
      { "name": "pool_id", "type": "felt252" },
      { "name": "collateral_asset", "type": "ContractAddress" },
      { "name": "debt_asset", "type": "ContractAddress" },
      { "name": "user", "type": "ContractAddress" }
    ],
    "outputs": [
      { "name": "collateralized", "type": "bool" },
      { "name": "collateral_value", "type": "u256" },
      { "name": "debt_value", "type": "u256" }
    ]
  },
  {
    "name": "utilization",
    "type": "function",
    "inputs": [
      { "name": "pool_id", "type": "felt252" },
      { "name": "asset", "type": "ContractAddress" }
    ],
    "outputs": [
      { "name": "utilization", "type": "u256" }
    ]
  },
  {
    "name": "rate_accumulator",
    "type": "function",
    "inputs": [
      { "name": "pool_id", "type": "felt252" },
      { "name": "asset", "type": "ContractAddress" }
    ],
    "outputs": [
      { "name": "rate_accumulator", "type": "u256" }
    ]
  },
  {
    "name": "asset_config",
    "type": "function",
    "inputs": [
      { "name": "pool_id", "type": "felt252" },
      { "name": "asset", "type": "ContractAddress" }
    ],
    "outputs": [
      {
        "name": "asset_config",
        "type": "struct",
        "members": [
          { "name": "total_collateral_shares", "type": "u256" },
          { "name": "total_nominal_debt", "type": "u256" },
          { "name": "reserve", "type": "u256" },
          { "name": "max_utilization", "type": "u256" },
          { "name": "floor", "type": "u256" },
          { "name": "scale", "type": "u256" },
          { "name": "is_legacy", "type": "bool" },
          { "name": "last_updated", "type": "u256" },
          { "name": "last_rate_accumulator", "type": "u256" },
          { "name": "last_full_utilization_rate", "type": "u256" },
          { "name": "fee_rate", "type": "u256" }
        ]
      },
      { "name": "fee_shares", "type": "u256" }
    ]
  },
  {
    "name": "ltv_config",
    "type": "function",
    "inputs": [
      { "name": "pool_id", "type": "felt252" },
      { "name": "collateral_asset", "type": "ContractAddress" },
      { "name": "debt_asset", "type": "ContractAddress" }
    ],
    "outputs": [
      {
        "name": "ltv_config",
        "type": "struct",
        "members": [
          { "name": "max_ltv", "type": "u256" }
        ]
      }
    ]
  },
  {
    "name": "context",
    "type": "function",
    "inputs": [
      { "name": "pool_id", "type": "felt252" },
      { "name": "collateral_asset", "type": "ContractAddress" },
      { "name": "debt_asset", "type": "ContractAddress" },
      { "name": "user", "type": "ContractAddress" }
    ],
    "outputs": [
      {
        "name": "context",
        "type": "struct",
        "members": [
          { "name": "pool_id", "type": "felt252" },
          { "name": "extension", "type": "ContractAddress" },
          { "name": "collateral_asset", "type": "ContractAddress" },
          { "name": "debt_asset", "type": "ContractAddress" },
          { "name": "collateral_asset_config", "type": "struct" },
          { "name": "debt_asset_config", "type": "struct" },
          { "name": "collateral_asset_price", "type": "struct" },
          { "name": "debt_asset_price", "type": "struct" },
          { "name": "collateral_asset_fee_shares", "type": "u256" },
          { "name": "debt_asset_fee_shares", "type": "u256" },
          { "name": "max_ltv", "type": "u256" },
          { "name": "user", "type": "ContractAddress" },
          { "name": "position", "type": "struct" }
        ]
      }
    ]
  },
  {
    "name": "calculate_collateral_shares",
    "type": "function",
    "inputs": [
      { "name": "pool_id", "type": "felt252" },
      { "name": "asset", "type": "ContractAddress" },
      { "name": "collateral", "type": "i257" }
    ],
    "outputs": [
      { "name": "collateral_shares", "type": "u256" }
    ]
  },
  {
    "name": "calculate_collateral",
    "type": "function",
    "inputs": [
      { "name": "pool_id", "type": "felt252" },
      { "name": "asset", "type": "ContractAddress" },
      { "name": "collateral_shares", "type": "i257" }
    ],
    "outputs": [
      { "name": "collateral", "type": "u256" }
    ]
  },
  {
    "name": "calculate_debt",
    "type": "function",
    "inputs": [
      { "name": "nominal_debt", "type": "i257" },
      { "name": "rate_accumulator", "type": "u256" },
      { "name": "asset_scale", "type": "u256" }
    ],
    "outputs": [
      { "name": "debt", "type": "u256" }
    ]
  },
  {
    "name": "calculate_nominal_debt",
    "type": "function",
    "inputs": [
      { "name": "debt", "type": "i257" },
      { "name": "rate_accumulator", "type": "u256" },
      { "name": "asset_scale", "type": "u256" }
    ],
    "outputs": [
      { "name": "nominal_debt", "type": "u256" }
    ]
  },
  {
    "name": "flash_loan",
    "type": "function",
    "inputs": [
      { "name": "receiver", "type": "ContractAddress" },
      { "name": "asset", "type": "ContractAddress" },
      { "name": "amount", "type": "u256" },
      { "name": "is_legacy", "type": "bool" },
      { "name": "data", "type": "Array<felt252>" }
    ],
    "outputs": []
  }
] as const

// Types for the contract
export interface ModifyPositionParams {
  poolId: string
  collateralAsset: string
  debtAsset: string
  user: string
  collateral: Amount
  debt: Amount
  data: string[]
}

export interface Amount {
  amountType: 'Delta' | 'Absolute'
  denomination: 'Assets' | 'Native'
  value: bigint
}

export interface Position {
  collateralShares: bigint
  nominalDebt: bigint
}

export interface PositionInfo {
  position: Position
  collateral: bigint
  debt: bigint
}

export interface CollateralizationInfo {
  collateralized: boolean
  collateralValue: bigint
  debtValue: bigint
}

export interface AssetConfig {
  totalCollateralShares: bigint
  totalNominalDebt: bigint
  reserve: bigint
  maxUtilization: bigint
  floor: bigint
  scale: bigint
  isLegacy: boolean
  lastUpdated: bigint
  lastRateAccumulator: bigint
  lastFullUtilizationRate: bigint
  feeRate: bigint
}

export interface AssetConfigInfo {
  assetConfig: AssetConfig
  feeShares: bigint
}

export interface LTVConfig {
  maxLtv: bigint
}

export interface AssetPrice {
  value: bigint
  isValid: boolean
}

export interface Context {
  poolId: string
  extension: string
  collateralAsset: string
  debtAsset: string
  collateralAssetConfig: AssetConfig
  debtAssetConfig: AssetConfig
  collateralAssetPrice: AssetPrice
  debtAssetPrice: AssetPrice
  collateralAssetFeeShares: bigint
  debtAssetFeeShares: bigint
  maxLtv: bigint
  user: string
  position: Position
}

export class VesuSingletonContract {
  private account: Account
  private provider: RpcProvider
  private contract: Contract

  constructor(account: Account, provider: RpcProvider, contractAddress: string) {
    this.account = account
    this.provider = provider
    this.contract = new Contract(VESU_SINGLETON_ABI, contractAddress, provider)
  }

  /**
   * Modify a position (deposit, withdraw, borrow, repay)
   */
  async modifyPosition(params: ModifyPositionParams): Promise<string> {
    try {
      const call: Call = {
        contractAddress: this.contract.address,
        entrypoint: "modify_position",
        calldata: CallData.compile({
          params: {
            pool_id: params.poolId,
            collateral_asset: params.collateralAsset,
            debt_asset: params.debtAsset,
            user: params.user,
            collateral: {
              amount_type: params.collateral.amountType === 'Delta' ? 0 : 1,
              denomination: params.collateral.denomination === 'Assets' ? 0 : 1,
              value: params.collateral.value
            },
            debt: {
              amount_type: params.debt.amountType === 'Delta' ? 0 : 1,
              denomination: params.debt.denomination === 'Assets' ? 0 : 1,
              value: params.debt.value
            },
            data: params.data
          }
        })
      }

      const result = await this.account.execute(call)
      return result.transaction_hash
    } catch (error) {
      console.error('Modify position failed:', error)
      throw new Error(`Modify position failed: ${error}`)
    }
  }

  /**
   * Get position information
   */
  async getPosition(
    poolId: string,
    collateralAsset: string,
    debtAsset: string,
    user: string
  ): Promise<PositionInfo> {
    try {
      const result = await this.contract.call("position", [
        poolId,
        collateralAsset,
        debtAsset,
        user
      ])
      
      return {
        position: {
          collateralShares: BigInt(result.position.collateral_shares),
          nominalDebt: BigInt(result.position.nominal_debt)
        },
        collateral: BigInt(result.collateral),
        debt: BigInt(result.debt)
      }
    } catch (error) {
      console.error('Failed to get position:', error)
      throw new Error(`Failed to get position: ${error}`)
    }
  }

  /**
   * Check if position is collateralized
   */
  async checkCollateralization(
    poolId: string,
    collateralAsset: string,
    debtAsset: string,
    user: string
  ): Promise<CollateralizationInfo> {
    try {
      const result = await this.contract.call("check_collateralization", [
        poolId,
        collateralAsset,
        debtAsset,
        user
      ])
      
      return {
        collateralized: result.collateralized,
        collateralValue: BigInt(result.collateral_value),
        debtValue: BigInt(result.debt_value)
      }
    } catch (error) {
      console.error('Failed to check collateralization:', error)
      throw new Error(`Failed to check collateralization: ${error}`)
    }
  }

  /**
   * Get asset utilization
   */
  async getUtilization(poolId: string, asset: string): Promise<bigint> {
    try {
      const result = await this.contract.call("utilization", [poolId, asset])
      return BigInt(result.utilization)
    } catch (error) {
      console.error('Failed to get utilization:', error)
      throw new Error(`Failed to get utilization: ${error}`)
    }
  }

  /**
   * Get rate accumulator
   */
  async getRateAccumulator(poolId: string, asset: string): Promise<bigint> {
    try {
      const result = await this.contract.call("rate_accumulator", [poolId, asset])
      return BigInt(result.rate_accumulator)
    } catch (error) {
      console.error('Failed to get rate accumulator:', error)
      throw new Error(`Failed to get rate accumulator: ${error}`)
    }
  }

  /**
   * Get asset configuration
   */
  async getAssetConfig(poolId: string, asset: string): Promise<AssetConfigInfo> {
    try {
      const result = await this.contract.call("asset_config", [poolId, asset])
      
      return {
        assetConfig: {
          totalCollateralShares: BigInt(result.asset_config.total_collateral_shares),
          totalNominalDebt: BigInt(result.asset_config.total_nominal_debt),
          reserve: BigInt(result.asset_config.reserve),
          maxUtilization: BigInt(result.asset_config.max_utilization),
          floor: BigInt(result.asset_config.floor),
          scale: BigInt(result.asset_config.scale),
          isLegacy: result.asset_config.is_legacy,
          lastUpdated: BigInt(result.asset_config.last_updated),
          lastRateAccumulator: BigInt(result.asset_config.last_rate_accumulator),
          lastFullUtilizationRate: BigInt(result.asset_config.last_full_utilization_rate),
          feeRate: BigInt(result.asset_config.fee_rate)
        },
        feeShares: BigInt(result.fee_shares)
      }
    } catch (error) {
      console.error('Failed to get asset config:', error)
      throw new Error(`Failed to get asset config: ${error}`)
    }
  }

  /**
   * Get LTV configuration
   */
  async getLTVConfig(
    poolId: string,
    collateralAsset: string,
    debtAsset: string
  ): Promise<LTVConfig> {
    try {
      const result = await this.contract.call("ltv_config", [
        poolId,
        collateralAsset,
        debtAsset
      ])
      
      return {
        maxLtv: BigInt(result.ltv_config.max_ltv)
      }
    } catch (error) {
      console.error('Failed to get LTV config:', error)
      throw new Error(`Failed to get LTV config: ${error}`)
    }
  }

  /**
   * Get context for a position
   */
  async getContext(
    poolId: string,
    collateralAsset: string,
    debtAsset: string,
    user: string
  ): Promise<Context> {
    try {
      const result = await this.contract.call("context", [
        poolId,
        collateralAsset,
        debtAsset,
        user
      ])
      
      return {
        poolId: result.context.pool_id,
        extension: result.context.extension,
        collateralAsset: result.context.collateral_asset,
        debtAsset: result.context.debt_asset,
        collateralAssetConfig: {
          totalCollateralShares: BigInt(result.context.collateral_asset_config.total_collateral_shares),
          totalNominalDebt: BigInt(result.context.collateral_asset_config.total_nominal_debt),
          reserve: BigInt(result.context.collateral_asset_config.reserve),
          maxUtilization: BigInt(result.context.collateral_asset_config.max_utilization),
          floor: BigInt(result.context.collateral_asset_config.floor),
          scale: BigInt(result.context.collateral_asset_config.scale),
          isLegacy: result.context.collateral_asset_config.is_legacy,
          lastUpdated: BigInt(result.context.collateral_asset_config.last_updated),
          lastRateAccumulator: BigInt(result.context.collateral_asset_config.last_rate_accumulator),
          lastFullUtilizationRate: BigInt(result.context.collateral_asset_config.last_full_utilization_rate),
          feeRate: BigInt(result.context.collateral_asset_config.fee_rate)
        },
        debtAssetConfig: {
          totalCollateralShares: BigInt(result.context.debt_asset_config.total_collateral_shares),
          totalNominalDebt: BigInt(result.context.debt_asset_config.total_nominal_debt),
          reserve: BigInt(result.context.debt_asset_config.reserve),
          maxUtilization: BigInt(result.context.debt_asset_config.max_utilization),
          floor: BigInt(result.context.debt_asset_config.floor),
          scale: BigInt(result.context.debt_asset_config.scale),
          isLegacy: result.context.debt_asset_config.is_legacy,
          lastUpdated: BigInt(result.context.debt_asset_config.last_updated),
          lastRateAccumulator: BigInt(result.context.debt_asset_config.last_rate_accumulator),
          lastFullUtilizationRate: BigInt(result.context.debt_asset_config.last_full_utilization_rate),
          feeRate: BigInt(result.context.debt_asset_config.fee_rate)
        },
        collateralAssetPrice: {
          value: BigInt(result.context.collateral_asset_price.value),
          isValid: result.context.collateral_asset_price.is_valid
        },
        debtAssetPrice: {
          value: BigInt(result.context.debt_asset_price.value),
          isValid: result.context.debt_asset_price.is_valid
        },
        collateralAssetFeeShares: BigInt(result.context.collateral_asset_fee_shares),
        debtAssetFeeShares: BigInt(result.context.debt_asset_fee_shares),
        maxLtv: BigInt(result.context.max_ltv),
        user: result.context.user,
        position: {
          collateralShares: BigInt(result.context.position.collateral_shares),
          nominalDebt: BigInt(result.context.position.nominal_debt)
        }
      }
    } catch (error) {
      console.error('Failed to get context:', error)
      throw new Error(`Failed to get context: ${error}`)
    }
  }

  /**
   * Calculate collateral shares
   */
  async calculateCollateralShares(
    poolId: string,
    asset: string,
    collateral: bigint
  ): Promise<bigint> {
    try {
      const result = await this.contract.call("calculate_collateral_shares", [
        poolId,
        asset,
        collateral
      ])
      return BigInt(result.collateral_shares)
    } catch (error) {
      console.error('Failed to calculate collateral shares:', error)
      throw new Error(`Failed to calculate collateral shares: ${error}`)
    }
  }

  /**
   * Calculate collateral from shares
   */
  async calculateCollateral(
    poolId: string,
    asset: string,
    collateralShares: bigint
  ): Promise<bigint> {
    try {
      const result = await this.contract.call("calculate_collateral", [
        poolId,
        asset,
        collateralShares
      ])
      return BigInt(result.collateral)
    } catch (error) {
      console.error('Failed to calculate collateral:', error)
      throw new Error(`Failed to calculate collateral: ${error}`)
    }
  }

  /**
   * Calculate debt from nominal debt
   */
  async calculateDebt(
    nominalDebt: bigint,
    rateAccumulator: bigint,
    assetScale: bigint
  ): Promise<bigint> {
    try {
      const result = await this.contract.call("calculate_debt", [
        nominalDebt,
        rateAccumulator,
        assetScale
      ])
      return BigInt(result.debt)
    } catch (error) {
      console.error('Failed to calculate debt:', error)
      throw new Error(`Failed to calculate debt: ${error}`)
    }
  }

  /**
   * Calculate nominal debt from debt
   */
  async calculateNominalDebt(
    debt: bigint,
    rateAccumulator: bigint,
    assetScale: bigint
  ): Promise<bigint> {
    try {
      const result = await this.contract.call("calculate_nominal_debt", [
        debt,
        rateAccumulator,
        assetScale
      ])
      return BigInt(result.nominal_debt)
    } catch (error) {
      console.error('Failed to calculate nominal debt:', error)
      throw new Error(`Failed to calculate nominal debt: ${error}`)
    }
  }

  /**
   * Execute flash loan
   */
  async flashLoan(
    receiver: string,
    asset: string,
    amount: bigint,
    isLegacy: boolean = false,
    data: string[] = []
  ): Promise<string> {
    try {
      const call: Call = {
        contractAddress: this.contract.address,
        entrypoint: "flash_loan",
        calldata: CallData.compile({
          receiver,
          asset,
          amount,
          is_legacy: isLegacy,
          data
        })
      }

      const result = await this.account.execute(call)
      return result.transaction_hash
    } catch (error) {
      console.error('Flash loan failed:', error)
      throw new Error(`Flash loan failed: ${error}`)
    }
  }
}

/**
 * Helper function to create VesuSingleton contract instance
 */
export function createVesuSingletonContract(
  account: Account, 
  provider: RpcProvider, 
  contractAddress: string
): VesuSingletonContract {
  return new VesuSingletonContract(account, provider, contractAddress)
}

/**
 * Helper function to create modify position parameters
 */
export function createModifyPositionParams(
  poolId: string,
  collateralAsset: string,
  debtAsset: string,
  user: string,
  collateralAmount: bigint,
  debtAmount: bigint,
  collateralType: 'Delta' | 'Absolute' = 'Delta',
  debtType: 'Delta' | 'Absolute' = 'Delta'
): ModifyPositionParams {
  return {
    poolId,
    collateralAsset,
    debtAsset,
    user,
    collateral: {
      amountType: collateralType,
      denomination: 'Assets',
      value: collateralAmount
    },
    debt: {
      amountType: debtType,
      denomination: 'Assets',
      value: debtAmount
    },
    data: []
  }
}

/**
 * Helper function to create deposit parameters
 */
export function createDepositParams(
  poolId: string,
  collateralAsset: string,
  debtAsset: string,
  user: string,
  amount: bigint
): ModifyPositionParams {
  return createModifyPositionParams(
    poolId,
    collateralAsset,
    debtAsset,
    user,
    amount, // collateral amount
    BigInt(0), // no debt
    'Delta',
    'Delta'
  )
}

/**
 * Helper function to create withdraw parameters
 */
export function createWithdrawParams(
  poolId: string,
  collateralAsset: string,
  debtAsset: string,
  user: string,
  amount: bigint
): ModifyPositionParams {
  return createModifyPositionParams(
    poolId,
    collateralAsset,
    debtAsset,
    user,
    -amount, // negative collateral amount (withdraw)
    BigInt(0), // no debt
    'Delta',
    'Delta'
  )
}

/**
 * Helper function to create borrow parameters
 */
export function createBorrowParams(
  poolId: string,
  collateralAsset: string,
  debtAsset: string,
  user: string,
  amount: bigint
): ModifyPositionParams {
  return createModifyPositionParams(
    poolId,
    collateralAsset,
    debtAsset,
    user,
    BigInt(0), // no collateral change
    amount, // debt amount
    'Delta',
    'Delta'
  )
}

/**
 * Helper function to create repay parameters
 */
export function createRepayParams(
  poolId: string,
  collateralAsset: string,
  debtAsset: string,
  user: string,
  amount: bigint
): ModifyPositionParams {
  return createModifyPositionParams(
    poolId,
    collateralAsset,
    debtAsset,
    user,
    BigInt(0), // no collateral change
    -amount, // negative debt amount (repay)
    'Delta',
    'Delta'
  )
}
