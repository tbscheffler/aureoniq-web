type CoachNotesHistoryProps = {
  notes: any[];
  loading: boolean;
};

export default function CoachNotesHistory({
  notes,
  loading,
}: CoachNotesHistoryProps) {
  return (
    <div className="mt-8 rounded-3xl border border-slate-800 bg-[#111827] p-8">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-[#FBBF24]">
        PREVIOUS SESSIONS
      </p>

      <h2 className="mt-3 text-3xl font-black text-white">
        Notes History
      </h2>

      {loading ? (
        <p className="mt-6 text-slate-400">Loading notes...</p>
      ) : notes.length === 0 ? (
        <p className="mt-6 text-slate-400">No saved notes yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {notes.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-700 bg-[#020617] p-5"
            >
              <p className="whitespace-pre-wrap leading-7 text-slate-300">
                {item.note}
              </p>

              <p className="mt-4 text-xs text-slate-500">
                Created{" "}
                {item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : "recently"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}