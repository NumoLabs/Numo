// Summary table component
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import type { ForecastResult, VaultSnapshot } from '../types';

interface SummaryTableProps {
  forecastResult?: ForecastResult;
  vaultSnapshot?: VaultSnapshot;
  isLoading: boolean;
  error?: Error | null;
}

export function SummaryTable({ 
  forecastResult, 
  vaultSnapshot, 
  isLoading, 
  error 
}: SummaryTableProps) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-red-800 mb-2">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">Error loading forecast data</span>
        </div>
        <p className="text-red-600 text-sm">{error.message}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!forecastResult) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-yellow-800 mb-2">
          <AlertCircle className="h-5 w-5" />
          <span className="font-medium">No Forecast Available</span>
        </div>
        <p className="text-yellow-600 text-sm">
          Configure parameters and calculate forecast to see results.
        </p>
      </div>
    );
  }

  const currentPrice = vaultSnapshot?.pricePerShare || 0;
  const expectedValue = forecastResult.forecast[forecastResult.forecast.length - 1]?.price || currentPrice;
  const priceChange = currentPrice > 0 ? ((expectedValue - currentPrice) / currentPrice) * 100 : 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Forecast Summary</h2>
      
      <div className="space-y-4">
        {/* Current vs Expected */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Current Price</div>
            <div className="text-lg font-semibold text-gray-900">
              ${currentPrice.toFixed(6)}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Expected Price</div>
            <div className="text-lg font-semibold text-gray-900">
              ${expectedValue.toFixed(6)}
            </div>
          </div>
        </div>

        {/* Price Change */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Projected Change</div>
              <div className={`text-lg font-semibold flex items-center gap-2 ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                {Math.abs(priceChange).toFixed(2)}%
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Time Horizon</div>
              <div className="text-lg font-semibold text-gray-900">
                {forecastResult.horizonDays} days
              </div>
            </div>
          </div>
        </div>

        {/* Confidence Bands */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-800 mb-2 font-medium">Confidence Bands</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-blue-600 mb-1">Lower Bound</div>
              <div className="text-sm font-semibold text-blue-900">
                ${forecastResult.confidenceBand?.lower?.[forecastResult.confidenceBand.lower.length - 1]?.toFixed(6) || 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-xs text-blue-600 mb-1">Upper Bound</div>
              <div className="text-sm font-semibold text-blue-900">
                ${forecastResult.confidenceBand?.upper?.[forecastResult.confidenceBand.upper.length - 1]?.toFixed(6) || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Model Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600 mb-2">Model Information</div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Model:</span>
              <span className="ml-2 font-medium capitalize">{forecastResult.model}</span>
            </div>
            <div>
              <span className="text-gray-500">Data Points:</span>
              <span className="ml-2 font-medium">{forecastResult.forecast.length}</span>
            </div>
            {forecastResult.metrics?.volatility && (
              <div>
                <span className="text-gray-500">Volatility:</span>
                <span className="ml-2 font-medium">
                  {(forecastResult.metrics.volatility).toFixed(2)}%
                </span>
              </div>
            )}
            <div>
              <span className="text-gray-500">Expected Return:</span>
              <span className="ml-2 font-medium">
                {forecastResult.metrics?.expectedReturn?.toFixed(2) || 'N/A'}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p className="mb-1">Forecast based on {forecastResult.forecast.length} forecast points</p>
          <p>This is an educational tool for analysis only. Not financial advice.</p>
        </div>
      </div>
    </div>
  );
}
