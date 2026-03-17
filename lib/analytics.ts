import dayjs from "dayjs";
import { NEGATIVE_WORDS, POSITIVE_WORDS, STOPWORDS, TOPIC_KEYWORDS } from "@/lib/constants";
import { AnalysisResult, ConversationSession, ParsedMessage, UserStats, TheGreatSilence, QuoteOfTheYear } from "@/lib/types";
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

function inferTopics(messages: ParsedMessage[]) {
  const topicCounter = new Map<string, number>();
  const text = messages.map((msg) => msg.message.toLowerCase()).join(" ");

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    const score = keywords.reduce((sum, keyword) => sum + (text.includes(keyword) ? 1 : 0), 0);
    if (score > 0) {
      topicCounter.set(topic, score);
    }
  }

  const entries = topEntries(Array.from(topicCounter.entries()), 6);
  return {
    topics: entries.map(([label, value]) => ({ label, value })),
    topicKeywords: entries.map(([label]) => label),
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

export function computeAnalytics(messages: ParsedMessage[], fileName: string): AnalysisResult {
  const participants = Array.from(new Set(messages.map((item) => item.sender)));
  const conversations = computeConversations(messages);

  const perUser = new Map<string, number>();
  const perDay = new Map<string, number>();
  const perHour = new Map<string, number>();
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

  const mostActiveDay = topEntries(Array.from(perDay.entries()), 1)[0]?.[0] ?? "-";
  const peakHourText = topEntries(Array.from(perHour.entries()), 1)[0]?.[0] ?? "00:00";
  const peakHour = Number(peakHourText.split(":")[0] ?? 0);
  const mostActiveUser = topEntries(Array.from(perUser.entries()), 1)[0]?.[0] ?? participants[0] ?? "Unknown";
  const longestConversation = Math.max(...conversations.map((item) => item.messageCount), 0);
  const shortestConversation = Math.min(...conversations.map((item) => item.messageCount), 0);

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

  const insideJokes = Array.from(wordCounter.entries())
    .filter(([word, count]) => count > 5 && count < 30 && word.length > 5)
    .sort(() => Math.random() - 0.5)
    .map(([word]) => word)
    .slice(0, 3);

  const messageSamples = messages
    .slice(0, 400)
    .map((msg) => {
      const lower = msg.message.toLowerCase();
      const topic =
        Object.entries(TOPIC_KEYWORDS).find(([, keywords]) => keywords.some((key) => lower.includes(key)))?.[0] ??
        "General";
      return {
        timestamp: msg.timestamp,
        sender: msg.sender,
        message: msg.message,
        topic,
      };
    })
    .filter((item) => item.message.trim().length > 0);

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
      reason: "Potential decision or planning moment",
      message: msg.message.slice(0, 180),
    }));

  const mostUsedEmoji = topEntries(Array.from(emojiCounter.entries()), 1)[0]?.[0] ?? "-";
  const totalStarts = Array.from(conversationStarts.values()).reduce((sum, val) => sum + val, 0);
  const topUserStarts = conversationStarts.get(mostActiveUser) ?? 0;
  const startRate = totalStarts > 0 ? (topUserStarts / totalStarts) * 100 : 0;

  const tone = (() => {
    const fullText = messages.map((item) => item.message.toLowerCase()).join(" ");
    const positive = POSITIVE_WORDS.filter((word) => fullText.includes(word)).length;
    const negative = NEGATIVE_WORDS.filter((word) => fullText.includes(word)).length;
    if (positive > negative + 2) return "Supportive and positive";
    if (negative > positive + 2) return "Tense and problem-focused";
    return "Neutral and practical";
  })();

  const quoteOfTheYear: QuoteOfTheYear | null = quoteCandidate ? {
    timestamp: quoteCandidate.timestamp,
    sender: quoteCandidate.sender,
    message: quoteCandidate.message,
    context: "A standout message that defines your communication style."
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
      fastestReplySec: replies.length ? Math.min(...replies) : 0,
      slowestReplySec: replies.length ? Math.max(...replies) : 0,
      mostActiveUser,
      mostActiveDay,
      peakChatHour: peakHour,
      longestConversation,
      shortestConversation,
      longestStreakDays,
    },
    activity: {
      messagesPerUser: topMapEntries(perUser, 8),
      messagesPerDay: topMapEntries(perDay, 365), // Expand to 365 for a full year if possible
      messagesPerHour: topMapEntries(perHour, 24),
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
      insideJokes
    },
    users,
    conversations,
    ai: {
      conversationSummary: `Conversation spans ${dayjs(messages[0]?.timestamp).format("DD MMM YYYY")} to ${dayjs(
        messages[messages.length - 1]?.timestamp,
      ).format("DD MMM YYYY")} with ${messages.length} messages and ${participants.length} active participants.`,
      relationshipDynamic: `${mostActiveUser} appears to lead the interaction, while others contribute around key discussion moments and follow-up questions.`,
      communicationStyle: "Mixed casual and practical discussion, with recurring planning-oriented messages.",
      overallTone: tone,
      importantMomentsNarrative: importantMoments.slice(0, 4).map((item) => `${dayjs(item.timestamp).format("DD MMM HH:mm")} - ${item.sender}: ${item.message}`),
      sentimentTimeline: [
        { period: "The Beginning", sentiment: "Neutral", description: "Getting comfortable and establishing the baseline." },
        { period: "The Middle", sentiment: tone, description: "A steady rhythm of conversation." },
      ],
      theFirstEncounter: "The conversation started casually, gradually evolving into a more consistent pattern of communication.",
      theVibe: "A dynamic mix of inside jokes, random links, and deep talks late at night.",
      theErasTour: [
        { era: "The Honeymoon Phase", description: "High frequency, mostly short messages and lots of emojis." },
        { era: "The Deep Talk Era", description: "Messages got longer and responses took a bit more time, focusing on quality over quantity." }
      ]
    },
    importantMoments,
    wrapped: {
      messagesSent: messages.length,
      peakHourLabel: peakHourText,
      conversationStartRate: Number(startRate.toFixed(1)),
      favoriteEmoji: mostUsedEmoji,
      topTopics: topicKeywords.slice(0, 3),
      fastestReplyLabel: formatSeconds(replies.length ? Math.min(...replies) : 0),
    },
    messageSamples,
  };
}
