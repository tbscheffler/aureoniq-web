"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AcceptInvitePage() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const inviteToken = params.get("token");
    setToken(inviteToken);
    setLoading(false);
  }, []);

  async function acceptInvitation() {
    if (!token) {
      alert("Missing invitation token.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please sign in first, then return to this invitation link.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.rpc("accept_organization_invitation", {
      invite_token: token,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Invitation accepted. Your coach can now view your shared career reports.");
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6">
        <a href="/" className="mb-8 text-sm font-bold text-[#FBBF24]">
          ← Back to AureonIQ
        </a>

        <p className="mb-4 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
          COACH INVITATION
        </p>

        <h1 className="text-4xl font-black">
          Accept coaching access
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-300">
          Accepting this invitation gives your coach permission to view your AureonIQ career reports. Your account, billing, password, and private settings remain yours.
        </p>

        <button
          onClick={acceptInvitation}
          disabled={loading || !token}
          className="mt-8 rounded-2xl bg-[#FBBF24] px-6 py-4 font-black text-[#020617] disabled:opacity-60"
        >
          {loading ? "Loading..." : "Accept Invitation"}
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