// Recharts line chart component (lazy loaded)
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { PricePoint, ForecastResult } from '../types';

interface RechartsLineChartProps {
  historicalPrices: PricePoint[];
  forecastResult?: ForecastResult;
}

export default function RechartsLineChart({ 
  historicalPrices, 
  forecastResult 
}: RechartsLineChartProps) {
  // Prepare data for the chart
  const chartData = historicalPrices.map(point => ({
    timestamp: point.timestamp,
    price: point.price,
    date: new Date(point.timestamp).toLocaleDateString(),
    time: new Date(point.timestamp).toLocaleTimeString()
  }));

  // Add forecast data if available
  if (forecastResult) {
    const lastPrice = historicalPrices[historicalPrices.length - 1];
    const forecastTimestamp = lastPrice.timestamp + (forecastResult.horizonDays * 24 * 60 * 60 * 1000);
    
    chartData.push({
      timestamp: forecastTimestamp,
      price: forecastResult.expectedValue,
      date: new Date(forecastTimestamp).toLocaleDateString(),
      time: new Date(forecastTimestamp).toLocaleTimeString()
    });
  }

  const formatTooltipValue = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  const formatXAxisLabel = (tickItem: string) => {
    return new Date(tickItem).toLocaleDateString();
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="timestamp"
            tickFormatter={formatXAxisLabel}
            stroke="#666"
            fontSize={12}
          />
          <YAxis 
            tickFormatter={formatTooltipValue}
            stroke="#666"
            fontSize={12}
          />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleString()}
            formatter={(value: number) => [formatTooltipValue(value), 'Price']}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '12px'
            }}
          />
          
          {/* Historical price line */}
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            name="Historical Price"
          />
          
          {/* Forecast confidence bands */}
          {forecastResult && (
            <>
              <ReferenceLine 
                y={forecastResult.confidenceBand.upper}
                stroke="#ef4444"
                strokeDasharray="5 5"
                strokeWidth={1}
              />
              <ReferenceLine 
                y={forecastResult.confidenceBand.lower}
                stroke="#ef4444"
                strokeDasharray="5 5"
                strokeWidth={1}
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
