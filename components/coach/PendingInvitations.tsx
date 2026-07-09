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
    >
      {invitations.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="font-black text-slate-950">No pending invitations.</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
            New client invites will appear here until accepted.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {invitations.map((invite) => (
            <div
              key={invite.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
                <div className="min-w-0 flex-1">
                  <p
                    className="truncate font-black text-slate-950"
                    title={invite.client_email}
                  >
                    {invite.client_email}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    Waiting for client acceptance.
                  </p>

                  <p className="mt-3 text-xs font-semibold text-slate-400">
                    Sent{" "}
                    {invite.created_at
                      ? new Date(invite.created_at).toLocaleDateString()
                      : "recently"}
                  </p>
                </div>

                <button
                  onClick={() => handleRevokeInvitation(invite.id)}
                  className="shrink-0 self-start rounded-2xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-black text-red-700 hover:border-red-200"
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
