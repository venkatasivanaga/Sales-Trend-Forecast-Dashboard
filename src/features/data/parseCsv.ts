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

  const rows = (parsed.data as any[]).map((r) => ({
    date: String(r.date ?? "").trim(),
    sales: Number(r.sales),
  }));

  const cleaned = rows
    .filter((r) => r.date && Number.isFinite(r.sales))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (!cleaned.length) {
    throw new Error("No valid rows found. Expected columns: date,sales");
  }

  return validateSalesRows(cleaned);
}
