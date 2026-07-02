import DashboardCard from "@/components/coach/DashboardCard";
import Link from "next/link";

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

function getAttentionReason(client: any) {
  if (client?.is_sample) {
    return "Demo workspace available for practice.";
  }

  if (!client?.client_user_id) {
    return "Client has not completed account setup.";
  }

  return "Ready for coach review.";
}

export default function CoachAttentionQueue({ clients }: Props) {
  const prioritizedClients = clients.slice(0, 3);

  return (
    <DashboardCard
      eyebrow="COACH ATTENTION QUEUE"
      title="Clients Needing Attention"
      className="mt-8"
    >
      {prioritizedClients.length === 0 ? (
        <p className="mt-6 text-slate-400">
          No active clients yet. Invite your first client to start building their
          career intelligence workspace.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {prioritizedClients.map((client) => (
            <Link
              key={client.id}
              href={`/coach/clients/${client.id}`}
              className="block rounded-2xl border border-slate-800 bg-[#020617] p-5 transition hover:border-[#FBBF24]"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-black text-white">
                    {getClientName(client)}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    {getAttentionReason(client)}
                  </p>
                </div>

                <span className="rounded-full border border-[#FBBF24]/40 bg-[#FBBF24]/10 px-3 py-1 text-xs font-black text-[#FBBF24]">
                  Review
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}