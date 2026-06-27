import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-black text-white">
        Quick Actions
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

        <ActionCard
          href="/coach/clients"
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
          href="/coach/notes"
          emoji="📝"
          title="Coach Notes"
          description="Review and update coaching notes."
        />

        <ActionCard
          href="/coach/meetings"
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
      className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-[#FBBF24]"
    >
      <p className="text-3xl">{emoji}</p>

      <p className="mt-4 font-black text-white">
        {title}
      </p>

      <p className="mt-2 text-sm text-slate-400">
        {description}
      </p>
    </Link>
  );
}