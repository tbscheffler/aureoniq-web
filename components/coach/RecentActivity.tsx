export default function RecentActivity({ activity }: { activity: any[] }) {
    return (
      <div className="mt-10 rounded-3xl border border-slate-800 bg-[#111827] p-8">
        <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
          RECENT ACTIVITY
        </p>
  
        {activity.length === 0 ? (
          <p className="mt-4 text-slate-400">No recent activity yet.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {activity.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-700 bg-[#020617] p-5"
              >
                <p className="font-bold text-white">
                  {formatActivityLabel(item.action)}
                </p>
  
                <p className="mt-2 text-sm text-slate-500">
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : "Recently"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  function formatActivityLabel(action: string) {
    switch (action) {
      case "organization_member_invitation_sent":
        return "Team invitation sent";
      case "organization_member_invitation_accepted":
        return "Team invitation accepted";
      case "organization_invitation_sent":
        return "Client invitation sent";
      case "organization_invitation_accepted":
        return "Client invitation accepted";
      case "organization_client_note_created":
        return "Coach note created";
      case "organization_client_meeting_created":
        return "Meeting added";
      case "organization_client_action_item_created":
        return "Action item created";
      default:
        return action || "Activity";
    }
  }