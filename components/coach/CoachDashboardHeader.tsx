type CoachDashboardHeaderProps = {
  organizationName: string;
  planName: string;
  firstName?: string;
};

export default function CoachDashboardHeader({
  organizationName,
  planName,
  firstName,
}: CoachDashboardHeaderProps) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#E8D49B] bg-white text-[#111827] shadow-sm">
      <div className="grid gap-0 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="p-8 md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#B8872A]">
            COACH WORKSPACE
          </p>

          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-slate-950 md:text-5xl">
            {getGreeting(firstName)}
          </h1>

          <p className="mt-3 text-2xl font-black text-[#B8872A]">
            {organizationName}
          </p>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Start with the clients who need attention, review today's coaching
            focus, and open the right Career Intelligence workspace.
          </p>
        </div>

        <div className="border-t border-slate-200 bg-gradient-to-br from-[#F8F5FF] to-white p-8 xl:border-l xl:border-t-0">
          <div className="rounded-[1.5rem] border border-[#E8D49B] bg-[#FFF8E7] p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#B8872A]">
              Current Plan
            </p>
            <p className="mt-2 text-2xl font-black text-slate-950">
              {formatPlanName(planName)}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              AI prepares. People decide.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting(firstName?: string) {
  const hour = new Date().getHours();

  let greeting = "Good evening";

  if (hour < 12) {
    greeting = "Good morning";
  } else if (hour < 18) {
    greeting = "Good afternoon";
  }

  return firstName ? `${greeting}, ${firstName}.` : `${greeting}.`;
}

function formatPlanName(planName: string) {
  if (!planName) {
    return "Coach Beta";
  }

  return planName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
