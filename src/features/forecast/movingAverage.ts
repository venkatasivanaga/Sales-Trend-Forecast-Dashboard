import type { SalesRow } from "../../types/sales";
import type { Granularity } from "../data/aggregate";

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

function addMonths(ym: string, monthsToAdd: number) {
  const [y, m] = ym.split("-").map(Number); // YYYY-MM
  const d = new Date(Date.UTC(y, m - 1, 1));
  d.setUTCMonth(d.getUTCMonth() + monthsToAdd);
  const yy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${yy}-${mm}`;
}

function addWeeks(isoWeek: string, weeksToAdd: number) {
  // format: YYYY-Www
  const [yPart, wPart] = isoWeek.split("-W");
  let year = Number(yPart);
  let week = Number(wPart);

  week += weeksToAdd;

  // normalize overflow; good enough for UI (handles most cases)
  while (week > 52) {
    week -= 52;
    year += 1;
  }
  while (week < 1) {
    week += 52;
    year -= 1;
  }
  return `${year}-W${String(week).padStart(2, "0")}`;
}

function nextKey(lastKey: string, g: Granularity, i: number) {
  if (g === "daily") return addDays(lastKey, i);
  if (g === "weekly") return addWeeks(lastKey, i);
  return addMonths(lastKey, i);
}

export function makeMovingAverageForecast(
  rows: SalesRow[],
  horizon: number,
  window: number,
  granularity: Granularity
): ForecastPoint[] {
  const data = [...rows].sort((a, b) => a.date.localeCompare(b.date));
  const n = data.length;
  if (n === 0) return [];

  const values = data.map((r) => r.sales);
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const lastKey = data[n - 1].date;

  const out: ForecastPoint[] = data.map((r) => ({
    date: r.date,
    actual: r.sales,
  }));

  for (let i = 1; i <= horizon; i++) {
    const start = Math.max(0, values.length - window);
    const ma = avg(values.slice(start));
    const nextDate = nextKey(lastKey, granularity, i);

    values.push(ma);
    out.push({ date: nextDate, forecast: ma });
  }

  return out;
}
