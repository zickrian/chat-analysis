import dayjs from "dayjs";
import { NEGATIVE_WORDS, POSITIVE_WORDS, STOPWORDS, TOPIC_KEYWORDS } from "@/lib/constants";
import { AnalysisResult, ChatIndexEntry, ConversationSession, ParsedMessage, UserStats, TheGreatSilence, QuoteOfTheYear } from "@/lib/types";
import { average, formatSeconds, hourLabel, topEntries, toIsoDay } from "@/lib/utils";

function getWordList(message: string) {
  return message
    .toLowerCase()
    .replace(/https?:\/\/[^\s]+/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length >= 3 && !STOPWORDS.has(item));
}

function computeSentiment(messages: ParsedMessage[]): ConversationSession["sentiment"] {
  const text = messages.map((msg) => msg.message.toLowerCase()).join(" ");
  const positive = POSITIVE_WORDS.reduce((acc, word) => acc + (text.includes(word) ? 1 : 0), 0);
  const negative = NEGATIVE_WORDS.reduce((acc, word) => acc + (text.includes(word) ? 1 : 0), 0);

  if (positive > negative + 1) return "positive";
  if (negative > positive + 1) return "negative";
  if (positive > 0 && negative === 0) return "supportive";
  return "neutral";
}

function countTopics(messages: ParsedMessage[]) {
  const topicCounter = new Map<string, number>();
  const keywordCounter = new Map<string, number>();
  const fallbackWordCounter = new Map<string, number>();

  for (const message of messages) {
    const text = message.message.toLowerCase();
    let matched = false;

    for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
      let score = 0;
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          score += 1;
          keywordCounter.set(keyword, (keywordCounter.get(keyword) ?? 0) + 1);
        }
      }

      if (score > 0) {
        matched = true;
        topicCounter.set(topic, (topicCounter.get(topic) ?? 0) + score);
      }
    }

    if (!matched) {
      const words = getWordList(text);
      for (const word of words) {
        fallbackWordCounter.set(word, (fallbackWordCounter.get(word) ?? 0) + 1);
      }
    }
  }

  if (topicCounter.size < 5) {
    const dynamicTopics = topEntries(Array.from(fallbackWordCounter.entries()), 6)
      .filter(([, value]) => value >= 4)
      .map(([label, value]) => [`Topik: ${label}`, value] as const);
    for (const [topic, value] of dynamicTopics) {
      topicCounter.set(topic, value);
    }
  }

  return { topicCounter, keywordCounter };
}

function inferTopics(messages: ParsedMessage[]) {
  const { topicCounter, keywordCounter } = countTopics(messages);

  const entries = topEntries(Array.from(topicCounter.entries()), 6);
  return {
    topics: entries.map(([label, value]) => ({ label, value })),
    topicKeywords: topEntries(Array.from(keywordCounter.entries()), 10).map(([label]) => label),
  };
}

function detectPrimaryTopic(message: string) {
  const lower = message.toLowerCase();
  let bestTopic = "General";
  let bestScore = 0;

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }

  if (bestScore === 0) {
    const words = getWordList(lower);
    if (words.length > 0) {
      return `General: ${words[0]}`;
    }
  }

  return bestTopic;
}

function buildTopicEvolution(messages: ParsedMessage[]) {
  if (!messages.length) return [];

  const phases = ["Fase Awal", "Fase Tengah", "Fase Terbaru"];
  const segmentSize = Math.ceil(messages.length / phases.length);

  return phases.map((phase, index) => {
    const start = index * segmentSize;
    const end = Math.min(messages.length, (index + 1) * segmentSize);
    const segment = messages.slice(start, end);
    const { topics } = inferTopics(segment);

    return {
      phase,
      startDate: segment[0]?.timestamp ?? messages[0].timestamp,
      endDate: segment[segment.length - 1]?.timestamp ?? messages[messages.length - 1].timestamp,
      topics: topics.slice(0, 3),
    };
  });
}

