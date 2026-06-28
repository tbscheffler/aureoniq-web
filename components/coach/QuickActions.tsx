import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
      <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
        QUICK ACTIONS
      </p>

      <h2 className="mt-3 text-2xl font-black text-white">
        Get Started
      </h2>

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
    </div>
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