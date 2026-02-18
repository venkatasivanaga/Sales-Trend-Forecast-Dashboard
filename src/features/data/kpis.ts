import type { SalesRow } from "../../types/sales";

export type SalesKpis = {
  total: number;
  avgPerDay: number;
  min: { date: string; sales: number };
  max: { date: string; sales: number };
};

export function computeSalesKpis(rows: SalesRow[]): SalesKpis {
  const sales = rows.map((r) => r.sales);
  const total = sales.reduce((a, b) => a + b, 0);
  const avgPerDay = total / rows.length;

  let minIdx = 0;
  let maxIdx = 0;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].sales < rows[minIdx].sales) minIdx = i;
    if (rows[i].sales > rows[maxIdx].sales) maxIdx = i;
  }

  return {
    total,
    avgPerDay,
    min: { date: rows[minIdx].date, sales: rows[minIdx].sales },
    max: { date: rows[maxIdx].date, sales: rows[maxIdx].sales },
  };
}
