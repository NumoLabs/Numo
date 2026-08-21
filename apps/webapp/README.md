# Numo – Modular BTC Finance on Starknet

## ✨ Overview

Numo is a modular DeFi platform built on Starknet that enables users to grow their BTC (WBTC) safely, automatically, and transparently. Numo offers a complete BTC-centric experience, including auto-rebalancing vaults, fixed-term bonds, strategy sharing, forecasting tools, and an integrated DeFi learning section.

## 🚀 Key Features

- **WBTC Deposits**: Users can deposit WBTC into Numo's vault.
- **Automatic and Manual Modes**: Choose between delegating strategy or manually selecting pools.
- **Smart Rebalancing**: Contract adjusts strategy based on Pragma data (APY, volatility, etc.).
- **Multi-Protocol Integration**: Uses Vesu and Ekubo to maximize returns.
- **BTC/WBTC Yield**: All rewards are automatically converted to WBTC.
- **Flexible Withdrawals**: Users can withdraw capital and yield at any time.
- **Simple and User-Friendly UI**: Experience designed for users new to DeFi.
- **BTC Bonds**: Lock BTC for 7, 30, or 90 days for extra yield.
- **Vault Marketplace**: Discover and follow community-created strategies.
- **Forecasting Tools**: Simulate gains and compare returns.
- **Educational Section**: Learn about DeFi directly in the application.

## 🏃 Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js (v18 or higher)](https://nodejs.org/)
- [Bun](https://bun.sh/)
- [Git](https://git-scm.com/)

### Clone and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/numo.git
   cd numo/apps/webapp
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Start development server:

   ```bash
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 🏗 Architecture

The web application follows a structured component-based approach:

- **Layout Components**: Base layout structure (`components/layout/`)
- **Shared Components**: Reusable UI elements (`components/shared/`)
- **Section Components**: Page-specific sections (`components/sections/`)
- **UI Components**: Basic UI building blocks (`components/ui/`)

### Technologies and Protocols

- **Starknet**: L2 blockchain on Ethereum
- **Vesu**: Decentralized lending and vault platform
- **Ekubo**: DEX with optimized AMM architecture
- **Pragma**: Oracle for real-time prices and rebalancing decisions
- **Cairo**: Smart contract language for Starknet
- **Next.js 14** with App Router
- **Tailwind CSS & shadcn/ui** for modern components
- **Framer Motion** for fluid animations
- **Build Optimization** using Bun

## 📊 How It Works

1. User deposits WBTC into the vault contract.
2. Can choose between three modes:
   - **Automatic Mode**: Contract decides best strategy based on Pragma data (APY, volatility, etc.).
   - **Manual Mode**: User selects which available pools to participate in.
   - **Hybrid Mode**: Custom allocation + rebalancing only within selected strategies.
3. Contract queries **Pragma** oracles to obtain:
   - Current BTC/USDC prices
   - Market indicators like volatility
   - Estimated APYs in Vesu and Ekubo
4. Vault distributes funds according to chosen strategy:
   - ✨ Ekubo: provide liquidity in BTC/USDC pool
   - ✨ Vesu: participate in vaults or loans with BTC
5. Any rewards generated in tokens other than BTC are automatically converted to WBTC within the protocol.
6. User can withdraw funds at any time along with accumulated returns in WBTC.

## 🔄 Automatic Rebalancing

- Runs periodically or when certain APY change thresholds are reached.
- Based on market conditions obtained through Pragma.
- Can be optimized to minimize costs and slippage.
- In manual mode, user can define fixed distribution or enable rebalancing within selected pools.

### 🎁 Bonus: hybrid mode

User can manually select multiple pools (e.g., 60% Ekubo, 40% Vesu) and enable automatic rebalancing **only within those chosen pools**. This allows leveraging automation without losing control.

## ❓ Why is it useful for users new to DeFi?

- Presents strategies with simple names and descriptions.
- Allows viewing suggested options like "Highest return" or "Lowest risk".
- Prevents users from having to understand complex contracts or protocols.
- Enables complete delegation of decisions with automatic mode.

## 🔍 BTCfi Track Criteria

| Requirement          | Compliance                                    |
| -------------------- | --------------------------------------------- |
| BTC/WBTC Yield       | ✅ All rewards converted to WBTC              |
| Vesu/Ekubo Usage     | ✅ Vault integrates both protocols            |
| Starknet Usage       | ✅ Deployed on Starknet testnet               |
| Open Repository      | ✅ Available on GitHub                        |
| Demo Video           | ✅ Included                                   |
| X Thread             | ✅ Includes technical explanation and mentions |
| Representation Token | ✅ rbBTC as participation proof               |
| Fixed-Term Bonds     | ✅ 7, 30, and 90-day options                  |

## ✏️ Future Expansions

- Integration with new strategies (staking, utility NFTs)
- Representation token (`rbBTC`) to make participation composable
- Analytical dashboard with historical APYs and automatic rebalancing
- UI recommendation system based on user profile or market state

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

## 🚀 Contributions

Contributions are welcome! Feel free to submit pull requests or open issues.

---

Developed with ❤️ by the Numo Team
## Linting

`bun run lint` runs Biome.

Two settings are deliberate and worth knowing before you "fix" them:

- **`noUnknownAtRules` is off.** Biome's CSS linter does not recognise Tailwind's
  `@tailwind` / `@apply` directives and reports them as unknown at-rules.
  Tailwind validates them itself at build time.
- **The remaining `useExhaustiveDependencies` findings are known and benign.**
  Each one lists a dependency that is a module-level constant
  (`getVesuConfig()` returns a frozen config object; `contract` is a
  `useMemo(..., [])`), so the extra entry never triggers a re-run. They are left
  in place rather than silenced so a genuinely unstable dependency still shows up.

Every other rule is expected to pass. If `bun run lint` reports something new,
it is new.
