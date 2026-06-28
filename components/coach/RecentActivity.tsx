import DashboardCard from "@/components/coach/DashboardCard";

type RecentActivityProps = {
  activity: any[];
};

export default function RecentActivity({ activity }: RecentActivityProps) {
  return (
    <DashboardCard eyebrow="RECENT ACTIVITY" title="Workspace Activity">

      {activity.length === 0 ? (
        <p className="mt-6 text-slate-400">No recent activity yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {activity.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-700 bg-[#020617] p-5"
            >
              <p className="font-bold text-white">
                {formatActivityMessage(item)}
              </p>

              <p className="mt-2 text-sm text-slate-500">
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