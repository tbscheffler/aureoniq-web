import type { ReactNode } from "react";

type CoachReportViewerProps = {
  title: string;
  summary?: string;
  reports: any[];
};

export default function CoachReportViewer({
  title,
  summary,
  reports,
}: CoachReportViewerProps) {
  const latestReport = reports[0];
  const report = latestReport?.report_json || latestReport;

  const opportunityScore =
    report?.careerOpportunityScore ||
    report?.opportunityScore ||
    report?.score ||
    "N/A";

  const marketValue =
    report?.marketValue ||
    report?.salaryRange ||
    report?.estimatedSalaryRange ||
    "Not available";

  const topMatch =
    report?.topCareerMatches?.[0]?.title ||
    report?.careerMatches?.[0]?.title ||
    report?.biggestOpportunity?.title ||
    report?.recommendedCareer ||
    "Not available";

  const executiveSummary =
    report?.summary ||
    report?.executiveSummary ||
    report?.careerSummary ||
    summary ||
    "Discovery Intelligence will appear here after the client completes Career Discovery.";

  const opportunities = normalizeItems(
    report?.topCareerMatches || report?.careerMatches || report?.opportunities || []
  );

  const hiddenOpportunities = normalizeItems(
    report?.hiddenOpportunities ||
      report?.unexpectedOpportunities ||
      (report?.careerYouDidntExpect ? [report.careerYouDidntExpect] : [])
  );

  const transferableSkills = normalizeItems(
    report?.transferableSkills || report?.keySkills || report?.skills || []
  );

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-7 text-[#111827] shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">
            CAREER REPORT
          </p>
          <h3 className="mt-3 text-3xl font-black">{title}</h3>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
            Career paths, transferable strengths, and hidden opportunities from
            the client&apos;s Discovery report.
          </p>
        </div>

        <div className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-emerald-700">
          {latestReport ? "Report Ready" : "Awaiting Report"}
        </div>
      </div>

      {!latestReport ? (
        <EmptyState
          title="Discovery Intelligence not available yet"
          description="When the client completes Career Discovery, AureonIQ will summarize career matches, transferable skills, hidden opportunities, and market direction here."
        />
      ) : (
        <div className="mt-7 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Opportunity Score"
              value={String(opportunityScore)}
              description="Overall Discovery signal"
              tone="gold"
            />
            <MetricCard
              label="Market Value"
              value={String(marketValue)}
              description="Estimated career value range"
            />
            <MetricCard
              label="Top Match"
              value={String(topMatch)}
              description="Strongest current match"
              tone="purple"
            />
          </div>

          <InsightPanel eyebrow="Career Summary" title="What stands out">
            <p className="text-sm font-semibold leading-7 text-slate-600">
              {executiveSummary}
            </p>
          </InsightPanel>

          <div className="grid gap-5 lg:grid-cols-2">
            <InsightList
              eyebrow="Career Matches"
              title="Roles worth exploring"
              items={opportunities.slice(0, 3)}
              emptyText="Career matches will appear here after Discovery completes."
            />

            <InsightList
              eyebrow="Transferable Skills"
              title="Strengths to translate"
              items={transferableSkills.slice(0, 4)}
              emptyText="Transferable strengths will appear here as more career evidence becomes available."
              tone="green"
            />
          </div>

          <InsightList
            eyebrow="Hidden Opportunities"
            title="Possibilities the client may not expect"
            items={hiddenOpportunities.slice(0, 2)}
            emptyText="Hidden opportunities will appear here when Discovery identifies strong adjacent paths."
            tone="purple"
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
  tone?: "slate" | "green" | "purple";
}) {
  const badgeClass =
    tone === "green"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : tone === "purple"
        ? "bg-[#F8F5FF] text-[#4C1D95] border-violet-100"
        : "bg-slate-50 text-slate-700 border-slate-100";

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
              className={["rounded-2xl border px-4 py-4", badgeClass].join(" ")}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black shadow-sm">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-black leading-6">{item.title}</p>
                  {item.description ? (
                    <p className="mt-1 text-sm font-semibold leading-6 opacity-80">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </div>
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
          item.career ||
          item.skill ||
          item.name ||
          item.area ||
          "Career signal",
        description:
          item.reason ||
          item.summary ||
          item.description ||
          item.whyItFits ||
          item.whyItMatters ||
          item.salaryRange ||
          item.salary ||
          "",
      };
    });
}
