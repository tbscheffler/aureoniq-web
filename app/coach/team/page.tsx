"use client";

import { useEffect, useState } from "react";
import {
  getCurrentOrganization,
  getOrganizationMembers,
  getPendingOrganizationMemberInvitations,
  sendOrganizationMemberInvitation,
} from "@/services/coachService";
import CoachShell from "@/components/coach/CoachShell";

export default function CoachTeamPage() {
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [role, setRole] = useState<"admin" | "coach">("coach");
  const [sending, setSending] = useState(false);

  async function loadTeamPage() {
    try {
      const membership = await getCurrentOrganization();

      const organizationId = membership.organization_id;
      const orgData = Array.isArray(membership.organizations)
        ? membership.organizations[0]
        : membership.organizations;

      const [memberData, inviteData] = await Promise.all([
        getOrganizationMembers(organizationId),
        getPendingOrganizationMemberInvitations(organizationId),
      ]);

      setOrganization(orgData);
      setMembers(memberData || []);
      setInvitations(inviteData || []);
    } catch (error: any) {
      alert(error.message || "Unable to load team page.");
      window.location.href = "/coach";
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeamPage();
  }, []);

  async function handleInviteTeamMember() {
    if (!inviteEmail.trim()) {
      alert("Enter an email first.");
      return;
    }

    if (!organization?.id) {
      alert("Organization not loaded yet.");
      return;
    }

    try {
      setSending(true);

      await sendOrganizationMemberInvitation({
        organizationId: organization.id,
        inviteEmail: inviteEmail.trim().toLowerCase(),
        role,
      });

      setInviteEmail("");
      setRole("coach");

      await loadTeamPage();
      alert("Team invitation sent.");
    } catch (error: any) {
      alert(error.message || "Failed to send team invitation.");
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <CoachShell>
        <section className="rounded-[2rem] bg-[#F8FAFC] p-6 text-slate-950">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#B8872A]">
              TEAM
            </p>
            <h1 className="mt-4 text-4xl font-black">Loading Team...</h1>
            <p className="mt-3 text-slate-600">Preparing your organization workspace.</p>
          </div>
        </section>
      </CoachShell>
    );
  }

  const adminCount = members.filter((member) => member.role === "admin" || member.role === "owner").length;
  const coachCount = members.filter((member) => member.role === "coach" || member.role === "member").length;

  return (
    <CoachShell>
      <section className="rounded-[2rem] bg-[#F8FAFC] p-4 text-[#111827] md:p-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#B8872A]">
            TEAM WORKSPACE
          </p>
          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black md:text-5xl">Team</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                Invite teammates, manage coaching roles, and keep your organization ready to support clients.
              </p>
            </div>
            <div className="rounded-2xl border border-[#B8872A]/25 bg-[#FFF8E7] px-5 py-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9A6A12]">Organization</p>
              <p className="mt-1 text-lg font-black text-slate-950">{organization?.name || "Coach Workspace"}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Active Members" value={members.length} description="People in this workspace" />
          <SummaryCard label="Coaches" value={coachCount} description="Client-facing support" />
          <SummaryCard label="Admins" value={adminCount} description="Organization access" />
          <SummaryCard label="Pending Invites" value={invitations.length} description="Waiting for acceptance" />
        </div>

        <div className="mt-7 grid gap-7 xl:grid-cols-[1fr_420px]">
          <div className="space-y-7">
            <TeamList title="Active Members" empty="No active team members yet." members={members} />
            <InvitationList invitations={invitations} />
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm xl:sticky xl:top-8 xl:self-start">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">Invite Teammate</p>
            <h2 className="mt-3 text-2xl font-black">Add someone to the workspace</h2>
            <p className="mt-3 leading-7 text-slate-600">
              Invite admins or coaches. Permissions help keep client access intentional as your team grows.
            </p>

            <div className="mt-6 space-y-4">
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#6D28D9] focus:ring-4 focus:ring-violet-100"
                placeholder="coworker@email.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />

              <select
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 font-bold text-slate-900 outline-none transition focus:border-[#6D28D9] focus:ring-4 focus:ring-violet-100"
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "coach")}
              >
                <option value="coach">Coach</option>
                <option value="admin">Admin</option>
              </select>

              <button
                onClick={handleInviteTeamMember}
                disabled={sending}
                className="w-full rounded-2xl bg-[#4C1D95] px-6 py-4 font-black text-white shadow-sm transition hover:bg-[#3B147B] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send Invite"}
              </button>
            </div>

            <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
              Owners and admins can invite team members. Coaches should only see the clients they support.
            </p>
          </div>
        </div>
      </section>
    </CoachShell>
  );
}

function SummaryCard({ label, value, description }: { label: string; value: number; description: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black text-[#B8872A]">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{description}</p>
    </div>
  );
}

function TeamList({ title, empty, members }: { title: string; empty: string; members: any[] }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">{title}</p>
      {members.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 font-semibold text-slate-500">{empty}</p>
      ) : (
        <div className="mt-6 space-y-4">
          {members.map((member) => (
            <div key={member.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-lg font-black text-slate-950">{member.profile?.display_name || "Team Member"}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">User ID: {member.user_id}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusPill label={member.role} tone="gold" />
                  <StatusPill label={member.status} tone="green" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InvitationList({ invitations }: { invitations: any[] }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">Pending Team Invites</p>
      {invitations.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 font-semibold text-slate-500">No pending team invitations.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {invitations.map((invite) => (
            <div key={invite.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-lg font-black text-slate-950">{invite.invite_email}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Expires {invite.expires_at ? new Date(invite.expires_at).toLocaleDateString() : "soon"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusPill label={invite.role} tone="gold" />
                  <StatusPill label={invite.status} tone="slate" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusPill({ label, tone }: { label: string; tone: "gold" | "green" | "slate" }) {
  const classes = {
    gold: "border-[#E8D49B] bg-[#FFF8E7] text-[#9A6A12]",
    green: "border-emerald-100 bg-emerald-50 text-emerald-800",
    slate: "border-slate-200 bg-white text-slate-500",
  }[tone];

  return <span className={["rounded-full border px-3 py-1 text-xs font-black capitalize", classes].join(" ")}>{label}</span>;
}
