/**
 * Simulation calculator — demand modelling and profit math.
 * Pure functions, no side effects.
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
}

/**
 * Core daily calculation as specified in PRD Section 8.1.
 */
export function calcDailyResult(
  state: SimState,
  events: string[]
): SimResult {
  let demand = 10;
  if (events.includes("festival")) demand += 5;
  if (events.includes("competition")) demand -= 2;
  if (state.sellingPrice > state.costPerUnit * 3) demand -= 3;

  const sales = Math.min(state.inventory, demand);
  const revenue = sales * state.sellingPrice;
  const profit = revenue - state.costPerUnit * sales;

  return {
    sales,
    revenue,
    profit,
    remaining: state.inventory - sales,
  };
}

/**
 * Calculate decision accuracy from history.
 */
export function calcDecisionAccuracy(
  profitableDecisions: number,
  totalDecisions: number
): number {
  if (totalDecisions === 0) return 0;
  return Math.round((profitableDecisions / totalDecisions) * 100);
}

/**
 * Calculate profit performance as percentage of capital.
 */
export function calcProfitPerformance(
  totalProfit: number,
  initialCapital: number
): number {
  if (initialCapital === 0) return 0;
  const perf = (totalProfit / initialCapital) * 100;
  return Math.min(100, Math.max(0, Math.round(perf)));
}
