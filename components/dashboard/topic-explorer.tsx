"use client";

import { useMemo, useState } from "react";
import { AnalysisResult } from "@/lib/types";

type Props = {
  report: AnalysisResult;
};

export function TopicExplorer({ report }: Props) {
  const [keyword, setKeyword] = useState("");
  const [topic, setTopic] = useState("all");
  const [day, setDay] = useState("");

  const topics = useMemo(() => Array.from(new Set(report.messageSamples.map((item) => item.topic))), [report.messageSamples]);

  const filtered = useMemo(() => {
    return report.messageSamples.filter((item) => {
      const matchKeyword = keyword
        ? item.message.toLowerCase().includes(keyword.toLowerCase()) || item.sender.toLowerCase().includes(keyword.toLowerCase())
        : true;
      const matchTopic = topic === "all" ? true : item.topic === topic;
      const matchDay = day ? item.timestamp.startsWith(day) : true;
      return matchKeyword && matchTopic && matchDay;
    });
  }, [report.messageSamples, keyword, topic, day]);

  return (
    <div className="space-y-6 font-sans">
      <div className="grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 md:grid-cols-3">
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Search keyword"
          className="rounded-xl border border-[var(--color-border-strong)] bg-transparent px-4 py-2 text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none transition-colors"
        />

        <select
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          className="rounded-xl border border-[var(--color-border-strong)] bg-transparent px-4 py-2 text-sm text-[var(--color-text-main)] focus:border-[var(--color-accent)] focus:outline-none transition-colors"
        >
          <option value="all">All topics</option>
          {topics.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={day}
          onChange={(event) => setDay(event.target.value)}
          className="rounded-xl border border-[var(--color-border-strong)] bg-transparent px-4 py-2 text-sm text-[var(--color-text-main)] focus:border-[var(--color-accent)] focus:outline-none transition-colors"
        />
      </div>

      <div className="space-y-3">
        {filtered.slice(0, 16).map((item, index) => (
          <div key={`${item.timestamp}-${index}`} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3">
            <p className="text-xs uppercase tracking-widest text-[var(--color-text-soft)] font-mono mb-1">{item.topic} - {item.sender} - {new Date(item.timestamp).toLocaleDateString()}</p>
            <p className="text-[var(--color-text-main)] font-medium leading-relaxed">{item.message}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-8 text-center text-sm font-medium text-[var(--color-text-muted)]">No messages found for your search.</div>
        )}
      </div>
    </div>
  );
}
