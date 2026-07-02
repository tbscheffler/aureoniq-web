"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PLANS } from "@/config/plans";

const trialDetails = [
  "14-day free trial",
  "Up to 4 active clients",
  "Full coach workspace access",
  "Starter plan is $49/month after trial",
];

const productSections = [
  {
    eyebrow: "COACH WORKSPACE",
    title: "Run every client from one clean command center.",
    text: "Track clients, meetings, action items, notes, shared reports, and plan limits without adding admin clutter.",
    image: "/coach/coach-dashboard.png",
  },
  {
    eyebrow: "CLIENT WORKSPACE",
    title: "Give every client a dedicated coaching workspace.",
    text: "Career Assessment, Future Potential, Resume Review, Coach Notes, meetings, and action plans stay organized in one place.",
    image: "/coach/client-workspace.png",
  },
  {
    eyebrow: "COACHING SESSIONS",
    title: "Turn every meeting into a structured coaching workflow.",
    text: "Create sessions, capture notes, assign action items, and complete coaching work inside one focused workspace.",
    image: "/coach/session-workspace.png",
  },
  {
    eyebrow: "CAREER INTELLIGENCE",
    title: "See the complete picture before every coaching session.",
    text: "Career Assessments, AIQ, Resume Intelligence, Career Journey, and coaching insights come together in one organized workspace so you're always prepared.",
    image: "/coach/career-intelligence-overview.png",
  },
];

const coachPlans = [
  PLANS.coach_starter,
  PLANS.coach_professional,
  PLANS.coach_growth,
];

export default function CoachesPage() {
  const [startingCheckout, setStartingCheckout] = useState(false);

  async function startCheckout() {
    try {
      setStartingCheckout(true);

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
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
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black tracking-[0.3em] text-[#FBBF24]">
          AUREONIQ FOR CAREER COACHES
        </p>

        <h1 className="mt-6 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Run your coaching practice from one Career Intelligence workspace.
        </h1>

        <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-300">
          AureonIQ helps career coaches manage clients, review career intelligence,
          capture coaching notes, organize sessions, and turn insight into action.
          AI prepares the context. Coaches lead the conversation.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/signup?plan=coach_starter"
          className="rounded-2xl bg-[#FBBF24] px-7 py-4 font-black text-[#020617] shadow-lg shadow-[#FBBF24]/10 transition hover:scale-[1.02]"
        >
          Start Your 14-Day Trial
        </Link>

          <Link
            href="/contact"
            className="rounded-2xl border border-slate-700 px-7 py-4 font-black text-white transition hover:border-[#FBBF24] hover:text-[#FBBF24]"
          >
            Talk to Us
          </Link>
        </div>

        <p className="mt-5 text-sm font-bold text-slate-500">
          14-day trial · 4 active clients · $49/month after trial
        </p>

        <div className="mt-14 overflow-hidden rounded-3xl border border-slate-800 bg-[#111827] p-3 shadow-2xl shadow-black/40">
          <Image
            src="/coach/coach-dashboard.png"
            alt="AureonIQ coach dashboard"
            width={1600}
            height={900}
            className="rounded-2xl"
            priority
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-20 md:grid-cols-3">
        <ValueCard
          title="Everything in one place"
          text="Clients, coaching sessions, notes, action items, and Career Intelligence stay organized in a single workspace."
        />

        <ValueCard
          title="AI accelerates preparation"
          text="AureonIQ organizes career insights before the meeting so you can spend more time coaching instead of preparing."
        />

        <ValueCard
          title="Track measurable progress"
          text="Follow client growth across coaching sessions, action plans, and Career Intelligence over time."
        />
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8 md:p-10">
          <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            HOW COACHES USE AUREONIQ
          </p>

          <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight">
            From client intake to completed coaching session.
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {[
              ["1", "Invite a client", "Bring clients into a secure shared workspace."],
              ["2", "Review intelligence", "See assessments, AIQ, resume insights, and career history."],
              ["3", "Run the session", "Capture notes, action items, and next steps in one place."],
              ["4", "Track progress", "Follow client momentum across sessions and action plans."],
            ].map(([num, title, text]) => (
              <div key={num} className="rounded-2xl border border-slate-800 bg-[#020617] p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#FBBF24] text-lg font-black text-[#020617]">
                  {num}
                </div>

                <h3 className="text-lg font-black">{title}</h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-20 px-6 pb-24">
        {productSections.map((section) => (
          <div
            key={section.title}
            className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]"
          >
            <div>
              <p className="text-sm font-black tracking-[0.3em] text-[#FBBF24]">
                {section.eyebrow}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight">
                {section.title}
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-400">
                {section.text}
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#111827] p-3 shadow-2xl shadow-black/30">
              <Image
                src={section.image}
                alt={section.title}
                width={1400}
                height={850}
                className="rounded-2xl"
              />
            </div>
          </div>
        ))}
      </section>

    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
          COACH PRICING
        </p>

        <h2 className="mt-4 text-4xl font-black leading-tight">
          Choose the plan that fits your practice.
        </h2>

        <p className="mt-5 text-lg leading-8 text-slate-400">
          Start free for 14 days. Upgrade as your coaching practice grows.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {coachPlans.map((plan) => (
          <div
            key={plan.key}
            className="rounded-3xl border border-slate-800 bg-[#111827] p-8"
          >
            <p className="text-sm font-black tracking-[0.2em] text-[#FBBF24]">
              {plan.displayName.toUpperCase()}
            </p>

            <h3 className="mt-5 text-4xl font-black">
              ${plan.monthlyPrice}
              <span className="text-lg font-bold text-slate-500">/mo</span>
            </h3>

            <p className="mt-4 text-slate-400">
              Up to {plan.activeClientLimit} active clients.
            </p>

            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <p>✓ {plan.trialDays}-day free trial</p>
              <p>✓ AI-prepared resume reviews</p>
              <p>✓ Career Assessment and AIQ viewers</p>
              <p>✓ Coach notes, meetings, and action items</p>
            </div>

            <Link
              href={`/signup?plan=${plan.key}`}
              className="mt-8 inline-block w-full rounded-2xl bg-[#FBBF24] px-6 py-4 text-center font-black text-[#020617] transition hover:scale-[1.02]"
            >
              Start {plan.displayName}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-slate-800 bg-[#111827] p-8">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm font-black tracking-[0.2em] text-[#FBBF24]">
              ENTERPRISE
            </p>

            <h3 className="mt-3 text-3xl font-black">
              Need more than 25 active clients?
            </h3>

            <p className="mt-3 max-w-3xl leading-7 text-slate-400">
              AureonIQ can support coaching organizations, universities, workforce
              programs, and custom deployments.
            </p>
          </div>

          <Link
            href="/contact"
            className="inline-block rounded-2xl border border-[#FBBF24] px-6 py-4 text-center font-black text-[#FBBF24] transition hover:bg-[#FBBF24] hover:text-[#020617]"
          >
            Request a Demo
          </Link>
        </div>
      </div>
    </section>
    </main>
  );
}

function ValueCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <p className="mt-4 leading-7 text-slate-400">{text}</p>
    </div>
  );
}