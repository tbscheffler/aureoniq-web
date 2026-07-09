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
    return "Career Health is declining. Coach review may help.";
  }

  return "Immediate coaching attention may be useful.";
}

export default function CoachCommandCenter({ clients }: Props) {
  const priorityClients = clients.slice(0, 3);

  return (
    <DashboardCard
      eyebrow="CLIENT INTELLIGENCE"
      title="Clients to review"
      className="h-full"
    >
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
        Open the client workspace that needs attention or use a demo workspace
        to practice the coaching flow.
      </p>

      <div className="mt-6 grid gap-4">
        {priorityClients.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="font-black text-slate-950">No clients yet.</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
              Invite your first client to begin building a Career Intelligence
              workspace.
            </p>
          </div>
        ) : (
          priorityClients.map((client) => (
            <Link
              key={client.id}
              href={`/coach/clients/${client.id}`}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-[#B8872A] hover:bg-[#FFF8E7]"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-black text-slate-950">{getClientName(client)}</p>

                {client.health?.score != null ? (
                  <span className="rounded-full border border-[#E8D49B] bg-[#FFF8E7] px-3 py-1 text-sm font-black text-[#9A6A12]">
                    {client.health.score}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                {getReason(client)}
              </p>
            </Link>
          ))
        )}

        <div className="grid gap-3 md:grid-cols-2">
          <a
            href="/coach/clients#invite-client"
            className="rounded-2xl bg-[#4C1D95] p-4 text-center text-sm font-black text-white transition hover:bg-[#3B147B]"
          >
            + Invite Client
          </a>

          <Link
            href="/coach/team"
            className="rounded-2xl border border-slate-200 bg-white p-4 text-center text-sm font-black text-slate-700 transition hover:border-[#4C1D95] hover:text-[#4C1D95]"
          >
            Invite Team Member
          </Link>
        </div>
      </div>
    </DashboardCard>
  );
}
