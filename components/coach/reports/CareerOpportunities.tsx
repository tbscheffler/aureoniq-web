type Props = {
    report: any;
  };
  
  export default function CareerOpportunities({ report }: Props) {
    const opportunities =
      report.topCareerMatches ||
      report.careerMatches ||
      report.opportunities ||
      [];
  
    return (
      <div className="mt-8 rounded-2xl border border-slate-700 bg-[#020617] p-8">
        <p className="text-sm font-black tracking-[0.2em] text-slate-500">
          CAREER OPPORTUNITIES
        </p>
  
        {opportunities.length === 0 ? (
          <p className="mt-6 text-slate-400">
            No opportunities available.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {opportunities.slice(0, 5).map((job: any, index: number) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-700 bg-[#111827] p-6"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xl font-black text-white">
                      {job.title}
                    </p>
  
                    <p className="mt-2 text-slate-400">
                      {job.salaryRange || job.salary}
                    </p>
                  </div>
  
                  <div className="rounded-full bg-[#FBBF24]/10 px-4 py-2">
                    <span className="font-black text-[#FBBF24]">
                      #{index + 1}
                    </span>
                  </div>
                </div>
  
                {job.reason && (
                  <p className="mt-4 leading-7 text-slate-300">
                    {job.reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }