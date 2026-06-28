import DashboardCard from "@/components/coach/DashboardCard";

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

  return (
    <DashboardCard
      eyebrow="CAREER REPORT"
      title={title}
    >
      {!latestReport ? (
        <p className="mt-6 text-slate-400">
          No report has been generated yet.
        </p>
      ) : (
        <>
          <div className="mt-6 rounded-2xl border border-slate-700 bg-[#020617] p-6">
            <p className="text-sm font-black tracking-[0.2em] text-slate-500">
              EXECUTIVE SUMMARY
            </p>

            <p className="mt-4 leading-7 text-slate-300">
              {summary || "Summary coming next."}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-2xl bg-[#FBBF24] px-5 py-3 font-black text-[#020617]">
              View Full Report
            </button>

            <button className="rounded-2xl border border-slate-700 px-5 py-3 font-black text-white">
              Compare Versions
            </button>
          </div>
        </>
      )}
    </DashboardCard>
  );
}