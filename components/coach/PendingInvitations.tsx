type PendingInvitationsProps = {
    invitations: any[];
    handleRevokeInvitation: (invitationId: string) => void;
  };
  
  export default function PendingInvitations({
    invitations,
    handleRevokeInvitation,
  }: PendingInvitationsProps) {
    return (
      <div className="mt-8 rounded-3xl border border-slate-800 bg-[#111827] p-8">
        <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
          PENDING INVITATIONS
        </p>
  
        {invitations.length === 0 ? (
          <p className="mt-4 text-slate-400">No pending invitations.</p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {invitations.map((invite) => (
              <div
                key={invite.id}
                className="rounded-2xl border border-slate-700 bg-[#020617] p-5"
              >
                <p className="font-black text-white">{invite.client_email}</p>
  
                <p className="mt-2 text-sm text-slate-400">
                  Status: {invite.status}
                </p>
  
                <p className="mt-2 text-sm text-slate-400">
                  Expires: {new Date(invite.expires_at).toLocaleDateString()}
                </p>
  
                <button
                  onClick={() => handleRevokeInvitation(invite.id)}
                  className="mt-4 rounded-xl border border-red-500/40 px-4 py-2 text-sm font-bold text-red-300 hover:bg-red-500/10"
                >
                  Revoke Invitation
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }