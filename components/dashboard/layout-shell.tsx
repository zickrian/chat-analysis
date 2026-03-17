import { ReactNode } from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { AnalysisResult } from "@/lib/types";

type Props = {
  reportId: string;
  report: AnalysisResult;
  children: ReactNode;
};

export function DashboardLayoutShell({ reportId, report, children }: Props) {
  return (
    <div className="soft-grid-bg min-h-screen text-[var(--color-text-main)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface-strong)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-soft)] font-mono">Private analysis</p>
            <h1 className="text-2xl font-display mt-1">{report.meta.fileName}</h1>
          </div>
          <Link href="/upload" className="button-secondary text-xs !min-h-0 !py-2 !px-4">
            Analyze another file
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:gap-8 lg:px-8">
        <DashboardSidebar reportId={reportId} />
        <section className="w-full space-y-5">{children}</section>
      </main>
    </div>
  );
}
