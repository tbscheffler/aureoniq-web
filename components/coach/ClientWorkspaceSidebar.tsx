type ClientWorkspaceSidebarProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

const sections = [
  {
    key: "overview",
    label: "Overview",
    description: "Client status and next steps",
  },
  {
    key: "discovery",
    label: "Career Assessment",
    description: "Career paths and opportunity analysis",
  },
  {
    key: "aiq",
    label: "Future Potential",
    description: "AIQ career intelligence report",
  },
  {
    key: "resume",
    label: "Resume Review",
    description: "Review resume strengths and improvement areas",
  },
  {
    key: "timeline",
    label: "Career Journey",
    description: "Progress and activity over time",
  },
  {
    key: "notes",
    label: "Coach Notes",
    description: "Private coaching observations",
  },
  {
    key: "sessions",
    label: "Coaching Sessions",
    description: "Plan, conduct, and review coaching sessions",
  },
  {
    key: "meetings",
    label: "Meetings",
    description: "Session history and follow-ups",
  },
  {
    key: "actions",
    label: "Action Plan",
    description: "Tasks and next steps",
  },
];

export default function ClientWorkspaceSidebar({
  activeSection,
  setActiveSection,
}: ClientWorkspaceSidebarProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-5">
      <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
        CAREER INTELLIGENCE
      </p>

      <div className="mt-6 space-y-3">
        {sections.map((section) => {
          const active = activeSection === section.key;

          return (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`w-full rounded-2xl p-4 text-left transition ${
                active
                  ? "bg-[#FBBF24] text-[#020617]"
                  : "border border-slate-800 bg-[#020617] text-slate-300 hover:border-[#FBBF24]"
              }`}
            >
              <p className="font-black">{section.label}</p>

              <p
                className={`mt-1 text-xs ${
                  active ? "text-[#020617]/70" : "text-slate-500"
                }`}
              >
                {section.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}