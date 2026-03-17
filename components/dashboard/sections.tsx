import { Card } from "@/components/ui/card";
import { BarChart } from "@/components/charts/bar-chart";
import { LineChart } from "@/components/charts/line-chart";
import { PieChart } from "@/components/charts/pie-chart";
import { TopicExplorer } from "@/components/dashboard/topic-explorer";
import { WrappedSlides } from "@/components/dashboard/wrapped-slides";
import { AnalysisResult } from "@/lib/types";
import { formatSeconds } from "@/lib/utils";

function OverviewSection({ report }: { report: AnalysisResult }) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const maxHeat = Math.max(...report.activity.activityHeatmap.map(d => d.value), 1);

  return (
    <div className="space-y-6 font-sans">
      

      {/* Basic Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-sm font-medium text-[var(--color-text-soft)]">Total Messages</p>
          <p className="mt-2 text-4xl font-display text-[var(--color-text-main)]">{report.totals.totalMessages.toLocaleString()}</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-[var(--color-text-soft)]">Participants</p>
          <p className="mt-2 text-4xl font-display text-[var(--color-text-main)]">{report.meta.participants.length}</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-[var(--color-text-soft)]">Longest Streak</p>
          <p className="mt-2 text-4xl font-display text-[var(--color-text-main)]">{report.totals.longestStreakDays} days</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-[var(--color-text-soft)]">Average Reply Time</p>
          <p className="mt-2 text-4xl font-display text-[var(--color-text-main)]">{formatSeconds(report.totals.averageReplyTimeSec)}</p>
        </Card>
      </div>

      {/* Heatmap integrated into Overview */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h3 className="font-display text-2xl text-[var(--color-text-main)]">Activity Heatmap</h3>
            <p className="text-sm text-[var(--color-text-soft)] mt-1 font-medium">When do you interact the most?</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-[var(--color-text-soft)] font-bold mb-1">Peak Hour</p>
            <p className="font-display text-xl text-[var(--color-text-main)]">{report.wrapped.peakHourLabel}</p>
          </div>
        </div>
        
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[800px] flex">
            <div className="flex flex-col justify-between pr-4 text-xs text-[var(--color-text-muted)] font-bold tracking-wider uppercase">
              {days.map((day) => (
                <div key={day} className="h-7 flex items-center">{day}</div>
              ))}
            </div>
            <div className="flex-1 flex flex-col gap-[3px]">
              {Array.from({ length: 7 }).map((_, d) => (
                <div key={d} className="flex gap-[3px]">
                  {Array.from({ length: 24 }).map((_, h) => {
                    const val = report.activity.activityHeatmap.find(x => x.dayOfWeek === d && x.hour === h)?.value ?? 0;
                    const opacity = val === 0 ? 0.05 : Math.max(0.15, val / maxHeat);
                    return (
                      <div 
                        key={h} 
                        className="h-7 flex-1 rounded-[2px] bg-[var(--color-accent-strong)] transition-all hover:opacity-100 hover:scale-110" 
                        style={{ opacity }}
                        title={`${days[d]} ${h}:00 - ${val} msgs`}
                      />
                    );
                  })}
                </div>
              ))}
              <div className="flex justify-between mt-3 text-xs text-[var(--color-text-muted)] font-mono font-bold px-1">
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

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-sm font-medium text-[var(--color-text-soft)] mb-1">Most Active User</p>
          <p className="text-3xl font-display text-[var(--color-text-main)]">{report.totals.mostActiveUser}</p>
          <p className="text-sm mt-3 text-[var(--color-text-muted)] font-medium">Takes the lead in keeping the conversation alive.</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-[var(--color-text-soft)] mb-1">Longest Conversation</p>
          <p className="text-3xl font-display text-[var(--color-text-main)]">{report.totals.longestConversation} messages</p>
          <p className="text-sm mt-3 text-[var(--color-text-muted)] font-medium">The deepest rabbit hole you've gone down in one sitting.</p>
        </Card>
      </div>
    </div>
  );
}

