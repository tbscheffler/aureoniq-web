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
  const healthScore = client.health?.score;
  const healthStatus = client.health?.status;

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 transition hover:border-[#B8872A] hover:bg-[#FFF8E7]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xl font-black text-slate-950">{displayName}</p>

          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
            {isSampleClient
              ? "Explore a completed demo workspace before inviting your first real client."
              : "Client relationship supported through AureonIQ Career Intelligence."}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <StatusPill
              label={isSampleClient ? "Demo Workspace" : "Active"}
              tone={isSampleClient ? "gold" : "green"}
            />

            {healthScore ? (
              <StatusPill
                label={`Health ${healthScore} · ${healthStatus}`}
                tone={
                  healthScore >= 80
                    ? "green"
                    : healthScore >= 60
                    ? "gold"
                    : "slate"
                }
              />
            ) : (
              <StatusPill label="Health Not Scored" tone="slate" />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <Link
            href={`/coach/clients/${client.id}`}
            className="rounded-2xl bg-[#4C1D95] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-[#3B147B]"
          >
            Open Workspace
          </Link>

          <p className="text-xs font-bold text-slate-400">
            Last activity: Not started
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t border-slate-200 pt-5 md:grid-cols-3">
        <MiniMetric label="Next Meeting" value="Not scheduled" />
        <MiniMetric label="Growth Items" value="0" />
        <MiniMetric label="Reflections" value="None yet" />
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
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : tone === "gold"
      ? "border-[#E8D49B] bg-[#FFF8E7] text-[#9A6A12]"
      : "border-slate-200 bg-white text-slate-500";

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
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-black text-slate-700">{value}</p>
    </div>
  );
}
