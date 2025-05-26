// Dashboard interfaces and data
export interface QuickStat {
  label: string
  value: string
  subValue: string
  icon: string
  color: string
}

export interface PerformanceIndicator {
  title: string
  badge: string
  badgeColor: string
  items: Array<{
    label: string
    value: string
  }>
  progress: number
  description: string
  color: string
}

export interface PortfolioCard {
  title: string
  value: string
  subValue: string
  icon: string
  colors: {
    bg: string
    border: string
    text: string
    subText: string
  }
}

export interface StrategyDistribution {
  name: string
  percentage: number
  amount: string
  apy: string
  tvl: string
  color: string
}

export interface RecentActivity {
  type: "deposit" | "withdraw" | "rebalance" | "milestone"
  title: string
  description: string
  badge: string
  badgeColor: string
  value: string
  subValue: string
  icon: string
  color: string
}

export interface AnalyticsMetric {
  title: string
  items: Array<{
    label: string
    value: string
  }>
  color: string
  icon: string
}

export interface RebalanceEvent {
  title: string
  description: string
  badge: string
  badgeColor: string
  value: string
  subValue: string
  tags: Array<{
    label: string
    icon: string
    color: string
  }>
  color: string
}

export interface AdvancedFeature {
  title: string
  description: string
  icon: string
  color: string
  stats: Array<{
    label: string
    value: string
  }>
  buttonText: string
  buttonHref: string
  buttonVariant: "default" | "outline"
}

// Data functions
export function getQuickStats(): QuickStat[] {
  return [
    {
      label: "Balance Total",
      value: "1.245 BTC",
      subValue: "≈ $78,435.67 USD",
      icon: "Bitcoin",
      color: "yellow",
    },
    {
      label: "Rendimiento",
      value: "+0.078 BTC",
      subValue: "+6.3% desde inicio",
      icon: "TrendingUp",
      color: "green",
    },
    {
      label: "APY Actual",
      value: "5.8%",
      subValue: "+0.3% vs anterior",
      icon: "Star",
      color: "yellow",
    },
    {
      label: "Próximo Rebalanceo",
      value: "12h 34m",
      subValue: "O cuando APY cambie",
      icon: "Clock",
      color: "purple",
    },
  ]
}

export function getPerformanceIndicators(): PerformanceIndicator[] {
  return [
    {
      title: "Rendimiento 24h",
      badge: "+2.1%",
      badgeColor: "green",
      items: [
        { label: "Ganancia", value: "+0.0026 BTC" },
        { label: "En USD", value: "+$163.75" },
      ],
      progress: 75,
      description: "75% del objetivo diario alcanzado",
      color: "green",
    },
    {
      title: "Estado de la Vault",
      badge: "Óptimo",
      badgeColor: "blue",
      items: [
        { label: "Eficiencia", value: "98.5%" },
        { label: "Uptime", value: "99.9%" },
      ],
      progress: 98.5,
      description: "Funcionamiento óptimo",
      color: "blue",
    },
    {
      title: "Nivel de Riesgo",
      badge: "Bajo",
      badgeColor: "orange",
      items: [
        { label: "Diversificación", value: "Excelente" },
        { label: "Volatilidad", value: "Baja" },
      ],
      progress: 25,
      description: "Riesgo controlado y gestionado",
      color: "orange",
    },
  ]
}

export function getPortfolioCards(): PortfolioCard[] {
  return [
    {
      title: "Balance Total",
      value: "1.245 BTC",
      subValue: "≈ $78,435.67 USD",
      icon: "Bitcoin",
      colors: {
        bg: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
        border: "border-amber-200 dark:border-amber-800",
        text: "text-amber-800 dark:text-amber-200",
        subText: "text-amber-700 dark:text-amber-300",
      },
    },
    {
      title: "Rendimiento Acumulado",
      value: "0.078 BTC",
      subValue: "+6.3% desde el depósito inicial",
      icon: "TrendingUp",
      colors: {
        bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
        border: "border-green-200 dark:border-green-800",
        text: "text-green-800 dark:text-green-200",
        subText: "text-green-700 dark:text-green-300",
      },
    },
    {
      title: "APY Actual",
      value: "5.8%",
      subValue: "+0.3% desde el último rebalanceo",
      icon: "Star",
      colors: {
        bg: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
        border: "border-blue-200 dark:border-blue-800",
        text: "text-blue-800 dark:text-blue-200",
        subText: "text-blue-700 dark:text-blue-300",
      },
    },
    {
      title: "Próximo Rebalanceo",
      value: "12h 34m",
      subValue: "O cuando el APY cambie +/-1%",
      icon: "Clock",
      colors: {
        bg: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
        border: "border-purple-200 dark:border-purple-800",
        text: "text-purple-800 dark:text-purple-200",
        subText: "text-purple-700 dark:text-purple-300",
      },
    },
  ]
}

