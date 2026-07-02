type TimelineEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  type:
    | "resume"
    | "assessment"
    | "aiq"
    | "meeting"
    | "note"
    | "action"
    | "health";
};

interface Props {
  events: TimelineEvent[];
}

export default function CareerJourneyTimeline({
  events,
}: Props) {
  return (
    <div className="space-y-4">
      {events.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-[#111827] p-6 text-slate-400">
          No career activity yet.
        </div>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            className="rounded-2xl border border-slate-800 bg-[#111827] p-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-black text-white">
                {event.title}
              </h3>

              <span className="text-xs uppercase tracking-wider text-slate-500">
                {event.date}
              </span>
            </div>

            <p className="mt-2 text-slate-400">
              {event.description}
            </p>
          </div>
        ))
      )}
    </div>
  );
}