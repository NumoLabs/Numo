// Real Vesu Data from vesu-v1 repository
// This file contains the actual asset configurations from Vesu

export interface VesuRealAsset {
  asset_name: string;
  logo_uri: string;
  token: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    is_legacy: boolean;
  };
  pragma: {
    oracle: string;
    summary_stats: string;
    pragma_key: string;
    timeout: number;
    number_of_sources: number;
    start_time_offset: number;
    time_window: number;
  };
  v_token: {
    v_token_name: string;
    v_token_symbol: string;
  };
  floor: number;
  max_utilization: number;
  target_utilization: number;
  min_target_utilization: number;
  max_target_utilization: number;
  min_full_utilization_rate: string;
  max_full_utilization_rate: string;
  initial_full_utilization_rate: string;
  zero_utilization_rate: string;
  rate_half_life: number;
  target_rate_percent: number;
  fee_rate: number;
}

// Sepolia Assets (Real data from vesu-v1)
export const VESU_SEPOLIA_ASSETS: VesuRealAsset[] = [
  {
    asset_name: "ethereum",
    logo_uri: "https://dv3jj1unlp2jl.cloudfront.net/128/color/eth.png",
    token: {
      address: "0x7809bb63f557736e49ff0ae4a64bd8aa6ea60e3f77f26c520cb92c24e3700d3",
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      is_legacy: false
    },
    pragma: {
      oracle: "0x4d50f735be96c4ad60b4f6e4ae92ae4b65e84d89497860116dd8bcee3d39c13",
      summary_stats: "0x0379afb83d2f8e38ab08252750233665a812a24278aacdde52475618edbf879c",
      pragma_key: "ETH/USD",
      timeout: 14400,
      number_of_sources: 4,
      start_time_offset: 0,
      time_window: 0
    },
    v_token: {
      v_token_name: "Vesu Ether",
      v_token_symbol: "vETH"
    },
    floor: 100,
    max_utilization: 0.95,
    target_utilization: 0.8,
    min_target_utilization: 0.78,
    max_target_utilization: 0.82,
    min_full_utilization_rate: "0.000000000160350400",
    max_full_utilization_rate: "0.000000035320611769",
    initial_full_utilization_rate: "0.000000013035786672",
    zero_utilization_rate: "0.000000000032134073",
    rate_half_life: 86400,
    target_rate_percent: 0.2,
    fee_rate: 0
  },
  {
    asset_name: "wrapped-bitcoin",
    logo_uri: "https://dv3jj1unlp2jl.cloudfront.net/128/color/wbtc.png",
    token: {
      address: "0x63d32a3fa6074e72e7a1e06fe78c46a0c8473217773e19f11d8c8cbfc4ff8ca",
      name: "Wrapped BTC",
      symbol: "WBTC",
      decimals: 8,
      is_legacy: false
    },
    pragma: {
      oracle: "0x4d50f735be96c4ad60b4f6e4ae92ae4b65e84d89497860116dd8bcee3d39c13",
      summary_stats: "0x0379afb83d2f8e38ab08252750233665a812a24278aacdde52475618edbf879c",
      pragma_key: "WBTC/USD",
      timeout: 14400,
      number_of_sources: 4,
      start_time_offset: 0,
      time_window: 0
    },
    v_token: {
      v_token_name: "Vesu Wrapped BTC",
      v_token_symbol: "vWBTC"
    },
    floor: 100,
    max_utilization: 0.95,
    target_utilization: 0.8,
    min_target_utilization: 0.78,
    max_target_utilization: 0.82,
    min_full_utilization_rate: "0.000000000160350400",
    max_full_utilization_rate: "0.000000035320611769",
    initial_full_utilization_rate: "0.000000013035786672",
    zero_utilization_rate: "0.000000000032134073",
    rate_half_life: 86400,
    target_rate_percent: 0.2,
    fee_rate: 0
  },
  {
    asset_name: "usd-coin",
    logo_uri: "https://dv3jj1unlp2jl.cloudfront.net/128/color/usdc.png",
    token: {
      address: "0x27ef4670397069d7d5442cb7945b27338692de0d8896bdb15e6400cf5249f94",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      is_legacy: false
    },
    pragma: {
      oracle: "0x4d50f735be96c4ad60b4f6e4ae92ae4b65e84d89497860116dd8bcee3d39c13",
      summary_stats: "0x0379afb83d2f8e38ab08252750233665a812a24278aacdde52475618edbf879c",
      pragma_key: "USDC/USD",
      timeout: 14400,
      number_of_sources: 4,
      start_time_offset: 0,
      time_window: 0
    },
    v_token: {
      v_token_name: "Vesu USD Coin",
      v_token_symbol: "vUSDC"
    },
    floor: 100,
    max_utilization: 0.95,
    target_utilization: 0.8,
    min_target_utilization: 0.78,
    max_target_utilization: 0.82,
    min_full_utilization_rate: "0.000000000160350400",
    max_full_utilization_rate: "0.000000035320611769",
    initial_full_utilization_rate: "0.000000013035786672",
    zero_utilization_rate: "0.000000000032134073",
      rate_half_life: 86400,
      target_rate_percent: 0.2,
      fee_rate: 0
    },
    {
      asset_name: "tether",
      logo_uri: "https://dv3jj1unlp2jl.cloudfront.net/128/color/usdt.png",
      token: {
        address: "0x2cd937c3dccd4a4e125011bbe3189a6db0419bb6dd95c4b5ce5f6d834d8996",
        name: "Tether USD",
        symbol: "USDT",
        decimals: 6,
        is_legacy: false
      },
      pragma: {
        oracle: "0x4d50f735be96c4ad60b4f6e4ae92ae4b65e84d89497860116dd8bcee3d39c13",
        summary_stats: "0x0379afb83d2f8e38ab08252750233665a812a24278aacdde52475618edbf879c",
        pragma_key: "USDT/USD",
        timeout: 14400,
        number_of_sources: 4,
        start_time_offset: 0,
        time_window: 0
      },
      v_token: {
        v_token_name: "Vesu Tether USD",
        v_token_symbol: "vUSDT"
      },
      floor: 100,
      max_utilization: 0.95,
      target_utilization: 0.8,
      min_target_utilization: 0.78,
      max_target_utilization: 0.82,
      min_full_utilization_rate: "0.000000000160350400",
      max_full_utilization_rate: "0.000000035320611769",
      initial_full_utilization_rate: "0.000000013035786672",
      zero_utilization_rate: "0.000000000032134073",
      rate_half_life: 86400,
      target_rate_percent: 0.2,
      fee_rate: 0
    },
    {
      asset_name: "wrapped-steth",
      logo_uri: "https://dv3jj1unlp2jl.cloudfront.net/128/color/steth.png",
      token: {
        address: "0x01b13a244e499b9baf6b82900dced05fbf4a44274d87f1000f500d465da12669",
        name: "Starknet Wrapped Staked Ether",
        symbol: "wstETH",
        decimals: 18,
        is_legacy: false
      },
      pragma: {
        oracle: "0x4d50f735be96c4ad60b4f6e4ae92ae4b65e84d89497860116dd8bcee3d39c13",
        summary_stats: "0x0379afb83d2f8e38ab08252750233665a812a24278aacdde52475618edbf879c",
        pragma_key: "WSTETH/USD",
        timeout: 14400,
        number_of_sources: 4,
        start_time_offset: 0,
        time_window: 0
      },
      v_token: {
        v_token_name: "Vesu Wrapped Staked Ether",
        v_token_symbol: "vWSTETH"
      },
      floor: 100,
      max_utilization: 0.95,
      target_utilization: 0.8,
      min_target_utilization: 0.78,
      max_target_utilization: 0.82,
      min_full_utilization_rate: "0.000000000160350400",
      max_full_utilization_rate: "0.000000035320611769",
      initial_full_utilization_rate: "0.000000013035786672",
      zero_utilization_rate: "0.000000000032134073",
      rate_half_life: 86400,
      target_rate_percent: 0.2,
      fee_rate: 0
    },
    {
      asset_name: "starknet",
      logo_uri: "https://dv3jj1unlp2jl.cloudfront.net/128/color/strk.png",
      token: {
        address: "0x772131070c7d56f78f3e46b27b70271d8ca81c7c52e3f62aa868fab4b679e43",
        name: "Starknet Token",
        symbol: "STRK",
        decimals: 18,
        is_legacy: false
      },
      pragma: {
        oracle: "0x4d50f735be96c4ad60b4f6e4ae92ae4b65e84d89497860116dd8bcee3d39c13",
        summary_stats: "0x0379afb83d2f8e38ab08252750233665a812a24278aacdde52475618edbf879c",
        pragma_key: "STRK/USD",
        timeout: 14400,
        number_of_sources: 4,
        start_time_offset: 0,
        time_window: 0
      },
      v_token: {
        v_token_name: "Vesu Starknet",
        v_token_symbol: "vSTRK"
      },
      floor: 100,
      max_utilization: 0.95,
      target_utilization: 0.8,
      min_target_utilization: 0.78,
      max_target_utilization: 0.82,
      min_full_utilization_rate: "0.000000000160350400",
      max_full_utilization_rate: "0.000000035320611769",
      initial_full_utilization_rate: "0.000000013035786672",
      zero_utilization_rate: "0.000000000032134073",
      rate_half_life: 86400,
      target_rate_percent: 0.2,
      fee_rate: 0
    }
  ];

