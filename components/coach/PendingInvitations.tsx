import DashboardCard from "@/components/coach/DashboardCard";

type PendingInvitationsProps = {
  invitations: any[];
  handleRevokeInvitation: (invitationId: string) => void;
};

export default function PendingInvitations({
  invitations,
  handleRevokeInvitation,
}: PendingInvitationsProps) {
  return (
    <DashboardCard
      eyebrow="PENDING INVITATIONS"
      title={`${invitations.length} Pending Invitation${
        invitations.length === 1 ? "" : "s"
      }`}
      className="mt-8"
    >
      {invitations.length === 0 ? (
        <p className="mt-6 text-slate-400">No pending client invitations.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {invitations.map((invite) => (
            <div
              key={invite.id}
              className="rounded-2xl border border-slate-700 bg-[#020617] p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-black text-white">
                    {invite.client_email}
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Waiting for client acceptance.
                  </p>

                  <p className="mt-3 text-xs text-slate-500">
                    Sent{" "}
                    {invite.created_at
                      ? new Date(invite.created_at).toLocaleDateString()
                      : "recently"}
                  </p>
                </div>

                <button
                  onClick={() => handleRevokeInvitation(invite.id)}
                  className="rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-2 text-sm font-black text-red-300 hover:border-red-300"
                >
                  Revoke
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}