type TodaysAgendaProps = {
  meetings: any[];
  overdueActions: number;
};

export default function TodaysAgenda({
  meetings,
  overdueActions,
}: TodaysAgendaProps) {
  return (
    <div className="mt-7 rounded-[2rem] border border-slate-200 bg-white p-7 text-[#111827] shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">
            TODAY'S FOCUS
          </p>

          <h2 className="mt-3 text-2xl font-black text-slate-950">
            Coaching priorities for today
          </h2>

          <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
            Meetings and overdue growth items are surfaced here so client work
            stays focused.
          </p>
        </div>

        {overdueActions > 0 ? (
          <div className="rounded-full border border-[#E8D49B] bg-[#FFF8E7] px-4 py-2 text-xs font-black text-[#9A6A12]">
            {overdueActions} item{overdueActions === 1 ? "" : "s"} need attention
          </div>
        ) : null}
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Meetings Today
          </p>

          {meetings.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
              <p className="font-black text-slate-950">
                No meetings scheduled today.
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                A quiet calendar is a good time to review client intelligence or
                invite the next founding coach client.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <p className="font-black text-slate-950">{meeting.title}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {meeting.client_profile?.display_name ||
                      meeting.client?.client_email ||
                      "Client"}
                  </p>
                  <p className="mt-2 text-sm font-black text-[#B8872A]">
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

        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Growth Items
          </p>

          {overdueActions > 0 ? (
            <div className="mt-5 rounded-2xl border border-[#E8D49B] bg-[#FFF8E7] p-5">
              <p className="text-4xl font-black text-[#B8872A]">
                {overdueActions}
              </p>
              <p className="mt-3 text-sm font-bold leading-6 text-[#7C4A03]">
                Review overdue items before your next client conversation.
              </p>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <p className="font-black text-emerald-950">No overdue items.</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-emerald-800">
                Your growth plan queue is clear.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
