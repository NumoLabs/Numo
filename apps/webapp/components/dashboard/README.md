# Dashboard Components

This directory contains all the dashboard components organized by functionality for better maintainability and clarity.

## 📁 Structure

```
dashboard/
├── layout/                 # Layout and navigation components
│   ├── dashboard-layout.tsx
│   ├── sidebar.tsx
│   ├── top-navigation.tsx
│   └── index.ts
├── charts/                 # Chart and visualization components
│   ├── dashboard-chart.tsx
│   ├── dashboard-tabs.tsx
│   └── index.ts
├── metrics/                # Performance and analytics metrics
│   ├── performance-indicators.tsx
│   ├── analytics-metrics.tsx
│   └── index.ts
├── overview/               # Portfolio overview components
│   ├── portfolio-overview.tsx
│   ├── strategy-distribution.tsx
│   ├── recent-activity.tsx
│   └── index.ts
├── analytics/              # Advanced analytics components
│   ├── rebalancing-history.tsx
│   └── index.ts
├── transactions/           # Transaction-related components
│   ├── dashboard-transactions.tsx
│   └── index.ts
├── dashboard-content.tsx   # Main content wrapper
├── dashboard-hero.tsx      # Hero section
├── advanced-features.tsx   # Advanced features section
└── index.ts               # Main exports
```

## 🎯 Component Categories

### Layout (`/layout`)
- **DashboardLayout**: Main layout wrapper
- **Sidebar**: Navigation sidebar
- **TopNavigation**: Top navigation bar

### Charts (`/charts`)
- **DashboardChart**: Performance visualization
- **DashboardTabs**: Tab system for different views

### Metrics (`/metrics`)
- **PerformanceIndicators**: Key performance metrics
- **AnalyticsMetrics**: Detailed analytics data

### Overview (`/overview`)
- **PortfolioOverview**: Portfolio summary
- **StrategyDistribution**: Strategy allocation visualization
- **RecentActivity**: Recent activity feed

### Analytics (`/analytics`)
- **RebalancingHistory**: Historical rebalancing data

### Transactions (`/transactions`)
- **DashboardTransactions**: Transaction history and management

## 📦 Usage

### Import from specific category:
```tsx
import { DashboardLayout } from '@/components/dashboard/layout'
import { DashboardChart } from '@/components/dashboard/charts'
import { PerformanceIndicators } from '@/components/dashboard/metrics'
```

### Import from main index:
```tsx
import { 
  DashboardLayout, 
  DashboardChart, 
  PerformanceIndicators 
} from '@/components/dashboard'
```

## 🔄 Component Flow

```
DashboardPage
└── DashboardLayout (layout/)
    ├── Sidebar (layout/)
    ├── TopNavigation (layout/)
    ├── DashboardHero
    └── DashboardContent
        ├── PerformanceIndicators (metrics/)
        ├── DashboardTabs (charts/)
        │   ├── PortfolioOverview (overview/)
        │   ├── DashboardChart (charts/)
        │   ├── StrategyDistribution (overview/)
        │   ├── RecentActivity (overview/)
        │   ├── AnalyticsMetrics (metrics/)
        │   ├── RebalancingHistory (analytics/)
        │   └── DashboardTransactions (transactions/)
        └── AdvancedFeatures
```

## 🎨 Benefits of This Structure

1. **Better Organization**: Components are grouped by functionality
2. **Easier Navigation**: Clear folder structure makes it easy to find components
3. **Scalability**: Easy to add new components to appropriate categories
4. **Maintainability**: Related components are kept together
5. **Import Clarity**: Index files provide clean import paths 