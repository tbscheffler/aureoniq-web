"use client";

import { useEffect, useState } from "react";
import {
  getCurrentOrganization,
  getOrganizationPlan,
  getOrganizationClients,
  getCoachDashboardStats,
  getCoachRecentActivity,
  getCoachAgendaStats,
  getTodaysCoachMeetings,
  ensureSampleClientForOrganization,
  getCoachDashboard,
  getClientHealth,
} from "@/services/coachService";
import RecentActivity from "@/components/coach/RecentActivity";
import CoachShell from "@/components/coach/CoachShell";
import CoachDashboardHeader from "@/components/coach/CoachDashboardHeader";
import TodaysAgenda from "@/components/coach/TodaysAgenda";
import { getCoachEntitlement } from "@/services/billing/entitlementService";
import CoachCommandCenter from "@/components/coach/CoachCommandCenter";
import CoachSnapshot from "@/components/coach/CoachSnapshot";

export default function CoachPage() {
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [clientEmail, setClientEmail] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [agendaStats, setAgendaStats] = useState<any>(null);
  const [todaysMeetings, setTodaysMeetings] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);

  async function loadCoachDashboard() {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const checkoutSuccess = searchParams.get("checkout") === "success";
      const sessionId = searchParams.get("session_id");

      if (checkoutSuccess && sessionId) {
        const provisionResponse = await fetch("/api/stripe/provision-coach", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const provisionData = await provisionResponse.json();

        if (!provisionResponse.ok) {
          throw new Error(
            provisionData.error || "Unable to activate coach workspace."
          );
        }

        window.history.replaceState({}, "", "/coach");
      }

      const entitlement = await getCoachEntitlement();

      if (!entitlement.hasAccess) {
        window.location.href = `/billing-required?reason=${entitlement.reason}`;
        return;
      }

      const membership = await getCurrentOrganization();

      const organizationId = membership.organization_id;
      await ensureSampleClientForOrganization(organizationId);
      const orgData = Array.isArray(membership.organizations)
        ? membership.organizations[0]
        : membership.organizations;

      const [
        planData,
        clientData,
        dashboardData,
        activityData,
        todaysMeetingsData,
      ] = await Promise.all([
        getOrganizationPlan(organizationId),
        getOrganizationClients(organizationId),
        getCoachDashboard(organizationId),
        getCoachRecentActivity(organizationId),
        getTodaysCoachMeetings(organizationId),
      ]);

      setOrganization(orgData);
      setPlan(planData);
            const clientsWithHealth = await Promise.all(
        (clientData || []).map(async (client) => ({
          ...client,
          health: await getClientHealth(client.id),
        }))
      );

      setClients(clientsWithHealth);
      setDashboardData(dashboardData);
      setStats(dashboardData?.stats || null);
      setActivity(activityData || []);
      setAgendaStats(dashboardData?.agenda || null);
      setTodaysMeetings(todaysMeetingsData || []);
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  }

  useEffect(() => {
    loadCoachDashboard();
  }, []);


  const seatUsage = dashboardData?.seatUsage;

  const clientLimit = Number(seatUsage?.seat_limit ?? plan?.managed_client_limit ?? 4);
  const activeClients = Number(seatUsage?.billable_clients ?? clients.length);
  const demoClients = Number(seatUsage?.demo_clients ?? 0);

  return (
    <CoachShell>
    <section>

    <CoachDashboardHeader
        organizationName={organization?.name || "Coach Workspace"}
        planName={plan?.plan_type || "Free Beta"}
      />

        <CoachSnapshot
          activeClients={stats?.activeClients ?? activeClients}
          clientLimit={clientLimit}
          overdueActions={agendaStats?.overdueActions ?? 0}
          meetingsToday={todaysMeetings.length}
          demoClients={demoClients}
        />

        <div id="todays-agenda">
          <TodaysAgenda
            meetings={todaysMeetings}
            overdueActions={agendaStats?.overdueActions ?? 0}
          />
        </div>



        <div className="mt-8 grid items-stretch gap-6 lg:grid-cols-[1fr_1fr]">
          <CoachCommandCenter clients={clients} />

          <RecentActivity activity={activity} />
        </div>
        </section>
        </CoachShell>
  );
}


