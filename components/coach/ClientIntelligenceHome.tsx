"use client";

import type { ReactNode } from "react";

type Props = {
  clientName: string;
  resumeProfile?: any;
  careerReport?: any;
  aiqReport?: any;
  clientHealth?: {
    score: number;
    status: string;
  } | null;
  careerSummary: string;
  recommendedNextStep: string;
  setActiveSection: (section: string) => void;
};

export default function ClientIntelligenceHome({
  clientName,
  resumeProfile = null,
  careerReport = null,
  aiqReport = null,
  clientHealth = null,
  careerSummary,
  recommendedNextStep,
  setActiveSection,
}: Props) {
  const aiqScore =
    aiqReport?.careerValue?.score ||
    aiqReport?.opportunityIndex?.score ||
    aiqReport?.growthPotential?.score ||
    clientHealth?.score ||
    "--";

  const careerStage =
    aiqReport?.careerStage?.stage ||
    aiqReport?.careerStage ||
    careerReport?.careerIdentity ||
    careerReport?.careerStage ||
    "Building Profile";

  const strengths = getStrengths({ resumeProfile, careerReport, aiqReport });
  const hiddenOpportunity = getHiddenOpportunity(careerReport);
  const regional = getRegionalOutlook(careerReport);
  const hasRegionalContext = regional.status === "available";

  return (
    <div className="space-y-7 text-[#111827]">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">
              At a Glance
            </p>
            <h2 className="mt-2 text-3xl font-black">Career Intelligence</h2>
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
              A quick read on this client&apos;s career story, readiness, strengths,
              and next coaching opportunities.
            </p>
          </div>

          <button
            onClick={() => setActiveSection("progress")}
            className="rounded-2xl border border-violet-100 bg-[#F8F5FF] px-5 py-3 text-sm font-black text-[#5B21B6] transition hover:bg-[#EFE7FF]"
          >
            View Career Journey →
          </button>
        </div>

        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <InsightCard
            icon="◎"
            label="AIQ Score"
            value={String(aiqScore)}
            detail={clientHealth?.status || "Career intelligence score"}
            accent="gold"
          />

          <InsightCard
            icon="◈"
            label="Career Stage"
            value={String(careerStage)}
            detail="Current career position"
            accent="purple"
          />

          <InsightCard
            icon="✦"
            label="Top Strengths"
            value={strengths.slice(0, 3).join(", ") || "Still developing"}
            detail={
              strengths.length > 3
                ? `+ ${strengths.length - 3} more`
                : "From career evidence"
            }
            accent="blue"
          />

          <InsightCard
            icon="↗"
            label="Career Readiness"
            value={clientHealth?.status || "Not Scored"}
            detail="Based on available signals"
            accent="green"
          />

          <InsightCard
            icon="✺"
            label="Hidden Opportunity"
            value={hiddenOpportunity}
            detail="Unexpected paths worth exploring"
            accent="gold"
          />
        </div>
      </section>

      <section className="grid gap-7 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-start gap-4">
            <SectionIcon tone="purple">◈</SectionIcon>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B8872A]">
                Opportunity Intelligence
              </p>
              <h3 className="mt-2 text-2xl font-black">
                Analyze a role for {clientName}
              </h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                Compare a role against the client&apos;s Career Intelligence Profile,
                including fit, stretch areas, career bridge, and decision context.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-violet-100 bg-gradient-to-br from-[#F8F5FF] to-white p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <MiniSignal label="Alignment" value="Fit + stretch" />
              <MiniSignal label="Bridge" value="Pathway view" />
              <MiniSignal label="Decision" value="Coach context" />
            </div>

            <button
              onClick={() => setActiveSection("evaluate")}
              className="mt-6 rounded-2xl bg-[#5B21B6] px-5 py-3 text-sm font-black text-white transition hover:bg-[#4C1D95]"
            >
              Open Evaluate
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex items-start gap-4">
            <SectionIcon tone="gold">✦</SectionIcon>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B8872A]">
                Coach Briefing
              </p>
              <h3 className="mt-2 text-2xl font-black">
                Prepare for the next session
              </h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                Turn career evidence into a focused conversation before the
                coach meets with the client.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <BriefingBox label="Today&apos;s Focus" value={recommendedNextStep} />
            <BriefingBox label="Career Signal" value={careerSummary} />
            <BriefingBox
              label="Conversation Spark"
              value="What strengths does this client underestimate, and which next step feels both realistic and energizing?"
            />
          </div>

          <button
            onClick={() => setActiveSection("grow")}
            className="mt-5 rounded-2xl border border-violet-100 bg-[#F8F5FF] px-5 py-3 text-sm font-black text-[#5B21B6] transition hover:bg-[#EFE7FF]"
          >
            Prepare for next session →
          </button>
        </div>
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#B8872A]">
              Regional Intelligence
            </p>
            <h3 className="mt-2 text-2xl font-black">Market context</h3>
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
              {hasRegionalContext
                ? regional.summary
                : "Regional insights will appear after the client shares location, relocation, and remote-work preferences during Career Discovery."}
            </p>
          </div>

          <div
            className={[
              "rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em]",
              hasRegionalContext
                ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                : "border-[#E8D49B] bg-[#FFF8E7] text-[#9A6A12]",
            ].join(" ")}
          >
            {hasRegionalContext ? "Regional Ready" : "Needs Location"}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <RegionalCard
            label="Local Demand"
            value={regional.localDemand}
            description="How the market may support this client&apos;s direction."
            active={hasRegionalContext}
          />
          <RegionalCard
            label="Nearby Markets"
            value={regional.nearbyMarkets}
            description="Adjacent markets that may expand opportunity options."
            active={hasRegionalContext}
          />
          <RegionalCard
            label="Remote Context"
            value={regional.remoteContext}
            description="How remote-friendly the client&apos;s target paths may be."
            active={hasRegionalContext}
          />
        </div>
      </section>
    </div>
  );
}

