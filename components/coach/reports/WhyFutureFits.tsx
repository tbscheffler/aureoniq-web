type Props = {
    report: any;
  };
  
  export default function WhyFutureFits({ report }: Props) {
    const data = report.whyThisFutureFits;
    const evidence = data?.evidence || [];
  
    return (
      <div className="mt-8 rounded-2xl border border-slate-700 bg-[#020617] p-8">
        <p className="text-sm font-black tracking-[0.2em] text-slate-500">
          WHY THIS FUTURE FITS
        </p>
  
        <p className="mt-4 leading-7 text-slate-300">
          {data?.summary || "No future-fit summary available."}
        </p>
  
        {evidence.length > 0 ? (
          <div className="mt-6 space-y-3">
            {evidence.map((item: string, index: number) => (
              <div
                key={index}
                className="flex gap-3 rounded-2xl border border-slate-700 bg-[#111827] p-4"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-sm font-black text-emerald-300">
                  ✓
                </span>
  
                <p className="text-sm leading-6 text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }