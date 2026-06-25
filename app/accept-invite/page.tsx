"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AcceptInvitePage() {
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<any>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadInvitation() {
      const params = new URLSearchParams(window.location.search);
      const inviteToken = params.get("token");

      if (!inviteToken) {
        setMessage("Missing invitation token.");
        setLoading(false);
        return;
      }

      setToken(inviteToken);

      const { data, error } = await supabase
        .from("organization_invitations")
        .select("id, client_email, status, expires_at, organizations(name)")
        .eq("token", inviteToken)
        .maybeSingle();

      if (error || !data) {
        setMessage("Invitation not found or no longer available.");
        setLoading(false);
        return;
      }

      setInvitation(data);
      setLoading(false);
    }

    loadInvitation();
  }, []);

  async function acceptInvitation() {
    if (!token) return;

    setAccepting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please sign in first, then return to this invitation link.");
      setAccepting(false);
      return;
    }

    const { error } = await supabase.rpc("accept_organization_invitation", {
      invite_token: token,
    });

    if (error) {
      setMessage(error.message);
      setAccepting(false);
      return;
    }

    setMessage("Invitation accepted. Your coach can now view your shared career reports.");
    setAccepting(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] text-white">
        <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6">
          <p className="font-black text-[#FBBF24]">Loading invitation...</p>
        </section>
      </main>
    );
  }

  const orgName = Array.isArray(invitation?.organizations)
    ? invitation.organizations[0]?.name
    : invitation?.organizations?.name;

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6">
        <a href="/" className="mb-8 text-sm font-bold text-[#FBBF24]">
          ← Back to AureonIQ
        </a>

        <p className="mb-4 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
          COACH INVITATION
        </p>

        <h1 className="text-4xl font-black">Connect with your coach</h1>

        <p className="mt-5 text-lg leading-8 text-slate-300">
          {orgName || "Your coach"} invited you to connect inside AureonIQ.
        </p>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-[#111827] p-6">
          <p className="font-black text-[#FBBF24]">What your coach can view</p>
          <ul className="mt-4 space-y-2 text-slate-300">
            <li>✓ Career Discovery Reports</li>
            <li>✓ AIQ Reports</li>
            <li>✓ Future reports while connected</li>
          </ul>
        </div>

        <div className="mt-5 rounded-3xl border border-slate-800 bg-[#111827] p-6">
          <p className="font-black text-[#FBBF24]">What stays private</p>
          <ul className="mt-4 space-y-2 text-slate-300">
            <li>✓ Password and authentication</li>
            <li>✓ Billing and payment details</li>
            <li>✓ Account settings</li>
          </ul>
        </div>

        <button
          onClick={acceptInvitation}
          disabled={accepting || invitation?.status !== "pending"}
          className="mt-8 rounded-2xl bg-[#FBBF24] px-6 py-4 font-black text-[#020617] disabled:opacity-60"
        >
          {accepting ? "Accepting..." : "Accept Invitation"}
        </button>

        {message ? (
          <p className="mt-6 rounded-2xl border border-slate-800 bg-[#111827] p-5 text-slate-300">
            {message}
          </p>
        ) : null}
      </section>
    </main>
  );
}