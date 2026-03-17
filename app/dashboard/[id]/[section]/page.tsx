import { notFound } from "next/navigation";
import { DashboardLayoutShell } from "@/components/dashboard/layout-shell";
import { renderSection } from "@/components/dashboard/sections";
import { readReportOr404 } from "@/lib/report";

type PageProps = {
  params: Promise<{
    id: string;
    section: string;
  }>;
};

const ALLOWED = new Set(["overview", "activity", "users", "content", "topics", "insights", "wrapped", "ai", "share"]);

export default async function DashboardSectionPage({ params }: PageProps) {
  const { id, section } = await params;
  if (!ALLOWED.has(section)) {
    notFound();
  }

  const report = readReportOr404(id);

  return <DashboardLayoutShell reportId={id} report={report}>{renderSection(section, report, id)}</DashboardLayoutShell>;
}
