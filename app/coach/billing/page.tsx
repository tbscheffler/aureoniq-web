"use client";

import { useEffect, useState } from "react";
import {
  getCurrentOrganization,
  getOrganizationPlan,
  getOrganizationClients,
} from "@/services/coachService";
import CoachShell from "@/components/coach/CoachShell";
import { supabase } from "@/lib/supabaseClient";

const PLAN_OPTIONS = [
  {
    name: "Free Beta",
    price: "$0",
    limit: 4,
    planType: "coach_beta",
    description: "For early coach testing and product feedback.",
  },
  {
    name: "Professional",
    price: "$49/mo",
    limit: 10,
    planType: "coach_professional",
    description: "For solo coaches managing a focused client roster.",
  },
  {
    name: "Growth",
    price: "$99/mo",
    limit: 25,
    planType: "coach_growth",
    description: "For growing practices with more active clients.",
  },
  {
    name: "Business",
    price: "$199/mo",
    limit: 50,
    planType: "coach_business",
    description: "For teams and larger coaching organizations.",
  },
];

export default function CoachBillingPage() {
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [openingPortal, setOpeningPortal] = useState(false);

  async function openCustomerPortal() {
    try {
      setOpeningPortal(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        window.location.href = "/login";
        return;
      }

      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to open billing portal.");
      }

      window.location.href = data.url;
    } catch (error: any) {
      alert(error.message || "Unable to open billing portal.");
      setOpeningPortal(false);
    }
  }

  useEffect(() => {
    async function loadBilling() {
      try {
        const membership = await getCurrentOrganization();

        const organizationId = membership.organization_id;
        const orgData = Array.isArray(membership.organizations)
          ? membership.organizations[0]
          : membership.organizations;

        const [planData, clientData] = await Promise.all([
          getOrganizationPlan(organizationId),
          getOrganizationClients(organizationId),
        ]);

        setOrganization(orgData);
        setPlan(planData);
        setClients(clientData || []);
      } catch (error: any) {
        alert(error.message || "Unable to load billing.");
        window.location.href = "/coach";
      } finally {
        setLoading(false);
      }
    }

    loadBilling();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] text-white">
        <section className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6">
          <p className="font-black text-[#FBBF24]">Loading Billing...</p>
        </section>
      </main>
    );
  }

  const currentPlanType = plan?.plan_type || "coach_beta";
  const clientLimit = Number(plan?.managed_client_limit ?? 4);
  const activeClients = clients.length;
  const seatsRemaining = Math.max(clientLimit - activeClients, 0);

  return (
      <CoachShell>
        <section>

        <div className="mt-10">
          <p className="mb-4 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            BILLING
          </p>

          <h1 className="text-5xl font-black">Plan & Seat Management</h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Manage your coach subscription, active client seats, and future
            billing settings for {organization?.name || "your organization"}.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <SummaryCard title="Current Plan" value={formatPlanName(currentPlanType)} />
          <SummaryCard title="Active Clients" value={`${activeClients} / ${clientLimit}`} />
          <SummaryCard title="Seats Remaining" value={seatsRemaining} />
        </div>

<div className="mt-10 rounded-3xl border border-slate-800 bg-[#111827] p-8">
  <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
    SUBSCRIPTION
  </p>

  <h2 className="mt-4 text-3xl font-black">
    {formatPlanName(currentPlanType)}
  </h2>

  <p className="mt-4 max-w-3xl leading-7 text-slate-400">
    Manage payment methods, invoices, cancellations, and subscription settings
    securely through Stripe.
  </p>

  <div className="mt-6 grid gap-4 md:grid-cols-3">
      <SummaryCard title="Status" value={plan?.status || "active"} />
      <SummaryCard title="Client Limit" value={clientLimit} />
      <SummaryCard title="Active Clients" value={activeClients} />
    </div>

    <button
      onClick={openCustomerPortal}
      disabled={openingPortal}
      className="mt-8 rounded-2xl bg-[#FBBF24] px-6 py-4 font-black text-[#020617] disabled:opacity-60"
    >
      {openingPortal ? "Opening Billing..." : "Manage Billing"}
    </button>
  </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {PLAN_OPTIONS.map((option) => (
            <PlanOptionCard
              key={option.planType}
              option={option}
              currentPlanType={currentPlanType}
            />
          ))}
        </div>
        </section>
        </CoachShell>
  );
}

function SummaryCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
      <p className="text-sm font-bold text-slate-400">{title}</p>
      <p className="mt-4 text-3xl font-black text-[#FBBF24]">{value}</p>
    </div>
  );
}

function PlanOptionCard({
  option,
  currentPlanType,
}: {
  option: any;
  currentPlanType: string;
}) {
  const isCurrent = option.planType === currentPlanType;

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">{option.name}</h2>
          <p className="mt-2 text-slate-400">{option.description}</p>
        </div>

        {isCurrent ? (
          <span className="rounded-full bg-[#FBBF24] px-3 py-1 text-xs font-black text-[#020617]">
            Current
          </span>
        ) : null}
      </div>

      <p className="mt-6 text-4xl font-black text-[#FBBF24]">{option.price}</p>

      <p className="mt-3 text-sm font-bold text-slate-300">
        Up to {option.limit} active clients
      </p>

      <button
        disabled
        className="mt-8 rounded-2xl bg-[#FBBF24]/20 px-5 py-3 font-black text-[#FBBF24]"
      >
        Stripe Coming Soon
      </button>
    </div>
  );
}

function formatPlanName(planType: string) {
  return planType
    .replace("coach_", "")
    .replace("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}