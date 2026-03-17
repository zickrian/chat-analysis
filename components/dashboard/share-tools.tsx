"use client";

import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { AnalysisResult } from "@/lib/types";

type Props = {
  report: AnalysisResult;
};

export function ShareTools({ report }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  async function exportImage() {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { backgroundColor: "#ffffff", scale: 2 });
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "chat-wrapped-card.png";
    link.click();
  }

  async function exportPdf() {
    if (!cardRef.current) return;
    const canvas = await html2canvas(cardRef.current, { backgroundColor: "#ffffff", scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width, canvas.height] });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("chat-wrapped-report.pdf");
  }

  return (
    <div className="space-y-4">
      <div ref={cardRef} className="rounded-2xl border border-neutral-200 bg-white p-8">
        <p className="text-sm uppercase tracking-[0.14em] text-neutral-500">My Chat Wrapped</p>
        <h3 className="mt-2 text-4xl text-neutral-900">{report.meta.fileName}</h3>
        <div className="mt-8 grid grid-cols-1 gap-4 text-neutral-700 sm:grid-cols-2">
          <p>Messages: {report.wrapped.messagesSent.toLocaleString()}</p>
          <p>Peak Hour: {report.wrapped.peakHourLabel}</p>
          <p>Top Topic: {report.wrapped.topTopics[0] ?? "General"}</p>
          <p>Favorite Emoji: {report.wrapped.favoriteEmoji}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={exportImage} className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white">
          Download Image
        </button>
        <button type="button" onClick={exportPdf} className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700">
          Download PDF
        </button>
      </div>
    </div>
  );
}
