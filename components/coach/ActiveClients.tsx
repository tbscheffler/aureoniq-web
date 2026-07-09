import ClientCard from "@/components/coach/ClientCard";
import DashboardCard from "@/components/coach/DashboardCard";

type ActiveClientsProps = {
  clients: any[];
};

export default function ActiveClients({ clients }: ActiveClientsProps) {
  return (
    <DashboardCard
      eyebrow="ACTIVE CLIENTS"
      title={`${clients.length} Client Workspace${clients.length === 1 ? "" : "s"}`}
    >
      {clients.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="font-black text-slate-950">No active clients yet.</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
            Invite your first client to start building their Career Intelligence
            workspace.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
