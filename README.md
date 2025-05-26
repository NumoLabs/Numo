# Numo - Starknet BTC Yield Vault

Numo is a DeFi application on Starknet that allows users to deposit BTC (or WBTC) and earn yield without manually managing their strategy. The vault automatically moves funds between DeFi platforms like Vesu and Ekubo, always seeking the best available APY. All yield is maintained in BTC/WBTC, meeting the criteria of the BTCfi Season Track.

## 🚀 Main Features

### 🏦 BTC/WBTC Vault
- Flexible deposit and withdrawal of WBTC
- 100% exposure in BTC/WBTC
- Yield always denominated in BTC/WBTC

### 🤖 Automatic and Manual Strategy
- **Automatic Mode:** The contract selects the best strategy based on Pragma data (APY, volatility, etc.)
- **Manual Mode:** The user chooses which pool to participate in (Ekubo BTC/USDC, Vesu vaults, etc.)
- **Hybrid Mode:** Custom distribution and automatic rebalancing only between selected pools

### 🔄 Intelligent Rebalancing
- Based on market conditions and APY thresholds
- Optimization to minimize costs and slippage
- Automatic conversion of rewards to WBTC

### 📊 Dashboard and UX
- Visualization of APY, pools, and strategies
- Suggested options: "Higher yield", "Lower risk"
- Simple and user-friendly interface for any user

## 🏗 Technology Stack

- **Frontend:** Next.js 14 (App Router)
- **Smart Contracts:** Cairo (StarkNet)
- **Oracles:** Pragma
- **DeFi Integration:** Vesu, Ekubo
- **Styles:** Tailwind CSS & shadcn/ui
- **Animations:** Framer Motion
- **Build:** Bun

## 📂 Project Structure

```
Numo/
├── apps/
│   ├── webapp/
│   │   ├── app/            # App Router pages, layout, global state, styles
│   │   ├── components/     # React components (ui/, home/, test/)
│   │   ├── constants/      # Global constants
│   │   ├── lib/            # Utilities, helpers, cache, mock-data, schemas
│   │   ├── types/          # Shared TypeScript types
│   │   └── public/         # Static assets
│   └── contracts/
│       ├── src/            # Cairo source code
│       ├── tests/          # Contract tests
│       ├── Scarb.toml      # Scarb configuration
│       └── snfoundry.toml  # Test configuration
├── package.json
├── bun.lock
├── tsconfig.json
└── README.md
```

## 🏃 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Bun
- Git

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

3. Configure environment variables:
   ```bash
   cp .env.sample .env.local
   ```

4. Start development server:
   ```bash
   bun dev
   ```

## 💡 Use Cases

### BTC Yield Vault
- Users seeking yield in BTC without managing strategies
- Total or partial delegation of yield strategy
- Flexible and transparent withdrawal

### Custom Strategy
- Advanced users who want to choose pools and define rebalancing
- Combination of Ekubo and Vesu pools according to preference

## 🔒 Security

- Audited and open source contracts
- Validation of addresses and deposits
- Protection against common DeFi attacks
- Use of robust oracles for rebalancing decisions

## 📊 Feature Comparison

| Feature                | Traditional Vault | Manual DeFi | Numo Vault |
|------------------------|-------------------|-------------|------------|
| Yield in BTC/WBTC      | ❌                | ⚠️          | ✅         |
| Automatic Strategy     | ❌                | ❌          | ✅         |
| Intelligent Rebalancing | ❌                | ❌          | ✅         |
| Multi-Protocol Integr. | ❌                | ⚠️          | ✅         |
| Simple UX              | ✅                | ❌          | ✅         |
| Flexible Withdrawal    | ⚠️                | ✅          | ✅         |
| Open Source            | ⚠️                | ✅          | ✅         |

## 🔍 BTCfi Track Criteria

| Requirement           | Compliance                                     |
| --------------------- | ---------------------------------------------- |
| Yield in BTC/WBTC     | ✅ All rewards are converted to WBTC           |
| Use of Vesu/Ekubo     | ✅ Vault integrates both protocols              |
| Use of Pragma         | ✅ Sophisticated Pragma integration             |
| Use of Starknet       | ✅ Deployed on Starknet testnet                 |
| Open repository       | ✅ Available on GitHub                          |
| Demo video            | ✅ Included                                     |
| Explanatory X thread  | ✅ Includes technical explanation and mentions  |

## 📜 License

This project is open source under the [MIT License](LICENSE).

## 🤝 Contributions

Contributions are welcome. Please review our contribution guidelines before submitting a pull request.

---

Developed with ❤️ by the Numo Team