// Mainnet Assets (Real data from vesu-v1)
export const VESU_MAINNET_ASSETS: VesuRealAsset[] = [
  {
    asset_name: "ethereum",
    logo_uri: "https://dv3jj1unlp2jl.cloudfront.net/128/color/eth.png",
    token: {
      address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
      is_legacy: false
    },
    pragma: {
      oracle: "0x2a85bd616f912537c50a49a4076db02c00b29b2cdc8a197ce92ed1837fa875b",
      summary_stats: "0x049eefafae944d07744d07cc72a5bf14728a6fb463c3eae5bca13552f5d455fd",
      pragma_key: "ETH/USD",
      timeout: 14400,
      number_of_sources: 4,
      start_time_offset: 0,
      time_window: 0
    },
    v_token: {
      v_token_name: "Vesu Ether",
      v_token_symbol: "vETH"
    },
    floor: 10,
    max_utilization: 0.95,
    target_utilization: 0.8,
    min_target_utilization: 0.78,
    max_target_utilization: 0.82,
    min_full_utilization_rate: "0.000000000641401600",
    max_full_utilization_rate: "0.000000035320611769",
    initial_full_utilization_rate: "0.000000013035786672",
    zero_utilization_rate: "0.000000000032134073",
    rate_half_life: 432000,
    target_rate_percent: 0.2,
    fee_rate: 0
  },
  {
    asset_name: "wrapped-bitcoin",
    logo_uri: "https://dv3jj1unlp2jl.cloudfront.net/128/color/wbtc.png",
    token: {
      address: "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac",
      name: "Wrapped BTC",
      symbol: "WBTC",
      decimals: 8,
      is_legacy: false
    },
    pragma: {
      oracle: "0x2a85bd616f912537c50a49a4076db02c00b29b2cdc8a197ce92ed1837fa875b",
      summary_stats: "0x049eefafae944d07744d07cc72a5bf14728a6fb463c3eae5bca13552f5d455fd",
      pragma_key: "WBTC/USD",
      timeout: 14400,
      number_of_sources: 4,
      start_time_offset: 0,
      time_window: 0
    },
    v_token: {
      v_token_name: "Vesu Wrapped BTC",
      v_token_symbol: "vWBTC"
    },
    floor: 10,
    max_utilization: 0.95,
    target_utilization: 0.8,
    min_target_utilization: 0.78,
    max_target_utilization: 0.82,
    min_full_utilization_rate: "0.000000000641401600",
    max_full_utilization_rate: "0.000000035320611769",
    initial_full_utilization_rate: "0.000000013035786672",
    zero_utilization_rate: "0.000000000032134073",
    rate_half_life: 432000,
    target_rate_percent: 0.2,
    fee_rate: 0
  },
  {
    asset_name: "usd-coin",
    logo_uri: "https://dv3jj1unlp2jl.cloudfront.net/128/color/usdc.png",
    token: {
      address: "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
      name: "USD Coin",
      symbol: "USDC",
      decimals: 6,
      is_legacy: false
    },
    pragma: {
      oracle: "0x2a85bd616f912537c50a49a4076db02c00b29b2cdc8a197ce92ed1837fa875b",
      summary_stats: "0x049eefafae944d07744d07cc72a5bf14728a6fb463c3eae5bca13552f5d455fd",
      pragma_key: "USDC/USD",
      timeout: 14400,
      number_of_sources: 4,
      start_time_offset: 0,
      time_window: 0
    },
    v_token: {
      v_token_name: "Vesu USD Coin",
      v_token_symbol: "vUSDC"
    },
    floor: 10,
    max_utilization: 0.95,
    target_utilization: 0.8,
    min_target_utilization: 0.78,
    max_target_utilization: 0.82,
    min_full_utilization_rate: "0.000000000641401600",
    max_full_utilization_rate: "0.000000035320611769",
    initial_full_utilization_rate: "0.000000013035786672",
    zero_utilization_rate: "0.000000000032134073",
    rate_half_life: 432000,
    target_rate_percent: 0.2,
    fee_rate: 0
  }
];

