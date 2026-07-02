interface CoachBriefingProps {
  summary: string;
  recommendedNextStep: string;
}

export default function CoachBriefing({
  summary,
  recommendedNextStep,
}: CoachBriefingProps) {
  return (
    <div className="rounded-3xl border border-[#FBBF24]/20 bg-[#111827] p-8">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-[#FBBF24]">
        COACH BRIEFING
      </p>

      <h2 className="mt-3 text-3xl font-black text-white">
        Executive Summary
      </h2>

      <p className="mt-6 text-lg leading-8 text-slate-300">
        {summary}
      </p>

      <div className="mt-8 rounded-2xl border border-slate-700 bg-[#020617] p-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
          Recommended Next Step
        </p>

        <p className="mt-3 text-lg font-semibold text-white">
          {recommendedNextStep}
        </p>
      </div>
    </div>
  );
}