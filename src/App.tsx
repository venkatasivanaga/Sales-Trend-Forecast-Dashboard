import "./App.css";

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <h1 className="text-lg font-semibold tracking-tight">
              Sales Trend Forecast Dashboard
            </h1>
            <span className="text-xs text-neutral-500">
              Upload • Explore • Forecast
            </span>
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
          <h2 className="text-base font-semibold">Getting started</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Upload a CSV with <code className="rounded bg-neutral-100 px-1">date</code>{" "}
            and <code className="rounded bg-neutral-100 px-1">sales</code> columns,
            then explore trends and generate a forecast.
          </p>

          <div className="mt-6 rounded-xl border border-dashed bg-neutral-50 p-6">
            <p className="text-sm text-neutral-600">
              (Next) File upload dropzone will go here.
            </p>
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
