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

  // Already ISO YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // Accept formats like:
  // "1/10/2003 0:00" or "01/10/2003" or "1/10/2003"
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+.*)?$/);
  if (m) {
    const mm = m[1].padStart(2, "0");
    const dd = m[2].padStart(2, "0");
    const yyyy = m[3];
    return `${yyyy}-${mm}-${dd}`;
  }

  // Fallback: try Date parse (best-effort)
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) {
    // Use UTC date part
    const yyyy = d.getUTCFullYear();
    const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(d.getUTCDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  return s; // let validator throw a friendly error
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

  const rows = (parsed.data as any[]).map((raw) => {
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

// Aggregate duplicate dates by summing sales (common in transaction-level exports)
const aggregatedMap = new Map<string, number>();
for (const r of cleaned) {
  aggregatedMap.set(r.date, (aggregatedMap.get(r.date) ?? 0) + r.sales);
}

const aggregated = Array.from(aggregatedMap.entries())
  .map(([date, sales]) => ({ date, sales }))
  .sort((a, b) => a.date.localeCompare(b.date));

return validateSalesRows(aggregated);

}