function buildMessageSamples(messages: ParsedMessage[], limit = 1200) {
  const nonEmpty = messages.filter((item) => item.message.trim().length > 0);
  if (nonEmpty.length <= limit) {
    return nonEmpty.map((msg) => ({
      timestamp: msg.timestamp,
      sender: msg.sender,
      message: msg.message,
      topic: detectPrimaryTopic(msg.message),
    }));
  }

  const sampled = [];
  const step = nonEmpty.length / limit;
  for (let i = 0; i < limit; i++) {
    sampled.push(nonEmpty[Math.floor(i * step)]);
  }

  return sampled.map((msg) => ({
    timestamp: msg.timestamp,
    sender: msg.sender,
    message: msg.message,
    topic: detectPrimaryTopic(msg.message),
  }));
}

function normalizeSearchText(sender: string, message: string) {
  return `${sender} ${message}`.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
}

function buildChatIndex(messages: ParsedMessage[]) {
  const entries: ChatIndexEntry[] = [];
  for (const message of messages) {
    entries.push({
      id: message.id,
      timestamp: message.timestamp,
      sender: message.sender,
      conversationId: message.conversationId,
      message: message.message,
      searchText: normalizeSearchText(message.sender, message.message),
    });
  }

  return {
    totalMessages: messages.length,
    entries,
  };
}

function computeConversations(messages: ParsedMessage[]) {
  const grouped = new Map<string, ParsedMessage[]>();
  for (const message of messages) {
    if (!grouped.has(message.conversationId)) {
      grouped.set(message.conversationId, []);
    }
    grouped.get(message.conversationId)?.push(message);
  }

  const sessions: ConversationSession[] = [];

  for (const [conversationId, convoMessages] of grouped.entries()) {
    const sorted = convoMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const participants = Array.from(new Set(sorted.map((item) => item.sender)));
    const words = sorted.flatMap((item) => getWordList(item.message));
    const keywordCount = new Map<string, number>();
    for (const word of words) {
      keywordCount.set(word, (keywordCount.get(word) ?? 0) + 1);
    }

    sessions.push({
      conversationId,
      startTime: sorted[0].timestamp,
      endTime: sorted[sorted.length - 1].timestamp,
      messageCount: sorted.length,
      participants,
      topicKeywords: topEntries(Array.from(keywordCount.entries()), 4).map(([label]) => label),
      sentiment: computeSentiment(sorted),
    });
  }

  return sessions.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
}

function topMapEntries(map: Map<string, number>, limit = 10) {
  return topEntries(Array.from(map.entries()), limit).map(([label, value]) => ({ label, value }));
}

function chronologicalMapEntries(map: Map<string, number>) {
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, value]) => ({ label, value }));
}

function extractDomains(message: string) {
  const links = message.match(/https?:\/\/[^\s]+/g) ?? [];
  return links
    .map((link) => {
      try {
        return new URL(link).hostname.replace("www.", "");
      } catch {
        return null;
      }
    })
    .filter((item): item is string => Boolean(item));
}

function computeLongestStreak(dates: string[]) {
  if (dates.length === 0) return 0;
  const sorted = Array.from(new Set(dates)).sort();
  let maxStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = dayjs(sorted[i - 1]);
    const curr = dayjs(sorted[i]);
    const diff = curr.diff(prev, "day");

    if (diff === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (diff > 1) {
      currentStreak = 1;
    }
  }

  return maxStreak;
}

function getMinMax(values: number[]) {
  if (values.length === 0) {
    return { min: 0, max: 0 };
  }

  let min = values[0];
  let max = values[0];

  for (let i = 1; i < values.length; i++) {
    const value = values[i];
    if (value < min) min = value;
    if (value > max) max = value;
  }

  return { min, max };
}

function median(values: number[]) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return Math.round((sorted[middle - 1] + sorted[middle]) / 2);
  }
  return sorted[middle];
}

