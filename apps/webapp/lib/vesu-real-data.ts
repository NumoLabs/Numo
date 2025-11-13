// Vesu Real Data - Mainnet asset addresses and metadata
// Based on official Vesu mainnet configuration

export interface VesuAsset {
  token: {
    address: string;
    symbol: string;
    decimals: number;
  };
}

// Official Mainnet addresses from Vesu documentation
const MAINNET_ASSETS: VesuAsset[] = [
  {
    token: {
      address: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', // ETH
      symbol: 'ETH',
      decimals: 18
    }
  },
  {
    token: {
      address: '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac', // WBTC
      symbol: 'WBTC',
      decimals: 8
    }
  },
  {
    token: {
      address: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8', // USDC
      symbol: 'USDC',
      decimals: 6
    }
  },
  {
    token: {
      address: '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8', // USDT
      symbol: 'USDT',
      decimals: 6
    }
  },
  {
    token: {
      address: '0x042b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2', // wstETH
      symbol: 'wstETH',
      decimals: 18
    }
  },
  {
    token: {
      address: '0x0057912720381af14b0e5c87aa4718ed5e527eab60b3801ebf702ab09139e38b', // STRK
      symbol: 'STRK',
      decimals: 18
    }
  }
];

const TESTNET_ASSETS: VesuAsset[] = [
  {
    token: {
      address: '0x7809bb63f557736e49ff0ae4a64bd8aa6ea60e3f77f26c520cb92c24e3700d3', // ETH
      symbol: 'ETH',
      decimals: 18
    }
  },
  {
    token: {
      address: '0x63d32a3fa6074e72e7a1e06fe78c46a0c8473217773e19f11d8c8cbfc4ff8ca', // WBTC
      symbol: 'WBTC',
      decimals: 8
    }
  },
  {
    token: {
      address: '0x27ef4670397069d7d5442cb7945b27338692de0d8896bdb15e6400cf5249f94', // USDC
      symbol: 'USDC',
      decimals: 6
    }
  },
  {
    token: {
      address: '0x2cd937c3dccd4a4e125011bbe3189a6db0419bb6dd95c4b5ce5f6d834d8996', // USDT
      symbol: 'USDT',
      decimals: 6
    }
  },
  {
    token: {
      address: '0x01b13a244e499b9baf6b82900dced05fbf4a44274d87f1000f500d465da12669', // wstETH
      symbol: 'wstETH',
      decimals: 18
    }
  },
  {
    token: {
      address: '0x772131070c7d56f78f3e46b27b70271d8ca81c7c52e3f62aa868fab4b679e43', // STRK
      symbol: 'STRK',
      decimals: 18
    }
  }
];

/**
 * Get Vesu assets for balance checking
 * MAINNET ONLY: Always returns mainnet assets regardless of isTestnet parameter
 * @param isTestnet - Ignored, always returns mainnet assets
 * @returns Array of Vesu assets with token addresses, symbols, and decimals
 */
export function getVesuAssets(isTestnet: boolean = false): VesuAsset[] {
  // MAINNET ONLY: Always return mainnet assets
  return MAINNET_ASSETS;
}

