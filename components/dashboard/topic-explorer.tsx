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
    <div className="space-y-4">
      <div className="grid gap-3 rounded-xl border border-neutral-200 bg-white p-4 md:grid-cols-3">
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Search keyword"
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />

        <select
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
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
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        {filtered.slice(0, 16).map((item, index) => (
          <div key={`${item.timestamp}-${index}`} className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
            <p className="text-xs text-neutral-500">{item.topic} - {item.sender} - {new Date(item.timestamp).toLocaleString()}</p>
            <p className="text-sm text-neutral-800">{item.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
