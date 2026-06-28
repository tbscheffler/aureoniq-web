type CoachDashboardHeaderProps = {
    organizationName: string;
    planName: string;
  };
  
  export default function CoachDashboardHeader({
    organizationName,
    planName,
  }: CoachDashboardHeaderProps) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
        <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
          COACH WORKSPACE
        </p>
  
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
          <h1 className="text-4xl font-black md:text-5xl">
            {getGreeting()}
            </h1>

            <p className="mt-3 text-2xl font-black text-[#FBBF24]">
            {organizationName}
            </p>
  
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
              Your client command center for career intelligence, coaching notes,
              meetings, action items, and shared reports.
            </p>
          </div>
  
          <div className="rounded-2xl border border-[#FBBF24]/30 bg-[#FBBF24]/10 px-5 py-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FBBF24]">
              Current Plan
            </p>
            <p className="mt-2 text-xl font-black text-white">{planName}</p>
          </div>
        </div>
      </div>
    );
  }
  
  function getGreeting() {
    const hour = new Date().getHours();
  
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }