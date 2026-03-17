import { AnalysisResult, ParsedMessage } from "@/lib/types";

type CerebrasChoice = {
  message?: {
    content?: string;
  };
};

type CerebrasResponse = {
  choices?: CerebrasChoice[];
};

function chunkArray<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

async function askCerebras(prompt: string, options?: { json?: boolean }) {
  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) return null;

  const model = process.env.CEREBRAS_MODEL ?? "llama3.3-70b";
  const payload: Record<string, unknown> = {
    model,
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content:
          "You are an expert conversational analyst acting as a magazine editor. Provide insights in Indonesian language (Bahasa Indonesia).",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  };

  if (options?.json) {
    payload.response_format = { type: "json_object" };
  }

  const res = await fetch("https://api.cerebras.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as CerebrasResponse;
  return data.choices?.[0]?.message?.content ?? null;
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function getTargetSampleSize(totalMessages: number) {
  if (totalMessages <= 3000) return 700;
  if (totalMessages <= 20000) return 1000;
  if (totalMessages <= 100000) return 1300;
  return 1600;
}

function makeRng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function getInsightScore(message: ParsedMessage) {
  const text = message.message.trim();
  const lower = text.toLowerCase();
  let score = 0;

  if (message.wordCount >= 8) score += 2;
  if (message.wordCount >= 20) score += 2;
  if (message.wordCount >= 40) score += 2;
  if (message.containsQuestion) score += 2;
  if (message.containsLink) score += 2;
  if (message.messageType === "media") score += 2;
  if (message.replyTimeSec !== null && message.replyTimeSec >= 6 * 3600) score += 4;
  else if (message.replyTimeSec !== null && message.replyTimeSec >= 3600) score += 2;

  if (/(plan|deal|decide|deadline|jadwal|setuju|kesimpulan|maaf|sorry|kangen|sayang|marah|berantem|anniversary|ultah|resign|nikah|putus)/i.test(lower)) {
    score += 4;
  }

  if (/[!]{2,}/.test(text)) score += 1;
  if (message.wordCount <= 2 && !message.containsLink && !message.containsQuestion) score -= 3;
  if (text.length <= 8) score -= 2;

  return score;
}

function topEntriesFromMap(map: Map<string, number>, limit: number) {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }));
}

function extractKeywords(messages: ParsedMessage[], limit = 12) {
  const counter = new Map<string, number>();
  for (const message of messages) {
    const words = message.message
      .toLowerCase()
      .replace(/https?:\/\/[^\s]+/g, " ")
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .split(/\s+/)
      .filter((word) => word.length >= 4 && word.length <= 24);
    for (const word of words) {
      counter.set(word, (counter.get(word) ?? 0) + 1);
    }
  }

  return topEntriesFromMap(counter, limit).map((item) => item.label);
}

