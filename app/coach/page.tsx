"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CoachPage() {
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    async function loadCoachDashboard() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      const { data: membership } = await supabase
        .from("organization_members")
        .select("organization_id, role")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (!membership) {
        window.location.href = "/dashboard";
        return;
      }

      const { data: orgData } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", membership.organization_id)
        .maybeSingle();

      const { data: planData } = await supabase
        .from("organization_plans")
        .select("*")
        .eq("organization_id", membership.organization_id)
        .eq("status", "active")
        .maybeSingle();

      const { data: clientData } = await supabase
        .from("organization_clients")
        .select("*")
        .eq("organization_id", membership.organization_id)
        .eq("status", "active");

      setOrganization(orgData);
      setPlan(planData);
      setClients(clientData || []);
      setLoading(false);
    }

    loadCoachDashboard();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] text-white">
        <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
          <p className="font-black text-[#FBBF24]">Loading Coach Dashboard...</p>
        </section>
      </main>
    );
  }

  const clientLimit = plan?.managed_client_limit || 0;
  const activeClients = clients.length;

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <a href="/" className="text-sm font-bold text-[#FBBF24]">
          ← Back to AureonIQ
        </a>

        <div className="mt-10">
          <p className="mb-4 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            COACH DASHBOARD
          </p>

          <h1 className="text-5xl font-black">
            {organization?.name || "Coach Workspace"}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Manage invited clients, review career intelligence, and help clients discover opportunities they didn&apos;t know they qualified for.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <MetricCard title="Plan" value={plan?.plan_type || "Not set"} />
          <MetricCard title="Active Clients" value={`${activeClients} / ${clientLimit}`} />
          <MetricCard title="Sponsored Tier" value={plan?.sponsored_tier || "None"} />
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-[#111827] p-8">
          <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            INVITE CLIENT
          </p>

          <p className="mt-4 text-slate-300">
            Invitation flow coming next. Coaches will invite clients by email, and clients must accept before access is granted.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-[#111827] p-8">
          <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            CLIENT OVERVIEW
          </p>

          {clients.length === 0 ? (
            <p className="mt-4 text-slate-400">
              No active clients yet.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="rounded-2xl border border-slate-700 bg-[#020617] p-5"
                >
                  <p className="font-black text-white">
                    Client
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    User ID: {client.client_user_id}
                  </p>

                  <p className="mt-2 text-sm text-slate-400">
                    Status: {client.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function MetricCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
      <p className="text-sm font-bold text-slate-400">{title}</p>
      <p className="mt-4 text-3xl font-black text-[#FBBF24]">{value}</p>
    </div>
  );
}