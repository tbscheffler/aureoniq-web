import Link from "next/link";

type ClientCardProps = {
  client: any;
};

export default function ClientCard({ client }: ClientCardProps) {
  const displayName =
    client.profile?.display_name ||
    client.client_profile?.display_name ||
    client.client_email ||
    "Client";

  return (
    <div className="rounded-2xl border border-slate-700 bg-[#020617] p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-black text-white">{displayName}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
              Active
            </span>

            <span className="rounded-full border border-[#FBBF24]/40 bg-[#FBBF24]/10 px-3 py-1 text-xs font-bold text-[#FBBF24]">
              Shared Access
            </span>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Client relationship managed through AureonIQ.
          </p>
        </div>

        <Link
          href={`/coach/clients/${client.id}`}
          className="rounded-2xl bg-[#FBBF24] px-4 py-2 text-sm font-black text-[#020617]"
        >
          Open Workspace
        </Link>
      </div>
    </div>
  );
}