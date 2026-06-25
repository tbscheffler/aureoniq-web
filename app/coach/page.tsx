"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  getCurrentOrganization,
  getOrganizationPlan,
  getOrganizationClients,
  getPendingInvitations,
  sendOrganizationInvitation,
} from "@/services/coachService";

export default function CoachPage() {
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [clientEmail, setClientEmail] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);

  async function loadCoachDashboard() {
    try {
      const membership = await getCurrentOrganization();
  
      const organizationId = membership.organization_id;
      const orgData = Array.isArray(membership.organizations)
        ? membership.organizations[0]
        : membership.organizations;
  
      const [planData, clientData, inviteData] = await Promise.all([
        getOrganizationPlan(organizationId),
        getOrganizationClients(organizationId),
        getPendingInvitations(organizationId),
      ]);
  
      setOrganization(orgData);
      setPlan(planData);
      setClients(clientData || []);
      setInvitations(inviteData || []);
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
    } finally {
      setSendingInvite(false);
    }
  }

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
            COACH WORKSPACE
          </p>

          <h1 className="text-5xl font-black">
            {organization?.name || "Coach Workspace"}
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Invite clients, manage active relationships, and review career intelligence only after client consent.
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

          <div className="mt-6 flex flex-col gap-4 md:flex-row">
            <input
              className="flex-1 rounded-2xl border border-slate-700 bg-[#020617] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
              placeholder="client@email.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
            />

            <button
              onClick={handleInviteClient}
              disabled={sendingInvite}
              className="rounded-2xl bg-[#FBBF24] px-6 py-4 font-black text-[#020617] disabled:opacity-60"
            >
              {sendingInvite ? "Creating..." : "Create Invitation"}
            </button>
          </div>

          <p className="mt-4 text-sm text-slate-400">
            This only creates an invitation. The coach gets no report access until the client accepts.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-[#111827] p-8">
          <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            PENDING INVITATIONS
          </p>

          {invitations.length === 0 ? (
            <p className="mt-4 text-slate-400">No pending invitations.</p>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {invitations.map((invite) => (
                <div
                  key={invite.id}
                  className="rounded-2xl border border-slate-700 bg-[#020617] p-5"
                >
                  <p className="font-black text-white">{invite.client_email}</p>
                  <p className="mt-2 text-sm text-slate-400">
                    Status: {invite.status}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Expires: {new Date(invite.expires_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-[#111827] p-8">
          <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            ACTIVE CLIENTS
          </p>

          {clients.length === 0 ? (
            <p className="mt-4 text-slate-400">No active clients yet.</p>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="rounded-2xl border border-slate-700 bg-[#020617] p-5"
                >
                  <p className="font-black text-white">Client</p>
                  <p className="mt-2 text-sm text-slate-400">
                    User ID: {client.client_user_id}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Access: {client.access_level}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Sponsored Tier: {client.sponsored_tier}
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