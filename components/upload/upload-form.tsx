"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, ArrowUpRight, FileText } from "lucide-react";

type Phase = "idle" | "uploading" | "parsing" | "stats" | "ai" | "report" | "done";

const PHASES = [
  { id: "parsing", label: "Parsing local structure" },
  { id: "stats", label: "Computing chronological data" },
  { id: "ai", label: "Synthesizing AI narratives", ai: true },
  { id: "report", label: "Curating final index" },
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

  // Auto-advance phases while uploading to simulate progress
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (phase === "parsing") {
      timeout = setTimeout(() => setPhase("stats"), 800);
    } else if (phase === "stats") {
      timeout = setTimeout(() => setPhase("ai"), 1200);
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
        throw new Error(data.error ?? "Failed to process archive");
      }

      setPhase("report");
      await new Promise((r) => setTimeout(r, 800));
      setPhase("done");
      await new Promise((r) => setTimeout(r, 600));

      router.push(`/dashboard/${data.reportId}/overview`);
    } catch (err) {
      setPhase("idle");
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  }

  return (
    <div className="space-y-8 font-sans relative z-10">
      {/* Upload Dropzone */}
      <label 
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center transition-all duration-300 ${
          file 
            ? 'border-[var(--color-accent)] bg-[var(--color-accent-soft)]' 
            : 'border-[var(--color-border-strong)] bg-[var(--color-bg-base)] hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-soft)]'
        }`}
      >
        <div className={`mb-4 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          file ? 'bg-[var(--color-accent)] text-[var(--color-surface-strong)]' : 'bg-[var(--color-surface-strong)] text-[var(--color-text-main)] border border-[var(--color-border)]'
        }`}>
          {file ? <FileText className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
        </div>
        
        <p className="font-display text-2xl text-[var(--color-text-main)] mb-2">
          {file ? 'Archive Selected' : 'Select Archive'}
        </p>
        <p className="text-sm text-[var(--color-text-soft)] font-medium max-w-xs mx-auto">
          {file 
            ? file.name 
            : 'Drag and drop your exported .txt or .zip file here, or click to browse.'}
        </p>
        
        <input
          type="file"
          accept=".txt,.zip"
          className="hidden"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
      </label>

      {/* Action Button */}
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={!file || phase !== "idle"}
        className="w-full flex items-center justify-center gap-3 py-4 rounded-full bg-[var(--color-text-main)] text-[var(--color-bg-base)] font-sans text-sm font-bold uppercase tracking-[0.1em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--color-accent)] hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(77,106,55,0.2)]"
      >
        {phase === "idle" ? (
          "Commence Analysis"
        ) : (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {phase === "done" ? "Redirecting..." : "Processing"}
          </>
        )}
      </button>

      {/* Progress Tracker */}
      {phase !== "idle" && (
        <div className="pt-4 space-y-4">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-text-main)] mb-6 border-b border-[var(--color-border)] pb-4">
            Analysis Progress
          </p>
          <div className="space-y-1">
            {PHASES.map((item, index) => {
              const isPast = index < currentStepIndex || phase === "done";
              const isCurrent = index === currentStepIndex && phase !== "done";

              return (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-3 rounded-xl transition-all duration-500 ${
                    isCurrent ? 'bg-[var(--color-surface-soft)] border border-[var(--color-border)]' : 'bg-transparent border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`font-mono text-xs w-6 opacity-40 ${
                      isCurrent || isPast ? 'text-[var(--color-text-main)]' : 'text-[var(--color-text-soft)]'
                    }`}>
                      0{index + 1}
                    </span>
                    <span className={`font-medium text-sm transition-colors ${
                      isCurrent ? 'text-[var(--color-text-main)]' : 
                      isPast ? 'text-[var(--color-text-soft)]' : 
                      'text-[var(--color-text-soft)] opacity-40'
                    }`}>
                      {item.label}
                    </span>
                    {item.ai && (
                      <span className="px-2 py-0.5 rounded-full bg-[var(--color-text-main)] text-[var(--color-bg-base)] text-[10px] font-bold tracking-wider uppercase ml-2">
                        AI
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    {isPast ? (
                      <Check className="h-4 w-4 text-[var(--color-accent)]" />
                    ) : isCurrent ? (
                      <Loader2 className="h-4 w-4 animate-spin text-[var(--color-text-main)]" />
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-text-soft)] opacity-20" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-800 text-sm font-medium flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          {error}
        </div>
      )}
    </div>
  );
}
