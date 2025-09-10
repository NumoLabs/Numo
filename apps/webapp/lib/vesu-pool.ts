import {
  CreatePoolParams,
  LiquidatePositionParams,
  ModifyPositionParams,
  Protocol,
  TransferPositionParams,
  calculateRates,
} from "./vesu-types";

type OmitPool<T> = Omit<T, "pool_id" | "user" | "receive_as_shares">;

export class Pool {
  constructor(
    public id: bigint,
    public protocol: Protocol,
    public params: CreatePoolParams,
  ) {}

  async lend({ collateral_asset, debt_asset, collateral, debt, data }: OmitPool<ModifyPositionParams>) {
    const { deployer, singleton } = this.protocol;
    const params: ModifyPositionParams = {
      pool_id: this.id,
      collateral_asset,
      debt_asset,
      user: deployer.lender.address,
      collateral,
      debt,
      data,
    };
    singleton.connect(deployer.lender);
    const response = await singleton.modify_position(params);
    return response;
  }

  async borrow({ collateral_asset, debt_asset, collateral, debt, data }: OmitPool<ModifyPositionParams>) {
    const { deployer, singleton } = this.protocol;
    const params: ModifyPositionParams = {
      pool_id: this.id,
      collateral_asset,
      debt_asset,
      user: deployer.borrower.address,
      collateral,
      debt,
      data,
    };
    singleton.connect(deployer.borrower);
    const response = await singleton.modify_position(params);
    return response;
  }

  async transfer({
    from_collateral_asset,
    to_collateral_asset,
    from_debt_asset,
    to_debt_asset,
    from_user,
    to_user,
    collateral,
    debt,
    from_data,
    to_data,
  }: OmitPool<TransferPositionParams>) {
    const { deployer, singleton } = this.protocol;
    const params: TransferPositionParams = {
      pool_id: this.id,
      from_collateral_asset,
      to_collateral_asset,
      from_debt_asset,
      to_debt_asset,
      from_user,
      to_user,
      collateral,
      debt,
      from_data,
      to_data,
    };
    singleton.connect(deployer.lender);
    const response = await singleton.transfer_position(params);
    return response;
  }

  async liquidate({ collateral_asset, debt_asset, data }: OmitPool<LiquidatePositionParams>) {
    const { deployer, singleton } = this.protocol;
    const params: LiquidatePositionParams = {
      pool_id: this.id,
      collateral_asset,
      debt_asset,
      user: deployer.borrower.address,
      receive_as_shares: false,
      data,
    };
    singleton.connect(deployer.lender);
    const response = await singleton.liquidate_position(params);
    return response;
  }

  async borrowAndSupplyRates(assetAddress: string) {
    const index = this.params.asset_params.findIndex(({ asset }) => asset === assetAddress);
    const config = this.params.interest_rate_configs[index];
    return await calculateRates(this.protocol, this.id, assetAddress, config);
  }
}

// Helper function to create a pool instance from Vesu configuration
export function createPoolFromConfig(
  poolId: string,
  protocol: Protocol,
  vesuConfig: any
): Pool | null {
  const poolConfig = vesuConfig.pools[poolId];
  if (!poolConfig) {
    console.error(`Pool ${poolId} not found in configuration`);
    return null;
  }

  // Convert the pool configuration to CreatePoolParams format
  const createPoolParams: CreatePoolParams = {
    pool_name: poolConfig.params.pool_name,
    asset_params: poolConfig.params.asset_params,
    v_token_params: poolConfig.params.v_token_params,
    ltv_params: poolConfig.params.ltv_params,
    interest_rate_configs: poolConfig.params.interest_rate_configs,
    pragma_oracle_params: poolConfig.params.pragma_oracle_params,
    liquidation_params: poolConfig.params.liquidation_params,
    debt_caps_params: poolConfig.params.debt_caps_params,
    shutdown_params: poolConfig.params.shutdown_params,
    fee_params: poolConfig.params.fee_params,
    owner: poolConfig.params.owner,
  };

  return new Pool(poolConfig.id, protocol, createPoolParams);
}

// Helper function to get all available pools from configuration
export function getAllPoolsFromConfig(
  protocol: Protocol,
  vesuConfig: any
): Pool[] {
  const pools: Pool[] = [];
  
  for (const poolId in vesuConfig.pools) {
    const pool = createPoolFromConfig(poolId, protocol, vesuConfig);
    if (pool) {
      pools.push(pool);
    }
  }
  
  return pools;
}

// Helper function to get pool by ID
export function getPoolById(
  poolId: string,
  protocol: Protocol,
  vesuConfig: any
): Pool | null {
  return createPoolFromConfig(poolId, protocol, vesuConfig);
}
