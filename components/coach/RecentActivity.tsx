import DashboardCard from "@/components/coach/DashboardCard";

type RecentActivityProps = {
  activity: any[];
};

export default function RecentActivity({ activity }: RecentActivityProps) {
  return (
    <DashboardCard eyebrow="RECENT ACTIVITY" title="Workspace activity" className="h-full">
      {activity.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="font-black text-slate-950">No recent activity yet.</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
            Activity will appear here as clients accept invitations, reports are
            shared, sessions are logged, and reflections are added.
          </p>
        </div>
      ) : (
        <div className="mt-6 max-h-[420px] space-y-4 overflow-y-auto pr-2">
          {activity.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <p className="font-bold text-slate-950">
                {formatActivityMessage(item)}
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-500">
                {formatActivityDate(item.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

function formatActivityMessage(item: any) {
  const actorName =
    item.actor_profile?.display_name ||
    item.metadata?.actor_email ||
    "Someone";

  switch (item.action) {
    case "organization_invitation_sent":
      return `${actorName} invited ${item.metadata?.client_email || "a client"}.`;

    case "organization_member_invitation_sent":
      return `${actorName} invited ${
        item.metadata?.invite_email || "a team member"
      } as ${item.metadata?.role || "coach"}.`;

    case "organization_client_note_created":
      return `${actorName} added a client note.`;

    case "organization_client_meeting_created":
      return `${actorName} logged a client meeting.`;

    case "organization_client_action_item_created":
      return `${actorName} created an action item.`;

    default:
      return `${actorName} updated the workspace.`;
  }
}

function formatActivityDate(dateValue: string) {
  if (!dateValue) return "";

  return new Date(dateValue).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
