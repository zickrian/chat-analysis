"use client";

import { useMemo, useState } from "react";
import { AnalysisResult } from "@/lib/types";

type Props = {
  report: AnalysisResult;
};

export function WrappedSlides({ report }: Props) {
  const slides = useMemo(
    () => [
      { title: "Your Chat Wrapped", body: `Generated from ${report.meta.fileName}` },
      { title: `You sent ${report.wrapped.messagesSent.toLocaleString()} messages`, body: "A full breakdown is ready on your dashboard." },
      { title: `Most active chatter: ${report.totals.mostActiveUser}`, body: `Conversations: ${report.totals.totalConversations}` },
      { title: `Peak chat hour: ${report.wrapped.peakHourLabel}`, body: `Most active day: ${report.totals.mostActiveDay}` },
      { title: "Top discussion topics", body: report.wrapped.topTopics.join(" • ") || "General" },
      { title: `Favorite emoji: ${report.wrapped.favoriteEmoji}`, body: `Fastest reply: ${report.wrapped.fastestReplyLabel}` },
      { title: "AI Summary", body: report.ai.conversationSummary },
    ],
    [report],
  );

  const [index, setIndex] = useState(0);
  const active = slides[index];

  return (
    <div className="space-y-4">
      <div className="fade-in flex min-h-[360px] flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-8">
        <div>
          <p className="text-sm text-neutral-500">Slide {index + 1} / {slides.length}</p>
          <h3 className="mt-3 text-3xl text-neutral-900">{active.title}</h3>
        </div>
        <p className="max-w-xl text-lg text-neutral-700">{active.body}</p>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
          disabled={index === 0}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => setIndex((prev) => Math.min(slides.length - 1, prev + 1))}
          disabled={index === slides.length - 1}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
