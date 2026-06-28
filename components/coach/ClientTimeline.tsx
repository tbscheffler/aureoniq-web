import DashboardCard from "@/components/coach/DashboardCard";

type ClientTimelineProps = {
  events: any[];
};

export default function ClientTimeline({
  events,
}: ClientTimelineProps) {
  return (
    <DashboardCard
      eyebrow="CLIENT TIMELINE"
      title="Career Journey"
    >
      {events.length === 0 ? (
        <p className="mt-6 text-slate-400">
          No timeline events yet.
        </p>
      ) : (
        <div className="mt-6 space-y-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex gap-4"
            >
              <div className="mt-2 h-3 w-3 rounded-full bg-[#FBBF24]" />

              <div>
                <p className="font-black text-white">
                  {event.title}
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {event.description}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {new Date(event.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}