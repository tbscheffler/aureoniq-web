"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getOrganizationClientActionItems,
  getOrganizationClientMeetings,
} from "@/services/coachService";

type JourneyEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  type:
    | "resume"
    | "assessment"
    | "aiq"
    | "meeting"
    | "note"
    | "action"
    | "health";
};

type ClientProgressTabProps = {
  organizationClientId: string;
  clientName: string;
  events: JourneyEvent[];
  careerReportsCount: number;
  aiqReportsCount: number;
  latestAIQScore?: number | string | null;
  openActionItems: number;
  nextMeeting?: any;
  clientHealth?: any;
  setActiveSection: (section: string) => void;
};

export default function ClientProgressTab({
  organizationClientId,
  clientName,
  events,
  careerReportsCount,
  aiqReportsCount,
  latestAIQScore,
  openActionItems,
  nextMeeting,
  clientHealth,
  setActiveSection,
}: ClientProgressTabProps) {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [actionItems, setActionItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProgressData() {
      try {
        setLoading(true);
        const [meetingData, actionData] = await Promise.all([
          getOrganizationClientMeetings(organizationClientId),
          getOrganizationClientActionItems(organizationClientId),
        ]);

        setMeetings(meetingData || []);
        setActionItems(actionData || []);
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProgressData();
  }, [organizationClientId]);

  const firstName = clientName.split(" ")[0] || "this client";

  const completedActions = actionItems.filter(
    (item) => item.status === "completed"
  ).length;

  const openActions = actionItems.filter(
    (item) => item.status !== "completed"
  );

  const completedMeetings = meetings.filter(
    (meeting) => meeting.status === "completed" || new Date(meeting.meeting_date) < new Date()
  );

  const progressEvents = useMemo(() => {
    const meetingEvents: JourneyEvent[] = meetings.map((meeting) => ({
      id: `progress-meeting-${meeting.id}`,
      title: meeting.title || "Coaching session",
      description:
        meeting.summary ||
        meeting.follow_up ||
        "A coaching conversation was recorded for this client.",
      date: formatProgressDate(meeting.meeting_date),
      type: "meeting",
    }));

    const actionEvents: JourneyEvent[] = actionItems.slice(0, 8).map((item) => ({
      id: `progress-action-${item.id}`,
      title: item.status === "completed" ? "Growth step completed" : "Growth step added",
      description: item.title || "A growth step was added to the client plan.",
      date: formatProgressDate(item.created_at || item.due_date),
      type: "action",
    }));

    return [...events, ...meetingEvents, ...actionEvents]
      .filter((event) => event.date && event.date !== "Unknown date")
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
  }, [events, meetings, actionItems]);

  const wins = buildProgressWins({
    careerReportsCount,
    aiqReportsCount,
    latestAIQScore,
    completedMeetings: completedMeetings.length,
    completedActions,
    clientHealth,
  });

  return (
    <div className="space-y-7">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-7 text-[#111827] shadow-sm md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#B8872A]">
              PROGRESS INTELLIGENCE
            </p>
            <h2 className="mt-3 text-3xl font-black md:text-4xl">
              Is {firstName}&apos;s career moving forward?
            </h2>
            <p className="mt-4 max-w-3xl leading-7 text-slate-600">
              Track the signals that show how this client&apos;s career clarity,
              readiness, coaching work, and opportunity exploration are evolving
              over time.
            </p>
          </div>

          <div className="rounded-full border border-emerald-100 bg-emerald-50 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-emerald-700">
            Journey View
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <ProgressMetricCard
          label="AIQ Score"
          value={latestAIQScore || "—"}
          description="Future potential signal"
          tone="gold"
        />
        <ProgressMetricCard
          label="Reports"
          value={careerReportsCount + aiqReportsCount}
          description="Career intelligence generated"
        />
        <ProgressMetricCard
          label="Sessions"
          value={meetings.length}
          description="Coaching conversations recorded"
        />
        <ProgressMetricCard
          label="Growth Steps"
          value={actionItems.length}
          description={`${completedActions} completed`}
        />
        <ProgressMetricCard
          label="Open Items"
          value={openActionItems}
          description="Need coach attention"
          tone={openActionItems > 0 ? "violet" : "green"}
        />
      </section>

      <section className="grid gap-7 xl:grid-cols-[1.15fr_0.85fr]">
        <CareerJourneyPanel events={progressEvents} loading={loading} />
        <div className="space-y-7">
          <MomentumPanel wins={wins} />
          <UpcomingMilestones
            actionItems={openActions}
            nextMeeting={nextMeeting}
            setActiveSection={setActiveSection}
          />
        </div>
      </section>

      <CoachingHistoryPanel
        meetings={meetings}
        loading={loading}
        setActiveSection={setActiveSection}
      />
    </div>
  );
}

function ProgressMetricCard({
  label,
  value,
  description,
  tone = "slate",
}: {
  label: string;
  value: string | number;
  description: string;
  tone?: "slate" | "gold" | "violet" | "green";
}) {
  const toneClass =
    tone === "gold"
      ? "border-[#E8D49B] bg-[#FFF8E7] text-[#9A6A12]"
      : tone === "violet"
        ? "border-violet-100 bg-[#F8F5FF] text-[#4C1D95]"
        : tone === "green"
          ? "border-emerald-100 bg-emerald-50 text-emerald-800"
          : "border-slate-200 bg-white text-slate-700";

  return (
    <div className={["rounded-[1.5rem] border p-5 shadow-sm", toneClass].join(" ")}>
      <p className="text-xs font-black uppercase tracking-[0.18em] opacity-80">
        {label}
      </p>
      <p className="mt-3 text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-sm font-semibold leading-5 opacity-80">
        {description}
      </p>
    </div>
  );
}

function CareerJourneyPanel({
  events,
  loading,
}: {
  events: JourneyEvent[];
  loading: boolean;
}) {
  const visibleEvents = events.slice(0, 10);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-7 text-[#111827] shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#B8872A]">
            CAREER JOURNEY
          </p>
          <h3 className="mt-3 text-2xl font-black">Timeline of progress</h3>
          <p className="mt-2 leading-7 text-slate-600">
            Key moments from reports, coaching sessions, and growth-plan work.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="mt-6 text-sm font-semibold text-slate-500">
          Loading career journey...
        </p>
      ) : visibleEvents.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6">
          <p className="font-bold text-slate-600">
            No progress signals yet. Career milestones will appear here as reports,
            sessions, and growth steps are completed.
          </p>
        </div>
      ) : (
        <div className="mt-7 space-y-4">
          {visibleEvents.map((event, index) => (
            <div key={event.id} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4C1D95] text-sm font-black text-white">
                  ✓
                </div>
                {index < visibleEvents.length - 1 ? (
                  <div className="mt-2 h-full min-h-8 w-px bg-slate-200" />
                ) : null}
              </div>

              <div className="min-w-0 flex-1 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-black text-slate-950">{event.title}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                      {event.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    {formatProgressDate(event.date)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function MomentumPanel({ wins }: { wins: string[] }) {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-7 text-[#111827] shadow-sm">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-[#B8872A]">
        WINS SINCE STARTING
      </p>
      <h3 className="mt-3 text-2xl font-black">Momentum signals</h3>
      <p className="mt-2 leading-7 text-slate-600">
        Positive evidence that coaching and Career Intelligence are creating a
        clearer path forward.
      </p>

      <div className="mt-6 space-y-3">
        {wins.map((win) => (
          <div
            key={win}
            className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4"
          >
            <p className="text-sm font-bold leading-6 text-emerald-900">
              ✓ {win}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function UpcomingMilestones({
  actionItems,
  nextMeeting,
  setActiveSection,
}: {
  actionItems: any[];
  nextMeeting?: any;
  setActiveSection: (section: string) => void;
}) {
  const visibleItems = actionItems.slice(0, 4);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-7 text-[#111827] shadow-sm">
      <p className="text-sm font-black uppercase tracking-[0.22em] text-[#B8872A]">
        NEXT MILESTONES
      </p>
      <h3 className="mt-3 text-2xl font-black">What to move forward</h3>
      <p className="mt-2 leading-7 text-slate-600">
        Upcoming growth steps and sessions that can keep the client moving.
      </p>

      <div className="mt-6 space-y-3">
        {nextMeeting ? (
          <div className="rounded-2xl border border-violet-100 bg-[#F8F5FF] px-5 py-4">
            <p className="text-sm font-black text-[#4C1D95]">
              Next coaching session
            </p>
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
              {nextMeeting.title || "Coaching Session"} · {formatProgressDate(nextMeeting.meeting_date)}
            </p>
          </div>
        ) : null}

        {visibleItems.length > 0 ? (
          visibleItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[#E8D49B] bg-[#FFF8E7] px-5 py-4"
            >
              <p className="text-sm font-black text-[#7C4A03]">{item.title}</p>
              {item.due_date ? (
                <p className="mt-1 text-sm font-semibold text-[#9A6A12]">
                  Due {formatProgressDate(item.due_date)}
                </p>
              ) : null}
            </div>
          ))
        ) : !nextMeeting ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6">
            <p className="text-sm font-bold leading-6 text-slate-600">
              No next milestone is currently active. Add a growth step after the
              next coaching conversation.
            </p>
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setActiveSection("grow")}
        className="mt-6 rounded-2xl bg-[#4C1D95] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#3B147B]"
      >
        Open Growth Plan
      </button>
    </section>
  );
}

function CoachingHistoryPanel({
  meetings,
  loading,
  setActiveSection,
}: {
  meetings: any[];
  loading: boolean;
  setActiveSection: (section: string) => void;
}) {
  const sortedMeetings = [...meetings].sort(
    (a, b) =>
      new Date(b.meeting_date).getTime() - new Date(a.meeting_date).getTime()
  );

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-7 text-[#111827] shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#B8872A]">
            COACHING HISTORY
          </p>
          <h3 className="mt-3 text-2xl font-black">Sessions and outcomes</h3>
          <p className="mt-2 max-w-3xl leading-7 text-slate-600">
            A clean record of coaching conversations. Create and edit session
            details from the Grow workspace.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveSection("grow")}
          className="w-fit rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-[#4C1D95] shadow-sm transition hover:border-[#4C1D95]"
        >
          Manage Sessions
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-sm font-semibold text-slate-500">
          Loading sessions...
        </p>
      ) : sortedMeetings.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6">
          <p className="font-bold text-slate-600">
            No coaching sessions have been recorded yet.
          </p>
        </div>
      ) : (
        <div className="mt-7 grid gap-4 xl:grid-cols-2">
          {sortedMeetings.slice(0, 6).map((meeting) => (
            <div
              key={meeting.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-black text-slate-950">
                    {meeting.title || "Coaching Session"}
                  </p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                    {formatProgressDate(meeting.meeting_date)}
                  </p>
                </div>
                <span className="w-fit rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                  {meeting.status || "recorded"}
                </span>
              </div>

              {meeting.summary ? (
                <p className="mt-4 line-clamp-3 text-sm font-semibold leading-6 text-slate-600">
                  {meeting.summary}
                </p>
              ) : (
                <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
                  No summary captured yet.
                </p>
              )}

              {meeting.follow_up ? (
                <div className="mt-4 rounded-xl border border-[#E8D49B] bg-[#FFF8E7] px-4 py-3">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#9A6A12]">
                    Follow-up
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-[#7C4A03]">
                    {meeting.follow_up}
                  </p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function buildProgressWins({
  careerReportsCount,
  aiqReportsCount,
  latestAIQScore,
  completedMeetings,
  completedActions,
  clientHealth,
}: {
  careerReportsCount: number;
  aiqReportsCount: number;
  latestAIQScore?: number | string | null;
  completedMeetings: number;
  completedActions: number;
  clientHealth?: any;
}) {
  const wins = [];

  if (careerReportsCount > 0) {
    wins.push("Career Discovery has created a clearer picture of possible paths.");
  }

  if (aiqReportsCount > 0) {
    wins.push("AIQ Intelligence is available to support future-focused coaching.");
  }

  if (latestAIQScore && Number(latestAIQScore) >= 75) {
    wins.push("Current AIQ signals show strong career readiness potential.");
  }

  if (completedMeetings > 0) {
    wins.push(`${completedMeetings} coaching conversation${completedMeetings === 1 ? "" : "s"} recorded.`);
  }

  if (completedActions > 0) {
    wins.push(`${completedActions} growth step${completedActions === 1 ? "" : "s"} completed.`);
  }

  if (clientHealth?.status || clientHealth?.score) {
    wins.push("Client health signals are being tracked for ongoing coaching context.");
  }

  if (wins.length === 0) {
    wins.push("This workspace is ready to start tracking career progress.");
    wins.push("Future reports, sessions, and growth steps will appear as momentum signals.");
  }

  return wins.slice(0, 5);
}

function formatProgressDate(dateValue?: string) {
  if (!dateValue) return "Unknown date";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
