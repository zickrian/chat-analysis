"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, CheckCircle2 } from "lucide-react";

type Phase = "idle" | "uploading" | "parsing" | "stats" | "ai" | "report" | "done";

const PHASES = [
  { id: "parsing", label: "Parsing messages" },
  { id: "stats", label: "Computing statistics" },
  { id: "ai", label: "Analyzing patterns with AI", ai: true },
  { id: "report", label: "Generating final report" },
];

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const getPhaseIndex = (p: Phase) => {
    if (p === "idle" || p === "uploading") return -1;
    if (p === "done") return PHASES.length;
    return PHASES.findIndex((item) => item.id === p);
  };

  const currentStepIndex = getPhaseIndex(phase);

  // Auto-advance phases while uploading to simulate progress before the AI actually finishes
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (phase === "parsing") {
      timeout = setTimeout(() => setPhase("stats"), 600);
    } else if (phase === "stats") {
      timeout = setTimeout(() => setPhase("ai"), 800);
    }

    return () => clearTimeout(timeout);
  }, [phase]);

  async function handleAnalyze() {
    if (!file) return;

    setError(null);
    setPhase("uploading");

    try {
      setPhase("parsing");
      const formData = new FormData();
      formData.set("file", file);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as { reportId?: string; error?: string };
      
      if (!response.ok || !data.reportId) {
        throw new Error(data.error ?? "Gagal memproses chat");
      }

      // Force the final steps to show completion before redirecting
      setPhase("report");
      await new Promise((r) => setTimeout(r, 600));
      setPhase("done");
      await new Promise((r) => setTimeout(r, 500));

      router.push(`/dashboard/${data.reportId}/overview`);
    } catch (err) {
      setPhase("idle");
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    }
  }

  return (
    <div className="space-y-6">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-10 text-center transition hover:border-neutral-500">
        <Upload className="mb-3 h-6 w-6 text-neutral-600" />
        <p className="font-medium text-neutral-900">Drag & drop chat export</p>
        <p className="mt-1 text-sm text-neutral-600">atau klik untuk pilih file (.txt / .zip)</p>
        <input
          type="file"
          accept=".txt,.zip"
          className="hidden"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      </label>

      {file ? (
        <div className="rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-700">File: {file.name}</div>
      ) : null}

      <button
        type="button"
        onClick={handleAnalyze}
        disabled={!file || phase !== "idle"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300"
      >
        {phase === "idle" ? "Analyze Conversation" : <Loader2 className="h-4 w-4 animate-spin" />} 
        {phase === "idle" ? null : phase === "done" ? "Redirecting to Dashboard..." : "Processing"}
      </button>

      {phase !== "idle" ? (
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="text-sm font-medium text-neutral-900 mb-3">Processing steps</p>
          <div className="space-y-3 text-sm">
            {PHASES.map((item, index) => {
              const isPast = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 transition-all duration-500 ${
                    isCurrent ? 'bg-blue-50 border border-blue-100' : 
                    isPast ? 'bg-neutral-50 border border-transparent' : 
                    'bg-transparent opacity-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {item.ai && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600">
                        AI
                      </span>
                    )}
                    <span className={`font-medium ${
                      isCurrent ? 'text-blue-700' : 
                      isPast ? 'text-neutral-700' : 
                      'text-neutral-500'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    {isPast ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : isCurrent ? (
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-neutral-300" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-600 font-medium p-3 bg-red-50 rounded-lg border border-red-100">{error}</p> : null}
    </div>
  );
}