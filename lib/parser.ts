import JSZip from "jszip";
import { ParsedMessage } from "@/lib/types";

const WA_LINE_REGEX =
  /^(?:\[)?(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})[, ]\s?(\d{1,2}[:.]\d{2}(?:[:.]\d{2})?)(?:\s?(AM|PM|am|pm))?(?:\])?\s?(?:- )?\s?([^:]+):\s([\s\S]*)$/;

const MEDIA_MARKERS = ["<Media omitted>", "media omitted", "image omitted", "video omitted", "sticker omitted"];

function parseDateTime(datePart: string, timePart: string, ampm?: string) {
  const separator = datePart.includes("/") ? "/" : datePart.includes("-") ? "-" : ".";
  const [d, m, yRaw] = datePart.split(separator).map((item) => item.trim());
  const year = yRaw.length === 2 ? Number(`20${yRaw}`) : Number(yRaw);
  const [rawHour, minute] = timePart.split(/[:.]/).map(Number);
  let hour = rawHour;

  if (ampm) {
    const upper = ampm.toUpperCase();
    if (upper === "PM" && hour < 12) hour += 12;
    if (upper === "AM" && hour === 12) hour = 0;
  }

  const date = new Date(year, Number(m) - 1, Number(d), hour, minute, 0, 0);
  return date;
}

function detectMessageType(message: string) {
  const lower = message.toLowerCase();
  const linkMatches = message.match(/https?:\/\/[^\s]+/g) ?? [];

  if (MEDIA_MARKERS.some((marker) => lower.includes(marker.toLowerCase()))) {
    return { messageType: "media" as const, linkCount: linkMatches.length, mediaType: "omitted" };
  }

  if (linkMatches.length > 0) {
    return { messageType: "link" as const, linkCount: linkMatches.length, mediaType: null };
  }

  return { messageType: "text" as const, linkCount: 0, mediaType: null };
}

function emojiCount(text: string) {
  const matches = text.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu);
  return matches?.length ?? 0;
}

export async function extractChatText(file: File) {
  if (file.name.endsWith(".txt")) {
    return file.text();
  }

  if (file.name.endsWith(".zip")) {
    const zipBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(zipBuffer);
    const txtFile = Object.values(zip.files).find((entry) => {
      const isTxt = entry.name.toLowerCase().endsWith(".txt");
      const isMacOsx = entry.name.includes("__MACOSX") || entry.name.split("/").pop()?.startsWith("._");
      return isTxt && !isMacOsx;
    });
    if (!txtFile) {
      throw new Error("ZIP tidak berisi file .txt chat export.");
    }
    return txtFile.async("text");
  }

  throw new Error("Format file tidak didukung. Gunakan .txt atau .zip");
}

export function parseWhatsappText(text: string): ParsedMessage[] {
  const rawLines = text.split(/\r?\n/);
  const mergedLines: string[] = [];

  for (const line of rawLines) {
    if (!line.trim()) continue;
    if (WA_LINE_REGEX.test(line)) {
      mergedLines.push(line);
      continue;
    }

    if (mergedLines.length > 0) {
      mergedLines[mergedLines.length - 1] += `\n${line}`;
    }
  }

  const messages: ParsedMessage[] = [];
  let conversationCounter = 1;
  let previousDate: Date | null = null;

  for (const line of mergedLines) {
    const match = line.match(WA_LINE_REGEX);
    if (!match) continue;

    const [, datePart, timePart, ampm, sender, message] = match;
    const parsedDate = parseDateTime(datePart, timePart, ampm);
    if (Number.isNaN(parsedDate.getTime())) continue;

    if (previousDate) {
      const gapMs = parsedDate.getTime() - previousDate.getTime();
      if (gapMs > 1000 * 60 * 30) {
        conversationCounter += 1;
      }
    }

    const words = message.trim().split(/\s+/).filter(Boolean);
    const emCount = emojiCount(message);
    const typeInfo = detectMessageType(message);
    const replyTimeSec = previousDate
      ? Math.max(0, Math.floor((parsedDate.getTime() - previousDate.getTime()) / 1000))
      : null;

    messages.push({
      id: `${conversationCounter}-${messages.length + 1}`,
      timestamp: parsedDate.toISOString(),
      sender: sender.trim(),
      message,
      messageType: typeInfo.messageType,
      wordCount: words.length,
      emojiCount: emCount,
      linkCount: typeInfo.linkCount,
      mediaType: typeInfo.mediaType,
      conversationId: `conv-${conversationCounter}`,
      replyTimeSec,
      containsQuestion: message.includes("?"),
      containsLink: typeInfo.linkCount > 0,
      containsEmoji: emCount > 0,
    });

    previousDate = parsedDate;
  }

  return messages;
}