// Helper functions
export function getVesuAssets(isTestnet: boolean): VesuRealAsset[] {
  return isTestnet ? VESU_SEPOLIA_ASSETS : VESU_MAINNET_ASSETS;
}

export function getVesuAssetBySymbol(symbol: string, isTestnet: boolean): VesuRealAsset | undefined {
  const assets = getVesuAssets(isTestnet);
  return assets.find(asset => asset.token.symbol === symbol);
}

export function getVesuAssetByAddress(address: string, isTestnet: boolean): VesuRealAsset | undefined {
  const assets = getVesuAssets(isTestnet);
  return assets.find(asset => asset.token.address.toLowerCase() === address.toLowerCase());
}

// Convert Vesu real asset to our internal format - ONLY REAL DATA
export function convertVesuAssetToPoolAsset(vesuAsset: VesuRealAsset) {
  // Only return real data from Vesu configuration
  // APY and utilization will come from API calls, not mock calculations
  return {
    name: vesuAsset.token.name,
    symbol: vesuAsset.token.symbol,
    currentUtilization: 0, // Will be populated from real API data
    apy: 0, // Will be populated from real API data
    defiSpringApy: 0, // Will be populated from real API data
    decimals: vesuAsset.token.decimals,
    address: vesuAsset.token.address,
    vTokenAddress: vesuAsset.token.address, // This would be the actual vToken address
    // Real configuration data
    floor: vesuAsset.floor,
    maxUtilization: vesuAsset.max_utilization,
    targetUtilization: vesuAsset.target_utilization,
    feeRate: vesuAsset.fee_rate,
    zeroUtilizationRate: vesuAsset.zero_utilization_rate,
    initialFullUtilizationRate: vesuAsset.initial_full_utilization_rate,
  };
}
