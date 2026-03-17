export type MessageType = "text" | "link" | "media";

export type ParsedMessage = {
  id: string;
  timestamp: string;
  sender: string;
  message: string;
  messageType: MessageType;
  wordCount: number;
  emojiCount: number;
  linkCount: number;
  mediaType: string | null;
  conversationId: string;
  replyTimeSec: number | null;
  containsQuestion: boolean;
  containsLink: boolean;
  containsEmoji: boolean;
};

export type ConversationSession = {
  conversationId: string;
  startTime: string;
  endTime: string;
  messageCount: number;
  participants: string[];
  topicKeywords: string[];
  sentiment: "positive" | "neutral" | "negative" | "supportive";
};

export type UserStats = {
  user: string;
  messagesSent: number;
  avgMessageLength: number;
  replySpeedSec: number | null;
  conversationStarts: number;
  emojiUsage: number;
  morningPersonScore: number;
  nightOwlScore: number;
  doubleTextCount: number;
  mediaSent: number;
  laughCount: number;
  longestMonologue: number;
  deadEnds: number;
  topWords: { label: string; value: number }[];
  topEmojis: { label: string; value: number }[];
  topDomains: { label: string; value: number }[];
  initiatorScore: number;
  closerScore: number;
};

export type ImportantMoment = {
  timestamp: string;
  sender: string;
  reason: string;
  message: string;
};

export type AiInsights = {
  conversationSummary: string;
  relationshipDynamic: string;
  communicationStyle: string;
  overallTone: string;
  importantMomentsNarrative: string[];
  sentimentTimeline: { period: string; sentiment: string; description: string }[];
  theFirstEncounter: string;
  theVibe: string;
  theErasTour: { era: string; description: string }[];
};

export type QuoteOfTheYear = {
  timestamp: string;
  sender: string;
  message: string;
  context: string;
};

export type TheGreatSilence = {
  durationDays: number;
  startDate: string;
  endDate: string;
  whoBrokeIt: string;
  message: string;
};

export type AnalysisResult = {
  meta: {
    fileName: string;
    generatedAt: string;
    participants: string[];
  };
  totals: {
    totalMessages: number;
    totalConversations: number;
    averageReplyTimeSec: number;
    fastestReplySec: number;
    slowestReplySec: number;
    mostActiveUser: string;
    mostActiveDay: string;
    peakChatHour: number;
    longestConversation: number;
    shortestConversation: number;
    longestStreakDays: number;
  };
  activity: {
    messagesPerUser: { label: string; value: number }[];
    messagesPerDay: { label: string; value: number }[];
    messagesPerHour: { label: string; value: number }[];
    activityHeatmap: { dayOfWeek: number; hour: number; value: number }[];
  };
  firstMessage: {
    timestamp: string;
    sender: string;
    message: string;
  } | null;
  quoteOfTheYear: QuoteOfTheYear | null;
  theGreatSilence: TheGreatSilence | null;
  content: {
    topWords: { label: string; value: number }[];
    topEmojis: { label: string; value: number }[];
    topLinks: { label: string; value: number }[];
    mediaUsage: { label: string; value: number }[];
    topicDistribution: { label: string; value: number }[];
    topicKeywords: string[];
    insideJokes: string[];
  };
  users: UserStats[];
  conversations: ConversationSession[];
  ai: AiInsights;
  importantMoments: ImportantMoment[];
  wrapped: {
    messagesSent: number;
    peakHourLabel: string;
    conversationStartRate: number;
    favoriteEmoji: string;
    topTopics: string[];
    fastestReplyLabel: string;
  };
  messageSamples: {
    timestamp: string;
    sender: string;
    message: string;
    topic: string;
  }[];
};
