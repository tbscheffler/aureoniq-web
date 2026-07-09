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
    <div className="rounded-[2rem] border border-slate-200 bg-white p-7 text-[#111827] shadow-sm">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">
        INVITE CLIENT
      </p>

      <h3 className="mt-3 text-2xl font-black text-slate-950">
        Create a client workspace
      </h3>

      <div className="mt-6 flex flex-col gap-4">
        <input
          className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#4C1D95] focus:ring-4 focus:ring-violet-100"
          placeholder="client@email.com"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
        />

        <button
          onClick={handleInviteClient}
          disabled={sendingInvite}
          className="rounded-2xl bg-[#4C1D95] px-6 py-4 font-black text-white transition hover:bg-[#3B147B] disabled:opacity-60"
        >
          {sendingInvite ? "Creating..." : "Create Invitation"}
        </button>
      </div>

      <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
        This only creates an invitation. Report access begins after the client
        accepts.
      </p>
    </div>
  );
}