function buildConflictMoments(messages: ParsedMessage[]) {
  const dayStats = new Map<string, { total: number; negative: number; longPause: number }>();

  for (const message of messages) {
    const day = toIsoDay(new Date(message.timestamp));
    const stat = dayStats.get(day) ?? { total: 0, negative: 0, longPause: 0 };
    stat.total += 1;

    const lower = message.message.toLowerCase();
    const hasNegative = NEGATIVE_WORDS.some((word) => lower.includes(word));
    if (hasNegative) {
      stat.negative += 1;
    }

    if ((message.replyTimeSec ?? 0) >= 6 * 60 * 60) {
      stat.longPause += 1;
    }

    dayStats.set(day, stat);
  }

  return Array.from(dayStats.entries())
    .map(([period, stat]) => {
      const negativityRate = stat.total > 0 ? stat.negative / stat.total : 0;
      const pauseRate = stat.total > 0 ? stat.longPause / stat.total : 0;
      const score = Number((negativityRate * 70 + pauseRate * 30).toFixed(1));
      const reason =
        stat.negative > 0 && stat.longPause > 0
          ? "Banyak kata bernada negatif disertai jeda balas yang panjang."
          : stat.negative > 0
            ? "Terjadi peningkatan pesan bernada negatif."
            : "Respons melambat signifikan pada periode ini.";
      return { period, score, reason };
    })
    .filter((item) => item.score > 5)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

export function computeAnalytics(messages: ParsedMessage[], fileName: string): AnalysisResult {
  const participants = Array.from(new Set(messages.map((item) => item.sender)));
  const conversations = computeConversations(messages);

  const perUser = new Map<string, number>();
  const perDay = new Map<string, number>();
  const perHour = new Map<string, number>();
  const responseByHour = new Map<number, { total: number; count: number }>();
  const wordCounter = new Map<string, number>();
  const emojiCounter = new Map<string, number>();
  const linkCounter = new Map<string, number>();
  const mediaCounter = new Map<string, number>();

  const heatmapMap = new Map<string, number>();

  // User specific maps
  const userWords = new Map<string, Map<string, number>>();
  const userEmojis = new Map<string, Map<string, number>>();
  const userDomains = new Map<string, Map<string, number>>();
  const userMorningScore = new Map<string, number>();
  const userNightOwlScore = new Map<string, number>();
  const userDoubleText = new Map<string, number>();
  const userMediaSent = new Map<string, number>();
  const userLaughCount = new Map<string, number>();
  const userLongestMonologue = new Map<string, number>();
  const userDeadEnds = new Map<string, number>();
  const userInitiatorScore = new Map<string, number>();
  const userCloserScore = new Map<string, number>();

  participants.forEach(p => {
    userWords.set(p, new Map());
    userEmojis.set(p, new Map());
    userDomains.set(p, new Map());
    userMorningScore.set(p, 0);
    userNightOwlScore.set(p, 0);
    userDoubleText.set(p, 0);
    userMediaSent.set(p, 0);
    userLaughCount.set(p, 0);
    userLongestMonologue.set(p, 0);
    userDeadEnds.set(p, 0);
    userInitiatorScore.set(p, 0);
    userCloserScore.set(p, 0);
  });

  const laughRegex = /\b(wkwk|haha|hehe|lol|lmao)\b/gi;

  let previousSender: string | null = null;
  let currentMonologueCount = 0;
  const uniqueDays = new Set<string>();

  const firstMessage = messages.length > 0 ? {
    timestamp: messages[0].timestamp,
    sender: messages[0].sender,
    message: messages[0].message
  } : null;

  let theGreatSilence: TheGreatSilence | null = null;
  let quoteCandidate: ParsedMessage | null = null;
  let maxSilenceMs = 0;

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const sender = message.sender;
    perUser.set(sender, (perUser.get(sender) ?? 0) + 1);

    if (previousSender === sender) {
      userDoubleText.set(sender, (userDoubleText.get(sender) ?? 0) + 1);
      currentMonologueCount++;
      const currentMax = userLongestMonologue.get(sender) ?? 0;
      if (currentMonologueCount > currentMax) {
        userLongestMonologue.set(sender, currentMonologueCount);
      }
    } else {
      currentMonologueCount = 1;
    }
    
    // Check dead end / great silence / initiator / closer
    if (i > 0) {
      const prevMessage = messages[i - 1];
      const diffMs = new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime();
      
      if (diffMs > maxSilenceMs) {
        maxSilenceMs = diffMs;
        theGreatSilence = {
          durationDays: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
          startDate: prevMessage.timestamp,
          endDate: message.timestamp,
          whoBrokeIt: message.sender,
          message: message.message
        };
      }

      // Initiator: starts convo after 8 hours of silence
      if (diffMs > 8 * 60 * 60 * 1000) {
        userInitiatorScore.set(message.sender, (userInitiatorScore.get(message.sender) ?? 0) + 1);
        userCloserScore.set(prevMessage.sender, (userCloserScore.get(prevMessage.sender) ?? 0) + 1);
      }
    }

    if (i < messages.length - 1) {
      const nextMessage = messages[i + 1];
      const diffMs = new Date(nextMessage.timestamp).getTime() - new Date(message.timestamp).getTime();
      if (diffMs > 24 * 60 * 60 * 1000 && nextMessage.sender !== sender) {
        userDeadEnds.set(sender, (userDeadEnds.get(sender) ?? 0) + 1);
      }
    } else {
      userDeadEnds.set(sender, (userDeadEnds.get(sender) ?? 0) + 1);
      userCloserScore.set(sender, (userCloserScore.get(sender) ?? 0) + 1); // Last person to ever send a message is also a closer
    }

    const date = new Date(message.timestamp);
    const dayLabel = toIsoDay(date);
    perDay.set(dayLabel, (perDay.get(dayLabel) ?? 0) + 1);
    uniqueDays.add(dayLabel);

    const hour = date.getHours();
    const hourLbl = hourLabel(hour);
    perHour.set(hourLbl, (perHour.get(hourLbl) ?? 0) + 1);
    if (message.replyTimeSec !== null) {
      const bucket = responseByHour.get(hour) ?? { total: 0, count: 0 };
      bucket.total += message.replyTimeSec;
      bucket.count += 1;
      responseByHour.set(hour, bucket);
    }

    const dayOfWeek = date.getDay(); // 0 (Sun) to 6 (Sat)
    const heatmapKey = `${dayOfWeek}-${hour}`;
    heatmapMap.set(heatmapKey, (heatmapMap.get(heatmapKey) ?? 0) + 1);

    if (hour >= 5 && hour < 9) {
      userMorningScore.set(sender, (userMorningScore.get(sender) ?? 0) + 1);
    } else if (hour >= 0 && hour < 4) {
      userNightOwlScore.set(sender, (userNightOwlScore.get(sender) ?? 0) + 1);
    }

    if (previousSender === sender) {
      userDoubleText.set(sender, (userDoubleText.get(sender) ?? 0) + 1);
    }
    previousSender = sender;

    const words = getWordList(message.message);
    for (const word of words) {
      wordCounter.set(word, (wordCounter.get(word) ?? 0) + 1);
      userWords.get(sender)!.set(word, (userWords.get(sender)!.get(word) ?? 0) + 1);
    }

    // Quote candidate logic (find a long interesting message)
    if (words.length > 15 && words.length < 50 && !message.message.includes("http")) {
      if (!quoteCandidate || words.length > getWordList(quoteCandidate.message).length) {
        if (Math.random() > 0.3) { // some randomness
          quoteCandidate = message;
        }
      }
    }

    const laughs = message.message.match(laughRegex);
    if (laughs) {
      userLaughCount.set(sender, (userLaughCount.get(sender) ?? 0) + laughs.length);
    }

    const emojis = message.message.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu) ?? [];
    for (const emoji of emojis) {
      emojiCounter.set(emoji, (emojiCounter.get(emoji) ?? 0) + 1);
      userEmojis.get(sender)!.set(emoji, (userEmojis.get(sender)!.get(emoji) ?? 0) + 1);
    }

    const domains = extractDomains(message.message);
    for (const domain of domains) {
      linkCounter.set(domain, (linkCounter.get(domain) ?? 0) + 1);
      userDomains.get(sender)!.set(domain, (userDomains.get(sender)!.get(domain) ?? 0) + 1);
    }

    if (message.messageType === "media") {
      const media = message.mediaType ?? "media";
      mediaCounter.set(media, (mediaCounter.get(media) ?? 0) + 1);
      userMediaSent.set(sender, (userMediaSent.get(sender) ?? 0) + 1);
    }
  }

  const activityHeatmap = [];
  for (let d = 0; d < 7; d++) {
    for (let h = 0; h < 24; h++) {
      const key = `${d}-${h}`;
      activityHeatmap.push({
        dayOfWeek: d,
        hour: h,
        value: heatmapMap.get(key) ?? 0
      });
    }
  }

  const longestStreakDays = computeLongestStreak(Array.from(uniqueDays));
  const replies = messages.map((item) => item.replyTimeSec).filter((item): item is number => item !== null);
  const medianReplyTimeSec = median(replies);

  const mostActiveDay = topEntries(Array.from(perDay.entries()), 1)[0]?.[0] ?? "-";
  const peakHourText = topEntries(Array.from(perHour.entries()), 1)[0]?.[0] ?? "00:00";
  const peakHour = Number(peakHourText.split(":")[0] ?? 0);
  const mostActiveUser = topEntries(Array.from(perUser.entries()), 1)[0]?.[0] ?? participants[0] ?? "Unknown";
  const conversationCounts = conversations.map((item) => item.messageCount);
  const conversationMinMax = getMinMax(conversationCounts);
  const longestConversation = conversationMinMax.max;
  const shortestConversation = conversationMinMax.min;
  const repliesMinMax = getMinMax(replies);

  const conversationStarts = new Map<string, number>();
  for (const session of conversations) {
    const first = messages.find((msg) => msg.conversationId === session.conversationId);
    if (first) {
      conversationStarts.set(first.sender, (conversationStarts.get(first.sender) ?? 0) + 1);
    }
  }

  const users: UserStats[] = participants.map((user) => {
    const userMessages = messages.filter((item) => item.sender === user);
    const replySpeedCandidates = userMessages
      .map((item) => item.replyTimeSec)
      .filter((item): item is number => item !== null);
      
    return {
      user,
      messagesSent: userMessages.length,
      avgMessageLength: Number(average(userMessages.map((item) => item.wordCount)).toFixed(1)),
      replySpeedSec: replySpeedCandidates.length ? Math.round(average(replySpeedCandidates)) : null,
      conversationStarts: conversationStarts.get(user) ?? 0,
      emojiUsage: userMessages.reduce((sum, item) => sum + item.emojiCount, 0),
      morningPersonScore: userMorningScore.get(user) ?? 0,
      nightOwlScore: userNightOwlScore.get(user) ?? 0,
      doubleTextCount: userDoubleText.get(user) ?? 0,
      mediaSent: userMediaSent.get(user) ?? 0,
      laughCount: userLaughCount.get(user) ?? 0,
      longestMonologue: userLongestMonologue.get(user) ?? 0,
      deadEnds: userDeadEnds.get(user) ?? 0,
      topWords: topMapEntries(userWords.get(user)!, 5),
      topEmojis: topMapEntries(userEmojis.get(user)!, 5),
      topDomains: topMapEntries(userDomains.get(user)!, 5),
      initiatorScore: userInitiatorScore.get(user) ?? 0,
      closerScore: userCloserScore.get(user) ?? 0,
    };
  });

  const { topics, topicKeywords } = inferTopics(messages);
  const topicEvolution = buildTopicEvolution(messages);
  const conflictMoments = buildConflictMoments(messages);

  const insideJokes = Array.from(wordCounter.entries())
    .filter(([word, count]) => count > 5 && count < 30 && word.length > 5)
    .sort(() => Math.random() - 0.5)
    .map(([word]) => word)
    .slice(0, 3);

  const messageSamples = buildMessageSamples(messages);
  const chatIndex = buildChatIndex(messages);

  const importantMoments = messages
    .filter((msg) => {
      const lower = msg.message.toLowerCase();
      return ["plan", "join", "deal", "decide", "deadline", "jadwal", "setuju", "kesimpulan"].some((term) =>
        lower.includes(term),
      );
    })
    .slice(0, 8)
    .map((msg) => ({
      timestamp: msg.timestamp,
      sender: msg.sender,
      reason: "Momen potensial untuk keputusan atau perencanaan",
      message: msg.message.slice(0, 180),
    }));

  const mostUsedEmoji = topEntries(Array.from(emojiCounter.entries()), 1)[0]?.[0] ?? "-";
  const totalStarts = Array.from(conversationStarts.values()).reduce((sum, val) => sum + val, 0);
  const topUserStarts = conversationStarts.get(mostActiveUser) ?? 0;
  const startRate = totalStarts > 0 ? (topUserStarts / totalStarts) * 100 : 0;

  const responseTimeByHour = Array.from({ length: 24 }, (_, hour) => {
    const bucket = responseByHour.get(hour);
    return {
      label: hourLabel(hour),
      value: bucket && bucket.count > 0 ? Math.round(bucket.total / bucket.count) : 0,
    };
  });

  const tone = (() => {
    const fullText = messages.map((item) => item.message.toLowerCase()).join(" ");
    const positive = POSITIVE_WORDS.filter((word) => fullText.includes(word)).length;
    const negative = NEGATIVE_WORDS.filter((word) => fullText.includes(word)).length;
    if (positive > negative + 2) return "Suportif dan positif";
    if (negative > positive + 2) return "Cenderung tegang dan berfokus pada masalah";
    return "Netral dan praktis";
  })();

  const quoteOfTheYear: QuoteOfTheYear | null = quoteCandidate ? {
    timestamp: quoteCandidate.timestamp,
    sender: quoteCandidate.sender,
    message: quoteCandidate.message,
    context: "Pesan menonjol yang menggambarkan gaya komunikasi kalian."
  } : null;

  return {
    meta: {
      fileName,
      generatedAt: new Date().toISOString(),
      participants,
    },
    totals: {
      totalMessages: messages.length,
      totalConversations: conversations.length,
      averageReplyTimeSec: Math.round(average(replies)),
      medianReplyTimeSec,
      fastestReplySec: repliesMinMax.min,
      slowestReplySec: repliesMinMax.max,
      mostActiveUser,
      mostActiveDay,
      peakChatHour: peakHour,
      longestConversation,
      shortestConversation,
      longestStreakDays,
    },
    activity: {
      messagesPerUser: topMapEntries(perUser, 8),
      messagesPerDay: chronologicalMapEntries(perDay),
      messagesPerHour: topMapEntries(perHour, 24),
      responseTimeByHour,
      activityHeatmap,
    },
    firstMessage,
    quoteOfTheYear,
    theGreatSilence: theGreatSilence && theGreatSilence.durationDays > 1 ? theGreatSilence : null,
    content: {
      topWords: topMapEntries(wordCounter, 20),
      topEmojis: topMapEntries(emojiCounter, 12),
      topLinks: topMapEntries(linkCounter, 12),
      mediaUsage: topMapEntries(mediaCounter, 6),
      topicDistribution: topics,
      topicKeywords,
      topicEvolution,
      insideJokes
    },
    conflictMoments,
    chatIndex,
    users,
    conversations,
    ai: {
      conversationSummary: `Percakapan berlangsung dari ${dayjs(messages[0]?.timestamp).format("DD MMM YYYY")} sampai ${dayjs(
        messages[messages.length - 1]?.timestamp,
      ).format("DD MMM YYYY")} dengan total ${messages.length} pesan dan ${participants.length} partisipan aktif.`,
      relationshipDynamic: `${mostActiveUser} terlihat paling sering mendorong alur percakapan, sementara peserta lain aktif di momen diskusi penting dan tindak lanjut.`,
      communicationStyle: "Gaya komunikasi campuran santai dan praktis, dengan pola percakapan yang sering mengarah ke perencanaan.",
      overallTone: tone,
      importantMomentsNarrative: importantMoments.slice(0, 4).map((item) => `${dayjs(item.timestamp).format("DD MMM HH:mm")} - ${item.sender}: ${item.message}`),
      sentimentTimeline: [
        { period: "Fase Awal", sentiment: "Netral", description: "Mulai saling menyesuaikan dan membangun ritme komunikasi." },
        { period: "Fase Tengah", sentiment: tone, description: "Ritme percakapan mulai stabil dengan pola interaksi yang lebih jelas." },
      ],
      theFirstEncounter: "Percakapan dimulai dengan gaya santai, lalu berkembang menjadi pola komunikasi yang lebih konsisten.",
      theVibe: "Campuran dinamis antara inside jokes, kirim link acak, dan obrolan mendalam di jam malam.",
      theErasTour: [
        { era: "Fase Hangat", description: "Frekuensi pesan tinggi, dominan pesan singkat, dan banyak emoji." },
        { era: "Fase Obrolan Mendalam", description: "Pesan cenderung lebih panjang, jeda balas sedikit lebih lama, dan kualitas diskusi meningkat." }
      ]
    },
    importantMoments,
    wrapped: {
      messagesSent: messages.length,
      peakHourLabel: peakHourText,
      conversationStartRate: Number(startRate.toFixed(1)),
      favoriteEmoji: mostUsedEmoji,
      topTopics: topicKeywords.slice(0, 3),
      fastestReplyLabel: formatSeconds(repliesMinMax.min),
    },
    messageSamples,
  };
}
