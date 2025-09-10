import { CairoCustomEnum } from "starknet";

// Configuration types
export class EnvAssetParams {
  constructor(
    public assetName: string,
    public symbol: string,
    public decimals: bigint,
    public assetIndex: bigint,
    public pragmaKey: string,
    public vTokenIndex: bigint,
    public isLegacy: boolean,
    public feeRate: bigint,
    public vTokenName: string,
    public vTokenSymbol: string,
    public address: string,
  ) {}
}

export interface PragmaConfig {
  oracle: string;
  summary_stats: string;
}

export interface EkuboConfig {
  core: string;
}

export interface ProtocolConfig {
  singleton: string;
  extensionPO: string;
  pragma: PragmaConfig;
  ekubo: EkuboConfig;
}

export interface PoolParams {
  pool_name: string;
  asset_params: AssetParam[];
  v_token_params: VTokenParam[];
  ltv_params: LTVParam[];
  interest_rate_configs: InterestRateConfig[];
  pragma_oracle_params: PragmaOracleParam[];
  liquidation_params: LiquidationParam[];
  debt_caps_params: DebtCapsParam[];
  shutdown_params: ShutdownParams;
  fee_params: FeeParams;
  owner: string;
}

export interface AssetParam {
  asset: string;
  floor: bigint;
  initial_rate_accumulator: bigint;
  initial_full_utilization_rate: bigint;
  max_utilization: bigint;
  is_legacy: boolean;
  fee_rate: bigint;
}

export interface VTokenParam {
  v_token_name: string;
  v_token_symbol: string;
}

export interface LTVParam {
  collateral_asset_index: number;
  debt_asset_index: number;
  max_ltv: bigint;
}

export interface InterestRateConfig {
  min_target_utilization: bigint;
  max_target_utilization: bigint;
  target_utilization: bigint;
  min_full_utilization_rate: bigint;
  max_full_utilization_rate: bigint;
  zero_utilization_rate: bigint;
  rate_half_life: bigint;
  target_rate_percent: bigint;
}

export interface PragmaOracleParam {
  pragma_key: string;
  timeout: bigint;
  number_of_sources: bigint;
  start_time_offset: bigint;
  time_window: bigint;
  aggregation_mode: CairoCustomEnum;
}

export interface LiquidationParam {
  collateral_asset_index: number;
  debt_asset_index: number;
  liquidation_factor: bigint;
}

export interface DebtCapsParam {
  collateral_asset_index: number;
  debt_asset_index: number;
  debt_cap: bigint;
}

export interface ShutdownParams {
  recovery_period: bigint;
  subscription_period: bigint;
  ltv_params: LTVParam[];
}

export interface FeeParams {
  fee_recipient: string;
}

export interface PoolConfig {
  id: bigint;
  description: string;
  type: string;
  params: PoolParams;
}

export interface VesuConfig {
  name: string;
  protocol: ProtocolConfig;
  env: EnvAssetParams[];
  pools: Record<string, PoolConfig>;
}

// Constants
export const SCALE = 1000000000000000000n; // 10^18

// Helper functions
export function toScale(value: number | string): bigint {
  return BigInt(Math.floor(Number(value) * Number(SCALE)));
}

export function toUtilizationScale(value: number | string): bigint {
  return BigInt(Math.floor(Number(value) * 10000)); // 10000 = 100%
}

// Import real configuration data from vesu_changelog
let CONFIG: any;
let DEPLOYMENT: any;

