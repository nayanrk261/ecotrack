import { describe, it, expect } from 'vitest';
import { calculateTrendRegression } from '../trendAnalysis';

describe('trendAnalysis', () => {
  it('should return flat projection values for arrays with fewer than 2 elements', () => {
    const resEmpty = calculateTrendRegression([]);
    expect(resEmpty.slope).toBe(0);
    expect(resEmpty.projectedNext).toBe(0);

    const resOne = calculateTrendRegression([250]);
    expect(resOne.slope).toBe(0);
    expect(resOne.projectedNext).toBe(250);
  });

  it('should correctly compute positive linear trend for increasing values', () => {
    // Values: 100, 120, 140
    // x = [0, 1, 2], y = [100, 120, 140]
    // Clearly slope m = 20, intercept c = 100
    // Next projection at index 3: 20 * 3 + 100 = 160
    const res = calculateTrendRegression([100, 120, 140]);
    expect(res.slope).toBeCloseTo(20, 2);
    expect(res.intercept).toBeCloseTo(100, 2);
    expect(res.projectedNext).toBe(160);
    expect(res.isTrendingDown).toBe(false);
    expect(res.absoluteSlope).toBe(20);
  });

  it('should correctly compute negative linear trend for decreasing values', () => {
    // Values: 300, 250, 200, 150
    // x = [0, 1, 2, 3]
    // m = -50, c = 300
    // Next projection at index 4: -50 * 4 + 300 = 100
    const res = calculateTrendRegression([300, 250, 200, 150]);
    expect(res.slope).toBeCloseTo(-50, 2);
    expect(res.intercept).toBeCloseTo(300, 2);
    expect(res.projectedNext).toBe(100);
    expect(res.isTrendingDown).toBe(true);
    expect(res.absoluteSlope).toBe(50);
  });

  it('should handle non-exact linear datasets using least-squares approximation', () => {
    // y = [10, 12, 11, 15]
    // x = [0, 1, 2, 3]
    // Sum x = 6, Sum y = 48, Sum xy = (0*10)+(1*12)+(2*11)+(3*15) = 0 + 12 + 22 + 45 = 79
    // Sum xx = 0 + 1 + 4 + 9 = 14
    // n = 4
    // Denominator = 4 * 14 - 6*6 = 56 - 36 = 20
    // Numerator = 4 * 79 - 6 * 48 = 316 - 288 = 28
    // m = 28 / 20 = 1.4
    // c = (48 - 1.4 * 6) / 4 = (48 - 8.4) / 4 = 39.6 / 4 = 9.9
    // Next index 4: 1.4 * 4 + 9.9 = 5.6 + 9.9 = 15.5
    const res = calculateTrendRegression([10, 12, 11, 15]);
    expect(res.slope).toBeCloseTo(1.4, 2);
    expect(res.intercept).toBeCloseTo(9.9, 2);
    expect(res.projectedNext).toBe(15.5);
  });
});
