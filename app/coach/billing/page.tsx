"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getCurrentOrganization,
  getOrganizationPlan,
  getCoachDashboard,
} from "@/services/coachService";
import CoachShell from "@/components/coach/CoachShell";
import { supabase } from "@/lib/supabaseClient";

const PLAN_OPTIONS = [
  {
    name: "Coach Starter",
    price: "$49/mo",
    limit: 4,
    planType: "coach_starter",
    description: "For solo coaches starting with a focused client roster.",
  },
  {
    name: "Coach Professional",
    price: "$99/mo",
    limit: 10,
    planType: "coach_professional",
    description: "For established coaches managing more active clients.",
  },
  {
    name: "Coach Growth",
    price: "$199/mo",
    limit: 25,
    planType: "coach_growth",
    description: "For growing practices and small coaching teams.",
  },
  {
    name: "Enterprise",
    price: "Contact Sales",
    limit: "Custom",
    planType: "coach_enterprise",
    description:
      "For coaching organizations, universities, workforce programs, and custom deployments.",
  },
];

export default function CoachBillingPage() {
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
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

        const [planData, dashboardData] = await Promise.all([
          getOrganizationPlan(organizationId),
          getCoachDashboard(organizationId),
        ]);

        setOrganization(orgData);
        setPlan(planData);
        setDashboardData(dashboardData);
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
      <CoachShell>
        <section className="rounded-[2rem] bg-[#F8FAFC] p-6 text-slate-950">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#B8872A]">
              BILLING
            </p>
            <h1 className="mt-4 text-4xl font-black">Loading Billing...</h1>
            <p className="mt-3 text-slate-600">Preparing your subscription workspace.</p>
          </div>
        </section>
      </CoachShell>
    );
  }

  const currentPlanType = plan?.plan_type || "coach_beta";
  const seatUsage = dashboardData?.seatUsage;

  const clientLimit = Number(seatUsage?.seat_limit ?? plan?.managed_client_limit ?? 4);
  const activeClients = Number(seatUsage?.billable_clients ?? 0);
  const demoClients = Number(seatUsage?.demo_clients ?? 0);
  const seatsRemaining = Number(
    seatUsage?.remaining_seats ?? Math.max(clientLimit - activeClients, 0)
  );

  return (
    <CoachShell>
      <section className="rounded-[2rem] bg-[#F8FAFC] p-4 text-[#111827] md:p-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#B8872A]">
            BILLING WORKSPACE
          </p>
          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black md:text-5xl">Plan & Seat Management</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
                Manage your coach subscription, active client seats, and billing settings for {organization?.name || "your organization"}.
              </p>
            </div>
            <button
              onClick={openCustomerPortal}
              disabled={openingPortal}
              className="rounded-2xl bg-[#4C1D95] px-6 py-4 font-black text-white shadow-sm transition hover:bg-[#3B147B] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {openingPortal ? "Opening Billing..." : "Manage Billing"}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <SummaryCard title="Current Plan" value={formatPlanName(currentPlanType)} description="Active subscription" />
          <SummaryCard title="Billable Seats" value={`${activeClients} / ${clientLimit}`} description="Clients counting toward plan" />
          <SummaryCard title="Seats Remaining" value={seatsRemaining} description="Available client seats" />
        </div>

        <div className="mt-7 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">Subscription</p>
          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-3xl font-black">{formatPlanName(currentPlanType)}</h2>
              <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                Manage payment methods, invoices, cancellations, and subscription settings securely through Stripe.
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Status</p>
              <p className="mt-1 text-lg font-black capitalize text-emerald-950">{plan?.status || "active"}</p>
            </div>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <MiniCard title="Client Limit" value={clientLimit} />
            <MiniCard title="Billable Clients" value={activeClients} />
            <MiniCard title="Demo Clients" value={demoClients} />
          </div>
        </div>

        <div className="mt-7 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">Plans</p>
          <h2 className="mt-3 text-2xl font-black">Available coach plans</h2>
          <p className="mt-2 max-w-3xl leading-7 text-slate-600">
            Choose the plan that fits your active client roster. Plan changes are managed securely through Stripe.
          </p>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {PLAN_OPTIONS.map((option) => (
              <PlanOptionCard
                key={option.planType}
                option={option}
                currentPlanType={currentPlanType}
                openCustomerPortal={openCustomerPortal}
              />
            ))}
          </div>
        </div>
      </section>
    </CoachShell>
  );
}

function SummaryCard({ title, value, description }: { title: string; value: any; description: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-black text-[#B8872A]">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{description}</p>
    </div>
  );
}

function MiniCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function PlanOptionCard({
  option,
  currentPlanType,
  openCustomerPortal,
}: {
  option: any;
  currentPlanType: string;
  openCustomerPortal: () => void;
}) {
  const isCurrent = option.planType === currentPlanType;

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-950">{option.name}</h3>
          <p className="mt-2 leading-7 text-slate-600">{option.description}</p>
        </div>

        {isCurrent ? (
          <span className="rounded-full border border-[#E8D49B] bg-[#FFF8E7] px-3 py-1 text-xs font-black text-[#9A6A12]">
            Current
          </span>
        ) : null}
      </div>

      <p className="mt-6 text-3xl font-black text-[#B8872A]">{option.price}</p>

      <p className="mt-3 text-sm font-bold text-slate-500">
        {option.limit === "Custom"
          ? "Custom active client limits"
          : `Up to ${option.limit} active clients`}
      </p>

      {option.planType === "coach_enterprise" ? (
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-2xl bg-[#4C1D95] px-5 py-3 font-black text-white shadow-sm transition hover:bg-[#3B147B]"
        >
          Contact Sales
        </Link>
      ) : (
        <button
          onClick={openCustomerPortal}
          className="mt-6 rounded-2xl bg-[#4C1D95] px-5 py-3 font-black text-white shadow-sm transition hover:bg-[#3B147B]"
        >
          Manage Plan
        </button>
      )}
    </div>
  );
}

function formatPlanName(planType: string) {
  return planType
    .replace("coach_", "")
    .replace("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