function InsightCard({
  icon,
  label,
  value,
  detail,
  accent,
}: {
  icon: string;
  label: string;
  value: string;
  detail: string;
  accent: "gold" | "purple" | "blue" | "green";
}) {
  const accentClasses = {
    gold: "bg-[#FEF3C7] text-[#B8872A]",
    purple: "bg-[#EDE9FE] text-[#5B21B6]",
    blue: "bg-[#DBEAFE] text-[#2563EB]",
    green: "bg-[#DCFCE7] text-[#16A34A]",
  }[accent];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-black ${accentClasses}`}
      >
        {icon}
      </div>
      <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 line-clamp-3 text-xl font-black leading-tight text-[#111827]">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-500">{detail}</p>
    </div>
  );
}

function SectionIcon({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "gold" | "purple";
}) {
  const className =
    tone === "purple"
      ? "bg-[#EDE9FE] text-[#5B21B6]"
      : "bg-[#FEF3C7] text-[#B8872A]";

  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-xl font-black ${className}`}
    >
      {children}
    </div>
  );
}

function MiniSignal({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-violet-100 bg-white px-4 py-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#6D28D9]">
        {label}
      </p>
      <p className="mt-2 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}

function BriefingBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-black text-[#111827]">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{value}</p>
    </div>
  );
}

function RegionalCard({
  label,
  value,
  description,
  active,
}: {
  label: string;
  value: string;
  description: string;
  active: boolean;
}) {
  return (
    <div
      className={[
        "rounded-3xl border p-5",
        active
          ? "border-emerald-100 bg-emerald-50 text-emerald-950"
          : "border-slate-200 bg-slate-50 text-slate-700",
      ].join(" ")}
    >
      <p className="text-xs font-black uppercase tracking-[0.16em] opacity-70">
        {label}
      </p>
      <p className="mt-3 text-lg font-black leading-tight">{value}</p>
      <p className="mt-3 text-sm font-semibold leading-6 opacity-80">
        {description}
      </p>
    </div>
  );
}

function getStrengths({
  resumeProfile,
  careerReport,
  aiqReport,
}: {
  resumeProfile?: any;
  careerReport?: any;
  aiqReport?: any;
}) {
  const raw =
    aiqReport?.topStrengths ||
    careerReport?.transferableSkills ||
    resumeProfile?.skills ||
    [];

  if (!Array.isArray(raw)) return [];

  return raw
    .map((item: any) => item?.skill || item?.name || item?.title || item)
    .filter(Boolean)
    .slice(0, 6);
}

function getHiddenOpportunity(careerReport?: any) {
  const hidden = careerReport?.hiddenOpportunities?.[0];

  return (
    hidden?.title ||
    hidden?.role ||
    careerReport?.careerYouDidntExpect?.title ||
    careerReport?.biggestOpportunity?.title ||
    careerReport?.topCareerMatches?.[0]?.title ||
    "Explore next fit"
  );
}

function getRegionalOutlook(careerReport?: any) {
  const region =
    careerReport?.regionalContext ||
    careerReport?.regional_context ||
    careerReport?.regional ||
    careerReport?.regionalIntelligence ||
    careerReport?.marketContext ||
    careerReport?.locationContext ||
    null;

  const preferredLocation =
    careerReport?.preferredLocation ||
    careerReport?.preferredCity ||
    careerReport?.location ||
    region?.preferredLocation ||
    region?.city ||
    region?.regionName ||
    region?.search_region ||
    region?.searchRegion ||
    region?.metro_area ||
    region?.metroArea ||
    "";

  const localDemand =
    region?.localDemand ||
    region?.demand ||
    region?.localAvailability ||
    region?.availability ||
    region?.marketDemand ||
    region?.jobMarket ||
    "";

  const nearbyMarkets = Array.isArray(region?.nearbyMarkets)
    ? region.nearbyMarkets.slice(0, 2).join(", ")
    : region?.nearbyMarkets ||
      region?.nearbyGrowthMarkets ||
      region?.adjacentMarkets ||
      region?.fallback_region ||
      region?.fallbackRegion ||
      "";

  const remoteContext =
    region?.remoteContext ||
    region?.remoteFriendliness ||
    region?.remote_fit ||
    region?.remoteFit ||
    region?.remoteAvailability ||
    "";

  const summary =
    region?.outlook ||
    region?.summary ||
    region?.regionalSummary ||
    careerReport?.regionalOutlook ||
    careerReport?.regionalSummary ||
    "";

  const hasAnyRegionalSignal = Boolean(
    summary || preferredLocation || localDemand || nearbyMarkets || remoteContext
  );

  if (hasAnyRegionalSignal) {
    return {
      status: "available" as const,
      summary:
        summary ||
        `Regional Intelligence is available${preferredLocation ? ` for ${preferredLocation}` : ""}. Use this context to understand local demand, nearby markets, and remote-work fit.`,
      localDemand: localDemand || "Regional demand context available",
      nearbyMarkets: nearbyMarkets || "Nearby market context available",
      remoteContext: remoteContext || "Remote-work context available",
    };
  }

  return {
    status: "missing" as const,
    summary: "",
    localDemand: "Add work location",
    nearbyMarkets: "Add relocation preference",
    remoteContext: "Add remote preference",
  };
}
