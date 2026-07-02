"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";
import { PLANS, PlanKey } from "@/config/plans";
import { redeemInvitationCode } from "@/services/coachService";

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupFallback />}>
      <SignupContent />
    </Suspense>
  );
}

function SignupContent() {
  const searchParams = useSearchParams();
  const invitationCode = searchParams.get("invite");
  const selectedPlanKey = (searchParams.get("plan") || "coach_starter") as PlanKey;
  const selectedPlan = PLANS[selectedPlanKey] || PLANS.coach_starter;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    try {
      setLoading(true);

      if (!email || !password || !businessName) {
        alert("Please fill out your email, password, and coaching business name.");
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            business_name: businessName,
            signup_type: "coach_trial",
          },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (invitationCode) {
        window.location.href = `/login?signup=success&invite=${encodeURIComponent(
          invitationCode
        )}`;
        return;
      }

      window.location.href = `/login?signup=success&plan=${selectedPlan.key}`;
    } catch (err: any) {
      alert(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <Link href="/coaches" className="mb-8 text-sm font-bold text-[#FBBF24]">
          ← Back to Coaches
        </Link>

        <p className="mb-4 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
          {invitationCode ? "FOUNDING COACH INVITATION" : "START YOUR 14-DAY TRIAL"}
        </p>

        <h1 className="text-4xl font-black">
          Create your coach account.
        </h1>

        <p className="mt-4 leading-7 text-slate-400">
          {invitationCode
            ? "You've been invited to join the AureonIQ Founding Coach Program. Your Coach Professional workspace will be activated automatically after you create your account."
            : `Start free for ${selectedPlan.trialDays} days with up to ${selectedPlan.activeClientLimit} active clients. ${selectedPlan.displayName} is $${selectedPlan.monthlyPrice}/month after trial.`}
        </p>

        <div className="mt-10 space-y-4">
          <input
            className="w-full rounded-2xl border border-slate-700 bg-[#111827] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
            placeholder="Coaching business name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />

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
            onClick={handleSignup}
            disabled={loading}
            className="w-full rounded-2xl bg-[#FBBF24] px-6 py-4 font-black text-[#020617] disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#FBBF24]">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function SignupFallback() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <p className="font-black text-[#FBBF24]">Loading signup...</p>
      </section>
    </main>
  );
}