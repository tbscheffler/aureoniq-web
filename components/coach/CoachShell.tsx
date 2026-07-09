"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getCurrentOrganization,
  getUnreadOrganizationNotificationCount,
} from "@/services/coachService";
import { supabase } from "@/lib/supabaseClient";

export default function CoachShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [unreadCount, setUnreadCount] = useState(0);
  const [coachName, setCoachName] = useState("Coach");
  const [organizationName, setOrganizationName] = useState("Coach Workspace");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    async function loadShellContext() {
      try {
        const membership = await getCurrentOrganization();
        const organizationId = membership.organization_id;
        const orgData = Array.isArray(membership.organizations)
          ? membership.organizations[0]
          : membership.organizations;

        if (orgData?.name) {
          setOrganizationName(orgData.name);
        }

        const [count, userResponse] = await Promise.all([
          getUnreadOrganizationNotificationCount(organizationId),
          supabase.auth.getUser(),
        ]);

        setUnreadCount(count);

        const user = userResponse.data.user;
        const displayName =
          user?.user_metadata?.display_name ||
          user?.user_metadata?.full_name ||
          user?.email ||
          "Coach";

        setCoachName(displayName);
      } catch {
        setUnreadCount(0);
      }
    }

    loadShellContext();
  }, []);

  async function handleSignOut() {
    try {
      setSigningOut(true);
      await supabase.auth.signOut();
      router.push("/login");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white lg:bg-[#F8FAFC]">
      <aside className="border-b border-slate-800 bg-[#020617] px-4 py-4 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-[286px] lg:border-b-0 lg:border-r lg:border-slate-900 lg:p-0">
        <div className="flex h-full flex-col rounded-[1.75rem] border border-slate-800 bg-[#111827] p-5 shadow-sm lg:min-h-screen lg:rounded-none lg:border-0 lg:px-7 lg:py-8 lg:shadow-none">
          <div>
            <Link href="/coach" className="text-sm font-black text-[#FBBF24]">
              AUREONIQ
            </Link>

            <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
              Coach
            </p>

            <div className="mt-5 rounded-2xl border border-slate-800 bg-[#020617]/70 px-4 py-3 lg:hidden">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                Workspace
              </p>
              <p className="mt-1 truncate text-sm font-black text-white">
                {organizationName}
              </p>
            </div>
          </div>

          <nav className="mt-6 grid grid-cols-2 gap-3 lg:mt-10 lg:block lg:space-y-3">
            <CoachNavLink href="/coach" label="Dashboard" currentPath={pathname} />
            <CoachNavLink
              href="/coach/clients"
              label="Clients"
              currentPath={pathname}
            />
            <CoachNavLink href="/coach/team" label="Team" currentPath={pathname} />
            <CoachNavLink
              href="/coach/notifications"
              label="Notifications"
              currentPath={pathname}
              badgeCount={unreadCount}
            />
          </nav>

          <div className="mt-6 hidden flex-1 lg:block" />

          <div className="mt-6 rounded-[1.4rem] border border-slate-800 bg-[#020617]/80 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
                  Signed in
                </p>
                <p className="mt-1 truncate text-sm font-black text-white">
                  {coachName}
                </p>
                <p className="mt-1 hidden truncate text-xs font-semibold text-slate-500 lg:block">
                  {organizationName}
                </p>
              </div>

              <Link
                href="/coach/settings"
                title="Settings"
                aria-label="Open coach settings"
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-base font-black transition ${
                  pathname.startsWith("/coach/settings") ||
                  pathname.startsWith("/coach/billing")
                    ? "border-[#FBBF24] bg-[#FBBF24] text-[#020617]"
                    : "border-slate-800 bg-[#111827] text-[#FBBF24] hover:border-[#FBBF24]"
                }`}
              >
                ⚙
              </Link>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="mt-4 w-full rounded-2xl border border-slate-800 bg-[#111827] px-4 py-3 text-sm font-black text-slate-200 transition hover:border-[#FBBF24] hover:text-[#FBBF24] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {signingOut ? "Signing out..." : "Logout"}
            </button>
          </div>
        </div>
      </aside>

      <section className="min-h-screen bg-[#F8FAFC] px-5 py-6 text-[#111827] lg:ml-[286px] lg:px-8 lg:py-8">
        <div className="mx-auto max-w-[1500px]">{children}</div>
      </section>
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
  const active = href === "/coach" ? currentPath === href : currentPath.startsWith(href);

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
