"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCoachClientSummary } from "@/services/coachService";

export default function CoachClientWorkspacePage() {
    const params = useParams();
    const clientId = params.clientId as string;
  
    const [loading, setLoading] = useState(true);
    const [workspace, setWorkspace] = useState<any>(null);
    const [error, setError] = useState("");
    const [activeSection, setActiveSection] = useState("discovery");

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const data = await getCoachClientSummary(clientId);
        setWorkspace(data);
      } catch (err: any) {
        setError(err.message || "Unable to load client workspace.");
      } finally {
        setLoading(false);
      }
    }

    loadWorkspace();
  }, [clientId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] p-8 text-white">
        <p className="font-black text-[#FBBF24]">Loading client workspace...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#020617] p-8 text-white">
        <p className="font-black text-red-300">{error}</p>
        <a href="/coach" className="mt-6 inline-block text-[#FBBF24]">
          ← Back to Coach Workspace
        </a>
      </main>
    );
  }

  const careerReports = workspace?.career_reports || [];
  const aiqReports = workspace?.aiq_reports || [];

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <a href="/coach" className="text-sm font-bold text-[#FBBF24]">
          ← Back to Coach Workspace
        </a>

        <div className="mt-10">
          <p className="mb-4 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            CLIENT WORKSPACE
          </p>

          <h1 className="text-5xl font-black">Client Career Intelligence</h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Review this client’s shared AureonIQ reports. Reports are read-only.
            Coaching notes and action plans will live here next.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <MetricCard title="Discovery Reports" value={careerReports.length} />
          <MetricCard title="AIQ Reports" value={aiqReports.length} />
          <MetricCard
            title="Access Level"
            value={workspace?.client?.access_level || "shared"}
          />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl border border-slate-800 bg-[#111827] p-6">
            <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
              WORKSPACE
            </p>

            <nav className="mt-6 space-y-3">
            <WorkspaceNavItem
              label="Career Discovery"
              active={activeSection === "discovery"}
              onClick={() => setActiveSection("discovery")}
            />

            <WorkspaceNavItem
              label="AIQ Reports"
              active={activeSection === "aiq"}
              onClick={() => setActiveSection("aiq")}
            />

            <WorkspaceNavItem label="Coach Notes" comingSoon />
            <WorkspaceNavItem label="Meeting History" comingSoon />
            <WorkspaceNavItem label="Action Plan" comingSoon />
            </nav>
          </aside>

          <div className="space-y-8">
            {activeSection === "discovery" ? (
              <ReportSection title="Career Discovery Reports" reports={careerReports} />
            ) : null}

            {activeSection === "aiq" ? (
              <ReportSection title="AIQ Reports" reports={aiqReports} />
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}

function MetricCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
      <p className="text-sm font-bold text-slate-400">{title}</p>
      <p className="mt-4 text-3xl font-black text-[#FBBF24]">{value}</p>
    </div>
  );
}

function WorkspaceNavItem({
  label,
  active = false,
  comingSoon = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  comingSoon?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={comingSoon}
      className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-bold disabled:cursor-not-allowed disabled:opacity-70 ${
        active
          ? "border-[#FBBF24] bg-[#FBBF24]/10 text-[#FBBF24]"
          : "border-slate-700 bg-[#020617] text-slate-300 hover:border-slate-500"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span>{label}</span>

        {comingSoon ? (
          <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] text-slate-400">
            Soon
          </span>
        ) : null}
      </div>
    </button>
  );
}

function ReportSection({ title, reports }: { title: string; reports: any[] }) {
  return (
    <div className="mt-8 rounded-3xl border border-slate-800 bg-[#111827] p-8">
      <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
        {title.toUpperCase()}
      </p>

      {reports.length === 0 ? (
        <p className="mt-4 text-slate-400">No reports shared yet.</p>
      ) : (
        <div className="mt-6 grid gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-2xl border border-slate-700 bg-[#020617] p-5"
            >
              <p className="font-black text-white">
                {report.title || "Career Report"}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Created:{" "}
                {report.created_at
                  ? new Date(report.created_at).toLocaleString()
                  : "Unknown"}
              </p>

              <ReadableReport report={report} />

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReadableReport({ report }: { report: any }) {
    const reportJson = report.report_json || report.aiq_json || report.data || {};
  
    return (
      <div className="mt-4 space-y-5">
        {reportJson.summary ? (
          <div>
            <p className="text-sm font-black text-[#FBBF24]">Summary</p>
            <p className="mt-2 leading-7 text-slate-300">{reportJson.summary}</p>
          </div>
        ) : null}
  
        {Array.isArray(reportJson.hiddenOpportunities) ? (
          <div>
            <p className="text-sm font-black text-[#FBBF24]">
              Hidden Opportunities
            </p>
  
            <div className="mt-3 grid gap-3">
              {reportJson.hiddenOpportunities.map((item: any, index: number) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-700 bg-black/30 p-4"
                >
                  <p className="font-bold text-white">
                    {item.title || item.role || "Opportunity"}
                  </p>
  
                  {item.reason ? (
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {item.reason}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
  
        {Array.isArray(reportJson.skillGaps) ? (
          <div>
            <p className="text-sm font-black text-[#FBBF24]">Skill Gaps</p>
  
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {reportJson.skillGaps.map((gap: any, index: number) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-700 bg-black/30 p-4"
                >
                  <p className="font-bold text-white">
                    {gap.skill || "Skill"}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">
                    Difficulty: {gap.difficulty || "Not specified"}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Time to learn: {gap.timeToLearn || "Not specified"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
  
        {Array.isArray(reportJson.futurePaths) ? (
          <div>
            <p className="text-sm font-black text-[#FBBF24]">Future Paths</p>
  
            <div className="mt-3 grid gap-3">
              {reportJson.futurePaths.map((path: any, index: number) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-700 bg-black/30 p-4"
                >
                  <p className="font-bold text-white">
                    {path.title || path.role || "Future Path"}
                  </p>
  
                  {path.description ? (
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {path.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }