type SeatUsageCardProps = {
  activeClients: number;
  clientLimit: number;
  planName: string;
  demoClients?: number;
};
  
export default function SeatUsageCard({
  activeClients,
  clientLimit,
  planName,
  demoClients = 0,
}: SeatUsageCardProps) {
    const safeLimit = clientLimit > 0 ? clientLimit : 4;
    const usagePercent = Math.min((activeClients / safeLimit) * 100, 100);
  
    return (
      <div className="mt-10 rounded-3xl border border-[#FBBF24]/30 bg-[#111827] p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
              PLAN USAGE
            </p>
  
            <h2 className="mt-4 text-3xl font-black text-white">
              {activeClients} of {safeLimit} billable client seats used
            </h2>
  
            <p className="mt-3 text-slate-400">
              Current plan:{" "}
              <span className="font-bold text-white">{formatPlanName(planName)}</span>
            </p>
          </div>
  
          <span className="w-fit rounded-full border border-[#FBBF24]/40 bg-[#FBBF24]/10 px-4 py-2 text-sm font-black text-[#FBBF24]">
            {formatPlanName(planName)}
          </span>
        </div>
  
        <div className="mt-8 h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-[#FBBF24]"
            style={{ width: `${usagePercent}%` }}
          />
        </div>
  
        {activeClients >= safeLimit ? (
          <p className="mt-4 text-sm font-bold text-red-300">
            Seat limit reached. Upgrade will be required before adding another active client.
          </p>
        ) : (
        <p className="mt-4 text-sm text-slate-400">
          {safeLimit - activeClients} billable client seats remaining.
          {demoClients > 0
            ? ` ${demoClients} demo client${demoClients === 1 ? "" : "s"} included at no cost.`
            : ""}
        </p>
        )}
      </div>
    );
  }
  
  function formatPlanName(planName: string) {
    switch (planName) {
      case "coach_starter":
        return "Starter";
      case "coach_growth":
        return "Growth";
      case "coach_professional":
        return "Professional";
      case "coach_business":
        return "Business";
      case "free_beta":
        return "Free Beta";
      default:
        return planName || "Free Beta";
    }
  }