"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCurrentOrganization,
  getOrganizationPlan,
  getOrganizationClients,
  getPendingInvitations,
  getCoachDashboardStats,
  getCoachRecentActivity,
  sendOrganizationInvitation,
  revokeOrganizationInvitation,
} from "@/services/coachService";
import QuickActions from "@/components/coach/QuickActions";
import RecentActivity from "@/components/coach/RecentActivity";
import CoachMetrics from "@/components/coach/CoachMetrics";
import InviteClientCard from "@/components/coach/InviteClientCard";
import PendingInvitations from "@/components/coach/PendingInvitations";
import ActiveClients from "@/components/coach/ActiveClients";
import SeatUsageCard from "@/components/coach/SeatUsageCard";
import CoachShell from "@/components/coach/CoachShell";

export default function CoachPage() {
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [clientEmail, setClientEmail] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);

  async function loadCoachDashboard() {
    try {
      const membership = await getCurrentOrganization();

      const organizationId = membership.organization_id;
      const orgData = Array.isArray(membership.organizations)
        ? membership.organizations[0]
        : membership.organizations;

        const [planData, clientData, inviteData, statsData, activityData] =
        await Promise.all([
          getOrganizationPlan(organizationId),
          getOrganizationClients(organizationId),
          getPendingInvitations(organizationId),
          getCoachDashboardStats(organizationId),
          getCoachRecentActivity(organizationId),
        ]);

      setOrganization(orgData);
      setPlan(planData);
      setClients(clientData || []);
      setInvitations(inviteData || []);
      setStats(statsData);
      setActivity(activityData || []);
      setLoading(false);
    } catch (error: any) {
      console.log("LOAD COACH DASHBOARD ERROR:", error.message);
      window.location.href = "/dashboard";
    }
  }

  useEffect(() => {
    loadCoachDashboard();
  }, []);

  async function handleInviteClient() {
    if (!clientEmail.trim()) {
      alert("Enter a client email first.");
      return;
    }

    if (!organization?.id) {
      alert("Organization not loaded yet.");
      return;
    }

    if (clients.length >= (plan?.managed_client_limit || 0)) {
      alert("You have reached your active client limit.");
      return;
    }

    try {
      setSendingInvite(true);
    
      await sendOrganizationInvitation(
        organization.id,
        clientEmail.trim().toLowerCase()
      );
    
      setClientEmail("");
      await loadCoachDashboard();
      alert("Invitation sent.");
    } catch (error: any) {
      alert(error.message || "Failed to send invitation.");
    } finally {
      setSendingInvite(false);
    }
  }

  async function handleRevokeInvitation(invitationId: string) {
    const confirmed = confirm(
      "Revoke this invitation? The client will no longer be able to accept it."
    );

    if (!confirmed) return;

    try {
      await revokeOrganizationInvitation(invitationId);
      await loadCoachDashboard();
      alert("Invitation revoked.");
    } catch (error: any) {
      alert(error.message || "Failed to revoke invitation.");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] text-white">
        <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
          <p className="font-black text-[#FBBF24]">
            Loading Coach Dashboard...
          </p>
        </section>
      </main>
    );
  }

  const clientLimit = Number(plan?.managed_client_limit ?? 4);
  const activeClients = clients.length;

  return (
    <CoachShell>
    <section>

        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
              COACH WORKSPACE
            </p>

            <h1 className="text-5xl font-black">
              {organization?.name || "Coach Workspace"}
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              Invite clients, manage active relationships, and review career
              intelligence only after client consent.
            </p>
          </div>

          {/* <div className="flex flex-wrap gap-3">
            <Link
              href="/coach"
              className="rounded-2xl bg-[#FBBF24] px-5 py-3 font-black text-[#020617]"
            >
              Clients
            </Link>

            <Link
              href="/coach/team"
              className="rounded-2xl border border-slate-700 bg-[#111827] px-5 py-3 font-black text-white hover:border-[#FBBF24]"
            >
              Team
            </Link>

            <Link
              href="/coach/billing"
              className="rounded-2xl border border-slate-700 bg-[#111827] px-5 py-3 font-black text-white hover:border-[#FBBF24]"
            >
              Billing
            </Link>

            <Link
              href="/coach/settings"
              className="rounded-2xl border border-slate-700 bg-[#111827] px-5 py-3 font-black text-white hover:border-[#FBBF24]"
            >
              Settings
            </Link>
          </div> */}
        </div>

        <CoachMetrics
          activeClients={stats?.activeClients ?? activeClients}
          clientLimit={clientLimit}
          teamMembers={stats?.teamMembers ?? 0}
          pendingInvites={
            (stats?.pendingClientInvites ?? 0) +
            (stats?.pendingTeamInvites ?? 0)
          }
          notesThisWeek={stats?.notesThisWeek ?? 0}
          meetingsThisWeek={stats?.meetingsThisWeek ?? 0}
          planName={plan?.plan_type || "Free Beta"}
        />

        <SeatUsageCard
          activeClients={stats?.activeClients ?? activeClients}
          clientLimit={clientLimit}
          planName={plan?.plan_type || "free_beta"}
        />

        <QuickActions />

        <RecentActivity activity={activity} />

        <InviteClientCard
          clientEmail={clientEmail}
          setClientEmail={setClientEmail}
          sendingInvite={sendingInvite}
          handleInviteClient={handleInviteClient}
        />

        <PendingInvitations
          invitations={invitations}
          handleRevokeInvitation={handleRevokeInvitation}
        />

        <ActiveClients clients={clients} />
        </section>
        </CoachShell>
  );
}


