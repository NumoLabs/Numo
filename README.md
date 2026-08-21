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
* [Scarb](https://docs.swmansion.com/scarb/) 2.12.2 and [Starknet Foundry](https://foundry-rs.github.io/starknet-foundry/) 0.50.0 — only for `apps/contracts`

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/numo.git
cd numo
```

2. Install dependencies (root, then webapp):

```bash
bun install && cd apps/webapp && bun install
```

3. Configure the environment:

```bash
cp apps/webapp/.env.example apps/webapp/.env.local
```

The app builds and runs with everything blank — it falls back to a public
Starknet RPC node — but these features stay dark until configured:

| Variable | Needed for | Exposed to browser |
| --- | --- | --- |
| `NEXT_PUBLIC_STARKNET_RPC_URL` | All on-chain reads (falls back to a rate-limited public node) | **Yes** |
| `STARKNET_RPC_URL` | Server-side RPC; safe place for a keyed URL | No |
| `ALCHEMY_API_KEY` | `/api/wallet/wbtc-balance` | No |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client | **Yes** |
| `SUPABASE_SERVICE_ROLE_KEY` | User profiles, avatar upload, user count | No |
| `PRAGMA_API_KEY` | Price feeds via `/api/pragma` | No |
| `NEXT_PUBLIC_SITE_URL` | Same-origin check on `/api/starknet-rpc` behind a proxy/CDN | **Yes** |

> Anything named `NEXT_PUBLIC_*` is inlined into the JavaScript bundle and is
> readable by anyone. Never put a secret behind that prefix.

Avatar uploads additionally need a **public** Supabase Storage bucket named
`avatars` (max 5 MB, image MIME types). Create it once in the Supabase
dashboard — the app does not provision it.

4. Start the development server:

```bash
bun run dev
```

### Contracts

```bash
cp apps/contracts/.env.example apps/contracts/.env   # set MAINNET_RPC_URL
bun run contracts:build
bun run contracts:test    # fork tests; requires MAINNET_RPC_URL
```

### Checks

```bash
bun run typecheck && bun run lint && bun run build
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


