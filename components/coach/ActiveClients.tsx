import Link from "next/link";

type ActiveClientsProps = {
  clients: any[];
};

export default function ActiveClients({
  clients,
}: ActiveClientsProps) {
  return (
    <div className="mt-8 rounded-3xl border border-slate-800 bg-[#111827] p-8">
      <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
        ACTIVE CLIENTS
      </p>

      {clients.length === 0 ? (
        <p className="mt-4 text-slate-400">
          No active clients yet.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {clients.map((client) => (
            <div
              key={client.id}
              className="rounded-2xl border border-slate-700 bg-[#020617] p-5"
            >
              <p className="text-xl font-black text-white">
                {client.client_display_name || "Client"}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#FBBF24]/40 bg-[#FBBF24]/10 px-3 py-1 text-xs font-bold text-[#FBBF24]">
                  {client.sponsored_tier || "Sponsored Access"}
                </span>

                <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  Reports Shared
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-400">
                Connected{" "}
                {client.started_at
                  ? new Date(client.started_at).toLocaleDateString()
                  : "Recently"}
              </p>

              <Link
                href={`/coach/clients/${client.id}`}
                className="mt-4 inline-block rounded-xl bg-[#FBBF24] px-4 py-2 text-sm font-black text-[#020617]"
              >
                Open Workspace
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}