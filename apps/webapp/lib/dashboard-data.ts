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
  buttonColor?: string
}

// Data functions
export function getQuickStats(): QuickStat[] {
  return [
    {
      label: "Total Balance",
      value: "1.245 BTC",
      subValue: "≈ $78,435.67 USD",
      icon: "Bitcoin",
      color: "yellow",
    },
    {
      label: "Performance",
      value: "+0.078 BTC",
      subValue: "+6.3% since start",
      icon: "TrendingUp",
      color: "green",
    },
    {
      label: "Current APY",
      value: "5.8%",
      subValue: "+0.3% vs previous",
      icon: "Star",
      color: "yellow",
    },
    {
      label: "Next Rebalance",
      value: "12h 34m",
      subValue: "Or when APY changes",
      icon: "Clock",
      color: "purple",
    },
  ]
}

export function getPerformanceIndicators(): PerformanceIndicator[] {
  return [
    {
      title: "24h Performance",
      badge: "+2.1%",
      badgeColor: "green",
      items: [
        { label: "Gain", value: "+0.0026 BTC" },
        { label: "In USD", value: "+$163.75" },
      ],
      progress: 75,
      description: "75% of daily goal reached",
      color: "green",
    },
    {
      title: "Vault Status",
      badge: "Optimal",
      badgeColor: "blue",
      items: [
        { label: "Efficiency", value: "98.5%" },
        { label: "Uptime", value: "99.9%" },
      ],
      progress: 98.5,
      description: "Optimal operation",
      color: "blue",
    },
    {
      title: "Risk Level",
      badge: "Low",
      badgeColor: "orange",
      items: [
        { label: "Diversification", value: "Excellent" },
        { label: "Volatility", value: "Low" },
      ],
      progress: 25,
      description: "Controlled and managed risk",
      color: "orange",
    },
  ]
}

export function getPortfolioCards(): PortfolioCard[] {
  return [
    {
      title: "Total Balance",
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
      title: "Accumulated Returns",
      value: "0.078 BTC",
      subValue: "+6.3% since initial deposit",
      icon: "TrendingUp",
      colors: {
        bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
        border: "border-green-200 dark:border-green-800",
        text: "text-green-800 dark:text-green-200",
        subText: "text-green-700 dark:text-green-300",
      },
    },
    {
      title: "Current APY",
      value: "5.8%",
      subValue: "+0.3% since last rebalance",
      icon: "Star",
      colors: {
        bg: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
        border: "border-blue-200 dark:border-blue-800",
        text: "text-blue-800 dark:text-blue-200",
        subText: "text-blue-700 dark:text-blue-300",
      },
    },
    {
      title: "Next Rebalance",
      value: "12h 34m",
      subValue: "Or when APY changes +/-1%",
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
      title: "Successful Deposit",
      description: "2 days ago • Tx: 0x1a2b...3c4d",
      badge: "Completed",
      badgeColor: "green",
      value: "+0.5 BTC",
      subValue: "≈ $31,250",
      icon: "Upload",
      color: "green",
    },
    {
      type: "rebalance",
      title: "Automatic Rebalance",
      description: "2 days ago • Tx: 0x1a2b...3c4d",
      badge: "Executed",
      badgeColor: "blue",
      value: "+0.3% APY",
      subValue: "Optimization",
      icon: "RefreshCw",
      color: "blue",
    },
    {
      type: "milestone",
      title: "Milestone Reached",
      description: "3 days ago • First 0.05 BTC gain",
      badge: "Achievement",
      badgeColor: "purple",
      value: "🎉 +5% ROI",
      subValue: "Congratulations!",
      icon: "Award",
      color: "purple",
    },
  ]
}

export function getAnalyticsMetrics(): AnalyticsMetric[] {
  return [
    {
      title: "Performance by Period",
      icon: "TrendingUp",
      color: "green",
      items: [
        { label: "24 hours", value: "+2.1%" },
        { label: "7 days", value: "+8.7%" },
        { label: "30 days", value: "+15.2%" },
        { label: "All time", value: "+6.3%" },
      ],
    },
    {
      title: "APY Comparison",
      icon: "BarChart3",
      color: "blue",
      items: [
        { label: "Your Vault", value: "5.8%" },
        { label: "DeFi Average", value: "4.2%" },
        { label: "Traditional Banks", value: "0.5%" },
      ],
    },
    {
      title: "Strategy Efficiency",
      icon: "Target",
      color: "purple",
      items: [
        { label: "Ekubo Performance", value: "92%" },
        { label: "Vesu Performance", value: "87%" },
        { label: "Rebalance Timing", value: "95%" },
      ],
    },
  ]
}

export function getRebalanceHistory(): RebalanceEvent[] {
  return [
    {
      title: "Rebalance to Ekubo (70%) / Vesu (30%)",
      description: "2 days ago • APY improved: +0.3%",
      badge: "Successful",
      badgeColor: "green",
      value: "5.8% APY",
      subValue: "+0.3% improvement",
      tags: [
        { label: "BTC/USDC Volume ↑", icon: "TrendingUp", color: "green" },
        { label: "Gas optimized", icon: "Zap", color: "blue" },
      ],
      color: "green",
    },
    {
      title: "Rebalance to Ekubo (50%) / Vesu (50%)",
      description: "5 days ago • APY improved: +0.2%",
      badge: "Successful",
      badgeColor: "blue",
      value: "5.5% APY",
      subValue: "+0.2% improvement",
      tags: [
        { label: "Vesu rates ↑", icon: "TrendingUp", color: "green" },
        { label: "Balanced risk", icon: "Shield", color: "purple" },
      ],
      color: "blue",
    },
    {
      title: "Rebalance to Vesu (80%) / Ekubo (20%)",
      description: "8 days ago • APY improved: +0.5%",
      badge: "Successful",
      badgeColor: "purple",
      value: "5.3% APY",
      subValue: "+0.5% improvement",
      tags: [
        { label: "Lending demand ↑", icon: "TrendingUp", color: "green" },
        { label: "Opportunity detected", icon: "Target", color: "orange" },
      ],
      color: "purple",
    },
  ]
}

export function getAdvancedFeatures(): AdvancedFeature[] {
  return [
    {
      title: "Custom Pools",
      description: "Create and manage your own vaults with custom distributions between different pools.",
      icon: "Target",
      color: "indigo", // Puedes dejar el color de la card como quieras
      stats: [
        { label: "Active Vaults", value: "2 active" },
        { label: "Average Return", value: "5.4%" },
      ],
      buttonText: "Explore Pools",
      buttonHref: "/pools",
      buttonVariant: "default",
      buttonColor: "black", // <--- Agrega esta línea para que el botón sea negro
    },
    {
      title: "Learn about DeFi",
      description: "Educational resources to understand DeFi concepts and how liquidity pools work.",
      icon: "BookOpen",
      color: "emerald",
      stats: [
        { label: "Learning Progress", value: "Beginner" },
        { label: "Basic Concepts", value: "0/3 completed" },
      ],
      buttonText: "Start Learning",
      buttonHref: "/learn/defi-basics",
      buttonVariant: "outline",
    },
  ]
}
