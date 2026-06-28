type TodaysAgendaProps = {
    meetings: any[];
    overdueActions: number;
  };
  
  export default function TodaysAgenda({
    meetings,
    overdueActions,
  }: TodaysAgendaProps) {
    return (
      <div className="mt-8 rounded-3xl border border-slate-800 bg-[#111827] p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
              TODAY
            </p>
  
            <h2 className="mt-3 text-2xl font-black text-white">
              Today's Agenda
            </h2>
          </div>
        </div>
  
        <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-700 bg-[#020617] p-6">
            <p className="text-sm font-bold text-slate-400">Meetings Today</p>

            {meetings.length === 0 ? (
                <p className="mt-4 text-slate-400">No meetings scheduled today.</p>
            ) : (
                <div className="mt-4 space-y-4">
                {meetings.map((meeting) => (
                    <div key={meeting.id} className="border-t border-slate-800 pt-4 first:border-t-0 first:pt-0">
                    <p className="font-black text-white">{meeting.title}</p>
                    <p className="mt-1 text-sm text-[#FBBF24]">
                        {new Date(meeting.meeting_date).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        })}
                    </p>
                    </div>
                ))}
                </div>
            )}
            </div>
  
          <AgendaCard
            title="Overdue Action Items"
            value={overdueActions}
            emptyMessage="No overdue action items."
          />
        </div>
      </div>
    );
  }
  
  function AgendaCard({
    title,
    value,
    emptyMessage,
  }: {
    title: string;
    value: number;
    emptyMessage: string;
  }) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-[#020617] p-6">
        <p className="text-sm font-bold text-slate-400">
          {title}
        </p>
  
        {value > 0 ? (
          <p className="mt-4 text-4xl font-black text-[#FBBF24]">
            {value}
          </p>
        ) : (
          <p className="mt-4 text-slate-400">
            {emptyMessage}
          </p>
        )}
      </div>
    );
  }