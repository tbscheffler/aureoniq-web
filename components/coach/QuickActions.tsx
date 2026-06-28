import Link from "next/link";
import DashboardCard from "@/components/coach/DashboardCard";

export default function QuickActions() {
  return (
    <DashboardCard eyebrow="QUICK ACTIONS" title="Get Started">

      <div className="mt-6 grid gap-4">
        

        <ActionCard
          href="/coach"
          emoji="👤"
          title="Invite Client"
          description="Add a new client to your organization."
        />

        <ActionCard
          href="/coach/team"
          emoji="👥"
          title="Invite Team Member"
          description="Add another coach or administrator."
        />

        <ActionCard
          href="/coach"
          emoji="📝"
          title="Coach Notes"
          description="Review and update coaching notes."
        />

        <ActionCard
          href="/coach"
          emoji="📅"
          title="Meetings"
          description="Manage upcoming coaching sessions."
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