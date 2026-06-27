import Link from "next/link";

export default function CoachShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-3xl border border-slate-800 bg-[#111827] p-6">
          <Link href="/" className="text-sm font-black text-[#FBBF24]">
            AUREONIQ
          </Link>

          <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
            Coach
          </p>

          <nav className="mt-8 space-y-3">
            <CoachNavLink href="/coach" label="Clients" />
            <CoachNavLink href="/coach/team" label="Team" />
            <CoachNavLink href="/coach/billing" label="Billing" />
            <CoachNavLink href="/coach/settings" label="Settings" />
          </nav>
        </aside>

        <section>{children}</section>
      </div>
    </main>
  );
}

function CoachNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-slate-800 bg-[#020617] px-5 py-4 font-black text-slate-200 hover:border-[#FBBF24] hover:text-[#FBBF24]"
    >
      {label}
    </Link>
  );
}