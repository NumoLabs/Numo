// Unit tests for mathematical utilities
import { 
  scaleByDecimals, 
  safeDiv, 
  stdev, 
  annualize, 
  calculateVolatility, 
  calculateReturns 
} from '../lib/math';

describe('Math Utilities', () => {
  describe('scaleByDecimals', () => {
    it('should scale bigint by decimals correctly', () => {
      expect(scaleByDecimals(BigInt('1000000000000000000'), 18)).toBe(1);
      expect(scaleByDecimals(BigInt('1500000000000000000'), 18)).toBe(1.5);
      expect(scaleByDecimals(BigInt('1000000'), 6)).toBe(1);
      expect(scaleByDecimals(BigInt('1500000'), 6)).toBe(1.5);
    });

    it('should handle zero values', () => {
      expect(scaleByDecimals(BigInt('0'), 18)).toBe(0);
      expect(scaleByDecimals(BigInt('0'), 6)).toBe(0);
    });
  });

  describe('safeDiv', () => {
    it('should divide numbers correctly', () => {
      expect(safeDiv(10, 2)).toBe(5);
      expect(safeDiv(15, 3)).toBe(5);
      expect(safeDiv(7, 2)).toBe(3.5);
    });

    it('should return 0 when dividing by zero', () => {
      expect(safeDiv(10, 0)).toBe(0);
      expect(safeDiv(0, 0)).toBe(0);
      expect(safeDiv(-5, 0)).toBe(0);
    });
  });

  describe('stdev', () => {
    it('should calculate standard deviation correctly', () => {
      const data = [1, 2, 3, 4, 5];
      const result = stdev(data);
      expect(result).toBeCloseTo(1.58, 1);
    });

    it('should return 0 for single value', () => {
      expect(stdev([5])).toBe(0);
    });

    it('should return 0 for empty array', () => {
      expect(stdev([])).toBe(0);
    });

    it('should handle negative values', () => {
      const data = [-1, 0, 1];
      const result = stdev(data);
      expect(result).toBeCloseTo(0.816, 2);
    });
  });

  describe('annualize', () => {
    it('should annualize rates correctly', () => {
      const monthlyRate = 0.01; // 1% monthly
      const annualRate = annualize(monthlyRate, 12);
      expect(annualRate).toBeCloseTo(0.1268, 3); // ~12.68% annual
    });

    it('should handle quarterly rates', () => {
      const quarterlyRate = 0.03; // 3% quarterly
      const annualRate = annualize(quarterlyRate, 4);
      expect(annualRate).toBeCloseTo(0.1255, 3); // ~12.55% annual
    });
  });

  describe('calculateReturns', () => {
    it('should calculate returns correctly', () => {
      const prices = [100, 110, 121, 133.1];
      const returns = calculateReturns(prices);
      
      expect(returns).toHaveLength(3);
      expect(returns[0]).toBeCloseTo(0.1, 2); // 10% return
      expect(returns[1]).toBeCloseTo(0.1, 2); // 10% return
      expect(returns[2]).toBeCloseTo(0.1, 2); // 10% return
    });

    it('should handle negative returns', () => {
      const prices = [100, 90, 81];
      const returns = calculateReturns(prices);
      
      expect(returns[0]).toBeCloseTo(-0.1, 2); // -10% return
      expect(returns[1]).toBeCloseTo(-0.1, 2); // -10% return
    });

    it('should return empty array for single price', () => {
      const prices = [100];
      const returns = calculateReturns(prices);
      expect(returns).toHaveLength(0);
    });
  });

  describe('calculateVolatility', () => {
    it('should calculate volatility from returns', () => {
      const returns = [0.1, 0.05, -0.02, 0.08, -0.03];
      const volatility = calculateVolatility(returns);
      
      expect(volatility).toBeGreaterThan(0);
      expect(volatility).toBeLessThan(1); // Should be reasonable
    });

    it('should return 0 for single return', () => {
      const returns = [0.1];
      const volatility = calculateVolatility(returns);
      expect(volatility).toBe(0);
    });

    it('should return 0 for empty returns', () => {
      const returns: number[] = [];
      const volatility = calculateVolatility(returns);
      expect(volatility).toBe(0);
    });
  });
});
