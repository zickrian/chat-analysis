import { NextResponse } from "next/server";
import { computeAnalytics } from "@/lib/analytics";
import { enrichWithAi } from "@/lib/ai";
import { extractChatText, parseWhatsappText } from "@/lib/parser";
import { saveAnalysis } from "@/lib/storage";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    if (!file.name.endsWith(".txt") && !file.name.endsWith(".zip")) {
      return NextResponse.json({ error: "Gunakan file .txt atau .zip" }, { status: 400 });
    }

    const text = await extractChatText(file);
    const messages = parseWhatsappText(text);

    if (!messages.length) {
      return NextResponse.json({ error: "Tidak ada pesan yang valid dari file chat" }, { status: 400 });
    }

    const base = computeAnalytics(messages, file.name);
    const enriched = await enrichWithAi(messages, base);

    const reportId = saveAnalysis(enriched);

    return NextResponse.json({ reportId });
  } catch (error) {
    console.error("[/api/analyze] Error:", error);
    const message = error instanceof Error ? error.message : "Terjadi error saat analisis";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
