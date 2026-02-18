import "./App.css";
import { useState } from "react";
import type { SalesRow } from "./types/sales";
import { parseSalesCsv } from "./features/data/parseCsv";
import { FileDropzone } from "./components/FileDropzone";
import { ChartSales } from "./components/ChartSales";

export default function App() {
  const [data, setData] = useState<SalesRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingSample, setLoadingSample] = useState(false);
  const [filename, setFilename] = useState<string | null>(null);

  async function loadSample() {
    setError(null);
    setLoadingSample(true);
    try {
      const res = await fetch("/sample-data.csv");
      if (!res.ok) throw new Error("Failed to load sample dataset");
      const text = await res.text();
      const rows = parseSalesCsv(text);
      setData(rows);
      setFilename("sample-data.csv");
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
      setData(null);
      setFilename(null);
    } finally {
      setLoadingSample(false);
    }
  }

  function clearData() {
    setData(null);
    setFilename(null);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <h1 className="text-lg font-semibold tracking-tight">
              Sales Trend Forecast Dashboard
            </h1>
            <span className="text-xs text-neutral-500">Upload • Explore • Forecast</span>
          </div>
          <a
            className="text-sm text-neutral-700 hover:text-neutral-900 underline underline-offset-4"
            href="https://github.com/venkatasivanaga/Sales-Trend-Forecast-Dashboard"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold">Getting started</h2>
              <p className="mt-1 text-sm text-neutral-600">
                Load the sample data or upload a CSV with{" "}
                <code className="rounded bg-neutral-100 px-1">date</code> and{" "}
                <code className="rounded bg-neutral-100 px-1">sales</code>.
              </p>
            </div>

            <button
              onClick={loadSample}
              disabled={loadingSample}
              className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium
                         hover:bg-neutral-50 disabled:opacity-60"
            >
              {loadingSample ? "Loading..." : "Load sample data"}
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <div className="mt-6">
            <FileDropzone
              onTextLoaded={(text, name) => {
                setError(null);
                try {
                  const rows = parseSalesCsv(text);
                  setData(rows);
                  setFilename(name ?? "uploaded.csv");
                } catch (e: any) {
                  setError(e?.message ?? "Invalid CSV");
                  setData(null);
                  setFilename(null);
                }
              }}
              onError={(msg) => {
                setError(msg);
                setData(null);
                setFilename(null);
              }}
            />
            {data && (
              <div className="mt-6">
                <KpiGrid kpis={computeSalesKpis(data)} />
              </div>
            )}
            {data && (
              <div className="mt-6">
                <ChartSales data={data} />
              </div>
            )}

            {data && (
              <div className="mt-4 rounded-xl border bg-white p-4 text-sm text-neutral-700">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    Loaded <span className="font-semibold">{data.length}</span> rows
                    {filename ? <span className="text-neutral-500"> • {filename}</span> : null}
                  </div>
                  <button
                    className="text-sm underline underline-offset-4 text-neutral-700 hover:text-neutral-900"
                    onClick={clearData}
                  >
                    Clear
                  </button>
                </div>

                <div className="mt-2 text-xs text-neutral-500">
                  First date: {data[0].date} • Last date: {data[data.length - 1].date}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-neutral-500">
          Built with React + Vite + Tailwind • {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}
