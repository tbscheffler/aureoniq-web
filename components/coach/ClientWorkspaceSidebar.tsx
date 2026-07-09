type ClientWorkspaceSidebarProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

const sections = [
  {
    key: "understand",
    label: "Understand",
    description: "Career story and intelligence",
    icon: "◎",
  },
  {
    key: "evaluate",
    label: "Evaluate",
    description: "Opportunity Intelligence",
    icon: "◈",
  },
  {
    key: "grow",
    label: "Grow",
    description: "Briefing and growth plan",
    icon: "✦",
  },
  {
    key: "progress",
    label: "Progress",
    description: "Career journey over time",
    icon: "⌁",
  },
  {
    key: "reflections",
    label: "Reflections",
    description: "Private coach observations",
    icon: "✎",
  },
];

export default function ClientWorkspaceSidebar({
  activeSection,
  setActiveSection,
}: ClientWorkspaceSidebarProps) {
  return (
    <div className="rounded-[2rem] border border-slate-800 bg-[#050B1F] p-5 shadow-sm">
      <p className="text-xs font-black tracking-[0.25em] text-[#D4AF37]">
        CLIENT WORKSPACE
      </p>

      <div className="mt-6 space-y-3">
        {sections.map((section) => {
          const active = activeSection === section.key;

          return (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`flex w-full items-start gap-3 rounded-2xl p-4 text-left transition ${
                active
                  ? "bg-[#5B21B6] text-white shadow-lg shadow-[#5B21B6]/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span
                className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full text-sm font-black ${
                  active ? "bg-white/15 text-[#FBBF24]" : "bg-white/5 text-[#D4AF37]"
                }`}
              >
                {section.icon}
              </span>

              <span>
                <span className="block font-black">{section.label}</span>
                <span className={`mt-1 block text-xs ${active ? "text-white/70" : "text-slate-500"}`}>
                  {section.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 p-4">
        <p className="text-sm font-black text-[#D4AF37]">AIQ Advantage</p>
        <p className="mt-2 text-xs leading-5 text-slate-300">
          Career intelligence that helps coaches understand the person behind the profile.
        </p>
      </div>
    </div>
  );
}
