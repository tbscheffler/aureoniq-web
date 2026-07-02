"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { hasWorkspaceAccess } from "@/services/workspaceAccessService";

export default function FounderPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [metrics, setMetrics] = useState({
    discoveryReports: 0,
    aiqReports: 0,
    savedJobs: 0,
    professionalSubs: 0,
    aiqProSubs: 0,
    coachOrganizations: 0,
    activeCoachClients: 0,
    coachingSessions: 0,
    completedCoachingSessions: 0,
    analyticsEvents: 0,
    analytics: {
      loginCompleted: 0,
      resumeUploaded: 0,
      discoveryCompleted: 0,
      upgradeClicked: 0,
      purchaseCompleted: 0,
    },
  });

  useEffect(() => {
    async function loadFounderDashboard() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

const isFounder = await hasWorkspaceAccess("founder");

if (!isFounder) {
  window.location.href = "/dashboard";
  return;
}

      setAuthorized(true);

      const [
        discovery,
        aiq,
        savedJobs,
        proSubs,
        aiqSubs,
        coachOrganizations,
        activeCoachClients,
        coachingSessions,
        completedCoachingSessions,
        events,
        analyticsEventsRaw,
      ] = await Promise.all([
        supabase.from("career_reports").select("id", { count: "exact", head: true }),
        supabase.from("aiq_reports").select("id", { count: "exact", head: true }),
        supabase.from("saved_jobs").select("id", { count: "exact", head: true }),
        supabase
          .from("user_entitlements")
          .select("id", { count: "exact", head: true })
          .eq("tier", "discovery_pro")
          .eq("status", "active"),
        supabase
          .from("user_entitlements")
          .select("id", { count: "exact", head: true })
          .eq("tier", "aiq_pro")
          .eq("status", "active"),
supabase
  .from("organizations")
  .select("id", { count: "exact", head: true })
  .eq("type", "coach"),

supabase
  .from("organization_clients")
  .select("id", { count: "exact", head: true })
  .eq("status", "active"),

supabase
  .from("organization_client_coaching_sessions")
  .select("id", { count: "exact", head: true }),

supabase
  .from("organization_client_coaching_sessions")
  .select("id", { count: "exact", head: true })
  .eq("status", "completed"),

supabase.from("analytics_events").select("id", { count: "exact", head: true }),
supabase.from("analytics_events").select("event_name"),
      ]);

      const eventCounts = {
        loginCompleted: 0,
        resumeUploaded: 0,
        discoveryCompleted: 0,
        upgradeClicked: 0,
        purchaseCompleted: 0,
      };
      
      analyticsEventsRaw.data?.forEach((event) => {
        switch (event.event_name) {
          case "login_completed":
            eventCounts.loginCompleted++;
            break;
          case "resume_uploaded":
            eventCounts.resumeUploaded++;
            break;
          case "discovery_completed":
            eventCounts.discoveryCompleted++;
            break;
          case "upgrade_clicked":
            eventCounts.upgradeClicked++;
            break;
          case "purchase_completed":
            eventCounts.purchaseCompleted++;
            break;
        }
      });

  setMetrics({
    discoveryReports: discovery.count || 0,
    aiqReports: aiq.count || 0,
    savedJobs: savedJobs.count || 0,
    professionalSubs: proSubs.count || 0,
    aiqProSubs: aiqSubs.count || 0,
    coachOrganizations: coachOrganizations.count || 0,
    activeCoachClients: activeCoachClients.count || 0,
    coachingSessions: coachingSessions.count || 0,
    completedCoachingSessions: completedCoachingSessions.count || 0,
    analyticsEvents: events.count || 0,
    analytics: eventCounts,
  });

      setLoading(false);
    }

    loadFounderDashboard();
  }, []);

  if (loading || !authorized) {
    return (
      <main className="min-h-screen bg-[#020617] text-white">
        <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
          <p className="text-[#FBBF24] font-black">Loading Founder Dashboard...</p>
        </section>
      </main>
    );
  }

  const estimatedMRR =
    metrics.professionalSubs * 9.99 + metrics.aiqProSubs * 14.99;

  const sessionCompletionRate =
  metrics.coachingSessions > 0
    ? Math.round(
        (metrics.completedCoachingSessions / metrics.coachingSessions) * 100
      )
    : 0;

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <a href="/" className="text-sm font-bold text-[#FBBF24]">
          ← Back to AureonIQ
        </a>

        <div className="mt-10">
          <p className="mb-4 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            FOUNDER DASHBOARD
          </p>

          <h1 className="text-5xl font-black">
            AureonIQ Command Center
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Track product usage, subscriptions, reports, and early traction.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <MetricCard title="Coach Organizations" value={metrics.coachOrganizations} />
          <MetricCard title="Active Coach Clients" value={metrics.activeCoachClients} />
          <MetricCard title="Coaching Sessions" value={metrics.coachingSessions} />
          <MetricCard title="Completed Sessions" value={metrics.completedCoachingSessions} />
          <MetricCard title="Session Completion Rate" value={sessionCompletionRate} suffix="%" />
          <MetricCard title="Discovery Reports" value={metrics.discoveryReports} />
          <MetricCard title="AIQ Reports" value={metrics.aiqReports} />
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-[#111827] p-8">
          <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            ESTIMATED MRR
          </p>

          <p className="mt-4 text-5xl font-black">
            ${estimatedMRR.toFixed(2)}
          </p>

          <p className="mt-3 text-slate-400">
            Based on active Supabase entitlements. RevenueCat should remain the source of truth for billing.
          </p>
        </div>
<div className="mt-8 rounded-3xl border border-slate-800 bg-[#111827] p-8">
  <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
    COACH ALPHA
  </p>

  <div className="mt-6 space-y-4 text-slate-300">

    <p>
      🏢 {metrics.coachOrganizations} coach organizations created
    </p>

    <p>
      👥 {metrics.activeCoachClients} active coach clients
    </p>

    <p>
      📅 {metrics.coachingSessions} coaching sessions created
    </p>

    <p>
      ✅ {metrics.completedCoachingSessions} coaching sessions completed
    </p>

    <p>
      📄 {metrics.discoveryReports} Discovery Reports generated
    </p>

    <p>
      🧠 {metrics.aiqReports} AIQ Reports generated
    </p>

  </div>
</div>
      </section>
    </main>
  );
}

function MetricCard({
  title,
  value,
  suffix = "",
}: {
  title: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
      <p className="text-sm font-bold text-slate-400">{title}</p>
      <p className="mt-4 text-4xl font-black text-[#FBBF24]">
  {value}
  {suffix}
</p>
    </div>
  );
}