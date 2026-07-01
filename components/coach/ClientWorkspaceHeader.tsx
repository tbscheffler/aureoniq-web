import Link from "next/link";

type Props = {
  client: any;
  hasDiscoveryReport?: boolean;
  hasAIQReport?: boolean;
  openActionItems?: number;
  nextMeeting?: any;
  clientHealth?: {
    score: number;
    status: string;
  } | null;
};

export default function ClientWorkspaceHeader({
  client,
  hasDiscoveryReport = false,
  hasAIQReport = false,
  openActionItems = 0,
  nextMeeting = null,
  clientHealth = null,
}: Props) {
const name =
  client?.client_display_name ||
  client?.client_profile?.display_name ||
  client?.client_email ||
  "Client";

const isSampleClient = Boolean(client?.is_sample);

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
      <Link
        href="/coach"
        className="text-sm font-bold text-[#FBBF24]"
      >
        ← Back to Clients
      </Link>

      <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            CLIENT WORKSPACE
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-black">
              {name}
            </h1>

            {isSampleClient && (
              <span className="rounded-full bg-[#FBBF24]/15 px-3 py-1 text-sm font-black text-[#FBBF24]">
                ⭐ Demo Workspace
              </span>
            )}
          </div>

          <p className="mt-4 text-slate-400">
            Manage meetings, notes, reports, action items, and career
            intelligence for this client.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-5">
          <HeaderStatusCard
            label="Career Health"
            value={
              clientHealth
                ? `${clientHealth.score} · ${clientHealth.status}`
                : "Not Scored"
            }
          />
          <HeaderStatusCard
            label="Career Assessment"
            value={hasDiscoveryReport ? "Complete" : "Not Started"}
          />

          <HeaderStatusCard
            label="AIQ"
            value={hasAIQReport ? "Complete" : "Not Started"}
          />

          <HeaderStatusCard
            label="Open Actions"
            value={String(openActionItems)}
          />

          <HeaderStatusCard
            label="Next Meeting"
            value={nextMeeting ? "Scheduled" : "None"}
          />
        </div>
        </div>

        <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-5 py-2 font-bold text-emerald-300">
          Active Client
        </span>
      </div>
    </div>
  );
}

function HeaderStatusCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#020617] p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-black text-white">{value}</p>
    </div>
  );
}