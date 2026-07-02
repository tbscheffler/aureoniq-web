"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { createFounderInvitationCode } from "@/services/coachService";


function BetaMetricCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
        {title}
      </p>
      <p className="mt-4 text-4xl font-black text-[#FBBF24]">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
    </div>
  );
}

export default function FounderBetaPage() {
    const [invites, setInvites] = useState<any[]>([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [coachName, setCoachName] = useState("");
    const [coachEmail, setCoachEmail] = useState("");
    const [creatingInvite, setCreatingInvite] = useState(false);

    useEffect(() => {
    async function loadInvites() {
        const { data, error } = await supabase
        .from("invitation_codes")
        .select("*")
        .order("created_at", { ascending: false });

        console.log("Invitation data:", data);
        console.log("Invitation error:", error);

        if (error) {
        alert(error.message);
        return;
        }

        setInvites(data || []);
    }

    loadInvites();
    }, []);

    async function handleCreateInvitation() {
  try {
    setCreatingInvite(true);

    await createFounderInvitationCode({
      coachName,
      coachEmail,
    });

    setCoachName("");
    setCoachEmail("");
    setShowCreateForm(false);

    const { data } = await supabase
      .from("invitation_codes")
      .select("*")
      .order("created_at", { ascending: false });

    setInvites(data || []);
  } catch (error: any) {
    alert(error.message || "Unable to create invitation.");
  } finally {
    setCreatingInvite(false);
  }
}

  return (
    <main className="min-h-screen bg-[#020617] px-6 py-10 text-white">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center gap-6">
          <Link href="/founder" className="text-sm font-bold text-[#FBBF24]">
            ← Back to Founder Dashboard
          </Link>
        </div>

        <div>
          <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            PRIVATE COACH BETA
          </p>

          <h1 className="mt-4 text-5xl font-black">Beta Program</h1>

          <p className="mt-4 max-w-3xl text-slate-400">
            Manage founding coach invitations, track redemptions, and run the
            early coach beta without touching SQL.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
            <BetaMetricCard
            title="Invitations"
            value={invites.length}
            subtitle="Created"
            />

            <BetaMetricCard
            title="Redeemed"
            value={invites.reduce((sum, invite) => sum + Number(invite.redemptions || 0), 0)}
            subtitle="Used by coaches"
            />

            <BetaMetricCard
            title="Remaining"
            value={invites.reduce(
                (sum, invite) =>
                sum +
                Math.max(
                    Number(invite.max_redemptions || 0) - Number(invite.redemptions || 0),
                    0
                ),
                0
            )}
            subtitle="Open beta spots"
            />

            <BetaMetricCard
            title="Active"
            value={invites.filter((invite) => invite.active).length}
            subtitle="Enabled invites"
            />
        </div>

        <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
                INVITATIONS
              </p>
              <h2 className="mt-3 text-3xl font-black">Founding Coach Invites</h2>
              <p className="mt-2 text-slate-400">
                Create one-time invite links for coaches you want in the private beta.
              </p>
            </div>

            <button
            onClick={() => setShowCreateForm(true)}
            className="rounded-2xl bg-[#FBBF24] px-5 py-3 font-black text-black"
            >
            + Create Invitation
            </button>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#020617] text-slate-400">
                <tr>
                    <th className="px-5 py-4 font-bold">Coach</th>
                  <th className="px-5 py-4 font-bold">Code</th>
                  <th className="px-5 py-4 font-bold">Purpose</th>
                  <th className="px-5 py-4 font-bold">Plan</th>
                  <th className="px-5 py-4 font-bold">Redemptions</th>
                  <th className="px-5 py-4 font-bold">Status</th>
                  <th className="px-5 py-4 font-bold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {invites.length === 0 ? (
                    <tr className="border-t border-slate-800">
                    <td className="px-5 py-5 text-slate-400" colSpan={7}>
                        No invitation codes yet.
                    </td>
                    </tr>
                ) : (
                    invites.map((invite) => (
                    <tr key={invite.id} className="border-t border-slate-800">
                        <td className="px-5 py-5 text-slate-300">
                        {invite.coach_name || "General Invite"}
                        </td>
                        <td className="px-5 py-5 font-black text-white">
                        {invite.code}
                        </td>

                        <td className="px-5 py-5 text-slate-300">
                        {invite.purpose}
                        </td>

                        <td className="px-5 py-5 text-slate-300">
                        {invite.plan_type}
                        </td>

                        <td className="px-5 py-5 text-slate-300">
                        {invite.redemptions}/{invite.max_redemptions}
                        </td>

                        <td className="px-5 py-5">
                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-300">
                            {invite.active ? "Active" : "Inactive"}
                        </span>
                        </td>
                        <td className="px-5 py-5">
                        <button
                        onClick={() => {
                            navigator.clipboard.writeText(
                            `https://www.aureoniq.com/signup?invite=${invite.code}`
                            );
                            alert("Invite link copied.");
                        }}
                        className="rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-300 transition hover:border-[#FBBF24] hover:text-[#FBBF24]"
                        >
                        📋 Copy Link
                        </button>
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
          </div>
        </div>

        {showCreateForm ? (
        <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
            <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            CREATE INVITATION
            </p>

            <h2 className="mt-3 text-3xl font-black">New Founding Coach Invite</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input
            value={coachName}
            onChange={(event) => setCoachName(event.target.value)}
            className="rounded-2xl border border-slate-700 bg-[#020617] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
            placeholder="Coach name"
            />

            <input
            value={coachEmail}
            onChange={(event) => setCoachEmail(event.target.value)}
            className="rounded-2xl border border-slate-700 bg-[#020617] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
            placeholder="Coach email optional"
            />

            <div className="mt-6 flex gap-3">
            <button
            onClick={handleCreateInvitation}
            disabled={creatingInvite}
            className="rounded-2xl bg-[#FBBF24] px-5 py-3 font-black text-black disabled:opacity-60"
            >
            {creatingInvite ? "Generating..." : "Generate Invitation"}
            </button>

            <button
                onClick={() => setShowCreateForm(false)}
                className="rounded-2xl border border-slate-700 px-5 py-3 font-black text-slate-300"
            >
                Cancel
            </button>
            </div>
          </div>
        </div>
      ) : null}

      </section>
    </main>
  );
}