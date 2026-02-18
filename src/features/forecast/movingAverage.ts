import type { SalesRow } from "../../types/sales";

export type ForecastPoint = {
  date: string;
  actual?: number;
  forecast?: number;
};

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr + "T00:00:00");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function makeMovingAverageForecast(
  rows: SalesRow[],
  horizon: number,
  window: number
): ForecastPoint[] {
  const data = [...rows].sort((a, b) => a.date.localeCompare(b.date));
  const n = data.length;
  if (n === 0) return [];

  const values = data.map((r) => r.sales);
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const lastDate = data[n - 1].date;

  // actual points
  const out: ForecastPoint[] = data.map((r) => ({
    date: r.date,
    actual: r.sales,
  }));

  // forecast points beyond last date
  for (let i = 1; i <= horizon; i++) {
    const start = Math.max(0, values.length - window);
    const ma = avg(values.slice(start));
    const nextDate = addDays(lastDate, i);

    values.push(ma); // roll forward using predicted value
    out.push({ date: nextDate, forecast: ma });
  }

  return out;
}
