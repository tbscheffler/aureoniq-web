type InviteClientCardProps = {
    clientEmail: string;
    setClientEmail: (email: string) => void;
    sendingInvite: boolean;
    handleInviteClient: () => void;
  };
  
  export default function InviteClientCard({
    clientEmail,
    setClientEmail,
    sendingInvite,
    handleInviteClient,
  }: InviteClientCardProps) {
    return (
      <div className="mt-8 rounded-3xl border border-slate-800 bg-[#111827] p-8">
        <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
          INVITE CLIENT
        </p>
  
        <div className="mt-6 flex flex-col gap-4 md:flex-row">
          <input
            className="flex-1 rounded-2xl border border-slate-700 bg-[#020617] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
            placeholder="client@email.com"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
          />
  
          <button
            onClick={handleInviteClient}
            disabled={sendingInvite}
            className="rounded-2xl bg-[#FBBF24] px-6 py-4 font-black text-[#020617] disabled:opacity-60"
          >
            {sendingInvite ? "Creating..." : "Create Invitation"}
          </button>
        </div>
  
        <p className="mt-4 text-sm text-slate-400">
          This only creates an invitation. The coach gets no report access until
          the client accepts.
        </p>
      </div>
    );
  }