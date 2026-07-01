"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";
import { PLANS, PlanKey } from "@/config/plans";
import { getCoachEntitlement } from "@/services/billing/entitlementService";


export default function StartTrialPage() {
  return (
    <Suspense fallback={<StartTrialFallback />}>
      <StartTrialContent />
    </Suspense>
  );
}

function StartTrialContent() {
  const searchParams = useSearchParams();
  const selectedPlanKey = (searchParams.get("plan") || "coach_starter") as PlanKey;
  const plan = PLANS[selectedPlanKey] || PLANS.coach_starter;
  const [startingCheckout, setStartingCheckout] = useState(false);

  useEffect(() => {
  async function redirectExistingCoach() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) return;

    const entitlement = await getCoachEntitlement();

    if (entitlement.hasAccess) {
      window.location.href = "/coach";
    }
  }

  redirectExistingCoach();
}, []);

  async function startCheckout() {
    try {
      setStartingCheckout(true);

const {
  data: { session },
} = await supabase.auth.getSession();

if (!session?.access_token) {
  window.location.href = "/login";
  return;
}

const response = await fetch("/api/stripe/create-checkout-session", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    planKey: plan.key,
  }),
});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to start checkout.");
      }

      window.location.href = data.url;
    } catch (error: any) {
      alert(error.message || "Unable to start checkout.");
      setStartingCheckout(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
        <Link href="/coaches" className="mb-8 text-sm font-bold text-[#FBBF24]">
          ← Back to Coaches
        </Link>

        <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8 md:p-10">
            <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            WELCOME TO AUREONIQ
            </p>

            <h1 className="mt-4 text-5xl font-black leading-tight">
            Your coaching workspace is ready.
            </h1>

            <p className="mt-5 text-lg leading-8 text-slate-300">
            Activate your workspace to begin coaching with up to{" "}
            <span className="font-bold text-white">
                {plan.activeClientLimit} active clients
            </span>
            . Your free trial lasts{" "}
            <span className="font-bold text-white">
                {plan.trialDays} days
            </span>
            {" "}and then continues at{" "}
            <span className="font-bold text-white">
                ${plan.monthlyPrice}/month
            </span>.
            </p>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {plan.features.map((feature) => (
              <div
                key={feature}
                className="rounded-2xl border border-slate-700 bg-[#020617] p-4"
              >
                <p className="font-black text-white">✓ {feature}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-slate-700 bg-[#020617] p-6">
            <p className="text-sm font-black tracking-[0.2em] text-[#FBBF24]">
                WHAT HAPPENS NEXT
            </p>

            <div className="mt-5 space-y-3 text-slate-300">
                <p>✓ Activate your secure workspace</p>
                <p>✓ Invite your first client whenever you're ready</p>
                <p>✓ Upload a resume and begin your first coaching session</p>
            </div>
            </div>

          <button
            onClick={startCheckout}
            disabled={startingCheckout}
            className="mt-8 w-full rounded-2xl bg-[#FBBF24] px-7 py-4 font-black text-[#020617] disabled:opacity-60 md:w-auto"
          >
            {startingCheckout
            ? "Starting..."
            : "Activate My Workspace"}
          </button>

          <p className="mt-4 text-sm text-slate-500">
            Secure checkout powered by Stripe.
          </p>
        </div>
      </section>
    </main>
  );
}

function StartTrialFallback() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-16">
        <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8 md:p-10">
          <p className="font-black text-[#FBBF24]">
            Loading trial options...
          </p>
        </div>
      </section>
    </main>
  );
}
