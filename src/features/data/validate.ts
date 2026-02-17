import type { SalesRow } from "../../types/sales";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function validateSalesRows(rows: SalesRow[]): SalesRow[] {
  // Validate date format + finite sales
  const badDate = rows.find((r) => !ISO_DATE.test(r.date));
  if (badDate) {
    throw new Error(
      `Invalid date "${badDate.date}". Expected ISO format YYYY-MM-DD.`
    );
  }

  const badSales = rows.find((r) => !Number.isFinite(r.sales));
  if (badSales) {
    throw new Error(`Invalid sales value for date ${badSales.date}.`);
  }

  // Detect duplicates (same date repeated)
  const seen = new Set<string>();
  const dups: string[] = [];
  for (const r of rows) {
    if (seen.has(r.date)) dups.push(r.date);
    seen.add(r.date);
  }
  if (dups.length) {
    const sample = dups.slice(0, 5).join(", ");
    throw new Error(`Duplicate dates found: ${sample}${dups.length > 5 ? "…" : ""}`);
  }

  return rows;
}
