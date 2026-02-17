import { useRef, useState } from "react";

type Props = {
  accept?: string;
  onTextLoaded: (text: string, filename?: string) => void;
  onError?: (message: string) => void;
};

export function FileDropzone({
  accept = ".csv,text/csv",
  onTextLoaded,
  onError,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  async function readFile(file: File) {
    try {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        throw new Error("Please upload a .csv file.");
      }
      const text = await file.text();
      onTextLoaded(text, file.name);
    } catch (e: any) {
      onError?.(e?.message ?? "Failed to read file");
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void readFile(file);
          // allow re-uploading same file
          if (inputRef.current) inputRef.current.value = "";
        }}
      />

      <div
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void readFile(file);
        }}
        className={[
          "rounded-xl border border-dashed p-6 transition",
          "bg-neutral-50",
          isDragging ? "border-neutral-900" : "border-neutral-300",
        ].join(" ")}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm font-medium text-neutral-900">
              Drag & drop a CSV here
            </div>
            <div className="mt-1 text-xs text-neutral-600">
              Expected columns: <span className="font-mono">date,sales</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-white"
          >
            Browse files
          </button>
        </div>
      </div>
    </div>
  );
}
