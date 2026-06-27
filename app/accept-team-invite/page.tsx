"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function AcceptTeamInvitePage() {
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

      const { data, error } = await supabase.rpc(
        "get_organization_member_invitation_by_token",
        {
          invite_token: inviteToken,
        }
      );

      if (error) {
        console.log("LOAD TEAM INVITE ERROR:", error);
        setMessage(error.message || "Unable to load team invitation.");
        setLoading(false);
        return;
      }
      
      if (!data) {
        setMessage("Team invitation not found or no longer available.");
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

    const { data, error } = await supabase.rpc(
        "accept_organization_member_invitation",
        {
          invite_token: token,
        }
      );
      
      console.log("RPC DATA:", data);
      console.log("RPC ERROR:", error);
      
      if (error) {
        console.error(error);
      
        setMessage(
          `${error.message}\n\n${JSON.stringify(error, null, 2)}`
        );
      
        setAccepting(false);
        return;
      }

    setMessage("Team invitation accepted. You can now access the coach workspace.");
    setAccepting(false);
  }

  const orgName = invitation?.organization_name;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] text-white">
        <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6">
          <p className="font-black text-[#FBBF24]">Loading team invitation...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6">
        <Link href="/" className="mb-8 text-sm font-bold text-[#FBBF24]">
          ← Back to AureonIQ
        </Link>

        <p className="mb-4 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
          TEAM INVITATION
        </p>

        <h1 className="text-4xl font-black">Join this organization</h1>

        <p className="mt-5 text-lg leading-8 text-slate-300">
          {orgName || "An AureonIQ organization"} invited you to join as{" "}
          <span className="font-black text-[#FBBF24]">
            {invitation?.role || "coach"}
          </span>
          .
        </p>

        <button
          onClick={acceptInvitation}
          disabled={accepting || invitation?.status !== "pending"}
          className="mt-8 rounded-2xl bg-[#FBBF24] px-6 py-4 font-black text-[#020617] disabled:opacity-60"
        >
          {accepting ? "Accepting..." : "Accept Team Invitation"}
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