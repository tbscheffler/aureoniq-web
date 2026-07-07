import DashboardCard from "@/components/coach/DashboardCard";
import ExecutiveSummary from "@/components/coach/reports/ExecutiveSummary";
import CareerOpportunities from "@/components/coach/reports/CareerOpportunities";
import TransferableSkills from "@/components/coach/reports/TransferableSkills";

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
            <ExecutiveSummary report={latestReport.report_json || latestReport} />
            <CareerOpportunities
                report={latestReport.report_json || latestReport}
                />
            <TransferableSkills
                report={latestReport.report_json || latestReport}
                />

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-2xl border border-slate-700 px-5 py-3 font-black text-slate-500"
          >
            Full Report Coming Soon
          </button>

          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-2xl border border-slate-700 px-5 py-3 font-black text-slate-500"
          >
            Compare Versions Coming Soon
          </button>
        </div>
        </>
      )}
    </DashboardCard>
  );
}