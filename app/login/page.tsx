"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getUserWorkspaceAccess } from "@/services/workspaceAccessService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      const user = data.user;

      const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role, user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    
      console.log("LOGIN USER ID:", user.id);
      console.log("LOGIN USER EMAIL:", user.email);
      console.log("ROLE DATA:", roleData);
      console.log("ROLE ERROR:", roleError);

const searchParams = new URLSearchParams(window.location.search);
const signupSuccess = searchParams.get("signup") === "success";
const selectedPlan = searchParams.get("plan") || "coach_starter";

if (signupSuccess) {
  window.location.href = `/start-trial?plan=${selectedPlan}`;
  return;
}

const redirect = searchParams.get("redirect");

if (redirect && redirect.startsWith("/")) {
  window.location.href = redirect;
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
    } catch (err: any) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <a href="/" className="mb-8 text-sm font-bold text-[#FBBF24]">
          ← Back to AureonIQ
        </a>

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