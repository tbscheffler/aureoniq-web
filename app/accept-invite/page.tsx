"use client";
import Link from "next/link";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";


export default function AcceptInvitePage() {
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<{
    id: string; client_email: string; status: string; expires_at: string;
    organizations: { name: string };
  } | null>(null);
  const [wrongAccount, setWrongAccount] = useState(false);
  const [message, setMessage] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [clientDisplayName, setClientDisplayName] = useState("");

  useEffect(() => {
    async function loadInvitation() {
      try {
        const params = new URLSearchParams(window.location.search);
        const inviteToken = params.get("token");
        if (!inviteToken) { setMessage("Missing invitation token."); return; }
        setToken(inviteToken);
        const { data, error } = await supabase.rpc("get_organization_invitation_preview", { invite_token: inviteToken });
        const invite = Array.isArray(data) ? data[0] : data;
        if (error || !invite) { setMessage("Invitation not found or no longer available."); return; }
        if (invite.status !== "pending" || new Date(invite.expires_at).getTime() <= Date.now()) {
          setMessage("This invitation has been accepted, expired, or revoked. If you already connected, open the AureonIQ app with the same email.");
          return;
        }
        setInvitation({ ...invite, organizations: { name: invite.organization_name } });
        const authError = new URLSearchParams(window.location.hash.slice(1)).get("error_description");
        if (authError) setMessage("Email verification did not complete. Please reopen your latest confirmation email, or sign in if you already verified.");
      } catch {
        setMessage("We could not load your invitation. Please refresh and try again.");
      } finally { setLoading(false); }
    }

    loadInvitation();
  }, []);

  async function acceptInvitation() {
    if (!token || !invitation || accepting) return;
    setAccepting(true);
    setMessage("");
    setWrongAccount(false);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const returnUrl = encodeURIComponent("/accept-invite?token=" + encodeURIComponent(token));
      if (!user) {
        const { data: hasAccount, error } = await supabase.rpc("invited_email_has_account", { invite_token: token });
        if (error) throw new Error("We could not verify this invitation. Please try again.");
        window.location.href = (hasAccount ? "/login" : "/client-signup") + "?redirect=" + returnUrl;
        return;
      }
      if (user.email?.trim().toLowerCase() !== invitation.client_email.trim().toLowerCase()) {
        setWrongAccount(true);
        setMessage("You are signed in with a different email. Sign in with the email your coach invited.");
        return;
      }
      if (!user.email_confirmed_at) {
        setMessage("Please verify your email before accepting this invitation.");
        return;
      }
      const { error } = await supabase.rpc("accept_organization_invitation", {
        invite_token: token, client_display_name_input: clientDisplayName.trim(),
      });
      if (error) throw error;
      setAccepted(true);
    } catch (error: unknown) {
      setMessage(error && typeof error === "object" && "message" in error ? String(error.message) : "We could not accept this invitation. Please try again.");
    } finally { setAccepting(false); }
  }

  async function switchAccount() {
    setAccepting(true);
    try {
      const { error } = await supabase.auth.signOut({ scope: "local" });
      if (error) throw error;
      window.location.href = "/login?redirect=" + encodeURIComponent("/accept-invite?token=" + encodeURIComponent(token || ""));
    } catch { setMessage("We could not sign you out. Please try again."); }
    finally { setAccepting(false); }
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

  const orgName = invitation?.organizations.name;

  if (accepted) {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6">
        <div className="rounded-3xl border border-[#FBBF24]/30 bg-[#111827] p-8 text-center">
          <p className="text-5xl">🎉</p>

          <p className="mt-6 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            YOU&apos;RE CONNECTED
          </p>

          <h1 className="mt-4 text-4xl font-black">
            Your coach connection is active.
          </h1>

          <p className="mt-5 leading-7 text-slate-300">
            Your coach can now view your shared AureonIQ career reports while
            you are connected. Open the AureonIQ app and sign in with the same
            email address you used for this invitation.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link               href="/"
              className="rounded-2xl bg-[#FBBF24] px-6 py-4 font-black text-[#020617]"
            >
              Back to AureonIQ
            </Link>

            <Link               href="/contact"
              className="rounded-2xl border border-slate-700 px-6 py-4 font-black text-white"
            >
              Need Help?
            </Link>
          </div>
        </div>
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

        <div className="mt-8">
          <label className="text-sm font-black text-[#FBBF24]">
            How should your coach identify you?
          </label>

          <input
            className="mt-3 w-full rounded-2xl border border-slate-700 bg-[#020617] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
            placeholder="Example: Tommy S."
            value={clientDisplayName}
            onChange={(e) => setClientDisplayName(e.target.value)}
          />
        </div>

        <button
          onClick={acceptInvitation}
          disabled={accepting || !invitation || wrongAccount}
          className="mt-8 rounded-2xl bg-[#FBBF24] px-6 py-4 font-black text-[#020617] disabled:opacity-60"
        >
          {accepting ? "Accepting..." : "Accept Invitation"}
        </button>

        {wrongAccount ? <button onClick={switchAccount} disabled={accepting} className="mt-4 block font-bold text-[#FBBF24]">Sign in with the invited email</button> : null}
        {message ? (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-[#111827] p-5 text-slate-300">
            <p>{message}</p>
            <p className="mt-3 text-sm text-slate-400">
              Make sure you use the same email address your coach invited.
            </p>
          </div>
        ) : null}
      </section>
    </main>
  );
}