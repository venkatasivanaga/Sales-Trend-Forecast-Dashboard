import type { SalesKpis } from "../features/data/kpis";

function formatNumber(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

function Card({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
      {sub ? <div className="mt-1 text-xs text-neutral-500">{sub}</div> : null}
    </div>
  );
}

export function KpiGrid({ kpis }: { kpis: SalesKpis }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Card label="Total sales" value={formatNumber(kpis.total)} />
      <Card label="Avg / day" value={formatNumber(kpis.avgPerDay)} />
      <Card
        label="Best day"
        value={formatNumber(kpis.max.sales)}
        sub={kpis.max.date}
      />
      <Card
        label="Worst day"
        value={formatNumber(kpis.min.sales)}
        sub={kpis.min.date}
      />
    </div>
  );
}
