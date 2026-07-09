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
  getClientHealth,
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

      const clientsWithHealth = await Promise.all(
        (clientData || []).map(async (client) => ({
          ...client,
          health: await getClientHealth(client.id),
        }))
      );

      setOrganization(orgData);
      setPlan(planData);
      setClients(clientsWithHealth);
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
        <section className="rounded-[2rem] bg-[#F8FAFC] p-4 text-[#111827] md:p-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="font-black text-[#B8872A]">Loading clients...</p>
          </div>
        </section>
      </CoachShell>
    );
  }

  return (
    <CoachShell>
      <section className="rounded-[2rem] bg-[#F8FAFC] p-4 text-[#111827] md:p-6">
        <div className="rounded-[2rem] border border-[#E8D49B] bg-white p-8 shadow-sm md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#B8872A]">
            CLIENT DIRECTORY
          </p>

          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black text-slate-950 md:text-5xl">
                Clients
              </h1>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                Manage active clients, invitations, and demo workspaces from one
                Career Intelligence command center.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-violet-100 bg-[#F8F5FF] px-5 py-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6D28D9]">
                Plan Usage
              </p>
              <p className="mt-2 text-2xl font-black text-slate-950">
                {clients.filter((client) => !client.is_sample).length}/
                {plan?.managed_client_limit || 0}
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Billable clients
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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

        <div className="mt-7 grid gap-7 xl:grid-cols-[1fr_420px]">
          <div id="active-clients" className="space-y-4">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-3">
                  <FilterButton
                    active={clientFilter === "all"}
                    onClick={() => setClientFilter("all")}
                  >
                    All
                  </FilterButton>

                  <FilterButton
                    active={clientFilter === "active"}
                    onClick={() => setClientFilter("active")}
                  >
                    Active
                  </FilterButton>

                  <FilterButton
                    active={clientFilter === "demo"}
                    onClick={() => setClientFilter("demo")}
                  >
                    Demo
                  </FilterButton>
                </div>

                <select
                  value={clientSort}
                  onChange={(event) =>
                    setClientSort(
                      event.target.value as "name" | "activeFirst" | "demoFirst"
                    )
                  }
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-[#4C1D95] focus:ring-4 focus:ring-violet-100"
                >
                  <option value="activeFirst">Real clients first</option>
                  <option value="demoFirst">Demo first</option>
                  <option value="name">Name</option>
                </select>
              </div>

              <div className="mt-4">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search clients by name or email..."
                />
              </div>

              <p className="mt-4 text-sm font-bold text-slate-500">
                Showing {filteredClients.length} of {clients.length} clients
              </p>
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
      </section>
    </CoachShell>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-full px-4 py-2 text-sm font-black transition",
        active
          ? "bg-[#4C1D95] text-white"
          : "border border-slate-200 bg-white text-slate-600 hover:border-[#4C1D95] hover:text-[#4C1D95]",
      ].join(" ")}
    >
      {children}
    </button>
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
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-black text-[#B8872A]">{value}</p>

      <p className="mt-1 text-xs font-bold text-slate-500">{description}</p>
    </div>
  );
}
