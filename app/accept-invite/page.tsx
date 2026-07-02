"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";


export default function AcceptInvitePage() {
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [invitation, setInvitation] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [clientDisplayName, setClientDisplayName] = useState("");

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
  "get_organization_invitation_preview",
  { invite_token: inviteToken }
);

const invite = Array.isArray(data) ? data[0] : data;

if (error || !invite) {
  setMessage("Invitation not found or no longer available.");
  setLoading(false);
  return;
}

setInvitation({
  id: invite.id,
  client_email: invite.client_email,
  status: invite.status,
  expires_at: invite.expires_at,
  organizations: { name: invite.organization_name },
});
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
  const returnUrl = encodeURIComponent(`/accept-invite?token=${token}`);

  const { data: hasAccount, error: accountCheckError } = await supabase.rpc(
    "invited_email_has_account",
    { invite_token: token }
  );

  if (accountCheckError) {
    setMessage(
      "We could not verify this invitation. Please try again or ask your coach to resend the invite."
    );
    setAccepting(false);
    return;
  }

  if (hasAccount) {
    setMessage(
      "This invitation is connected to an existing AureonIQ account. Please sign in using the email your coach invited."
    );
    window.location.href = `/login?redirect=${returnUrl}`;
  } else {
    setMessage(
      "To accept this coach invitation, first create an AureonIQ account using the email your coach invited."
    );
    window.location.href = `/client-signup?redirect=${returnUrl}`;
  }

  setAccepting(false);
  return;
}

const { data, error } = await supabase.rpc(
  "accept_organization_invitation",
  {
    invite_token: token,
    client_display_name_input: clientDisplayName.trim(),
  }
);

console.log("RPC DATA:", data);
console.log("RPC ERROR:", error);

if (error) {
  console.error(error);

  setMessage(
    error.message.includes("Invitation not found")
      ? "This invitation has already been accepted, expired, or is no longer available. If you already connected with your coach, open the AureonIQ app and sign in with the same email."
      : error.message
  );

  setAccepting(false);
  return;
}

    setMessage(
      "You're connected! Your coach can now view your shared AureonIQ career reports. Next, open the AureonIQ app and sign in with this same email."
    );
    setAccepted(true);
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
            <a
              href="/"
              className="rounded-2xl bg-[#FBBF24] px-6 py-4 font-black text-[#020617]"
            >
              Back to AureonIQ
            </a>

            <a
              href="/contact"
              className="rounded-2xl border border-slate-700 px-6 py-4 font-black text-white"
            >
              Need Help?
            </a>
          </div>
        </div>
      </section>
    </main>
  );
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
          disabled={accepting}
          className="mt-8 rounded-2xl bg-[#FBBF24] px-6 py-4 font-black text-[#020617] disabled:opacity-60"
        >
          {accepting ? "Accepting..." : "Accept Invitation"}
        </button>

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