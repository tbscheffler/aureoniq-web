"use client";

import Link from "next/link";
import { useState } from "react";
import { endOrganizationClientRelationship } from "@/services/coachService";

type Props = {
  client: any;
  hasDiscoveryReport?: boolean;
  hasAIQReport?: boolean;
  openActionItems?: number;
  nextMeeting?: any;
  clientHealth?: {
    score: number;
    status: string;
  } | null;
  resumeProfile?: any;
  careerReport?: any;
  aiqReport?: any;
};

export default function ClientWorkspaceHeader({
  client,
  hasDiscoveryReport = false,
  hasAIQReport = false,
  clientHealth = null,
  resumeProfile = null,
  careerReport = null,
  aiqReport = null,
}: Props) {
  const name =
    client?.client_display_name ||
    client?.client_profile?.display_name ||
    client?.client_email ||
    "Client";

  const initials = getInitials(name);
  const isSampleClient = Boolean(client?.is_sample);
  const [endingRelationship, setEndingRelationship] = useState(false);

  const currentTitle =
    resumeProfile?.current_title ||
    resumeProfile?.currentTitle ||
    careerReport?.currentRole ||
    "Career Explorer";

  const location =
    resumeProfile?.preferred_location ||
    resumeProfile?.location ||
    careerReport?.regionalContext?.region ||
    careerReport?.regionalContext?.matchedRegion ||
    "Location not set";

  const targetSalary =
    careerReport?.salaryGoal ||
    careerReport?.marketValue ||
    "Target not set";

  const careerStory =
    careerReport?.summary ||
    aiqReport?.aiqSummary ||
    "This career profile is still developing. As the client completes reports and shares more career evidence, AureonIQ will build a clearer picture of their strengths, opportunities, and next steps.";

  const aiqScore =
    aiqReport?.careerValue?.score ||
    aiqReport?.opportunityIndex?.score ||
    aiqReport?.growthPotential?.score ||
    clientHealth?.score ||
    "--";

  async function handleEndRelationship() {
    const confirmed = window.confirm(
      "End this coaching relationship? This will remove the client from your active roster and end their sponsored access. Their AureonIQ account and data will not be deleted."
    );

    if (!confirmed) return;

    try {
      setEndingRelationship(true);
      await endOrganizationClientRelationship(client.id);
      alert("Coaching relationship ended.");
      window.location.href = "/coach";
    } catch (error: any) {
      alert(error.message || "Unable to end coaching relationship.");
    } finally {
      setEndingRelationship(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-[#d7b56d]/30 bg-white p-5 text-[#111827] shadow-sm md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/coach/clients" className="text-sm font-bold text-[#9A6A12]">
          ← Back to Clients
        </Link>

        <div className="flex flex-wrap gap-3">
          <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-[#111827] shadow-sm">
            + Add Note
          </button>
          <button className="rounded-2xl bg-[#B8872A] px-4 py-2.5 text-sm font-black text-white shadow-sm">
            Schedule Session
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_1.35fr_0.55fr] lg:items-center">
        <section className="flex gap-4 border-b border-slate-200 pb-5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FBBF24] via-[#B8872A] to-[#5B21B6] text-2xl font-black text-white shadow-lg shadow-[#B8872A]/20">
            {initials}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-black text-[#92400E]">
                {isSampleClient ? "Demo Client" : "Active Client"}
              </span>
            </div>

            <h1 className="mt-2 text-3xl font-black leading-tight text-[#111827]">
              {name}
            </h1>

            <p className="mt-2 font-semibold text-slate-600">{currentTitle}</p>

            <div className="mt-4 space-y-1.5 text-sm text-slate-600">
              <p>📍 {location}</p>
              <p>🎯 {targetSalary}</p>
              <p>{hasDiscoveryReport ? "✓ Career Intelligence ready" : "• Career Intelligence pending"}</p>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 pb-5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
          <p className="text-3xl font-black leading-none text-[#B8872A]">“</p>
          <p className="mt-1 text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">
            Career Story
          </p>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-700">
            {careerStory}
          </p>
          <button className="mt-3 text-sm font-black text-[#5B21B6]">
            View full story →
          </button>
        </section>

        <section className="flex flex-col justify-center text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#111827]">
            AIQ Score
          </p>

          <div className="mx-auto mt-4 flex h-28 w-28 items-center justify-center rounded-full border-[8px] border-[#B8872A] bg-[#FFFBEB] shadow-inner">
            <div>
              <p className="text-4xl font-black text-[#B8872A]">{aiqScore}</p>
              <p className="text-xs font-bold text-slate-500">/100</p>
            </div>
          </div>

          <p className="mt-3 font-black text-[#5B21B6]">
            {clientHealth?.status || (hasAIQReport ? "Intelligence Ready" : "Profile Building")}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {hasAIQReport ? "AIQ report complete" : "Generate AIQ for deeper insight"}
          </p>
        </section>
      </div>

      {!isSampleClient ? (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleEndRelationship}
            disabled={endingRelationship}
            className="rounded-2xl border border-red-200 px-4 py-2 text-sm font-black text-red-500 hover:bg-red-50 disabled:opacity-60"
          >
            {endingRelationship ? "Ending..." : "End Coaching Relationship"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function getInitials(name: string) {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return "AIQ";

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}
