export interface Pool {
  id: string
  name: string
  description: string
  apy: string
  tvl: string
  protocol: string
  risk: string
  tokens: string[]
  url?: string
  details?: string
  risks?: string[]
  benefits?: string[]
}

export interface Vault {
  id: string
  name: string
  description: string
  apy: string
  totalValue: string
  riskLevel: string
  createdAt: string
  lastRebalanced: string
  pools: Array<{
    name: string
    allocation: number
    apy: string
  }>
}

export const poolsData: Pool[] = [
  {
    id: "ekubo-btc-usdc",
    name: "Ekubo BTC/USDC",
    description: "BTC/USDC liquidity pool on Ekubo DEX with automatic rebalancing",
    apy: "4.8%",
    tvl: "$2.4M",
    protocol: "Ekubo",
    risk: "Medium",
    tokens: ["BTC", "USDC"],
    url: "https://ekubo.org",
    details:
      "This pool allows users to provide liquidity for the BTC/USDC pair on Ekubo DEX. Liquidity providers earn trading fees generated when users swap between these tokens.",
    risks: [
      "Impermanent loss risk if BTC price changes significantly relative to USDC",
      "Smart contract risk associated with the Ekubo platform",
      "Liquidity risk if trading volume decreases",
    ],
    benefits: [
      "Trading fees generated from swap activity",
      "BTC exposure while maintaining part of the position in stablecoin",
      "Potential participation in Ekubo incentive programs",
    ],
  },
  {
    id: "vesu-btc-lending",
    name: "Vesu BTC Lending",
    description: "BTC lending pool on Vesu Finance with collateralized guarantees",
    apy: "5.8%",
    tvl: "$3.7M",
    protocol: "Vesu",
    risk: "Low",
    tokens: ["BTC"],
    url: "https://vesu.xyz",
    details:
      "Decentralized lending pool where you can lend your BTC and earn interest. Loans are backed by collateralized guarantees.",
    risks: [
      "Smart contract risk of the Vesu platform",
      "Liquidity risk in case of high withdrawal demand",
      "Risk of interest rate changes",
    ],
    benefits: [
      "Stable returns through loan interest",
      "Lower volatility compared to liquidity pools",
      "Backed by collateralized guarantees",
    ],
  },
  {
    id: "ekubo-btc-eth",
    name: "Ekubo BTC/ETH",
    description: "BTC/ETH liquidity pool on Ekubo DEX for trading between major cryptocurrencies",
    apy: "5.2%",
    tvl: "$1.8M",
    protocol: "Ekubo",
    risk: "Medium",
    tokens: ["BTC", "ETH"],
    url: "https://ekubo.org",
    details:
      "Liquidity pool for the BTC/ETH pair, enabling efficient swaps between the two most important cryptocurrencies.",
    risks: [
      "Impermanent loss risk due to volatility of both assets",
      "Smart contract risk",
      "Correlation between BTC and ETH may affect returns",
    ],
    benefits: [
      "Exposure to two main crypto ecosystem assets",
      "Trading fees from a highly liquid pair",
      "Diversification between BTC and ETH",
    ],
  },
  {
    id: "vesu-btc-vault",
    name: "Vesu BTC Vault",
    description: "Automated BTC vault on Vesu Finance with optimized strategies",
    apy: "4.5%",
    tvl: "$5.2M",
    protocol: "Vesu",
    risk: "Low",
    tokens: ["BTC"],
    url: "https://vesu.xyz",
    details: "Automated vault that optimizes BTC performance through different Vesu Finance strategies.",
    risks: ["Smart contract risk", "Automated strategy risk", "Dependency on Vesu platform"],
    benefits: ["Automated strategy management", "Continuous yield optimization", "Lower risk than liquidity pools"],
  },
  {
    id: "ekubo-btc-usdt",
    name: "Ekubo BTC/USDT",
    description: "BTC/USDT liquidity pool on Ekubo DEX with high volatility",
    apy: "4.6%",
    tvl: "$1.2M",
    protocol: "Ekubo",
    risk: "Medium-High",
    tokens: ["BTC", "USDT"],
    url: "https://ekubo.org",
    details: "BTC/USDT liquidity pool with potential for higher volatility due to USDT characteristics.",
    risks: [
      "Impermanent loss risk",
      "Specific risk of USDT as a centralized stablecoin",
      "Higher volatility compared to other stablecoins",
    ],
    benefits: ["Trading fees", "BTC exposure with stablecoin", "Liquidity in a popular pair"],
  },
  {
    id: "ekubo-btc-dai",
    name: "Ekubo BTC/DAI",
    description: "BTC/DAI liquidity pool on Ekubo DEX with decentralized stablecoin",
    apy: "4.3%",
    tvl: "$0.9M",
    protocol: "Ekubo",
    risk: "Medium",
    tokens: ["BTC", "DAI"],
    url: "https://ekubo.org",
    details: "Liquidity pool combining BTC with DAI, a decentralized stablecoin from the MakerDAO ecosystem.",
    risks: ["Impermanent loss risk", "Smart contract risk", "Dependency on MakerDAO ecosystem for DAI"],
    benefits: ["BTC exposure with decentralized stablecoin", "Trading fees", "Diversification with DAI"],
  },
]

export const vaultsData: Record<string, Vault> = {
  "btc-conservative": {
    id: "btc-conservative",
    name: "BTC Conservative",
    description: "Conservative strategy with low risk and stable returns",
    apy: "5.8%",
    totalValue: "$2.4M",
    riskLevel: "Low",
    createdAt: "2 weeks ago",
    lastRebalanced: "3 days ago",
    pools: [
      { name: "Ekubo DEX", allocation: 70, apy: "6.2%" },
      { name: "Vesu Lending", allocation: 30, apy: "4.8%" },
    ],
  },
  "btc-aggressive": {
    id: "btc-aggressive",
    name: "BTC Aggressive",
    description: "Aggressive strategy with higher risk and potential for high returns",
    apy: "12.4%",
    totalValue: "$1.8M",
    riskLevel: "High",
    createdAt: "1 week ago",
    lastRebalanced: "1 day ago",
    pools: [
      { name: "Ekubo DEX", allocation: 40, apy: "6.2%" },
      { name: "Vesu Lending", allocation: 35, apy: "4.8%" },
      { name: "Yield Farming", allocation: 25, apy: "18.5%" },
    ],
  },
  "btc-balanced": {
    id: "btc-balanced",
    name: "BTC Balanced",
    description: "Balanced strategy between risk and returns",
    apy: "8.7%",
    totalValue: "$3.1M",
    riskLevel: "Medium",
    createdAt: "3 weeks ago",
    lastRebalanced: "2 days ago",
    pools: [
      { name: "Ekubo DEX", allocation: 50, apy: "6.2%" },
      { name: "Vesu Lending", allocation: 35, apy: "4.8%" },
      { name: "Staking Pool", allocation: 15, apy: "12.1%" },
    ],
  },
}

export const getPoolBySlug = (slug: string): Pool | undefined => {
  return poolsData.find((pool) => pool.id === slug)
}

export const getVaultBySlug = (slug: string): Vault | undefined => {
  return vaultsData[slug]
}

// Alias para compatibilidad con imports antiguos
export const pools = poolsData
