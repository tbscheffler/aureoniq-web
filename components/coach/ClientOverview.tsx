import DashboardCard from "@/components/coach/DashboardCard";

type ClientOverviewProps = {
  clientName: string;
  hasDiscoveryReport: boolean;
  hasAIQReport: boolean;
  openActionItems: number;
  nextMeeting?: {
    title: string;
    meetingDate: string;
  } | null;
};

export default function ClientOverview({
  clientName,
  hasDiscoveryReport,
  hasAIQReport,
  openActionItems,
  nextMeeting,
}: ClientOverviewProps) {
  return (
    <DashboardCard eyebrow="OVERVIEW" title={clientName}>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <StatusCard
          title="Career Discovery"
          complete={hasDiscoveryReport}
        />

        <StatusCard
          title="AIQ Report"
          complete={hasAIQReport}
        />

        <MetricCard
          title="Open Action Items"
          value={String(openActionItems)}
        />

        <MetricCard
          title="Next Meeting"
          value={
            nextMeeting
              ? new Date(nextMeeting.meetingDate).toLocaleDateString()
              : "None Scheduled"
          }
        />
      </div>
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