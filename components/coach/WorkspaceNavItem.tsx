export default function WorkspaceNavItem({
    label,
    active = false,
    comingSoon = false,
    onClick,
  }: {
    label: string;
    active?: boolean;
    comingSoon?: boolean;
    onClick?: () => void;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={comingSoon}
        className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-bold disabled:cursor-not-allowed disabled:opacity-70 ${
          active
            ? "border-[#FBBF24] bg-[#FBBF24]/10 text-[#FBBF24]"
            : "border-slate-700 bg-[#020617] text-slate-300 hover:border-slate-500"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <span>{label}</span>
  
          {comingSoon ? (
            <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] text-slate-400">
              Soon
            </span>
          ) : null}
        </div>
      </button>
    );
  }