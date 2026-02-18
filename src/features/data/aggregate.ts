import type { SalesRow } from "../../types/sales";

export type Granularity = "daily" | "weekly" | "monthly";

function weekKey(dateStr: string) {
  // ISO date parsing
  const d = new Date(dateStr + "T00:00:00");
  // Thursday in current week decides the year.
  const day = (d.getUTCDay() + 6) % 7; // Mon=0..Sun=6
  d.setUTCDate(d.getUTCDate() - day + 3); // shift to Thursday
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const firstDay = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDay + 3);
  const week =
    1 +
    Math.round(
      (d.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );
  const year = d.getUTCFullYear();
  return `${year}-W${String(week).padStart(2, "0")}`;
}

function monthKey(dateStr: string) {
  return dateStr.slice(0, 7); // YYYY-MM
}

export function aggregateSales(rows: SalesRow[], g: Granularity): SalesRow[] {
  if (g === "daily") return rows;

  const map = new Map<string, number>();
  for (const r of rows) {
    const key = g === "weekly" ? weekKey(r.date) : monthKey(r.date);
    map.set(key, (map.get(key) ?? 0) + r.sales);
  }

  return Array.from(map.entries())
    .map(([date, sales]) => ({ date, sales }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
