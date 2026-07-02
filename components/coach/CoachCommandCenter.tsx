import Link from "next/link";
import DashboardCard from "@/components/coach/DashboardCard";

type Props = {
  clients: any[];
};

function getClientName(client: any) {
  return (
    client?.client_display_name ||
    client?.client_profile?.display_name ||
    client?.client_email ||
    "Client"
  );
}

function getReason(client: any) {
  if (client?.is_sample) {
    return "Demo workspace ready for practice.";
  }

  if (!client?.client_user_id) {
    return "Client has not completed setup.";
  }

  const score = client?.health?.score;

  if (score == null) {
    return "Career Health has not been calculated yet.";
  }

  if (score >= 85) {
    return "Career Health is excellent. Monitor progress.";
  }

  if (score >= 70) {
    return "Career Health is good. Review next recommendations.";
  }

  if (score >= 50) {
    return "Career Health is declining. Coach review recommended.";
  }

  return "Immediate coaching attention recommended.";
}

export default function CoachCommandCenter({ clients }: Props) {
  const priorityClients = clients.slice(0, 3);

  return (
    <DashboardCard
      eyebrow="COACH COMMAND CENTER"
      title="What Needs Attention"
      className="h-full"
    >
      <div className="mt-6 grid gap-4">
        {priorityClients.map((client) => (
          <Link
            key={client.id}
            href={`/coach/clients/${client.id}`}
            className="rounded-2xl border border-slate-800 bg-[#020617] p-5 transition hover:border-[#FBBF24]"
          >
            <div className="flex items-center justify-between">
  <p className="font-black text-white">
    {getClientName(client)}
  </p>

  {client.health?.score != null && (
    <span className="rounded-full bg-[#FBBF24]/10 px-3 py-1 text-sm font-black text-[#FBBF24]">
      {client.health.score}
    </span>
  )}
</div>
            <p className="mt-2 text-sm text-slate-400">{getReason(client)}</p>
          </Link>
        ))}

        <div className="grid gap-3 md:grid-cols-2">
          <a
            href="/coach/clients#invite-client"
            className="rounded-2xl border border-[#FBBF24]/30 bg-[#FBBF24]/10 p-4 font-black text-[#FBBF24]"
          >
            + Invite Client
          </a>

          <Link
            href="/coach/team"
            className="rounded-2xl border border-slate-700 p-4 font-black text-white hover:border-[#FBBF24]"
          >
            Invite Team Member
          </Link>
        </div>
      </div>
    </DashboardCard>
  );
}