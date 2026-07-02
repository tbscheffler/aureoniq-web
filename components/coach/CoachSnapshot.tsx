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
      title="Executive Overview"
      className="mt-8"
    >
      <div className="mt-6 grid gap-4 md:grid-cols-4">

        <SnapshotCard
          label="Clients"
          value={`${activeClients}/${clientLimit}`}
          subtext={`${demoClients} Demo`}
        />

        <SnapshotCard
          label="Meetings"
          value={meetingsToday}
          subtext="Today"
        />

        <SnapshotCard
          label="Needs Attention"
          value={overdueActions}
          subtext="Open Items"
        />

        <SnapshotCard
          label="Career Health"
          value="—"
          subtext="Coming Soon"
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
    <div className="rounded-2xl border border-slate-800 bg-[#020617] p-5">

      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black text-[#FBBF24]">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-400">
        {subtext}
      </p>

    </div>
  );
}