// Parameters panel component
import { useState } from 'react';
import { Settings, Calculator } from 'lucide-react';
import type { ForecastModel, ForecastParams } from '../types';

interface ParamsPanelProps {
  onParamsChange: (params: ForecastParams & { model: ForecastModel }) => void;
  isLoading: boolean;
}

export function ParamsPanel({ onParamsChange, isLoading }: ParamsPanelProps) {
  const [model, setModel] = useState<ForecastModel>('movingAverage');
  const [horizonDays, setHorizonDays] = useState(30);
  const [window, setWindow] = useState(7);
  const [alpha, setAlpha] = useState(0.1);

  const handleCalculate = () => {
    const params: ForecastParams = {
      horizonDays,
      ...(model === 'movingAverage' && { window }),
      ...(model === 'ema' && { alpha })
    };
    
    onParamsChange({ ...params, model });
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="h-5 w-5 text-gray-400" />
        <h2 className="text-lg font-semibold text-white">Forecast Parameters</h2>
      </div>

      <div className="space-y-4">
        {/* Model Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Forecasting Model
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as ForecastModel)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            <option value="movingAverage">Moving Average</option>
            <option value="ema">Exponential Moving Average</option>
            <option value="volAdjusted">Volatility Adjusted</option>
          </select>
          <p className="text-xs text-gray-400 mt-1">
            {model === 'movingAverage' && 'Uses recent price average with trend analysis'}
            {model === 'ema' && 'Gives more weight to recent prices'}
            {model === 'volAdjusted' && 'Adjusts projection based on historical volatility'}
          </p>
        </div>

        {/* Horizon Days */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Forecast Horizon (days)
          </label>
          <input
            type="number"
            value={horizonDays}
            onChange={(e) => setHorizonDays(Number(e.target.value))}
            min="1"
            max="365"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        {/* Model-specific parameters */}
        {model === 'movingAverage' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Moving Average Window (days)
            </label>
            <input
              type="number"
              value={window}
              onChange={(e) => setWindow(Number(e.target.value))}
              min="2"
              max="30"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
        )}

        {model === 'ema' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Alpha (smoothing factor)
            </label>
            <input
              type="number"
              value={alpha}
              onChange={(e) => setAlpha(Number(e.target.value))}
              min="0.01"
              max="1"
              step="0.01"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-400 mt-1">
              Lower values = more smoothing, higher values = more responsive to recent changes
            </p>
          </div>
        )}

        {/* Calculate Button */}
        <button
          onClick={handleCalculate}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Calculator className="h-4 w-4" />
          {isLoading ? 'Calculating...' : 'Calculate Forecast'}
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-600">
        <div className="text-xs text-gray-400">
          <p className="mb-1">All calculations use real on-chain data</p>
          <p>Forecasts are for educational purposes only</p>
        </div>
      </div>
    </div>
  );
}
