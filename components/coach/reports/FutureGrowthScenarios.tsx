type Props = {
    report: any;
  };
  
  export default function FutureGrowthScenarios({ report }: Props) {
    const scenarios = report.futureGrowthScenarios || [];
  
    return (
      <div className="mt-8 rounded-2xl border border-slate-700 bg-[#020617] p-8">
        <p className="text-sm font-black tracking-[0.2em] text-slate-500">
          FUTURE GROWTH SCENARIOS
        </p>
  
        {scenarios.length === 0 ? (
          <p className="mt-6 text-slate-400">
            No future growth scenarios available.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {scenarios.map((scenario: any, index: number) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-700 bg-[#111827] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xl font-black text-white">
                      {scenario.title ||
                        scenario.role ||
                        scenario.path ||
                        `Scenario ${index + 1}`}
                    </p>
  
                    {scenario.timeframe ? (
                      <p className="mt-2 text-sm font-bold text-[#FBBF24]">
                        {scenario.timeframe}
                      </p>
                    ) : null}
                  </div>
  
                  <div className="rounded-full bg-[#FBBF24]/10 px-4 py-2">
                    <span className="font-black text-[#FBBF24]">
                      #{index + 1}
                    </span>
                  </div>
                </div>
  
                <p className="mt-4 leading-7 text-slate-300">
                  {scenario.summary ||
                    scenario.description ||
                    scenario.whyItFits ||
                    scenario.outlook ||
                    ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }