import { Card } from "@/components/ui/card";
import { BarChart } from "@/components/charts/bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { PieChart } from "@/components/charts/pie-chart";
import { ShareTools } from "@/components/dashboard/share-tools";
import { TopicExplorer } from "@/components/dashboard/topic-explorer";
import { WrappedSlides } from "@/components/dashboard/wrapped-slides";
import { AnalysisResult } from "@/lib/types";
import { formatSeconds } from "@/lib/utils";

function OverviewSection({ report }: { report: AnalysisResult }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm text-neutral-500">Total Messages</p>
          <p className="mt-2 text-3xl">{report.totals.totalMessages.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">Participants</p>
          <p className="mt-2 text-3xl">{report.meta.participants.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">Longest Streak</p>
          <p className="mt-2 text-3xl">{report.totals.longestStreakDays} days</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">Average Reply Time</p>
          <p className="mt-2 text-3xl">{formatSeconds(report.totals.averageReplyTimeSec)}</p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <p className="text-sm text-neutral-500">Most Active User</p>
          <p className="mt-2 text-2xl">{report.totals.mostActiveUser}</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">Peak Chat Hour</p>
          <p className="mt-2 text-2xl">{report.wrapped.peakHourLabel}</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">Longest Conversation</p>
          <p className="mt-2 text-2xl">{report.totals.longestConversation} msgs</p>
        </Card>
      </div>
    </div>
  );
}

function ActivitySection({ report }: { report: AnalysisResult }) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const maxHeat = Math.max(...report.activity.activityHeatmap.map(d => d.value), 1);

  return (
    <div className="space-y-5">
      <Card>
        <h3 className="text-lg">Activity Heatmap</h3>
        <p className="text-sm text-neutral-500 mb-4">When do you chat the most?</p>
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[800px] flex">
            <div className="flex flex-col justify-between pr-2 text-xs text-neutral-400 font-medium">
              {days.map((day) => (
                <div key={day} className="h-6 flex items-center">{day}</div>
              ))}
            </div>
            <div className="flex-1 flex flex-col gap-[2px]">
              {Array.from({ length: 7 }).map((_, d) => (
                <div key={d} className="flex gap-[2px]">
                  {Array.from({ length: 24 }).map((_, h) => {
                    const val = report.activity.activityHeatmap.find(x => x.dayOfWeek === d && x.hour === h)?.value ?? 0;
                    const opacity = val === 0 ? 0.05 : Math.max(0.15, val / maxHeat);
                    return (
                      <div 
                        key={h} 
                        className="h-6 flex-1 rounded-sm bg-indigo-600 transition-opacity hover:opacity-80" 
                        style={{ opacity }}
                        title={`${days[d]} ${h}:00 - ${val} msgs`}
                      />
                    );
                  })}
                </div>
              ))}
              <div className="flex justify-between mt-1 text-[10px] text-neutral-400">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>23:00</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
      
      <Card>
        <h3 className="text-lg">Messages per Day</h3>
        <LineChart data={report.activity.messagesPerDay} />
      </Card>
      <Card>
        <h3 className="text-lg">Messages per Hour</h3>
        <BarChart data={report.activity.messagesPerHour} />
      </Card>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-neutral-500">Most Active Day</p>
          <p className="mt-2">{report.totals.mostActiveDay}</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">Most Active Hour</p>
          <p className="mt-2">{report.wrapped.peakHourLabel}</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">Longest Streak</p>
          <p className="mt-2">{report.totals.longestStreakDays} days without missing a beat</p>
        </Card>
      </div>
    </div>
  );
}