export function getStrategyDistribution(): StrategyDistribution[] {
  return [
    {
      name: "Ekubo (BTC/USDC)",
      percentage: 70,
      amount: "0.872 BTC",
      apy: "4.8%",
      tvl: "$2.4M",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Vesu (Vaults)",
      percentage: 30,
      amount: "0.373 BTC",
      apy: "5.8%",
      tvl: "$3.7M",
      color: "from-green-500 to-emerald-600",
    },
  ]
}

export function getRecentActivity(): RecentActivity[] {
  return [
    {
      type: "deposit",
      title: "Depósito Exitoso",
      description: "Hace 2 días • Tx: 0x1a2b...3c4d",
      badge: "Completado",
      badgeColor: "green",
      value: "+0.5 BTC",
      subValue: "≈ $31,250",
      icon: "Upload",
      color: "green",
    },
    {
      type: "rebalance",
      title: "Rebalanceo Automático",
      description: "Hace 2 días • Tx: 0x1a2b...3c4d",
      badge: "Ejecutado",
      badgeColor: "blue",
      value: "+0.3% APY",
      subValue: "Optimización",
      icon: "RefreshCw",
      color: "blue",
    },
    {
      type: "milestone",
      title: "Milestone Alcanzado",
      description: "Hace 3 días • Primera ganancia de 0.05 BTC",
      badge: "Logro",
      badgeColor: "purple",
      value: "🎉 +5% ROI",
      subValue: "¡Felicitaciones!",
      icon: "Award",
      color: "purple",
    },
  ]
}

export function getAnalyticsMetrics(): AnalyticsMetric[] {
  return [
    {
      title: "Rendimiento por Período",
      icon: "TrendingUp",
      color: "green",
      items: [
        { label: "24 horas", value: "+2.1%" },
        { label: "7 días", value: "+8.7%" },
        { label: "30 días", value: "+15.2%" },
        { label: "Todo el tiempo", value: "+6.3%" },
      ],
    },
    {
      title: "Comparación de APY",
      icon: "BarChart3",
      color: "blue",
      items: [
        { label: "Tu Vault", value: "5.8%" },
        { label: "Promedio DeFi", value: "4.2%" },
        { label: "Bancos Tradicionales", value: "0.5%" },
      ],
    },
    {
      title: "Eficiencia de Estrategia",
      icon: "Target",
      color: "purple",
      items: [
        { label: "Ekubo Performance", value: "92%" },
        { label: "Vesu Performance", value: "87%" },
        { label: "Rebalanceo Timing", value: "95%" },
      ],
    },
  ]
}

export function getRebalanceHistory(): RebalanceEvent[] {
  return [
    {
      title: "Rebalanceo a Ekubo (70%) / Vesu (30%)",
      description: "Hace 2 días • APY mejorado: +0.3%",
      badge: "Exitoso",
      badgeColor: "green",
      value: "5.8% APY",
      subValue: "+0.3% mejora",
      tags: [
        { label: "Volumen BTC/USDC ↑", icon: "TrendingUp", color: "green" },
        { label: "Gas optimizado", icon: "Zap", color: "blue" },
      ],
      color: "green",
    },
    {
      title: "Rebalanceo a Ekubo (50%) / Vesu (50%)",
      description: "Hace 5 días • APY mejorado: +0.2%",
      badge: "Exitoso",
      badgeColor: "blue",
      value: "5.5% APY",
      subValue: "+0.2% mejora",
      tags: [
        { label: "Vesu rates ↑", icon: "TrendingUp", color: "green" },
        { label: "Riesgo balanceado", icon: "Shield", color: "purple" },
      ],
      color: "blue",
    },
    {
      title: "Rebalanceo a Vesu (80%) / Ekubo (20%)",
      description: "Hace 8 días • APY mejorado: +0.5%",
      badge: "Exitoso",
      badgeColor: "purple",
      value: "5.3% APY",
      subValue: "+0.5% mejora",
      tags: [
        { label: "Lending demand ↑", icon: "TrendingUp", color: "green" },
        { label: "Oportunidad detectada", icon: "Target", color: "orange" },
      ],
      color: "purple",
    },
  ]
}

export function getAdvancedFeatures(): AdvancedFeature[] {
  return [
    {
      title: "Pools Personalizados",
      description: "Crea y gestiona tus propias vaults con distribuciones personalizadas entre diferentes pools.",
      icon: "Target",
      color: "indigo",
      stats: [
        { label: "Vaults Creadas", value: "2 activas" },
        { label: "Rendimiento Promedio", value: "5.4%" },
      ],
      buttonText: "Explorar Pools",
      buttonHref: "/pools",
      buttonVariant: "default",
    },
    {
      title: "Aprende sobre DeFi",
      description: "Recursos educativos para entender los conceptos de DeFi y cómo funcionan los pools de liquidez.",
      icon: "BookOpen",
      color: "emerald",
      stats: [
        { label: "Progreso de Aprendizaje", value: "Principiante" },
        { label: "Conceptos Básicos", value: "0/3 completados" },
      ],
      buttonText: "Comenzar a Aprender",
      buttonHref: "/learn/defi-basics",
      buttonVariant: "outline",
    },
  ]
}
