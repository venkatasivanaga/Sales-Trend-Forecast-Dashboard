import Papa from "papaparse";
import type { SalesRow } from "../../types/sales";
import { validateSalesRows } from "./validate";

function normKeys(obj: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const k of Object.keys(obj)) out[k.trim().toLowerCase()] = obj[k];
  return out;
}

function toIsoDate(input: string): string {
  const s = (input ?? "").trim();
  if (!s) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+.*)?$/);
  if (m) {
    const mm = m[1].padStart(2, "0");
    const dd = m[2].padStart(2, "0");
    const yyyy = m[3];
    return `${yyyy}-${mm}-${dd}`;
  }

  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) {
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  return s; // let validator fail with message
}

export function parseSalesCsv(csvText: string): SalesRow[] {
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  if (parsed.errors?.length) {
    const msg = parsed.errors[0]?.message ?? "Failed to parse CSV";
    throw new Error(msg);
  }

  const rows: SalesRow[] = (parsed.data as any[]).map((raw) => {
    const r = normKeys(raw);

    const dateVal =
      r["date"] ??
      r["orderdate"] ??
      r["order_date"] ??
      r["timestamp"] ??
      r["time"];

    const salesVal =
      r["sales"] ??
      r["revenue"] ??
      r["amount"] ??
      r["total"] ??
      r["price"];

    return {
      date: toIsoDate(String(dateVal ?? "")),
      sales: Number(salesVal),
    };
  });

  const cleaned = rows
    .filter((r) => r.date && Number.isFinite(r.sales))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (!cleaned.length) {
    throw new Error(
      "No valid rows found. Expected a date column (date/orderdate) and a numeric sales column (sales/revenue)."
    );
  }

  // Aggregate duplicate dates (transaction-level exports commonly have multiple rows/day)
  const aggregatedMap = new Map<string, number>();
  for (const r of cleaned) {
    aggregatedMap.set(r.date, (aggregatedMap.get(r.date) ?? 0) + r.sales);
  }

  const aggregated: SalesRow[] = Array.from(aggregatedMap.entries())
    .map(([date, sales]) => ({ date, sales }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return validateSalesRows(aggregated);
}
