import { notFound } from "next/navigation";
import { getAnalysis } from "@/lib/storage";

export function readReportOr404(reportId: string) {
  const report = getAnalysis(reportId);
  if (!report) notFound();
  return report;
}
