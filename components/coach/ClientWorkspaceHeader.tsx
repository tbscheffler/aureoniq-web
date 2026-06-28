import Link from "next/link";

type Props = {
  client: any;
};

export default function ClientWorkspaceHeader({ client }: Props) {
  const name =
    client?.client_profile?.display_name ||
    client?.client_email ||
    "Client";

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

          <h1 className="mt-3 text-5xl font-black text-white">
            {name}
          </h1>

          <p className="mt-4 text-slate-400">
            Manage meetings, notes, reports, action items, and career
            intelligence for this client.
          </p>
        </div>

        <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-5 py-2 font-bold text-emerald-300">
          Active Client
        </span>
      </div>
    </div>
  );
}