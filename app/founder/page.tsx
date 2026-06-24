"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function FounderPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [metrics, setMetrics] = useState({
    discoveryReports: 0,
    aiqReports: 0,
    savedJobs: 0,
    professionalSubs: 0,
    aiqProSubs: 0,
    analyticsEvents: 0,
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

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      if (roleData?.role !== "founder") {
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
        events,
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
        supabase.from("analytics_events").select("id", { count: "exact", head: true }),
      ]);

      setMetrics({
        discoveryReports: discovery.count || 0,
        aiqReports: aiq.count || 0,
        savedJobs: savedJobs.count || 0,
        professionalSubs: proSubs.count || 0,
        aiqProSubs: aiqSubs.count || 0,
        analyticsEvents: events.count || 0,
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
          <MetricCard title="Discovery Reports" value={metrics.discoveryReports} />
          <MetricCard title="AIQ Reports" value={metrics.aiqReports} />
          <MetricCard title="Saved Jobs" value={metrics.savedJobs} />
          <MetricCard title="Professional Subscribers" value={metrics.professionalSubs} />
          <MetricCard title="AIQ Pro Subscribers" value={metrics.aiqProSubs} />
          <MetricCard title="Analytics Events" value={metrics.analyticsEvents} />
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
      </section>
    </main>
  );
}

function MetricCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
      <p className="text-sm font-bold text-slate-400">{title}</p>
      <p className="mt-4 text-4xl font-black text-[#FBBF24]">{value}</p>
    </div>
  );
}