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
    description: "Pool de liquidez BTC/USDC en Ekubo DEX con rebalanceo automático",
    apy: "4.8%",
    tvl: "$2.4M",
    protocol: "Ekubo",
    risk: "Medio",
    tokens: ["BTC", "USDC"],
    url: "https://ekubo.org",
    details:
      "Este pool permite a los usuarios proporcionar liquidez para el par BTC/USDC en Ekubo DEX. Los proveedores de liquidez ganan comisiones de trading que se generan cuando los usuarios intercambian entre estos tokens.",
    risks: [
      "Riesgo de impermanent loss si el precio de BTC cambia significativamente en relación con USDC",
      "Riesgo de contrato inteligente asociado con la plataforma Ekubo",
      "Riesgo de liquidez si el volumen de trading disminuye",
    ],
    benefits: [
      "Comisiones de trading generadas por la actividad de intercambio",
      "Exposición a BTC mientras se mantiene parte de la posición en stablecoin",
      "Posible participación en programas de incentivos de Ekubo",
    ],
  },
  {
    id: "vesu-btc-lending",
    name: "Vesu BTC Lending",
    description: "Pool de préstamos de BTC en Vesu Finance con garantías colateralizadas",
    apy: "5.8%",
    tvl: "$3.7M",
    protocol: "Vesu",
    risk: "Bajo",
    tokens: ["BTC"],
    url: "https://vesu.xyz",
    details:
      "Pool de préstamos descentralizado donde puedes prestar tus BTC y ganar intereses. Los préstamos están respaldados por garantías colateralizadas.",
    risks: [
      "Riesgo de contrato inteligente de la plataforma Vesu",
      "Riesgo de liquidez en caso de alta demanda de retiros",
      "Riesgo de cambios en las tasas de interés",
    ],
    benefits: [
      "Rendimientos estables a través de intereses de préstamos",
      "Menor volatilidad comparado con pools de liquidez",
      "Respaldado por garantías colateralizadas",
    ],
  },
  {
    id: "ekubo-btc-eth",
    name: "Ekubo BTC/ETH",
    description: "Pool de liquidez BTC/ETH en Ekubo DEX para trading entre criptomonedas principales",
    apy: "5.2%",
    tvl: "$1.8M",
    protocol: "Ekubo",
    risk: "Medio",
    tokens: ["BTC", "ETH"],
    url: "https://ekubo.org",
    details:
      "Pool de liquidez para el par BTC/ETH, permitiendo intercambios eficientes entre las dos criptomonedas más importantes.",
    risks: [
      "Riesgo de impermanent loss debido a la volatilidad de ambos activos",
      "Riesgo de contrato inteligente",
      "Correlación entre BTC y ETH puede afectar los rendimientos",
    ],
    benefits: [
      "Exposición a dos activos principales del ecosistema crypto",
      "Comisiones de trading de un par muy líquido",
      "Diversificación entre BTC y ETH",
    ],
  },
  {
    id: "vesu-btc-vault",
    name: "Vesu BTC Vault",
    description: "Vault automatizada de BTC en Vesu Finance con estrategias optimizadas",
    apy: "4.5%",
    tvl: "$5.2M",
    protocol: "Vesu",
    risk: "Bajo",
    tokens: ["BTC"],
    url: "https://vesu.xyz",
    details:
      "Vault automatizada que optimiza el rendimiento de BTC a través de diferentes estrategias de Vesu Finance.",
    risks: ["Riesgo de contrato inteligente", "Riesgo de estrategia automatizada", "Dependencia de la plataforma Vesu"],
    benefits: [
      "Gestión automatizada de estrategias",
      "Optimización continua de rendimientos",
      "Menor riesgo que pools de liquidez",
    ],
  },
  {
    id: "ekubo-btc-usdt",
    name: "Ekubo BTC/USDT",
    description: "Pool de liquidez BTC/USDT en Ekubo DEX con alta volatilidad",
    apy: "4.6%",
    tvl: "$1.2M",
    protocol: "Ekubo",
    risk: "Medio-Alto",
    tokens: ["BTC", "USDT"],
    url: "https://ekubo.org",
    details: "Pool de liquidez BTC/USDT con potencial de mayor volatilidad debido a las características de USDT.",
    risks: [
      "Riesgo de impermanent loss",
      "Riesgo específico de USDT como stablecoin centralizada",
      "Mayor volatilidad comparado con otros stablecoins",
    ],
    benefits: ["Comisiones de trading", "Exposición a BTC con stablecoin", "Liquidez en un par popular"],
  },
  {
    id: "ekubo-btc-dai",
    name: "Ekubo BTC/DAI",
    description: "Pool de liquidez BTC/DAI en Ekubo DEX con stablecoin descentralizada",
    apy: "4.3%",
    tvl: "$0.9M",
    protocol: "Ekubo",
    risk: "Medio",
    tokens: ["BTC", "DAI"],
    url: "https://ekubo.org",
    details: "Pool de liquidez que combina BTC con DAI, una stablecoin descentralizada del ecosistema MakerDAO.",
    risks: [
      "Riesgo de impermanent loss",
      "Riesgo de contrato inteligente",
      "Dependencia del ecosistema MakerDAO para DAI",
    ],
    benefits: ["Exposición a BTC con stablecoin descentralizada", "Comisiones de trading", "Diversificación con DAI"],
  },
]

export const vaultsData: Record<string, Vault> = {
  "btc-conservative": {
    id: "btc-conservative",
    name: "BTC Conservative",
    description: "Estrategia conservadora con bajo riesgo y rendimientos estables",
    apy: "5.8%",
    totalValue: "$2.4M",
    riskLevel: "Bajo",
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
    description: "Estrategia agresiva con mayor riesgo y potencial de altos rendimientos",
    apy: "12.4%",
    totalValue: "$1.8M",
    riskLevel: "Alto",
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
    description: "Estrategia equilibrada entre riesgo y rendimiento",
    apy: "8.7%",
    totalValue: "$3.1M",
    riskLevel: "Medio",
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
