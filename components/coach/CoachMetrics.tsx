type CoachMetricsProps = {
    activeClients: number;
    clientLimit: number;
    teamMembers: number;
    pendingInvites: number;
    notesThisWeek: number;
    meetingsThisWeek: number;
    planName: string;
  };
  
  export default function CoachMetrics({
    activeClients,
    clientLimit,
    teamMembers,
    pendingInvites,
    notesThisWeek,
    meetingsThisWeek,
    planName,
  }: CoachMetricsProps) {
    return (
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <MetricCard
          title="Active Clients"
          value={`${activeClients} / ${clientLimit}`}
        />
  
        <MetricCard
          title="Team Members"
          value={teamMembers}
        />
  
        <MetricCard
          title="Pending Invites"
          value={pendingInvites}
        />
  
        <MetricCard
          title="Notes This Week"
          value={notesThisWeek}
        />
  
        <MetricCard
          title="Meetings This Week"
          value={meetingsThisWeek}
        />
  
        <MetricCard
          title="Plan"
          value={planName}
        />
      </div>
    );
  }
  
  function MetricCard({
    title,
    value,
  }: {
    title: string;
    value: any;
  }) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
        <p className="text-sm font-bold text-slate-400">
          {title}
        </p>
  
        <p className="mt-4 text-3xl font-black text-[#FBBF24]">
          {value}
        </p>
      </div>
    );
  }