function UsersSection({ report }: { report: AnalysisResult }) {
  const users = report.users;
  
  const ghostingIndex = [...users].sort((a, b) => (b.replySpeedSec ?? 0) - (a.replySpeedSec ?? 0));
  const morningPersons = [...users].sort((a, b) => b.morningPersonScore - a.morningPersonScore);
  const doubleTexters = [...users].sort((a, b) => b.doubleTextCount - a.doubleTextCount);
  const laughers = [...users].sort((a, b) => b.laughCount - a.laughCount);
  const mediaKings = [...users].sort((a, b) => b.mediaSent - a.mediaSent);

  return (
    <div className="space-y-5">
      <Card>
        <h3 className="text-lg">User Comparison</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-neutral-500">
              <tr>
                <th className="px-2 py-2">User</th>
                <th className="px-2 py-2">Messages Sent</th>
                <th className="px-2 py-2">Avg Word Count</th>
                <th className="px-2 py-2">Reply Speed</th>
                <th className="px-2 py-2">Emoji Usage</th>
              </tr>
            </thead>
            <tbody>
              {report.users.map((user) => (
                <tr key={user.user} className="border-t border-neutral-100">
                  <td className="px-2 py-2">{user.user}</td>
                  <td className="px-2 py-2">{user.messagesSent}</td>
                  <td className="px-2 py-2">{user.avgMessageLength}</td>
                  <td className="px-2 py-2">{user.replySpeedSec ? formatSeconds(user.replySpeedSec) : "-"}</td>
                  <td className="px-2 py-2">{user.emojiUsage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <p className="text-sm text-neutral-500">🐌 Ghosting / Slow Respon Index</p>
          <p className="mt-2 text-xl">{ghostingIndex[0]?.user ?? "-"}</p>
          <p className="text-sm text-neutral-400">Avg {formatSeconds(ghostingIndex[0]?.replySpeedSec ?? 0)} to reply</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">🌅 The Morning Person (5 AM - 9 AM)</p>
          <p className="mt-2 text-xl">{morningPersons[0]?.user ?? "-"}</p>
          <p className="text-sm text-neutral-400">{morningPersons[0]?.morningPersonScore} morning messages</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">💬 Raja/Ratu Double Text</p>
          <p className="mt-2 text-xl">{doubleTexters[0]?.user ?? "-"}</p>
          <p className="text-sm text-neutral-400">{doubleTexters[0]?.doubleTextCount} consecutive texts</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">🤣 The Laugh Tracker</p>
          <p className="mt-2 text-xl">{laughers[0]?.user ?? "-"}</p>
          <p className="text-sm text-neutral-400">Said haha/wkwk {laughers[0]?.laughCount} times</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">🖼️ Raja Media & Sticker</p>
          <p className="mt-2 text-xl">{mediaKings[0]?.user ?? "-"}</p>
          <p className="text-sm text-neutral-400">Sent {mediaKings[0]?.mediaSent} media items</p>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg">Messages per User</h3>
        <BarChart data={report.activity.messagesPerUser} />
      </Card>
    </div>
  );
}

function ContentSection({ report }: { report: AnalysisResult }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="text-lg">Top Words Frequency</h3>
          <BarChart data={report.content.topWords.slice(0, 12)} />
        </Card>
        <Card>
          <h3 className="text-lg">Top Emojis</h3>
          <ul className="mt-4 space-y-2 text-sm text-neutral-700">
            {report.content.topEmojis.slice(0, 10).map((item) => (
              <li key={item.label} className="flex items-center justify-between rounded-md bg-neutral-50 px-3 py-2">
                <span>{item.label}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {report.users.map(user => (
          <Card key={user.user}>
            <h3 className="text-lg">{user.user}&apos;s Dictionary</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-neutral-500 mb-2">Signature Words</p>
                <ul className="space-y-1 text-sm">
                  {user.topWords.slice(0, 5).map(w => (
                    <li key={w.label} className="flex justify-between border-b border-neutral-50 pb-1">
                      <span>{w.label}</span><span className="text-neutral-400">{w.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-medium text-neutral-500 mb-2">Fav Emojis</p>
                <div className="flex flex-wrap gap-2 text-lg">
                  {user.topEmojis.slice(0, 5).map(e => (
                    <span key={e.label} title={`${e.value} times`}>{e.label}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="text-lg">Link Domain Distribution</h3>
        <BarChart data={report.content.topLinks.slice(0, 10)} />
      </Card>
    </div>
  );
}

function TopicsSection({ report }: { report: AnalysisResult }) {
  const availableTopics = Array.from(new Set(report.messageSamples.map((item) => item.topic))).slice(0, 8);
  return (
    <div className="space-y-5">
      <Card>
        <h3 className="text-lg">Topic Distribution</h3>
        <PieChart data={report.content.topicDistribution.length ? report.content.topicDistribution : [{ label: "General", value: 1 }]} />
      </Card>

      <Card>
        <h3 className="text-lg">Topics</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {availableTopics.map((topic) => (
            <span key={topic} className="rounded-full border border-neutral-300 px-3 py-1 text-xs text-neutral-700">
              {topic}
            </span>
          ))}
        </div>
        <div className="mt-4 space-y-2 text-sm text-neutral-700">
          {report.messageSamples.slice(0, 10).map((item, index) => (
            <div key={`${item.timestamp}-${index}`} className="rounded-lg bg-neutral-50 px-3 py-2">
              <p className="text-xs text-neutral-500">{item.topic} - {item.sender}</p>
              <p className="line-clamp-2">{item.message}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg">Search Chat Insight</h3>
        <p className="mt-1 text-sm text-neutral-600">Search by keyword, topic, or date.</p>
        <div className="mt-4">
          <TopicExplorer report={report} />
        </div>
      </Card>
    </div>
  );
}

function InsightsSection({ report }: { report: AnalysisResult }) {
  return (
    <div className="space-y-5">
      <Card>
        <h3 className="text-lg">✨ The First Encounter</h3>
        <p className="mt-3 text-neutral-700 italic border-l-4 border-indigo-200 pl-4 py-1">&quot;{report.ai.theFirstEncounter}&quot;</p>
      </Card>
      <Card>
        <h3 className="text-lg">Conversation Summary</h3>
        <p className="mt-3 text-neutral-700">{report.ai.conversationSummary}</p>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="text-lg">Relationship Dynamic</h3>
          <p className="mt-3 text-neutral-700">{report.ai.relationshipDynamic}</p>
        </Card>
        <Card>
          <h3 className="text-lg">Communication Style</h3>
          <p className="mt-3 text-neutral-700">{report.ai.communicationStyle}</p>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg">📈 Sentiment Timeline</h3>
        <div className="mt-4 space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-300 before:to-transparent">
          {report.ai.sentimentTimeline?.map((timeline, idx) => (
            <div key={`${timeline.period}-${idx}`} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-indigo-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10" />
              <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-neutral-100 bg-white shadow-sm">
                <div className="font-medium text-neutral-800">{timeline.period}</div>
                <div className="text-sm text-neutral-600 mt-1">{timeline.sentiment}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg">Important Moments</h3>
        <ul className="mt-3 space-y-2 text-neutral-700">
          {report.ai.importantMomentsNarrative.map((line, idx) => (
            <li key={`${line}-${idx}`} className="rounded-lg bg-neutral-50 px-3 py-2 text-sm">
              {line}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function WrappedSection({ report }: { report: AnalysisResult }) {
  return (
    <Card>
      <WrappedSlides report={report} />
    </Card>
  );
}

function ShareSection({ report }: { report: AnalysisResult }) {
  return (
    <Card>
      <ShareTools report={report} />
    </Card>
  );
}

export function renderSection(section: string, report: AnalysisResult) {
  if (section === "overview") return <OverviewSection report={report} />;
  if (section === "activity") return <ActivitySection report={report} />;
  if (section === "users") return <UsersSection report={report} />;
  if (section === "content") return <ContentSection report={report} />;
  if (section === "topics") return <TopicsSection report={report} />;
  if (section === "insights") return <InsightsSection report={report} />;
  if (section === "wrapped") return <WrappedSection report={report} />;
  if (section === "share") return <ShareSection report={report} />;
  return null;
}
