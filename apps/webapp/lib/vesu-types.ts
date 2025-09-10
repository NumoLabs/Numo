// Vesu protocol types and interfaces
// These replace the vesu_changelog dependency

export interface CreatePoolParams {
  pool_id: bigint
  user: string
  receive_as_shares: boolean
  asset_params: AssetParams[]
  v_token_params: VTokenParams[]
  ltv_params: LTVParams[]
  interest_rate_configs: InterestRateConfig[]
  pragma_oracle_params: PragmaOracleParams[]
  liquidation_params: LiquidationParams[]
  debt_caps_params: DebtCapsParams[]
  shutdown_params: ShutdownParams
  fee_params: FeeParams
  owner: string
}

export interface ModifyPositionParams {
  pool_id: bigint
  collateral_asset: number
  debt_asset: number
  user: string
  collateral: bigint
  debt: bigint
  data: any
}

export interface TransferPositionParams {
  pool_id: bigint
  from_collateral_asset: number
  to_collateral_asset: number
  from_debt_asset: number
  to_debt_asset: number
  from_user: string
  to_user: string
  collateral: bigint
  debt: bigint
  from_data: any
  to_data: any
}

export interface LiquidatePositionParams {
  pool_id: bigint
  collateral_asset: number
  debt_asset: number
  user: string
  receive_as_shares: boolean
  data: any
}

export interface AssetParams {
  asset: string
  floor: bigint
  initial_rate_accumulator: bigint
  initial_full_utilization_rate: bigint
  max_utilization: bigint
  is_legacy: boolean
  fee_rate: bigint
}

export interface VTokenParams {
  v_token_name: string
  v_token_symbol: string
}

export interface LTVParams {
  collateral_asset_index: number
  debt_asset_index: number
  max_ltv: bigint
}

export interface InterestRateConfig {
  min_target_utilization: bigint
  max_target_utilization: bigint
  target_utilization: bigint
  min_full_utilization_rate: bigint
  max_full_utilization_rate: bigint
  zero_utilization_rate: bigint
  rate_half_life: bigint
  target_rate_percent: bigint
}

export interface PragmaOracleParams {
  pragma_key: string
  timeout: bigint
  number_of_sources: bigint
  start_time_offset: bigint
  time_window: bigint
  aggregation_mode: any
}

export interface LiquidationParams {
  collateral_asset_index: number
  debt_asset_index: number
  liquidation_factor: bigint
}

export interface DebtCapsParams {
  collateral_asset_index: number
  debt_asset_index: number
  debt_cap: bigint
}

export interface ShutdownParams {
  recovery_period: bigint
  subscription_period: bigint
  ltv_params: LTVParams[]
}

export interface FeeParams {
  fee_recipient: string
}

export interface Protocol {
  deployer: {
    lender: {
      address: string
    }
    borrower: {
      address: string
    }
  }
  singleton: {
    connect: (deployer: any) => void
    modify_position: (params: ModifyPositionParams) => Promise<any>
    transfer_position: (params: TransferPositionParams) => Promise<any>
    liquidate_position: (params: LiquidatePositionParams) => Promise<any>
  }
}

// Mock implementation of calculateRates
export async function calculateRates(
  protocol: Protocol,
  poolId: bigint,
  assetAddress: string,
  config: InterestRateConfig
): Promise<{ supplyRate: bigint; borrowRate: bigint }> {
  // Mock implementation - replace with real calculation
  return {
    supplyRate: 5000000000000000000n, // 5% in wei
    borrowRate: 8000000000000000000n  // 8% in wei
  }
}
