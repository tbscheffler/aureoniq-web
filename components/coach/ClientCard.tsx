import Link from "next/link";

type ClientCardProps = {
  client: any;
};

export default function ClientCard({ client }: ClientCardProps) {
const displayName =
  client.client_display_name ||
  client.profile?.display_name ||
  client.client_profile?.display_name ||
  client.client_email ||
  "Client";

  const isSampleClient = Boolean(client.is_sample);

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#020617] p-5 transition hover:border-[#FBBF24]/60">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-lg font-black text-white">{displayName}</p>

          <p className="mt-2 text-sm text-slate-400">
            {isSampleClient
            ? "Explore a completed demo workspace before inviting your first real client."
            : "Client relationship managed through AureonIQ."}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <StatusPill
              label={isSampleClient ? "Demo Workspace" : "Active"}
              tone={isSampleClient ? "gold" : "green"}
            />
            <StatusPill label="Resume Pending" tone="slate" />
            <StatusPill label="Assessment Pending" tone="gold" />
            <StatusPill label="AIQ Pending" tone="slate" />
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <Link
            href={`/coach/clients/${client.id}`}
            className="rounded-2xl bg-[#FBBF24] px-4 py-2 text-center text-sm font-black text-[#020617]"
          >
            Open Workspace
          </Link>

          <p className="text-xs font-bold text-slate-500">
            Last activity: Not started
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-slate-800 pt-5 md:grid-cols-3">
        <MiniMetric label="Next Meeting" value="Not scheduled" />
        <MiniMetric label="Open Tasks" value="0" />
        <MiniMetric label="Coach Notes" value="None yet" />
      </div>
    </div>
  );
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "green" | "gold" | "slate";
}) {
  const className =
    tone === "green"
      ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
      : tone === "gold"
      ? "border-[#FBBF24]/40 bg-[#FBBF24]/10 text-[#FBBF24]"
      : "border-slate-700 bg-slate-900 text-slate-300";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>
      {label}
    </span>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-black text-white">{value}</p>
    </div>
  );
}