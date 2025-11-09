// Forecast chart component with lazy loading
import { lazy, Suspense } from 'react';
import { AlertCircle, TrendingUp } from 'lucide-react';
import type { PricePoint, ForecastResult } from '../types';

const RechartsLineChart = lazy(() => import('./RechartsLineChart'));

interface ForecastChartProps {
  historicalPrices: PricePoint[];
  forecastResult?: ForecastResult;
  isLoading: boolean;
  error?: Error | null;
}

export function ForecastChart({ 
  historicalPrices, 
  forecastResult, 
  isLoading, 
  error 
}: ForecastChartProps) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-red-800 mb-2">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Error loading chart data</span>
        </div>
        <p className="text-red-600 text-sm">{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-48"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // If we have a forecast result but no historical prices, we can still show the forecast
  // The forecast was generated from vault data, so we'll allow it to display
  if (historicalPrices.length === 0 && !forecastResult) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-yellow-800 mb-2">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Insufficient Data</span>
        </div>
        <p className="text-yellow-600 text-sm">
          No historical price data available for forecasting. Historical data is required to generate projections.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Price Forecast
        </h2>
        {forecastResult && (
          <div className="text-sm text-gray-600">
            Model: {forecastResult.model} • {forecastResult.horizonDays} days
          </div>
        )}
      </div>

      <Suspense fallback={
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }>
        <RechartsLineChart 
          historicalPrices={historicalPrices}
          forecastResult={forecastResult}
        />
      </Suspense>

      <div className="mt-4 text-xs text-gray-500">
        <p>
          📊 {historicalPrices.length > 0 && historicalPrices[0]?.timestamp < Date.now() - 86400000 
            ? 'Data source: Pragma price feeds (on-chain)' 
            : 'Data source: Vault metrics (on-chain)'} • 
          Historical points: {historicalPrices.length} • 
          Last update: {new Date(historicalPrices[historicalPrices.length - 1]?.timestamp || Date.now()).toLocaleString()}
        </p>
        <p className="mt-1">
          ⚠️ This is an educational tool for analysis only. Forecasts are based on vault performance data and mathematical models, not financial advice.
        </p>
      </div>
    </div>
  );
}
