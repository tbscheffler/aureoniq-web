import Link from "next/link";
import DashboardCard from "@/components/coach/DashboardCard";

export default function QuickActions() {
  return (
    <DashboardCard eyebrow="COACH COMMAND CENTER" title="Today's Priorities">

      <div className="mt-6 grid gap-4">
        

      <ActionCard
        href="#invite-client"
        emoji="👤"
        title="Invite Client"
        description="Add a new client and start their sponsored AureonIQ access."
      />

      <ActionCard
        href="#todays-agenda"
        emoji="📅"
        title="Today's Agenda"
        description="Review meetings and overdue client actions for today."
      />

      <ActionCard
        href="#active-clients"
        emoji="📝"
        title="Open Client Workspace"
        description="Choose a client to review notes, meetings, resume insights, and action items."
      />

      <ActionCard
        href="/coach/team"
        emoji="👥"
        title="Invite Team Member"
        description="Add another coach or administrator to your workspace."
      />

      </div>
      </DashboardCard>
  );
}

function ActionCard({
  href,
  emoji,
  title,
  description,
}: {
  href: string;
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-[#FBBF24]"
    >
      <p className="text-3xl">{emoji}</p>

      <div>
        <p className="font-black text-white">{title}</p>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
    </Link>
  );
}