function ActivitySection({ report }: { report: AnalysisResult }) {
  return (
    <div className="space-y-5 font-sans">
      <Card>
        <h3 className="font-display text-2xl text-[var(--color-text-main)] mb-4">Messages per Day</h3>
        <LineChart data={report.activity.messagesPerDay} />
      </Card>
      <Card>
        <h3 className="font-display text-2xl text-[var(--color-text-main)] mb-4">Messages per Hour</h3>
        <BarChart data={report.activity.messagesPerHour} />
      </Card>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-sm font-medium text-[var(--color-text-soft)]">Most Active Day</p>
          <p className="mt-2 text-xl font-medium text-[var(--color-text-main)]">{report.totals.mostActiveDay}</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-[var(--color-text-soft)]">Most Active Hour</p>
          <p className="mt-2 text-xl font-medium text-[var(--color-text-main)]">{report.wrapped.peakHourLabel}</p>
        </Card>
      </div>
    </div>
  );
}

function UsersSection({ report }: { report: AnalysisResult }) {
  const users = report.users;
  
  const ghostingIndex = [...users].sort((a, b) => (b.replySpeedSec ?? 0) - (a.replySpeedSec ?? 0));
  const morningPersons = [...users].sort((a, b) => b.morningPersonScore - a.morningPersonScore);
  const nightOwls = [...users].sort((a, b) => b.nightOwlScore - a.nightOwlScore);
  const doubleTexters = [...users].sort((a, b) => b.doubleTextCount - a.doubleTextCount);
  const laughers = [...users].sort((a, b) => b.laughCount - a.laughCount);
  const mediaKings = [...users].sort((a, b) => b.mediaSent - a.mediaSent);
  const yappers = [...users].sort((a, b) => b.longestMonologue - a.longestMonologue);
  const ignored = [...users].sort((a, b) => b.deadEnds - a.deadEnds);

  return (
    <div className="space-y-5 font-sans">
      <Card>
        <h3 className="font-display text-2xl text-[var(--color-text-main)]">User Comparison</h3>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm border-collapse">
            <thead className="text-[var(--color-text-soft)] border-b border-[var(--color-border-strong)]">
              <tr>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">User</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Messages Sent</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Avg Word Count</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Reply Speed</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">Emoji Usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] text-[var(--color-text-main)] font-medium">
              {report.users.map((user) => (
                <tr key={user.user} className="hover:bg-[var(--color-surface)] transition-colors">
                  <td className="px-4 py-3">{user.user}</td>
                  <td className="px-4 py-3">{user.messagesSent.toLocaleString()}</td>
                  <td className="px-4 py-3">{user.avgMessageLength}</td>
                  <td className="px-4 py-3">{user.replySpeedSec ? formatSeconds(user.replySpeedSec) : "-"}</td>
                  <td className="px-4 py-3">{user.emojiUsage.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="flex flex-col">
          <p className="text-xs font-bold tracking-widest uppercase text-[var(--color-text-soft)] mb-2">🐌 Ghosting Index</p>
          <p className="mt-auto text-2xl font-display text-[var(--color-text-main)]">{ghostingIndex[0]?.user ?? "-"}</p>
          <p className="text-sm text-[var(--color-text-muted)] font-medium mt-1">Avg {formatSeconds(ghostingIndex[0]?.replySpeedSec ?? 0)} to reply</p>
        </Card>
        <Card className="flex flex-col">
          <p className="text-xs font-bold tracking-widest uppercase text-[var(--color-text-soft)] mb-2">🌅 Morning Person</p>
          <p className="mt-auto text-2xl font-display text-[var(--color-text-main)]">{morningPersons[0]?.user ?? "-"}</p>
          <p className="text-sm text-[var(--color-text-muted)] font-medium mt-1">{morningPersons[0]?.morningPersonScore} morning msgs</p>
        </Card>
        <Card className="flex flex-col">
          <p className="text-xs font-bold tracking-widest uppercase text-[var(--color-text-soft)] mb-2">🦉 Night Owl</p>
          <p className="mt-auto text-2xl font-display text-[var(--color-text-main)]">{nightOwls[0]?.user ?? "-"}</p>
          <p className="text-sm text-[var(--color-text-muted)] font-medium mt-1">{nightOwls[0]?.nightOwlScore} late night msgs</p>
        </Card>
        <Card className="flex flex-col">
          <p className="text-xs font-bold tracking-widest uppercase text-[var(--color-text-soft)] mb-2">💬 Double Texter</p>
          <p className="mt-auto text-2xl font-display text-[var(--color-text-main)]">{doubleTexters[0]?.user ?? "-"}</p>
          <p className="text-sm text-[var(--color-text-muted)] font-medium mt-1">{doubleTexters[0]?.doubleTextCount} consecutive texts</p>
        </Card>
        <Card className="flex flex-col">
          <p className="text-xs font-bold tracking-widest uppercase text-[var(--color-text-soft)] mb-2">🤣 The Laugher</p>
          <p className="mt-auto text-2xl font-display text-[var(--color-text-main)]">{laughers[0]?.user ?? "-"}</p>
          <p className="text-sm text-[var(--color-text-muted)] font-medium mt-1">Laughed {laughers[0]?.laughCount} times</p>
        </Card>
        <Card className="flex flex-col">
          <p className="text-xs font-bold tracking-widest uppercase text-[var(--color-text-soft)] mb-2">🖼️ Media King</p>
          <p className="mt-auto text-2xl font-display text-[var(--color-text-main)]">{mediaKings[0]?.user ?? "-"}</p>
          <p className="text-sm text-[var(--color-text-muted)] font-medium mt-1">Sent {mediaKings[0]?.mediaSent} media items</p>
        </Card>
        <Card className="flex flex-col">
          <p className="text-xs font-bold tracking-widest uppercase text-[var(--color-text-soft)] mb-2">🗣️ The Yapper</p>
          <p className="mt-auto text-2xl font-display text-[var(--color-text-main)]">{yappers[0]?.user ?? "-"}</p>
          <p className="text-sm text-[var(--color-text-muted)] font-medium mt-1">Record: {yappers[0]?.longestMonologue} msgs in a row</p>
        </Card>
        <Card className="flex flex-col">
          <p className="text-xs font-bold tracking-widest uppercase text-[var(--color-text-soft)] mb-2">👻 The Ignored</p>
          <p className="mt-auto text-2xl font-display text-[var(--color-text-main)]">{ignored[0]?.user ?? "-"}</p>
          <p className="text-sm text-[var(--color-text-muted)] font-medium mt-1">{ignored[0]?.deadEnds} dead end messages</p>
        </Card>
      </div>

      <Card>
        <h3 className="font-display text-2xl text-[var(--color-text-main)] mb-4">Messages per User</h3>
        <BarChart data={report.activity.messagesPerUser} />
      </Card>
    </div>
  );
}

function ContentSection({ report }: { report: AnalysisResult }) {
  return (
    <div className="space-y-5 font-sans">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="font-display text-2xl text-[var(--color-text-main)] mb-4">Top Words Frequency</h3>
          <BarChart data={report.content.topWords.slice(0, 12)} />
        </Card>
        <Card>
          <h3 className="font-display text-2xl text-[var(--color-text-main)]">Top Emojis</h3>
          <ul className="mt-4 space-y-2 text-sm text-[var(--color-text-main)] font-medium">
            {report.content.topEmojis.slice(0, 10).map((item) => (
              <li key={item.label} className="flex items-center justify-between rounded-xl bg-[var(--color-bg-base)] px-4 py-3">
                <span className="text-xl">{item.label}</span>
                <span className="text-[var(--color-text-soft)]">{item.value.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {report.users.map(user => (
          <Card key={user.user}>
            <h3 className="font-display text-2xl text-[var(--color-text-main)]">{user.user}&apos;s Dictionary</h3>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-soft)] mb-3">Signature Words</p>
                <ul className="space-y-2 text-sm font-medium">
                  {user.topWords.slice(0, 5).map(w => (
                    <li key={w.label} className="flex justify-between border-b border-[var(--color-border)] pb-2">
                      <span className="text-[var(--color-text-main)]">{w.label}</span>
                      <span className="text-[var(--color-text-muted)]">{w.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-soft)] mb-3">Fav Emojis</p>
                <div className="flex flex-wrap gap-2 text-2xl">
                  {user.topEmojis.slice(0, 5).map(e => (
                    <span key={e.label} title={`${e.value} times`} className="hover:scale-110 transition-transform cursor-default">{e.label}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="font-display text-2xl text-[var(--color-text-main)] mb-4">Link Domain Distribution</h3>
        <BarChart data={report.content.topLinks.slice(0, 10)} />
      </Card>
    </div>
  );
}

function TopicsSection({ report }: { report: AnalysisResult }) {
  const availableTopics = Array.from(new Set(report.messageSamples.map((item) => item.topic))).slice(0, 8);
  return (
    <div className="space-y-5 font-sans">
      <Card>
        <h3 className="font-display text-2xl text-[var(--color-text-main)] mb-4">Topic Distribution</h3>
        <PieChart data={report.content.topicDistribution.length ? report.content.topicDistribution : [{ label: "General", value: 1 }]} />
      </Card>

      <Card>
        <h3 className="font-display text-2xl text-[var(--color-text-main)]">Topics</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {availableTopics.map((topic) => (
            <span key={topic} className="editorial-pill">
              {topic}
            </span>
          ))}
        </div>
        <div className="mt-6 space-y-3 text-sm text-[var(--color-text-main)]">
          {report.messageSamples.slice(0, 10).map((item, index) => (
            <div key={`${item.timestamp}-${index}`} className="rounded-xl bg-[var(--color-bg-base)] border border-[var(--color-border)] px-4 py-3 font-medium">
              <p className="text-xs text-[var(--color-text-soft)] font-mono uppercase tracking-widest mb-1">{item.topic} - {item.sender}</p>
              <p className="line-clamp-2 leading-relaxed">{item.message}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-display text-2xl text-[var(--color-text-main)]">Search Chat Insight</h3>
        <p className="mt-2 text-sm text-[var(--color-text-soft)] font-medium">Search by keyword, topic, or date.</p>
        <div className="mt-6">
          <TopicExplorer report={report} />
        </div>
      </Card>
    </div>
  );
}

function InsightsSection({ report }: { report: AnalysisResult }) {
  const firstMsg = report.firstMessage;
  const initiators = [...report.users].sort((a, b) => b.initiatorScore - a.initiatorScore);
  const closers = [...report.users].sort((a, b) => b.closerScore - a.closerScore);

  return (
    <div className="space-y-6 font-sans">
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* The Vibe / Persona */}
        <Card className="bg-[var(--color-surface-soft)] border-none">
          <h3 className="font-display text-3xl text-[var(--color-text-main)] mb-4">The Vibe</h3>
          <p className="text-lg text-[var(--color-text-main)] font-medium leading-relaxed italic">
            "{report.ai.theVibe}"
          </p>
          <div className="mt-6 pt-6 border-t border-[var(--color-border-strong)]">
            <h4 className="text-xs uppercase tracking-widest text-[var(--color-text-soft)] font-bold mb-3">Overall Tone</h4>
            <p className="text-sm font-medium">{report.ai.overallTone}</p>
          </div>
        </Card>

        {/* First Encounter */}
        <Card>
          <h3 className="font-display text-2xl text-[var(--color-text-main)] mb-6">✨ The First Encounter</h3>
          {firstMsg ? (
            <div className="mb-4">
              <p className="text-xs uppercase tracking-widest text-[var(--color-text-soft)] font-mono mb-2">
                {new Date(firstMsg.timestamp).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-sm leading-relaxed text-[var(--color-text-main)] font-medium">
                <span className="font-bold">{firstMsg.sender}</span> started it all with:
              </p>
              <div className="mt-3 p-4 bg-[var(--color-bg-base)] rounded-xl border border-[var(--color-border)] italic text-[var(--color-text-main)]">
                "{firstMsg.message}"
              </div>
            </div>
          ) : null}
          <p className="text-sm text-[var(--color-text-soft)] font-medium leading-relaxed mt-4">
            {report.ai.theFirstEncounter}
          </p>
        </Card>
      </div>

      {/* The Great Silence */}
      {report.theGreatSilence && (
        <Card className="bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-soft)] border-[var(--color-border-strong)]">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <h3 className="font-display text-3xl text-[var(--color-text-main)] mb-2">The Great Silence</h3>
              <p className="text-[var(--color-text-soft)] font-medium leading-relaxed">
                You once went <strong className="text-[var(--color-text-main)]">{report.theGreatSilence.durationDays} days</strong> without speaking to each other.
              </p>
              <p className="text-sm text-[var(--color-text-muted)] mt-2">
                From {new Date(report.theGreatSilence.startDate).toLocaleDateString()} to {new Date(report.theGreatSilence.endDate).toLocaleDateString()}.
              </p>
            </div>
            <div className="flex-1 p-5 bg-[var(--color-bg-base)] rounded-xl border border-[var(--color-border)]">
              <p className="text-xs uppercase tracking-widest text-[var(--color-text-soft)] font-bold mb-2">The Icebreaker</p>
              <p className="text-sm font-medium mb-1"><span className="font-bold">{report.theGreatSilence.whoBrokeIt}</span> broke the silence with:</p>
              <p className="text-sm italic text-[var(--color-text-muted)]">"{report.theGreatSilence.message}"</p>
            </div>
          </div>
        </Card>
      )}

      {/* Connection Dynamics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h3 className="font-display text-2xl text-[var(--color-text-main)] mb-6">Connection Dynamics</h3>
          
          <div className="space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--color-text-soft)] font-bold mb-2">The Initiator</p>
              <p className="text-lg font-display text-[var(--color-text-main)] mb-1">{initiators[0]?.user ?? "-"}</p>
              <p className="text-sm text-[var(--color-text-muted)] font-medium">Starts the conversation after a long break most often ({initiators[0]?.initiatorScore ?? 0} times).</p>
            </div>
            
            <div className="pt-4 border-t border-[var(--color-border)]">
              <p className="text-xs uppercase tracking-widest text-[var(--color-text-soft)] font-bold mb-2">The Closer</p>
              <p className="text-lg font-display text-[var(--color-text-main)] mb-1">{closers[0]?.user ?? "-"}</p>
              <p className="text-sm text-[var(--color-text-muted)] font-medium">Usually gets the last word before going to sleep or disappearing ({closers[0]?.closerScore ?? 0} times).</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <h3 className="font-display text-2xl text-[var(--color-text-main)] mb-6">Inside Jokes & Slang</h3>
          {report.content.insideJokes?.length > 0 ? (
            <div className="flex flex-col gap-3">
              {report.content.insideJokes.map((joke, i) => (
                <div key={i} className="px-4 py-3 rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border)] flex items-center justify-between">
                  <span className="font-display text-xl text-[var(--color-text-main)]">"{joke}"</span>
                  <span className="text-xs text-[var(--color-text-soft)] uppercase tracking-widest">Exclusive</span>
                </div>
              ))}
              <p className="text-sm text-[var(--color-text-muted)] mt-4 font-medium leading-relaxed">
                Words that seem unique to your specific dynamic and vocabulary.
              </p>
            </div>
          ) : (
            <p className="text-sm text-[var(--color-text-muted)] font-medium">Not enough unique slang detected. You mostly speak regular words!</p>
          )}
        </Card>
      </div>

      <Card>
        <h3 className="font-display text-2xl text-[var(--color-text-main)] mb-8">The Eras Tour</h3>
        <div className="relative border-l border-[var(--color-border-strong)] ml-4 md:ml-[50%] md:-translate-x-[0.5px] space-y-12 py-4">
          {report.ai.theErasTour?.map((era, idx) => (
            <div key={`${era.era}-${idx}`} className="relative pl-8 md:pl-0 md:w-[100%] md:even:ml-[0%] md:odd:-ml-[100%] md:even:pl-8 md:odd:pr-8 md:odd:text-right group">
              <div className="absolute top-3 -left-[17px] md:group-even:-left-[1px] md:group-odd:left-auto md:group-odd:-right-[1px] w-8 h-[1px] bg-[var(--color-border-strong)]" />
              <div>
                <div className="font-display text-2xl text-[var(--color-text-main)]">{era.era}</div>
                <div className="text-sm font-medium text-[var(--color-text-soft)] mt-2 leading-relaxed">{era.description}</div>
              </div>
            </div>
          ))}
          
          {/* Include sentiment phases in the eras if they are different */}
          {report.ai.sentimentTimeline?.map((timeline, idx) => (
            <div key={`${timeline.period}-${idx}-sent`} className="relative pl-8 md:pl-0 md:w-[100%] md:even:ml-[0%] md:odd:-ml-[100%] md:even:pl-8 md:odd:pr-8 md:odd:text-right group">
              <div className="absolute top-3 -left-[17px] md:group-even:-left-[1px] md:group-odd:left-auto md:group-odd:-right-[1px] w-8 h-[1px] bg-[var(--color-border-strong)]" />
              <div>
                <div className="text-xs uppercase tracking-widest text-[var(--color-text-soft)] font-bold mb-1">{timeline.period}</div>
                <div className="font-display text-xl text-[var(--color-text-main)]">{timeline.sentiment}</div>
                {timeline.description && <div className="text-sm font-medium text-[var(--color-text-muted)] mt-1 leading-relaxed">{timeline.description}</div>}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-display text-2xl text-[var(--color-text-main)]">Important Moments</h3>
        <ul className="mt-6 space-y-3">
          {report.ai.importantMomentsNarrative.map((line, idx) => (
            <li key={`${line}-${idx}`} className="rounded-xl bg-[var(--color-surface-soft)] border border-[var(--color-border)] px-4 py-3 text-sm font-medium text-[var(--color-text-main)] leading-relaxed">
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
    <Card className="bg-[var(--color-bg-base)] border-none shadow-none p-0 overflow-hidden">
      <WrappedSlides report={report} />
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
  return null;
}
