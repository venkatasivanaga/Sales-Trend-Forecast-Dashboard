import Papa from "papaparse";
import type { SalesRow } from "../../types/sales";
import { validateSalesRows } from "./validate";

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

const norm = (obj: Record<string, any>) => {
  const out: Record<string, any> = {};
  for (const k of Object.keys(obj)) out[k.trim().toLowerCase()] = obj[k];
  return out;
};

const rows = (parsed.data as any[]).map((raw) => {
    const r = norm(raw);
    const dateVal = r["date"] ?? r["orderdate"];
    const salesVal = r["sales"] ?? r["revenue"] ?? r["amount"];
    return {
        date: String(dateVal ?? "").trim(),
        sales: Number(salesVal),
    };
});


  const cleaned = rows
    .filter((r) => r.date && Number.isFinite(r.sales))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (!cleaned.length) {
    throw new Error("No valid rows found. Expected columns: date,sales");
  }

  return validateSalesRows(cleaned);
}
