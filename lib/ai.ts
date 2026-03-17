import { AnalysisResult, ParsedMessage } from "@/lib/types";

type CerebrasChoice = {
  message?: {
    content?: string;
  };
};

type CerebrasResponse = {
  choices?: CerebrasChoice[];
};

function chunkMessages(messages: ParsedMessage[], size = 150) {
  const chunks: ParsedMessage[][] = [];
  for (let i = 0; i < messages.length; i += size) {
    chunks.push(messages.slice(i, i + size));
  }
  return chunks;
}

async function askCerebras(prompt: string) {
  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey) return null;

  const model = process.env.CEREBRAS_MODEL ?? "llama3.1-8b";
  const res = await fetch("https://api.cerebras.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You are an analyst for private messaging conversations. Respond with concise JSON only when asked.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
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

export async function enrichWithAi(messages: ParsedMessage[], base: AnalysisResult): Promise<AnalysisResult> {
  const apiKey = process.env.CEREBRAS_API_KEY;
  if (!apiKey || messages.length < 20) {
    return base;
  }

  const chunks = chunkMessages(messages, 150);
  const chunkSummaries: string[] = [];

  for (const chunk of chunks.slice(0, 10)) {
    const compact = chunk.map((m) => `${m.timestamp} | ${m.sender}: ${m.message.slice(0, 200)}`).join("\n");
    const prompt = `Summarize this chat chunk in 5 bullets: main topics, interaction style, emotional tone, notable events, and decisions.\n\n${compact}`;
    const summary = await askCerebras(prompt);
    if (summary) chunkSummaries.push(summary);
  }

  if (!chunkSummaries.length) {
    return base;
  }

  const finalPrompt = `Analyze these chunk summaries and output strict JSON with keys:
conversationSummary (string),
relationshipDynamic (string),
communicationStyle (string),
overallTone (string),
importantMomentsNarrative (array of strings max 5),
sentimentTimeline (array of objects with 'period' and 'sentiment' keys, max 4 items representing phases of chat),
theFirstEncounter (string, narrative of how they first started based on first chunk).

Summaries:
${chunkSummaries.map((item, idx) => `Chunk ${idx + 1}: ${item}`).join("\n\n")}`;

  type AiPayload = {
    conversationSummary: string;
    relationshipDynamic: string;
    communicationStyle: string;
    overallTone: string;
    importantMomentsNarrative: string[];
    sentimentTimeline?: { period: string; sentiment: string }[];
    theFirstEncounter?: string;
  };

  const final = safeJsonParse<AiPayload>(await askCerebras(finalPrompt));
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
    },
  };
}
