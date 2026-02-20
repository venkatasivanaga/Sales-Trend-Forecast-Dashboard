import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Row = {
  date: string;
  actual?: number;
  forecast?: number;
  sales?: number; // fallback
};

function formatNumber(n: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
}

export function ChartSales({ data }: { data: Row[] }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div>
        <div className="text-sm font-semibold">Sales trend</div>
        <div className="mt-1 text-xs text-neutral-500">Actual vs forecast</div>
      </div>

      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickMargin={8} minTickGap={24} />
            <YAxis tickFormatter={formatNumber} width={70} />
            <Tooltip
              formatter={(value: any) => formatNumber(Number(value))}
              labelFormatter={(label) => `Date: ${label}`}
            />

            <Line
              type="monotone"
              dataKey={(d: any) => d.actual ?? d.sales}
              name="Actual"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />

            <Line
              type="monotone"
              dataKey="forecast"
              name="Forecast"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              strokeDasharray="6 4"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
