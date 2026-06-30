"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const reasonMessages: Record<string, string> = {
  no_plan:
    "Your coach workspace does not have an active plan yet.",
  expired_trial:
    "Your coach trial has ended. Activate billing to continue using your workspace.",
  active_subscription:
    "Your subscription is active.",
  active_trial:
    "Your trial is active.",
};

export default function BillingRequiredPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason") || "no_plan";

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6">
        <Link href="/coaches" className="mb-8 text-sm font-bold text-[#FBBF24]">
          ← Back to Coaches
        </Link>

        <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8 md:p-10">
          <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            BILLING REQUIRED
          </p>

          <h1 className="mt-4 text-5xl font-black leading-tight">
            Activate your coach workspace.
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            {reasonMessages[reason] || reasonMessages.no_plan}
          </p>

          <div className="mt-8 rounded-2xl border border-slate-700 bg-[#020617] p-6">
            <p className="font-black text-white">Coach Starter includes:</p>

            <div className="mt-4 space-y-3 text-slate-300">
              <p>✓ 14-day free trial</p>
              <p>✓ Up to 4 active clients</p>
              <p>✓ Resume Review</p>
              <p>✓ Career Assessment and AIQ viewers</p>
              <p>✓ Notes, meetings, and action items</p>
            </div>
          </div>

          <Link
            href="/start-trial"
            className="mt-8 inline-block rounded-2xl bg-[#FBBF24] px-7 py-4 font-black text-[#020617]"
          >
            Activate Workspace
          </Link>
        </div>
      </section>
    </main>
  );
}