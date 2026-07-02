"use client";

import { useEffect, useState } from "react";
import CoachShell from "@/components/coach/CoachShell";
import InviteClientCard from "@/components/coach/InviteClientCard";
import PendingInvitations from "@/components/coach/PendingInvitations";
import ActiveClients from "@/components/coach/ActiveClients";
import {
  getCurrentOrganization,
  getOrganizationPlan,
  getOrganizationClients,
  getPendingInvitations,
  sendOrganizationInvitation,
  revokeOrganizationInvitation,
} from "@/services/coachService";
import SearchBar from "@/components/coach/SearchBar";

export default function CoachClientsPage() {
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [clientEmail, setClientEmail] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [clientFilter, setClientFilter] = useState<"all" | "active" | "demo">("all");
  const [clientSort, setClientSort] = useState<"name" | "activeFirst" | "demoFirst">("activeFirst");

const filteredClients = clients.filter((client) => {
  const searchableText = [
    client.client_display_name,
    client.profile?.display_name,
    client.client_profile?.display_name,
    client.client_email,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const matchesSearch = searchableText.includes(searchQuery.toLowerCase());

  const matchesFilter =
    clientFilter === "all" ||
    (clientFilter === "active" && !client.is_sample) ||
    (clientFilter === "demo" && client.is_sample);

  return matchesSearch && matchesFilter;
});

const sortedClients = [...filteredClients].sort((a, b) => {
  if (clientSort === "activeFirst") {
    return Number(a.is_sample) - Number(b.is_sample);
  }

  if (clientSort === "demoFirst") {
    return Number(b.is_sample) - Number(a.is_sample);
  }

  const aName =
    a.client_display_name ||
    a.profile?.display_name ||
    a.client_profile?.display_name ||
    a.client_email ||
    "";

  const bName =
    b.client_display_name ||
    b.profile?.display_name ||
    b.client_profile?.display_name ||
    b.client_email ||
    "";

  return aName.localeCompare(bName);
});

  async function loadClientsPage() {
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
    } catch (error: any) {
      alert(error.message || "Unable to load clients.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClientsPage();
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
      await loadClientsPage();
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
      await loadClientsPage();
      alert("Invitation revoked.");
    } catch (error: any) {
      alert(error.message || "Failed to revoke invitation.");
    }
  }

  if (loading) {
    return (
      <CoachShell>
        <p className="font-black text-[#FBBF24]">Loading clients...</p>
      </CoachShell>
    );
  }

  return (
    <CoachShell>
      <div className="space-y-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#FBBF24]">
            CLIENT DIRECTORY
          </p>

          <h1 className="mt-2 text-5xl font-black text-white">
            Clients
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Manage active clients, invitations, and future archived clients from
            one workspace.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryPill
              label="Total Clients"
              value={clients.length}
              description="All client workspaces"
            />
            <SummaryPill
              label="Billable Clients"
              value={clients.filter((client) => !client.is_sample).length}
              description="Counts toward your plan"
            />
            <SummaryPill
              label="Demo Workspaces"
              value={clients.filter((client) => client.is_sample).length}
              description="Practice clients, no seat used"
            />
            <SummaryPill
              label="Pending Invites"
              value={invitations.length}
              description="Waiting for client acceptance"
            />
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_420px]">
          <div id="active-clients" className="space-y-4">
            <div className="flex flex-wrap gap-3">
  <button
    onClick={() => setClientFilter("all")}
    className={`rounded-full px-4 py-2 text-sm font-black ${
      clientFilter === "all"
        ? "bg-[#FBBF24] text-[#020617]"
        : "border border-slate-700 text-slate-300"
    }`}
  >
    All
  </button>

  <button
    onClick={() => setClientFilter("active")}
    className={`rounded-full px-4 py-2 text-sm font-black ${
      clientFilter === "active"
        ? "bg-[#FBBF24] text-[#020617]"
        : "border border-slate-700 text-slate-300"
    }`}
  >
    Active
  </button>

  <button
    onClick={() => setClientFilter("demo")}
    className={`rounded-full px-4 py-2 text-sm font-black ${
      clientFilter === "demo"
        ? "bg-[#FBBF24] text-[#020617]"
        : "border border-slate-700 text-slate-300"
    }`}
  >
    Demo
  </button>
</div>
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search clients by name or email..."
            />

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-bold text-slate-500">
              Showing {filteredClients.length} of {clients.length} clients
            </p>

            <select
              value={clientSort}
              onChange={(event) =>
                setClientSort(event.target.value as "name" | "activeFirst" | "demoFirst")
              }
              className="rounded-2xl border border-slate-800 bg-[#111827] px-4 py-3 text-sm font-bold text-white outline-none"
            >
              <option value="activeFirst">Real clients first</option>
              <option value="demoFirst">Demo first</option>
              <option value="name">Name</option>
            </select>
          </div>

            <ActiveClients clients={sortedClients} />
          </div>

          <div className="space-y-6 xl:sticky xl:top-8 xl:self-start">
            <div id="invite-client">
              <InviteClientCard
                clientEmail={clientEmail}
                setClientEmail={setClientEmail}
                sendingInvite={sendingInvite}
                handleInviteClient={handleInviteClient}
              />
            </div>

            <PendingInvitations
              invitations={invitations}
              handleRevokeInvitation={handleRevokeInvitation}
            />
          </div>
        </div>
      </div>
    </CoachShell>
  );
}

function SummaryPill({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-[#FBBF24]">{value}</p>

      <p className="mt-1 text-xs font-bold text-slate-500">
        {description}
      </p>
    </div>
  );
}