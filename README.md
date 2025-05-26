# Numo – Modular BTC Finance on Starknet

**Numo** is a modular DeFi platform built on Starknet that helps users grow their BTC (WBTC) safely, automatically, and transparently. Numo offers a full BTC-first experience, including auto-rebalancing vaults, fixed-term bonds, strategy sharing, forecasting tools, and an integrated DeFi learning section.

## 🚀 Key Features

### 🏦 BTC Savings+ (Auto-Rebalancing Vault)

* Deposit and withdraw WBTC flexibly
* 100% BTC/WBTC exposure
* Yield always denominated in WBTC
* `rbBTC` token as proof of participation

### 🔐 BTC Bonds

* Lock BTC for 7, 30, or 90 days
* Earn extra yield based on lock duration
* Ideal for long-term BTC holders

### 🧠 Strategy Modes

* **Auto Mode**: Contract selects the best pool using Pragma (APY, volatility)
* **Manual Mode**: User chooses between Ekubo, Vesu, or custom pools
* **Hybrid Mode**: Custom allocation + rebalance only within selected strategies

### 📈 Vault Marketplace

* Discover and follow community-created vault strategies
* Each strategy shows its risk level, APY, and composition
* Users can publish and track performance of their own strategies

### 📊 Forecasting & Insights

* Simulate gains based on amount and time
* Compare performance: vault vs. hodling vs. single protocol
* Visual charts and yield estimators

### 📚 Learn DeFi

* Educational section built into the app
* Helps users understand vaults, liquidity, risk, and key DeFi concepts
* Designed to onboard non-technical users

### 🧠 Intelligent Rebalancing

* Based on market conditions, TWAPs, and APY thresholds
* Optimized to reduce costs and slippage
* Rewards are auto-converted to WBTC

## 🏗 Tech Stack

* **Frontend:** Next.js 14 (App Router)
* **Smart Contracts:** Cairo (Starknet)
* **Oracles:** Pragma
* **DeFi Integration:** Vesu, Ekubo
* **Styling:** Tailwind CSS & shadcn/ui
* **Build Tool:** Bun

## 📂 Project Structure

```
Numo/
├── apps/
│   ├── webapp/
│   │   ├── app/            # App Router pages, layout, global state, styles
│   │   ├── components/     # React components (ui/, vault/, bonds/, etc.)
│   │   ├── constants/      # Global constants
│   │   ├── lib/            # Utilities, helpers, cache, mock-data, schemas
│   │   ├── types/          # Shared TypeScript types
│   │   └── public/         # Static assets
│   └── contracts/
│       ├── src/            # Cairo smart contracts
│       ├── tests/          # Contract unit tests
│       ├── Scarb.toml      # Scarb config
│       └── snfoundry.toml  # Testing config
├── package.json
├── bun.lock
├── tsconfig.json
└── README.md
```

## 🏃 Getting Started

### Prerequisites

* Node.js (v18+)
* Bun
* Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/numo.git
cd numo
```

2. Install dependencies:

```bash
bun install
```

3. Start the development server:

```bash
cd apps/webapp && bun dev
```

## 💡 Use Cases

### BTC Yield Vault

* For BTC holders who want passive yield without managing strategies
* Trustless rebalancing and exposure control
* Withdraw at any time

### Custom Strategies

* Power users can define preferred pools and thresholds
* Composable with Vesu, Ekubo, and other integrations

### Educational Onboarding

* Newcomers can learn and use DeFi tools in the same place
* Ideal for DAO-based onboarding or BTC-focused communities

## 🔒 Security

* Parameter validation and safe external calls
* Trusted price feeds via Pragma oracles

## 📊 Feature Comparison

| Feature                    | Traditional Vault | Manual DeFi | Numo Vault |
| -------------------------- | ----------------- | ----------- | ---------- |
| Yield in BTC/WBTC          | ❌                 | ⚠️          | ✅          |
| Auto Strategy              | ❌                 | ❌           | ✅          |
| Intelligent Rebalancing    | ❌                 | ❌           | ✅          |
| Multi-protocol Integration | ❌                 | ⚠️          | ✅          |
| Simple UX                  | ✅                 | ❌           | ✅          |
| Flexible Withdrawal        | ⚠️                | ✅           | ✅          |
| Open Source                | ⚠️                | ✅           | ✅          |


