import ClientCard from "@/components/coach/ClientCard";
import DashboardCard from "@/components/coach/DashboardCard";

type ActiveClientsProps = {
  clients: any[];
};

export default function ActiveClients({ clients }: ActiveClientsProps) {
  return (
    <DashboardCard
      eyebrow="ACTIVE CLIENTS"
      title={`${clients.length} Active Client${clients.length === 1 ? "" : "s"}`}
      className="mt-8"
    >
      {clients.length === 0 ? (
        <p className="mt-6 text-slate-400">
          No active clients yet. Invite your first client to start building their
          career intelligence workspace.
        </p>
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