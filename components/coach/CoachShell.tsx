"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getCurrentOrganization,
  getUnreadOrganizationNotificationCount,
} from "@/services/coachService";

export default function CoachShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function loadUnreadCount() {
      try {
        const membership = await getCurrentOrganization();
        const count = await getUnreadOrganizationNotificationCount(
          membership.organization_id
        );

        setUnreadCount(count);
      } catch {
        setUnreadCount(0);
      }
    }

    loadUnreadCount();
  }, []);

  return (
    <main className="min-h-screen bg-[#020617] text-white">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr] lg:py-8">
    <aside className="rounded-3xl border border-slate-800 bg-[#111827] p-4 sm:p-6 lg:sticky lg:top-6 lg:self-start">
          <Link href="/" className="text-sm font-black text-[#FBBF24]">
            AUREONIQ
          </Link>

          <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
            Coach
          </p>

          <nav className="mt-6 grid grid-cols-2 gap-3 lg:mt-8 lg:block lg:space-y-3">
          <CoachNavLink href="/coach" label="Clients" currentPath={pathname} />
        <CoachNavLink href="/coach/team" label="Team" currentPath={pathname} />
        <CoachNavLink
          href="/coach/notifications"
          label="Notifications"
          currentPath={pathname}
          badgeCount={unreadCount}
        />
        <CoachNavLink href="/coach/billing" label="Billing" currentPath={pathname} />
        <CoachNavLink href="/coach/settings" label="Settings" currentPath={pathname} />
          </nav>
        </aside>

        <section>{children}</section>
      </div>
    </main>
  );
}

function CoachNavLink({
  href,
  label,
  currentPath,
  badgeCount = 0,
}: {
  href: string;
  label: string;
  currentPath: string;
  badgeCount?: number;
}) {
  const active = currentPath === href;

  return (
    <Link
      href={href}
      className={`flex items-center justify-between rounded-2xl px-5 py-4 font-black transition ${
        active
          ? "bg-[#FBBF24] text-[#020617]"
          : "border border-slate-800 bg-[#020617] text-slate-200 hover:border-[#FBBF24] hover:text-[#FBBF24]"
      }`}
    >
    <span>{label}</span>

    {badgeCount > 0 ? (
      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-black text-white">
        {badgeCount}
      </span>
    ) : null}
    </Link>
  );
}