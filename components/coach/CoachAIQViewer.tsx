import type { ReactNode } from "react";

type CoachAIQViewerProps = {
  reports: any[];
};

export default function CoachAIQViewer({ reports }: CoachAIQViewerProps) {
  const latestReport = reports[0];
  const report = latestReport?.report_json || latestReport;

  const aiqScore =
    report?.careerValue?.score ||
    report?.opportunityIndex?.score ||
    report?.growthPotential?.score ||
    "N/A";

  const careerStage = report?.careerStage?.stage || report?.careerStage || "N/A";
  const marketPosition =
    report?.careerValue?.marketPosition ||
    report?.marketPosition ||
    report?.opportunityIndex?.label ||
    "N/A";

  const outlook =
    report?.aiqSummary ||
    report?.summary ||
    report?.careerOutlook ||
    "AIQ Intelligence will appear here after the client completes an AIQ Report.";

  const strengths = normalizeItems(
    report?.topStrengths || report?.strengths || report?.careerValue?.strengths || []
  );

  const accelerators = normalizeItems(
    report?.growthAccelerators || report?.accelerators || report?.growthPotential?.accelerators || []
  );

  const scenarios = normalizeItems(
    report?.futureGrowthScenarios || report?.futureScenarios || report?.scenarios || []
  );

  const futureFitEvidence = normalizeItems(
    report?.whyThisFutureFits?.evidence || report?.futureFitEvidence || []
  );

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-7 text-[#111827] shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">
            FUTURE POTENTIAL
          </p>
          <h3 className="mt-3 text-3xl font-black">AIQ Intelligence</h3>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
            Future potential, growth signals, and career readiness from the
            client&apos;s AIQ report.
          </p>
        </div>

        <div className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
          {latestReport ? "AIQ Ready" : "Awaiting AIQ"}
        </div>
      </div>

      {!latestReport ? (
        <EmptyState
          title="AIQ Intelligence not available yet"
          description="When the client completes an AIQ Report, AureonIQ will summarize future potential, career readiness, and development priorities here."
        />
      ) : (
        <div className="mt-7 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              label="AIQ Score"
              value={String(aiqScore)}
              description="Future potential signal"
              tone="gold"
            />
            <MetricCard
              label="Career Stage"
              value={String(careerStage)}
              description="Current career position"
              tone="purple"
            />
            <MetricCard
              label="Market Position"
              value={String(marketPosition)}
              description="How the profile appears positioned"
            />
          </div>

          <InsightPanel eyebrow="Career Outlook" title="Future potential summary">
            <p className="text-sm font-semibold leading-7 text-slate-600">
              {outlook}
            </p>
          </InsightPanel>

          <div className="grid gap-5 lg:grid-cols-2">
            <InsightList
              eyebrow="Growth Signals"
              title="Strengths to build around"
              items={strengths.slice(0, 3)}
              emptyText="Strength signals will appear here as AIQ evidence becomes available."
              tone="green"
            />

            <InsightList
              eyebrow="Development Priorities"
              title="Where growth could accelerate"
              items={accelerators.slice(0, 3)}
              emptyText="Growth accelerators will appear here after AIQ analysis."
              tone="gold"
            />
          </div>

          <InsightList
            eyebrow="Future Scenarios"
            title="Potential directions to explore"
            items={scenarios.slice(0, 3)}
            emptyText="Future scenarios will appear here as AureonIQ identifies longer-term career paths."
            tone="purple"
          />

          <InsightList
            eyebrow="Why this future fits"
            title="Evidence behind the outlook"
            items={futureFitEvidence.slice(0, 3)}
            emptyText={report?.whyThisFutureFits?.summary || "Future-fit evidence will appear here when available."}
          />
        </div>
      )}
    </section>
  );
}

function MetricCard({
  label,
  value,
  description,
  tone = "slate",
}: {
  label: string;
  value: string;
  description: string;
  tone?: "slate" | "gold" | "purple";
}) {
  const toneClass =
    tone === "gold"
      ? "border-[#E8D49B] bg-[#FFF8E7] text-[#9A6A12]"
      : tone === "purple"
        ? "border-violet-100 bg-[#F8F5FF] text-[#4C1D95]"
        : "border-slate-200 bg-slate-50 text-slate-900";

  return (
    <div className={["rounded-3xl border p-5", toneClass].join(" ")}>
      <p className="text-xs font-black uppercase tracking-[0.16em] opacity-70">
        {label}
      </p>
      <p className="mt-3 text-2xl font-black leading-tight">{value}</p>
      <p className="mt-2 text-sm font-semibold leading-6 opacity-80">
        {description}
      </p>
    </div>
  );
}

function InsightPanel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#B8872A]">
        {eyebrow}
      </p>
      <h4 className="mt-2 text-xl font-black text-slate-950">{title}</h4>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function InsightList({
  eyebrow,
  title,
  items,
  emptyText,
  tone = "slate",
}: {
  eyebrow: string;
  title: string;
  items: NormalizedItem[];
  emptyText: string;
  tone?: "slate" | "green" | "purple" | "gold";
}) {
  const cardClass =
    tone === "green"
      ? "border-emerald-100 bg-emerald-50 text-emerald-900"
      : tone === "purple"
        ? "border-violet-100 bg-[#F8F5FF] text-[#4C1D95]"
        : tone === "gold"
          ? "border-[#E8D49B] bg-[#FFF8E7] text-[#7C4A03]"
          : "border-slate-100 bg-slate-50 text-slate-700";

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#B8872A]">
        {eyebrow}
      </p>
      <h4 className="mt-2 text-xl font-black text-slate-950">{title}</h4>

      {items.length === 0 ? (
        <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
          {emptyText}
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {items.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className={["rounded-2xl border px-4 py-4", cardClass].join(" ")}
            >
              <p className="text-sm font-black leading-6">{item.title}</p>
              {item.description ? (
                <p className="mt-1 text-sm font-semibold leading-6 opacity-80">
                  {item.description}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="mt-7 rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-6">
      <p className="text-lg font-black text-slate-950">{title}</p>
      <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

type NormalizedItem = {
  title: string;
  description?: string;
};

function normalizeItems(items: any[]): NormalizedItem[] {
  if (!Array.isArray(items)) return [];

  return items
    .filter(Boolean)
    .map((item) => {
      if (typeof item === "string") {
        return { title: item };
      }

      return {
        title:
          item.title ||
          item.role ||
          item.path ||
          item.skill ||
          item.name ||
          item.area ||
          "Career signal",
        description:
          item.summary ||
          item.description ||
          item.whyItMatters ||
          item.whyItFits ||
          item.action ||
          item.outlook ||
          item.timeframe ||
          "",
      };
    });
}
