// Main vault forecasting page
'use client';

import { useState } from 'react';
import { VaultHeader } from '../../../features/vault-forecasting/components/VaultHeader';
import { ForecastChart } from '../../../features/vault-forecasting/components/ForecastChart';
import { ParamsPanel } from '../../../features/vault-forecasting/components/ParamsPanel';
import { SummaryTable } from '../../../features/vault-forecasting/components/SummaryTable';
import { useVaultSnapshot } from '../../../features/vault-forecasting/hooks/useVaultSnapshot';
import { usePragmaPrice } from '../../../features/vault-forecasting/hooks/usePragmaPrice';
import { usePragmaHistory } from '../../../features/vault-forecasting/hooks/usePragmaHistory';
import { 
  movingAverageForecast, 
  emaForecast, 
  volAdjustedProjection 
} from '../../../features/vault-forecasting/lib/models';
import type { ForecastModel, ForecastParams, ForecastResult } from '../../../features/vault-forecasting/types';

function VaultForecastingContent() {
  const [, setForecastParams] = useState<ForecastParams & { model: ForecastModel }>({
    model: 'movingAverage',
    horizonDays: 30,
    window: 7,
    alpha: 0.1
  });

  const [forecastResult, setForecastResult] = useState<ForecastResult | undefined>();

  // Get vault address from environment
  const vaultAddress = process.env.NEXT_PUBLIC_VAULT_ADDRESS;
  const pragmaFeedAddress = process.env.NEXT_PUBLIC_PRAGMA_FEED_WBTC_USD;

  // Check if forecasting is enabled
  const isForecastingEnabled = process.env.NEXT_PUBLIC_FORECASTING_ENABLED === 'true';

  // Hooks for data fetching
  const vaultSnapshot = useVaultSnapshot(vaultAddress);
  const pragmaPrice = usePragmaPrice(pragmaFeedAddress);

  // Calculate historical data range (last 30 days)
  const now = Date.now();
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);

  const pragmaHistory = usePragmaHistory({
    feedAddress: pragmaFeedAddress,
    fromTimestamp: thirtyDaysAgo,
    toTimestamp: now,
    intervalSec: 3600 // 1 hour intervals
  });

  // Calculate forecast when parameters change
  const calculateForecast = (params: ForecastParams & { model: ForecastModel }) => {
    if (!pragmaHistory.data || pragmaHistory.data.length === 0) {
      setForecastResult(undefined);
      return;
    }

    let result: ForecastResult | null = null;

    try {
      switch (params.model) {
        case 'movingAverage':
          result = movingAverageForecast(pragmaHistory.data, params);
          break;
        case 'ema':
          result = emaForecast(pragmaHistory.data, params);
          break;
        case 'volAdjusted':
          result = volAdjustedProjection(pragmaHistory.data, params);
          break;
      }

      setForecastResult(result || undefined);
    } catch (error) {
      console.error('Error calculating forecast:', error);
      setForecastResult(undefined);
    }
  };

  const handleParamsChange = (params: ForecastParams & { model: ForecastModel }) => {
    setForecastParams(params);
    calculateForecast(params);
  };

  // Show banner if forecasting is not enabled
  if (!isForecastingEnabled) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h1 className="text-xl font-semibold text-yellow-800 mb-2">
              Vault Forecasting Disabled
            </h1>
            <p className="text-yellow-600">
              Vault forecasting feature is not enabled. Set NEXT_PUBLIC_FORECASTING_ENABLED=true to enable.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show banner if required environment variables are missing
  if (!vaultAddress || !pragmaFeedAddress) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h1 className="text-xl font-semibold text-red-800 mb-2">
              Configuration Required
            </h1>
            <p className="text-red-600 mb-2">
              Missing required environment variables:
            </p>
            <ul className="list-disc list-inside text-red-600 space-y-1">
              {!vaultAddress && <li>NEXT_PUBLIC_VAULT_ADDRESS</li>}
              {!pragmaFeedAddress && <li>NEXT_PUBLIC_PRAGMA_FEED_WBTC_USD</li>}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <VaultHeader
          vaultAddress={vaultAddress}
          snapshot={vaultSnapshot.data}
          isLoading={vaultSnapshot.isLoading}
          error={vaultSnapshot.error}
        />

        {/* Live Price Section */}
        {pragmaPrice.data && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Live Price Feed</h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ${pragmaPrice.data.price.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">
                  WBTC/USD • Updated: {new Date(pragmaPrice.data.updatedAt).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => pragmaPrice.refetch()}
                disabled={pragmaPrice.isFetching}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {pragmaPrice.isFetching ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Chart */}
          <div className="lg:col-span-2">
            <ForecastChart
              historicalPrices={pragmaHistory.data || []}
              forecastResult={forecastResult}
              isLoading={pragmaHistory.isLoading}
              error={pragmaHistory.error}
            />
          </div>

          {/* Right Column - Parameters and Summary */}
          <div className="space-y-6">
            <ParamsPanel
              onParamsChange={handleParamsChange}
              isLoading={pragmaHistory.isLoading}
            />
            <SummaryTable
              forecastResult={forecastResult}
              vaultSnapshot={vaultSnapshot.data}
              isLoading={pragmaHistory.isLoading}
              error={pragmaHistory.error}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            About This Tool
          </h3>
          <div className="text-blue-800 text-sm space-y-2">
            <p>
              📊 <strong>100% On-Chain Data:</strong> All price data comes directly from Pragma price feeds on Starknet.
              No simulated or mock data is used.
            </p>
            <p>
              🔍 <strong>Real Vault Metrics:</strong> Vault data is read directly from the smart contract using view functions.
              Only metrics exposed by the contract are displayed.
            </p>
            <p>
              ⚠️ <strong>Educational Purpose:</strong> This tool is for educational and analytical purposes only.
              Forecasts are based on historical data and mathematical models, not financial advice.
            </p>
            <p>
              🚫 <strong>No Transactions:</strong> This tool only reads data from the blockchain. No transactions are executed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VaultForecastingPage() {
  return <VaultForecastingContent />;
}