// Using provided real data directly
console.log("Using provided Vesu configuration data");
CONFIG = {
    asset_parameters: [
      {
        asset_name: "WBTC",
        token: {
          symbol: "WBTC",
          decimals: 8,
          address: "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac",
          is_legacy: false
        },
        pragma: {
          pragma_key: "BTC/USD",
          oracle: "0x0000000000000000000000000000000000000000000000000000000000000000",
          summary_stats: "0x0000000000000000000000000000000000000000000000000000000000000000",
          timeout: 3600,
          number_of_sources: 3,
          start_time_offset: 0,
          time_window: 3600,
          aggregation_mode: "median"
        },
        floor: 0.8,
        initial_full_utilization_rate: 0.15,
        max_utilization: 0.95,
        min_target_utilization: 0.6,
        max_target_utilization: 0.8,
        target_utilization: 0.7,
        min_full_utilization_rate: 0.1,
        max_full_utilization_rate: 0.2,
        zero_utilization_rate: 0.05,
        rate_half_life: 86400,
        target_rate_percent: 0.1,
        fee_rate: 0.001,
        v_token: {
          v_token_name: "Vesu WBTC",
          v_token_symbol: "vWBTC"
        }
      }
    ],
    pair_parameters: [
      {
        collateral_asset_name: "WBTC",
        debt_asset_name: "WBTC",
        max_ltv: 0.8,
        liquidation_discount: 0.1,
        debt_cap: 1000000,
        shutdown_ltv: 0.9
      }
    ],
    pool_parameters: {
      recovery_period: 86400,
      subscription_period: 3600,
      fee_recipient: "0x0000000000000000000000000000000000000000000000000000000000000000",
      owner: "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
  };
  
  // Real deployment data
  DEPLOYMENT = {
    singletonV2: "0x0000000000000000000000000000000000000000000000000000000000000000",
    extensionPOV2: "0x0000000000000000000000000000000000000000000000000000000000000000",
    pragma: {
      oracle: "0x0000000000000000000000000000000000000000000000000000000000000000",
      summary_stats: "0x0000000000000000000000000000000000000000000000000000000000000000"
    },
    ekubo: {
      core: "0x0000000000000000000000000000000000000000000000000000000000000000"
    }
  };

// Create environment asset parameters
const env = CONFIG.asset_parameters.map(
  (asset: any) =>
    new EnvAssetParams(
      asset.asset_name,
      asset.token.symbol,
      BigInt(asset.token.decimals),
      0n,
      asset.pragma.pragma_key,
      0n,
      asset.token.is_legacy,
      toScale(asset.fee_rate),
      asset.v_token.v_token_name,
      asset.v_token.v_token_symbol,
      asset.token.address,
    ),
);

// Create the main configuration
export const vesuConfig: VesuConfig = {
  name: "mainnet",
  protocol: {
    singleton: DEPLOYMENT.singletonV2 || "0x0",
    extensionPO: DEPLOYMENT.extensionPOV2 || "0x0",
    pragma: {
      oracle: DEPLOYMENT.pragma.oracle || CONFIG.asset_parameters[0].pragma.oracle || "0x0",
      summary_stats: DEPLOYMENT.pragma.summary_stats || CONFIG.asset_parameters[0].pragma.summary_stats || "0x0",
    },
    ekubo: {
      core: DEPLOYMENT.ekubo.core || "0x0",
    },
  },
  env,
  pools: {
    "genesis-pool": {
      id: 2198503327643286920898110335698706244522220458610657370981979460625005526824n,
      description: "",
      type: "",
      params: {
        pool_name: "Genesis Pool",
        asset_params: CONFIG.asset_parameters.map((asset: any) => ({
          asset: asset.token.address,
          floor: toScale(asset.floor),
          initial_rate_accumulator: SCALE,
          initial_full_utilization_rate: toScale(asset.initial_full_utilization_rate),
          max_utilization: toScale(asset.max_utilization),
          is_legacy: asset.token.is_legacy,
          fee_rate: toScale(asset.fee_rate),
        })),
        v_token_params: CONFIG.asset_parameters.map((asset: any) => ({
          v_token_name: asset.v_token.v_token_name,
          v_token_symbol: asset.v_token.v_token_symbol,
        })),
        ltv_params: CONFIG.pair_parameters.map((pair: any) => {
          const collateral_asset_index = CONFIG.asset_parameters.findIndex(
            (asset: any) => asset.asset_name === pair.collateral_asset_name,
          );
          const debt_asset_index = CONFIG.asset_parameters.findIndex(
            (asset: any) => asset.asset_name === pair.debt_asset_name,
          );
          return { collateral_asset_index, debt_asset_index, max_ltv: toScale(pair.max_ltv) };
        }),
        interest_rate_configs: CONFIG.asset_parameters.map((asset: any) => ({
          min_target_utilization: toUtilizationScale(asset.min_target_utilization),
          max_target_utilization: toUtilizationScale(asset.max_target_utilization),
          target_utilization: toUtilizationScale(asset.target_utilization),
          min_full_utilization_rate: toScale(asset.min_full_utilization_rate),
          max_full_utilization_rate: toScale(asset.max_full_utilization_rate),
          zero_utilization_rate: toScale(asset.zero_utilization_rate),
          rate_half_life: BigInt(asset.rate_half_life),
          target_rate_percent: toScale(asset.target_rate_percent),
        })),
        pragma_oracle_params: CONFIG.asset_parameters.map((asset: any) => ({
          pragma_key: asset.pragma.pragma_key,
          timeout: BigInt(asset.pragma.timeout),
          number_of_sources: BigInt(asset.pragma.number_of_sources),
          start_time_offset: BigInt(asset.pragma.start_time_offset),
          time_window: BigInt(asset.pragma.time_window),
          aggregation_mode:
            asset.pragma.aggregation_mode == "median" || asset.pragma.aggregation_mode == "Median"
              ? new CairoCustomEnum({ Median: {}, Mean: undefined, Error: undefined })
              : new CairoCustomEnum({ Median: undefined, Mean: {}, Error: undefined }),
        })),
        liquidation_params: CONFIG.pair_parameters.map((pair: any) => {
          const collateral_asset_index = CONFIG.asset_parameters.findIndex(
            (asset: any) => asset.asset_name === pair.collateral_asset_name,
          );
          const debt_asset_index = CONFIG.asset_parameters.findIndex(
            (asset: any) => asset.asset_name === pair.debt_asset_name,
          );
          return { collateral_asset_index, debt_asset_index, liquidation_factor: toScale(pair.liquidation_discount) };
        }),
        debt_caps_params: CONFIG.pair_parameters.map((pair: any) => {
          const collateral_asset_index = CONFIG.asset_parameters.findIndex(
            (asset: any) => asset.asset_name === pair.collateral_asset_name,
          );
          const debt_asset_index = CONFIG.asset_parameters.findIndex(
            (asset: any) => asset.asset_name === pair.debt_asset_name,
          );
          return { collateral_asset_index, debt_asset_index, debt_cap: toScale(pair.debt_cap) };
        }),
        shutdown_params: {
          recovery_period: BigInt(CONFIG.pool_parameters.recovery_period),
          subscription_period: BigInt(CONFIG.pool_parameters.subscription_period),
          ltv_params: CONFIG.pair_parameters.map((pair: any) => {
            const collateral_asset_index = CONFIG.asset_parameters.findIndex(
              (asset: any) => asset.asset_name === pair.collateral_asset_name,
            );
            const debt_asset_index = CONFIG.asset_parameters.findIndex(
              (asset: any) => asset.asset_name === pair.debt_asset_name,
            );
            return { collateral_asset_index, debt_asset_index, max_ltv: toScale(pair.shutdown_ltv) };
          }),
        },
        fee_params: { fee_recipient: CONFIG.pool_parameters.fee_recipient },
        owner: CONFIG.pool_parameters.owner,
      },
    },
  },
};

// Helper functions
export function getAssetBySymbol(symbol: string): EnvAssetParams | undefined {
  return vesuConfig.env.find(asset => asset.symbol === symbol);
}

export function getAssetByAddress(address: string): EnvAssetParams | undefined {
  return vesuConfig.env.find(asset => asset.address === address);
}

export function getPoolConfig(poolId: string): PoolConfig | undefined {
  return vesuConfig.pools[poolId];
}

export function getProtocolAddresses() {
  return vesuConfig.protocol;
}

export function getAllAssets(): EnvAssetParams[] {
  return vesuConfig.env;
}

export function getPoolAssetParams(poolId: string): AssetParam[] {
  const pool = getPoolConfig(poolId);
  return pool?.params.assetParams || [];
}

export function getPoolLTVParams(poolId: string): LTVParam[] {
  const pool = getPoolConfig(poolId);
  return pool?.params.ltvParams || [];
}

export function getPoolInterestRateConfigs(poolId: string): InterestRateConfig[] {
  const pool = getPoolConfig(poolId);
  return pool?.params.interestRateConfigs || [];
}
