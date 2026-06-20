/**
 * Interface representing the result of a trend regression analysis.
 */
export interface TrendRegressionResult {
  slope: number;        // m value: rate of change per month in kg CO2
  intercept: number;    // c value
  projectedNext: number; // m * N + c: projected footprint for the next log entry index
  isTrendingDown: boolean;
  absoluteSlope: number; // absolute value of slope for clean display text
}

/**
 * Perform a simple linear regression (least squares) on an array of numbers.
 * y represents the numbers (monthly carbon values), x represents their 0-based index chronologically.
 *
 * @param yValues - Array of chronological footprint values.
 * @returns TrendRegressionResult.
 */
export function calculateTrendRegression(yValues: number[]): TrendRegressionResult {
  const n = yValues.length;
  if (n < 2) {
    // If not enough data, return flat trend
    const avg = n === 1 ? yValues[0] : 0;
    return {
      slope: 0,
      intercept: avg,
      projectedNext: avg,
      isTrendingDown: false,
      absoluteSlope: 0,
    };
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (let i = 0; i < n; i++) {
    const x = i;
    const y = yValues[i];
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  }

  const denominator = n * sumXX - sumX * sumX;
  const slope = denominator === 0 ? 0 : (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;
  
  const nextIndex = n;
  const projectedNext = Math.max(0, slope * nextIndex + intercept);

  return {
    slope,
    intercept,
    projectedNext: Math.round(projectedNext * 10) / 10,
    isTrendingDown: slope < 0,
    absoluteSlope: Math.round(Math.abs(slope) * 10) / 10,
  };
}
