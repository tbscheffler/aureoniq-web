import DashboardCard from "@/components/coach/DashboardCard";

type Props = {
  activeClients: number;
  clientLimit: number;
  overdueActions: number;
  meetingsToday: number;
  demoClients: number;
};

export default function CoachSnapshot({
  activeClients,
  clientLimit,
  overdueActions,
  meetingsToday,
  demoClients,
}: Props) {
  return (
    <DashboardCard
      eyebrow="TODAY'S SNAPSHOT"
      title="At a glance"
      className="mt-7"
    >
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <SnapshotCard
          label="Clients"
          value={`${activeClients}/${clientLimit}`}
          subtext={`${demoClients} demo workspace${demoClients === 1 ? "" : "s"}`}
        />

        <SnapshotCard
          label="Meetings Today"
          value={meetingsToday}
          subtext="Scheduled coaching conversations"
        />

        <SnapshotCard
          label="Needs Attention"
          value={overdueActions}
          subtext="Open growth items"
        />

        <SnapshotCard
          label="Demo Workspaces"
          value={demoClients}
          subtext="Practice before inviting clients"
        />
      </div>
    </DashboardCard>
  );
}

function SnapshotCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string | number;
  subtext: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-[#B8872A]">{value}</p>

      <p className="mt-1 text-sm font-semibold text-slate-500">{subtext}</p>
    </div>
  );
}