function buildChunkInsight(chunk: ParsedMessage[]) {
  const senderCounter = new Map<string, number>();
  const highlights = chunk
    .map((message) => ({ message, score: getInsightScore(message) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((item) => ({
      timestamp: item.message.timestamp,
      sender: item.message.sender,
      text: item.message.message.slice(0, 180),
    }));

  let questionCount = 0;
  let linkCount = 0;
  let mediaCount = 0;
  let longPauseCount = 0;

  for (const message of chunk) {
    senderCounter.set(message.sender, (senderCounter.get(message.sender) ?? 0) + 1);
    if (message.containsQuestion) questionCount += 1;
    if (message.containsLink) linkCount += 1;
    if (message.messageType === "media") mediaCount += 1;
    if (message.replyTimeSec !== null && message.replyTimeSec >= 3600) longPauseCount += 1;
  }

  return {
    windowStart: chunk[0]?.timestamp ?? null,
    windowEnd: chunk[chunk.length - 1]?.timestamp ?? null,
    messageCount: chunk.length,
    activeSenders: topEntriesFromMap(senderCounter, 4),
    questionCount,
    linkCount,
    mediaCount,
    longPauseCount,
    keywords: extractKeywords(chunk, 10),
    highlights,
  };
}

function pickRepresentativeMessages(messages: ParsedMessage[]) {
  const total = messages.length;
  const target = getTargetSampleSize(total);
  if (total <= target) return messages;

  const selected = new Set<number>();
  const startAnchor = Math.min(30, Math.floor(target * 0.08));
  const endAnchor = Math.min(30, Math.floor(target * 0.08));

  for (let i = 0; i < startAnchor; i++) selected.add(i);
  for (let i = Math.max(0, total - endAnchor); i < total; i++) selected.add(i);

  const segmentCount = Math.min(20, Math.max(10, Math.floor(Math.sqrt(total / 3000)) + 12));
  const budgetAfterAnchors = Math.max(target - selected.size, 0);
  const topPerSegment = Math.max(8, Math.floor(budgetAfterAnchors / segmentCount / 2));
  const randomPerSegment = Math.max(4, Math.floor(budgetAfterAnchors / segmentCount / 4));

  for (let segment = 0; segment < segmentCount; segment++) {
    const start = Math.floor((segment * total) / segmentCount);
    const end = Math.max(start + 1, Math.floor(((segment + 1) * total) / segmentCount));
    const indices = Array.from({ length: end - start }, (_, i) => start + i);
    const scored = indices
      .map((idx) => ({ idx, score: getInsightScore(messages[idx]) }))
      .sort((a, b) => b.score - a.score);

    for (let i = 0; i < Math.min(topPerSegment, scored.length); i++) {
      selected.add(scored[i].idx);
    }

    const remaining = scored.slice(topPerSegment).map((item) => item.idx);
    const rng = makeRng(total + segment * 7919);
    for (let i = 0; i < Math.min(randomPerSegment, remaining.length); i++) {
      const pick = Math.floor(rng() * remaining.length);
      selected.add(remaining[pick]);
      remaining.splice(pick, 1);
    }
  }

  const selectedIndices = Array.from(selected).sort((a, b) => a - b);
  if (selectedIndices.length <= target) {
    return selectedIndices.map((idx) => messages[idx]);
  }

  const timelineBalanced: ParsedMessage[] = [];
  const step = selectedIndices.length / target;
  for (let i = 0; i < target; i++) {
    const idx = selectedIndices[Math.floor(i * step)];
    timelineBalanced.push(messages[idx]);
  }

  return timelineBalanced;
}

async function summarizeMessageChunks(messages: ParsedMessage[], originalTotal: number) {
  const summaries: string[] = [];
  const chunks = chunkArray(messages, 150);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const insight = buildChunkInsight(chunk);
    const prompt = `Kamu menganalisis chat besar (${originalTotal} pesan total). Ini bagian ${i + 1}/${chunks.length}. Data di bawah adalah insight lokal terstruktur (bukan raw chat penuh). Ringkas dalam 5 bullet: topik utama, dinamika interaksi, tone emosi, momen penting, dan keputusan.\n\n${JSON.stringify(insight)}`;
    const summary = await askCerebras(prompt);
    if (summary) {
      summaries.push(summary);
    }
  }

  return summaries;
}

async function reduceSummariesHierarchically(summaries: string[]) {
  let level = summaries;

  while (level.length > 8) {
    const grouped = chunkArray(level, 8);
    const nextLevel: string[] = [];

    for (const batch of grouped) {
      const prompt = `Gabungkan beberapa ringkasan chat berikut menjadi 1 ringkasan padat dalam Bahasa Indonesia. Wajib mencakup: perubahan fase percakapan, dinamika hubungan, momen penting, dan tema berulang.\n\n${batch
        .map((item, idx) => `Ringkasan ${idx + 1}:\n${item}`)
        .join("\n\n")}`;
      const reduced = await askCerebras(prompt);
      nextLevel.push(reduced ?? batch.join("\n"));
    }

    level = nextLevel;
  }

  return level;
}

export async function enrichWithAi(messages: ParsedMessage[], base: AnalysisResult): Promise<AnalysisResult> {
  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey || messages.length < 20) {
    return base;
  }

  const representativeMessages = pickRepresentativeMessages(messages);
  const firstLevelSummaries = await summarizeMessageChunks(representativeMessages, messages.length);
  const chunkSummaries = await reduceSummariesHierarchically(firstLevelSummaries);

  if (!chunkSummaries.length) {
    return base;
  }

  const finalPrompt = `Analyze these representative timeline summaries and output strict JSON with keys (ALL VALUES MUST BE IN INDONESIAN / BAHASA INDONESIA):
conversationSummary (string, ringkasan percakapan),
relationshipDynamic (string, dinamika hubungan),
communicationStyle (string, gaya komunikasi),
overallTone (string, nada emosional secara keseluruhan),
importantMomentsNarrative (array of strings max 5, momen penting),
sentimentTimeline (array of objects with 'period', 'sentiment', and 'description' keys, max 4 items representing phases of chat. Gunakan bahasa Indonesia untuk semua value),
theFirstEncounter (string, narrative of how they first started based on first chunk, bahasa indonesia),
theVibe (string, a single sentence describing the overall relationship persona or aesthetic, e.g. "Sahabat kacau yang berkomunikasi sepenuhnya melalui sarkasme dan keluh kesah larut malam."),
theErasTour (array of objects with 'era' and 'description' keys, max 3 items representing distinct chapters of their relationship based on the chat. Gunakan bahasa Indonesia).

Important: summarize as a coherent chronology from early phase to latest phase, since summaries are selected across the full timeline.

Summaries:
${chunkSummaries.map((item, idx) => `Chunk ${idx + 1}: ${item}`).join("\n\n")}`;

  type AiPayload = {
    conversationSummary: string;
    relationshipDynamic: string;
    communicationStyle: string;
    overallTone: string;
    importantMomentsNarrative: string[];
    sentimentTimeline?: { period: string; sentiment: string; description: string }[];
    theFirstEncounter?: string;
    theVibe?: string;
    theErasTour?: { era: string; description: string }[];
  };

  const final = safeJsonParse<AiPayload>(await askCerebras(finalPrompt, { json: true }));
  if (!final) {
    return base;
  }

  return {
    ...base,
    ai: {
      conversationSummary: final.conversationSummary || base.ai.conversationSummary,
      relationshipDynamic: final.relationshipDynamic || base.ai.relationshipDynamic,
      communicationStyle: final.communicationStyle || base.ai.communicationStyle,
      overallTone: final.overallTone || base.ai.overallTone,
      importantMomentsNarrative: final.importantMomentsNarrative?.length
        ? final.importantMomentsNarrative
        : base.ai.importantMomentsNarrative,
      sentimentTimeline: final.sentimentTimeline?.length ? final.sentimentTimeline : base.ai.sentimentTimeline,
      theFirstEncounter: final.theFirstEncounter || base.ai.theFirstEncounter,
      theVibe: final.theVibe || base.ai.theVibe,
      theErasTour: final.theErasTour?.length ? final.theErasTour : base.ai.theErasTour,
    },
  };
}
