import DashboardCard from "@/components/coach/DashboardCard";
import SummaryMetric from "@/components/coach/reports/SummaryMetric";
import GrowthAccelerators from "@/components/coach/reports/GrowthAccelerators";
import FutureGrowthScenarios from "@/components/coach/reports/FutureGrowthScenarios";

type CoachAIQViewerProps = {
  reports: any[];
};

export default function CoachAIQViewer({ reports }: CoachAIQViewerProps) {
  const latestReport = reports[0];
  const report = latestReport?.report_json || latestReport;

  return (
    <DashboardCard eyebrow="FUTURE POTENTIAL" title="AIQ Report">
      {!latestReport ? (
        <p className="mt-6 text-slate-400">
          No AIQ report has been generated yet.
        </p>
      ) : (
        <>
          <div className="mt-6 rounded-2xl border border-slate-700 bg-[#020617] p-8">
            <p className="text-sm font-black tracking-[0.2em] text-slate-500">
              FUTURE POTENTIAL SUMMARY
            </p>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <SummaryMetric
                label="AIQ Score"
                value={
                    report.careerValue?.score ||
                    report.opportunityIndex?.score ||
                    report.growthPotential?.score ||
                    "N/A"
                }
                />

                <SummaryMetric
                label="Trajectory"
                value={report.careerStage?.stage || "N/A"}
                />

                <SummaryMetric
                label="Market Position"
                value={report.careerValue?.marketPosition || "N/A"}
                />
            </div>

            <div className="mt-8">
              <p className="text-sm font-black tracking-[0.2em] text-slate-500">
                CAREER OUTLOOK
              </p>

              <p className="mt-4 leading-7 text-slate-300">
              {report.aiqSummary || "No career outlook summary available."}
              </p>
            </div>
          </div>
          <GrowthAccelerators report={report} />
          <FutureGrowthScenarios report={report} />
        </>
      )}
    </DashboardCard>
  );
}