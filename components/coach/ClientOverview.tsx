import DashboardCard from "@/components/coach/DashboardCard";

import type { CareerIntelligenceSummary } from "@/services/careerIntelligenceService";
import ProgressBar from "@/components/common/ProgressBar";

type ClientOverviewProps = {
  clientName: string;
  hasDiscoveryReport: boolean;
  hasAIQReport: boolean;
  openActionItems: number;
  nextMeeting?: {
    title: string;
    meetingDate: string;
  } | null;
  intelligence: CareerIntelligenceSummary;
};

export default function ClientOverview({
  clientName,
  hasDiscoveryReport,
  hasAIQReport,
  openActionItems,
  nextMeeting,
  intelligence,
}: ClientOverviewProps) {
  return (
    <DashboardCard eyebrow="CAREER INTELLIGENCE" title="Client Snapshot">
    <div className="mt-6 rounded-2xl border border-[#FBBF24]/30 bg-[#FBBF24]/10 p-6">
    <p className="text-sm font-black tracking-[0.2em] text-[#FBBF24]">
        CAREER HEALTH
    </p>

    <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
        <p className="text-5xl font-black text-white">
        {intelligence.careerHealth}%
        </p>

        <ProgressBar value={intelligence.careerHealth} />

        <p className="mt-3 text-sm text-slate-300">
        Momentum: {intelligence.careerMomentum} · Risk:{" "}
        {intelligence.riskLevel}
        </p>
        </div>

        <div className="max-w-xl rounded-2xl border border-slate-700 bg-[#020617] p-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
            AI COACH RECOMMENDATION
        </p>

        <p className="mt-2 text-sm font-bold leading-6 text-white">
            {intelligence.nextRecommendedAction}
        </p>
        </div>
    </div>

    <div className="mt-6 rounded-2xl border border-slate-700 bg-[#020617] p-6">
        <p className="text-sm font-black tracking-[0.2em] text-slate-500">
            SNAPSHOT CHECKLIST
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
            <SnapshotItem
            label="Career Assessment"
            complete={hasDiscoveryReport}
            />

            <SnapshotItem
            label="Future Potential"
            complete={hasAIQReport}
            />

            <SnapshotItem
            label="Upcoming Session"
            complete={Boolean(nextMeeting)}
            />

            <SnapshotItem
            label="No Outstanding Tasks"
            complete={openActionItems === 0}
            />
        </div>
        </div>

    </div>

      {/* <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <StatusCard
          title="Career Assessment"
          complete={hasDiscoveryReport}
        />

        <StatusCard
          title="Future Potential"
          complete={hasAIQReport}
        />

        <MetricCard
          title="Client Progress"
          value={String(openActionItems)}
        />

        <MetricCard
        title="Upcoming Session"
        value={
            nextMeeting
            ? formatMeetingDate(nextMeeting.meetingDate)
            : "None Scheduled"
        }
        />
      </div> */}
    </DashboardCard>
  );
}

function StatusCard({
  title,
  complete,
}: {
  title: string;
  complete: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-[#020617] p-5">
      <p className="text-sm text-slate-400">{title}</p>

      <p className="mt-3 font-black text-white">
        {complete ? "Complete ✓" : "Not Started"}
      </p>
    </div>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-[#020617] p-5">
      <p className="text-sm text-slate-400">{title}</p>

      <p className="mt-3 text-2xl font-black text-[#FBBF24]">
        {value}
      </p>
    </div>
  );
}

function SnapshotItem({
    label,
    complete,
  }: {
    label: string;
    complete: boolean;
  }) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-[#111827] p-4">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-black ${
            complete
              ? "bg-emerald-400/20 text-emerald-300"
              : "bg-[#FBBF24]/20 text-[#FBBF24]"
          }`}
        >
          {complete ? "✓" : "!"}
        </span>
  
        <p className="font-bold text-white">{label}</p>
      </div>
    );
  }

function formatMeetingDate(dateValue: string) {
    const date = new Date(dateValue);
  
    return date.toLocaleString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }