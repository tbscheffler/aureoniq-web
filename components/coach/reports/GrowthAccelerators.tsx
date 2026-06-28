type Props = {
    report: any;
  };
  
  export default function GrowthAccelerators({ report }: Props) {
    const accelerators = report.growthAccelerators || [];
  
    return (
      <div className="mt-8 rounded-2xl border border-slate-700 bg-[#020617] p-8">
        <p className="text-sm font-black tracking-[0.2em] text-slate-500">
          GROWTH ACCELERATORS
        </p>
  
        {accelerators.length === 0 ? (
          <p className="mt-6 text-slate-400">
            No growth accelerators available.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {accelerators.map((item: any, index: number) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-700 bg-[#111827] p-5"
              >
                <p className="font-black text-white">
                  {item.title || item.name || item.area || `Accelerator ${index + 1}`}
                </p>
  
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.summary || item.description || item.whyItMatters || item.action || ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }