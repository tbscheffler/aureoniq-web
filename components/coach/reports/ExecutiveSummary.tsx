import SummaryMetric from "@/components/coach/reports/SummaryMetric";


type Props = {
    report: any;
  };
  
  export default function ExecutiveSummary({ report }: Props) {
    console.log("EXECUTIVE REPORT:", report);
    if (!report) return null;
  
    return (
      <div className="rounded-2xl border border-slate-700 bg-[#020617] p-6">
        <p className="text-sm font-black tracking-[0.2em] text-slate-500">
          EXECUTIVE SUMMARY
        </p>
  
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <SummaryMetric
                label="Opportunity Score"
                value={report.careerOpportunityScore ?? "N/A"}
            />

            <SummaryMetric
                label="Market Value"
                value={report.marketValue ?? "N/A"}
            />

            <SummaryMetric
                label="Top Match"
                value={
                report.topCareerMatches?.[0]?.title ||
                report.biggestOpportunity?.title ||
                "N/A"
                }
            />
            </div>
  
            <div className="mt-8">
            <p className="text-sm font-black tracking-[0.2em] text-slate-500">
                CAREER SUMMARY
            </p>

            <p className="mt-4 leading-7 text-slate-300">
                {report.summary || "No summary available."}
            </p>
            </div>
      </div>
    );
  }