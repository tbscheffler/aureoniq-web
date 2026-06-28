import Link from "next/link";
import ClientCard from "@/components/coach/ClientCard";

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
          <ClientCard key={client.id} client={client} />
        ))}
        </div>
      )}
    </div>
  );
}