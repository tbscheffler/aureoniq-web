"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCurrentOrganization,
  getOrganizationMembers,
  getPendingOrganizationMemberInvitations,
  sendOrganizationMemberInvitation,
} from "@/services/coachService";

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
      <main className="min-h-screen bg-[#020617] text-white">
        <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
          <p className="font-black text-[#FBBF24]">Loading Team...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto max-w-6xl px-6 py-12">
        <Link href="/coach" className="text-sm font-bold text-[#FBBF24]">
          ← Back to Coach Workspace
        </Link>

        <div className="mt-10">
          <p className="mb-4 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            TEAM
          </p>

          <h1 className="text-5xl font-black">Team Members</h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Invite coworkers, manage organization roles, and assign coaches to
            clients.
          </p>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-[#111827] p-8">
          <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            INVITE TEAM MEMBER
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-[1fr_180px_180px]">
            <input
              className="rounded-2xl border border-slate-700 bg-[#020617] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
              placeholder="coworker@email.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />

            <select
              className="rounded-2xl border border-slate-700 bg-[#020617] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "coach")}
            >
              <option value="coach">Coach</option>
              <option value="admin">Admin</option>
            </select>

            <button
              onClick={handleInviteTeamMember}
              disabled={sending}
              className="rounded-2xl bg-[#FBBF24] px-6 py-4 font-black text-[#020617] disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send Invite"}
            </button>
          </div>

          <p className="mt-4 text-sm text-slate-400">
            Owners and admins can invite team members. Coaches can view assigned
            clients only.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
            <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
              ACTIVE MEMBERS
            </p>

            {members.length === 0 ? (
              <p className="mt-4 text-slate-400">No active members yet.</p>
            ) : (
              <div className="mt-6 space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="rounded-2xl border border-slate-700 bg-[#020617] p-5"
                  >
                    <p className="font-black text-white">
                      {member.profile?.display_name || "Team Member"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-[#FBBF24]/40 bg-[#FBBF24]/10 px-3 py-1 text-xs font-bold text-[#FBBF24]">
                        {member.role}
                      </span>

                      <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                        {member.status}
                      </span>
                    </div>

                    <p className="mt-4 text-xs text-slate-500">
                      User ID: {member.user_id}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
            <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
              PENDING TEAM INVITES
            </p>

            {invitations.length === 0 ? (
              <p className="mt-4 text-slate-400">No pending team invitations.</p>
            ) : (
              <div className="mt-6 space-y-4">
                {invitations.map((invite) => (
                  <div
                    key={invite.id}
                    className="rounded-2xl border border-slate-700 bg-[#020617] p-5"
                  >
                    <p className="font-black text-white">
                      {invite.invite_email}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full border border-[#FBBF24]/40 bg-[#FBBF24]/10 px-3 py-1 text-xs font-bold text-[#FBBF24]">
                        {invite.role}
                      </span>

                      <span className="rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
                        {invite.status}
                      </span>
                    </div>

                    <p className="mt-4 text-xs text-slate-500">
                      Expires{" "}
                      {invite.expires_at
                        ? new Date(invite.expires_at).toLocaleDateString()
                        : "soon"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}