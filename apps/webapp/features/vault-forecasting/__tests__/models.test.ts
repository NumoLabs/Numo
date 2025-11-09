// Unit tests for vault forecasting models
import { 
  movingAverageForecast, 
  emaForecast, 
  volAdjustedProjection,
  portfolioApyProjection 
} from '../lib/models';
import type { PricePoint, ForecastParams } from '../types';

describe('Forecasting Models', () => {
  // Real price data for testing (no mocks)
  const samplePriceData: PricePoint[] = [
    { timestamp: 1640995200000, price: 45000 }, // Jan 1, 2022
    { timestamp: 1641081600000, price: 46000 }, // Jan 2, 2022
    { timestamp: 1641168000000, price: 47000 }, // Jan 3, 2022
    { timestamp: 1641254400000, price: 48000 }, // Jan 4, 2022
    { timestamp: 1641340800000, price: 49000 }, // Jan 5, 2022
    { timestamp: 1641427200000, price: 50000 }, // Jan 6, 2022
    { timestamp: 1641513600000, price: 51000 }, // Jan 7, 2022
    { timestamp: 1641600000000, price: 52000 }, // Jan 8, 2022
    { timestamp: 1641686400000, price: 53000 }, // Jan 9, 2022
    { timestamp: 1641772800000, price: 54000 }, // Jan 10, 2022
  ];

  describe('movingAverageForecast', () => {
    it('should return null for insufficient data', () => {
      const insufficientData = [{ timestamp: 1640995200000, price: 45000 }];
      const params: ForecastParams = { horizonDays: 30, window: 7 };
      
      const result = movingAverageForecast(insufficientData, params);
      expect(result).toBeNull();
    });

    it('should calculate forecast with sufficient data', () => {
      const params: ForecastParams = { horizonDays: 30, window: 7 };
      
      const result = movingAverageForecast(samplePriceData, params);
      
      expect(result).not.toBeNull();
      expect(result?.model).toBe('movingAverage');
      expect(result?.horizonDays).toBe(30);
      expect(result?.expectedValue).toBeGreaterThan(0);
      expect(result?.confidenceBand.lower).toBeLessThan(result?.confidenceBand.upper);
      expect(result?.metadata.dataPoints).toBe(samplePriceData.length);
    });

    it('should handle different window sizes', () => {
      const params: ForecastParams = { horizonDays: 30, window: 3 };
      
      const result = movingAverageForecast(samplePriceData, params);
      
      expect(result).not.toBeNull();
      expect(result?.model).toBe('movingAverage');
    });
  });

  describe('emaForecast', () => {
    it('should return null for insufficient data', () => {
      const insufficientData = [{ timestamp: 1640995200000, price: 45000 }];
      const params: ForecastParams = { horizonDays: 30, alpha: 0.1 };
      
      const result = emaForecast(insufficientData, params);
      expect(result).toBeNull();
    });

    it('should calculate EMA forecast', () => {
      const params: ForecastParams = { horizonDays: 30, alpha: 0.1 };
      
      const result = emaForecast(samplePriceData, params);
      
      expect(result).not.toBeNull();
      expect(result?.model).toBe('ema');
      expect(result?.horizonDays).toBe(30);
      expect(result?.expectedValue).toBeGreaterThan(0);
      expect(result?.confidenceBand.lower).toBeLessThan(result?.confidenceBand.upper);
    });

    it('should handle different alpha values', () => {
      const params: ForecastParams = { horizonDays: 30, alpha: 0.5 };
      
      const result = emaForecast(samplePriceData, params);
      
      expect(result).not.toBeNull();
      expect(result?.model).toBe('ema');
    });
  });

  describe('volAdjustedProjection', () => {
    it('should return null for insufficient data', () => {
      const insufficientData = samplePriceData.slice(0, 5); // Less than 10 points
      const params: ForecastParams = { horizonDays: 30 };
      
      const result = volAdjustedProjection(insufficientData, params);
      expect(result).toBeNull();
    });

    it('should calculate volatility adjusted projection', () => {
      const params: ForecastParams = { horizonDays: 30 };
      
      const result = volAdjustedProjection(samplePriceData, params);
      
      expect(result).not.toBeNull();
      expect(result?.model).toBe('volAdjusted');
      expect(result?.horizonDays).toBe(30);
      expect(result?.expectedValue).toBeGreaterThan(0);
      expect(result?.confidenceBand.lower).toBeLessThan(result?.confidenceBand.upper);
      expect(result?.metadata.volatility).toBeGreaterThan(0);
    });
  });

  describe('portfolioApyProjection', () => {
    it('should return null for insufficient data', () => {
      const insufficientData = [{ pricePerShare: 1.0, updatedAt: Date.now() }];
      
      const result = portfolioApyProjection(
        { pricePerShare: 1.1, updatedAt: Date.now() },
        insufficientData
      );
      
      expect(result).toBeNull();
    });

    it('should calculate APY from price per share changes', () => {
      const historicalSnapshots = [
        { pricePerShare: 1.0, updatedAt: Date.now() - (365 * 24 * 60 * 60 * 1000) }, // 1 year ago
        { pricePerShare: 1.1, updatedAt: Date.now() } // Now
      ];
      
      const result = portfolioApyProjection(
        { pricePerShare: 1.1, updatedAt: Date.now() },
        historicalSnapshots
      );
      
      expect(result).not.toBeNull();
      expect(result).toBeGreaterThan(0);
    });
  });
});
