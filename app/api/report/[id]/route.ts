import { NextResponse } from "next/server";
import { getAnalysis } from "@/lib/storage";

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(_: Request, context: Params) {
  const { id } = await context.params;
  const report = getAnalysis(id);

  if (!report) {
    return NextResponse.json({ error: "Report tidak ditemukan atau sudah expired" }, { status: 404 });
  }

  return NextResponse.json(report);
}
