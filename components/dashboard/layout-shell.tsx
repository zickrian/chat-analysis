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
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Private analysis</p>
            <h1 className="text-xl">{report.meta.fileName}</h1>
          </div>
          <Link href="/upload" className="rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
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
