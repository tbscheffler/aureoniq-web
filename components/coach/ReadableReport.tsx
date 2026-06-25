export default function ReadableReport({ report }: { report: any }) {
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