/**
 * Core simulation engine — runs entirely client-side.
 * No API calls needed for calculations.
 */

export interface SimState {
  inventory: number;
  costPerUnit: number;
  sellingPrice: number;
  capital: number;
  day: number;
}

export interface SimResult {
  sales: number;
  revenue: number;
  profit: number;
  remaining: number;
  demand: number;
}

/**
 * Location-based demand multiplier.
 */
const LOCATION_MULTIPLIER: Record<string, number> = {
  village: 0.7,
  town: 1.0,
  city: 1.4,
  online: 1.2,
};

/**
 * Calculate the result of a day's business operation.
 */
export function calcDailyResult(
  state: SimState,
  events: string[],
  location: string = "town"
): SimResult {
  let demand = 10;

  // Event modifiers
  if (events.includes("festival")) demand += 5;
  if (events.includes("harvest")) demand += 3;
  if (events.includes("school_season")) demand += 4;
  if (events.includes("competition")) demand -= 2;
  if (events.includes("rain")) demand -= 3;
  if (events.includes("holiday")) demand += 6;

  // Price sensitivity — high markup reduces demand
  if (state.sellingPrice > state.costPerUnit * 3) demand -= 3;
  if (state.sellingPrice > state.costPerUnit * 4) demand -= 4;
  if (state.sellingPrice < state.costPerUnit * 1.5) demand += 2;

  // Location multiplier
  demand = Math.round(demand * (LOCATION_MULTIPLIER[location] || 1.0));

  // Day progression — demand grows slightly over time
  demand += Math.floor(state.day / 5);

  // Minimum demand of 1
  demand = Math.max(1, demand);

  const sales = Math.min(state.inventory, demand);
  const revenue = sales * state.sellingPrice;
  const profit = revenue - state.costPerUnit * sales;

  return {
    sales,
    revenue,
    profit,
    remaining: state.inventory - sales,
    demand,
  };
}

/**
 * Calculate profit margin percentage.
 */
export function calcProfitMargin(
  costPerUnit: number,
  sellingPrice: number
): number {
  if (sellingPrice === 0) return 0;
  return Math.round(((sellingPrice - costPerUnit) / sellingPrice) * 100);
}

/**
 * Determine if business is in failure state.
 */
export function isBusinessFailed(capital: number, inventory: number): boolean {
  return capital <= 0 && inventory <= 0;
}

/**
 * Calculate recommended restock quantity.
 */
export function calcRestockQty(
  avgDailySales: number,
  daysOfStock: number = 3
): number {
  return Math.ceil(avgDailySales * daysOfStock);
}
