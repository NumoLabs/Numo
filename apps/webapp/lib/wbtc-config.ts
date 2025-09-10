// WBTC Configuration for Starknet
export const WBTC_CONFIG = {
  // WBTC token address on Starknet
  ADDRESS: "0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac",
  
  // Token details
  SYMBOL: "WBTC",
  NAME: "Wrapped Bitcoin",
  DECIMALS: 8, // WBTC has 8 decimals
  
  // Display settings
  DISPLAY_DECIMALS: 8,
  MIN_DISPLAY_AMOUNT: 0.00000001, // 1 satoshi
  
  // Trading pairs commonly used with WBTC
  COMMON_PAIRS: {
    USDC: "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
    USDT: "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
    ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c7b7f8c8c8c8c8c8c8c8c8",
  },
  
  // Vault configuration
  VAULT: {
    MIN_DEPOSIT: 0.001, // Minimum 0.001 WBTC
    MAX_DEPOSIT: 1000, // Maximum 1000 WBTC
    DEFAULT_DEPOSIT: 0.01, // Default deposit amount
    WITHDRAWAL_FEE_BPS: 10, // 0.1% withdrawal fee
    MANAGEMENT_FEE_BPS: 50, // 0.5% management fee
  },
  
  // Rebalancing configuration
  REBALANCING: {
    MIN_YIELD_IMPROVEMENT: 0.1, // 0.1% minimum yield improvement
    MAX_SLIPPAGE: 1.0, // 1% maximum slippage
    REBALANCE_THRESHOLD: 5.0, // 5% threshold for rebalancing
    MAX_POOL_WEIGHT: 80, // 80% maximum weight per pool
  },
  
  // UI Configuration
  UI: {
    CURRENCY_SYMBOL: "WBTC",
    CURRENCY_NAME: "Wrapped Bitcoin",
    CURRENCY_ICON: "₿", // Bitcoin symbol
    COLOR: "#f7931a", // Bitcoin orange color
    BACKGROUND_COLOR: "#fef3e2", // Light orange background
  }
} as const

// Helper functions for WBTC
export function formatWBTCAmount(amount: number | string, decimals: number = 8): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return numAmount.toFixed(decimals)
}

export function parseWBTCAmount(amount: string): number {
  return parseFloat(amount)
}

export function isValidWBTCAmount(amount: string): boolean {
  const numAmount = parseFloat(amount)
  return !isNaN(numAmount) && numAmount >= 0 && numAmount <= WBTC_CONFIG.VAULT.MAX_DEPOSIT
}

export function getWBTCDisplayAmount(amount: bigint): string {
  const divisor = BigInt(10 ** WBTC_CONFIG.DECIMALS)
  const value = Number(amount) / Number(divisor)
  return formatWBTCAmount(value)
}

export function getWBTCAmountFromDisplay(displayAmount: string): bigint {
  const numAmount = parseFloat(displayAmount)
  const multiplier = BigInt(10 ** WBTC_CONFIG.DECIMALS)
  return BigInt(Math.floor(numAmount * Number(multiplier)))
}

// Validation functions
export function validateWBTCDeposit(amount: string): { isValid: boolean; error?: string } {
  const numAmount = parseFloat(amount)
  
  if (isNaN(numAmount)) {
    return { isValid: false, error: "Invalid amount" }
  }
  
  if (numAmount < WBTC_CONFIG.VAULT.MIN_DEPOSIT) {
    return { 
      isValid: false, 
      error: `Minimum deposit is ${WBTC_CONFIG.VAULT.MIN_DEPOSIT} WBTC` 
    }
  }
  
  if (numAmount > WBTC_CONFIG.VAULT.MAX_DEPOSIT) {
    return { 
      isValid: false, 
      error: `Maximum deposit is ${WBTC_CONFIG.VAULT.MAX_DEPOSIT} WBTC` 
    }
  }
  
  return { isValid: true }
}

export function validateWBTCWithdrawal(amount: string, available: number): { isValid: boolean; error?: string } {
  const numAmount = parseFloat(amount)
  
  if (isNaN(numAmount)) {
    return { isValid: false, error: "Invalid amount" }
  }
  
  if (numAmount <= 0) {
    return { isValid: false, error: "Amount must be greater than 0" }
  }
  
  if (numAmount > available) {
    return { isValid: false, error: "Insufficient balance" }
  }
  
  return { isValid: true }
}

// Formatting functions for display
export function formatWBTCValue(value: number, showSymbol: boolean = true): string {
  const formatted = formatWBTCAmount(value)
  return showSymbol ? `${formatted} ${WBTC_CONFIG.SYMBOL}` : formatted
}

export function formatWBTCPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

// Constants for UI
export const WBTC_DISPLAY_CONFIG = {
  SYMBOL: WBTC_CONFIG.UI.CURRENCY_SYMBOL,
  NAME: WBTC_CONFIG.UI.CURRENCY_NAME,
  ICON: WBTC_CONFIG.UI.CURRENCY_ICON,
  COLOR: WBTC_CONFIG.UI.COLOR,
  BACKGROUND_COLOR: WBTC_CONFIG.UI.BACKGROUND_COLOR,
  DECIMALS: WBTC_CONFIG.DISPLAY_DECIMALS,
  MIN_AMOUNT: WBTC_CONFIG.MIN_DISPLAY_AMOUNT,
} as const
