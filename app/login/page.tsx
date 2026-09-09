"use client";
import Link from "next/link";

import { useState } from "react";
import { safeRedirect } from "@/lib/safeRedirect";
import { supabase } from "@/lib/supabaseClient";
import { getUserWorkspaceAccess } from "@/services/workspaceAccessService";
import { redeemInvitationCode } from "@/services/coachService";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

const searchParams = new URLSearchParams(window.location.search);
const signupSuccess = searchParams.get("signup") === "success";
const invitationCode = searchParams.get("invite");
const selectedPlan = searchParams.get("plan") || "coach_starter";

if (signupSuccess) {
  if (invitationCode) {
    await redeemInvitationCode(invitationCode);

    window.location.href = "/coach";
    return;
  }

  window.location.href = `/start-trial?plan=${selectedPlan}`;
  return;
}

const redirect = searchParams.get("redirect");

if (redirect) {
  window.location.href = safeRedirect(redirect);
  return;
}

const workspaces = await getUserWorkspaceAccess();

if (workspaces.length === 1) {
  window.location.href = workspaces[0].href;
  return;
}

if (workspaces.length > 1) {
  window.location.href = "/portal";
  return;
}

window.location.href = "/dashboard";
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <Link href="/" className="mb-8 text-sm font-bold text-[#FBBF24]">
          ← Back to AureonIQ
        </Link>

        <p className="mb-4 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
          AUREONIQ PORTAL
        </p>

        <h1 className="text-4xl font-black">
          Sign in to your dashboard.
        </h1>

        <div className="mt-10 space-y-4">
          <input
            className="w-full rounded-2xl border border-slate-700 bg-[#111827] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full rounded-2xl border border-slate-700 bg-[#111827] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-2xl bg-[#FBBF24] px-6 py-4 font-black text-[#020617] disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </section>
    </main>
  );
}