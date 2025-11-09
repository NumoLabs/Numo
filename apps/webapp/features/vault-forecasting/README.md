# Vault Forecasting Feature

A frontend-only feature for projecting vault performance using real on-chain data from Starknet.

## Overview

This feature provides educational forecasting capabilities for vault performance analysis using:
- **Real on-chain data** from Pragma price feeds
- **Vault contract data** read via view functions
- **Mathematical models** for price projections
- **No mock data or simulations**

## Environment Variables

Add these to your `.env` file:

```bash
# Enable the feature
NEXT_PUBLIC_FORECASTING_ENABLED=true

# Starknet configuration
NEXT_PUBLIC_STARKNET_RPC_URL=https://starknet-sepolia.public.blastapi.io
NEXT_PUBLIC_NETWORK=sepolia

# Vault contract address
NEXT_PUBLIC_VAULT_ADDRESS=0x0524cE87626E205c7F4F05370a73a72C3960d607C1308eA50A9616cc9cbe36a9

# Pragma price feed address (WBTC/USD)
NEXT_PUBLIC_PRAGMA_FEED_WBTC_USD=0x00b4d40eb5c74771b19a64e0c4688d9226924cdd087417e821d2244268e2f9f
```

## Features

### Real On-Chain Data
- **Pragma Price Feeds**: Live WBTC/USD prices and historical data
- **Vault Contract**: Reads actual vault metrics via view functions
- **No Mock Data**: All data comes directly from the blockchain

### Forecasting Models
- **Moving Average**: Uses recent price average with trend analysis
- **Exponential Moving Average**: Gives more weight to recent prices
- **Volatility Adjusted**: Adjusts projection based on historical volatility

### Vault Metrics (if exposed by contract)
- Total Value Locked (TVL)
- Price Per Share
- Asset address
- Management/Performance fees
- Last rebalance timestamp
- Position weights

## Usage

1. **Enable the feature** by setting `NEXT_PUBLIC_FORECASTING_ENABLED=true`
2. **Configure environment variables** for vault address and price feeds
3. **Navigate to** `/forecasting/vault` to access the tool
4. **Select parameters** for forecasting model and time horizon
5. **View results** with confidence bands and projections

## Architecture

```
features/vault-forecasting/
├── components/          # UI components
├── hooks/              # React hooks for data fetching
├── services/           # On-chain data services
├── lib/               # Utilities and models
│   ├── abi/          # Contract ABIs
│   ├── math.ts       # Mathematical utilities
│   └── models.ts     # Forecasting models
├── types/            # TypeScript definitions
└── __tests__/        # Unit tests
```

## Data Sources

### Pragma Price Feeds
- **Latest Price**: `latest_round_data()` function
- **Historical Data**: `get_round_data(round_id)` for past prices
- **Feed Address**: WBTC/USD feed on Starknet

### Vault Contract
Reads view functions (if available):
- `totalAssets()` / `totalAssetsUsd()`
- `asset()` / `underlying()`
- `pricePerShare()`
- `decimals()`
- `lastRebalance()`
- `getPositions()` / `getWeights()`
- `managementFee()` / `performanceFee()`

## Forecasting Models

### Moving Average
```typescript
movingAverageForecast(series: PricePoint[], {window, horizonDays})
```
- Uses recent price average
- Calculates trend from last price vs average
- Projects forward with confidence bands

### Exponential Moving Average
```typescript
emaForecast(series: PricePoint[], {alpha, horizonDays})
```
- Gives more weight to recent prices
- Uses alpha smoothing factor
- Projects trend with volatility bands

### Volatility Adjusted
```typescript
volAdjustedProjection(series: PricePoint[], {horizonDays})
```
- Calculates historical volatility
- Adjusts projection conservatively
- Uses volatility for confidence bands

## Error Handling

- **Missing Environment Variables**: Shows configuration banner
- **Contract Function Not Available**: Gracefully omits metric
- **Insufficient Data**: Shows warning, no mock data
- **RPC Errors**: Displays error message with retry option

## Performance

- **React Query**: Caching and background refetching
- **Lazy Loading**: Charts loaded on demand
- **30s Refresh**: Live data updates every 30 seconds
- **Error Boundaries**: Graceful error handling

## Testing

Run unit tests:
```bash
npm test features/vault-forecasting
```

Tests cover:
- Mathematical models with real data arrays
- Service error handling
- Hook behavior
- Component rendering

## Extension

### Multiple Vaults
To support multiple vaults, create:
```
app/forecasting/vault/[address]/page.tsx
```

### Additional Price Feeds
Add more feeds by:
1. Adding feed address to environment variables
2. Creating new service instances
3. Updating UI to select feeds

## Compliance

✅ **No Mock Data**: All data comes from on-chain sources
✅ **Read-Only**: No transactions executed
✅ **Educational**: Clear disclaimers about purpose
✅ **Transparent**: Shows data sources and limitations
✅ **Isolated**: Can be deleted without affecting other features

## Troubleshooting

### Feature Not Loading
- Check `NEXT_PUBLIC_FORECASTING_ENABLED=true`
- Verify all environment variables are set
- Check RPC URL connectivity

### No Data Available
- Verify vault contract has view functions
- Check Pragma feed is active
- Ensure sufficient historical data

### Forecast Errors
- Check historical data length (minimum 2 points)
- Verify model parameters are valid
- Check for RPC rate limits

## Security Notes

- **No Private Keys**: Feature only reads public data
- **No Transactions**: Read-only operations only
- **Environment Variables**: All config via env vars
- **Error Handling**: No sensitive data in error messages
