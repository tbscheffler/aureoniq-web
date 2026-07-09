type DashboardCardProps = {
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
};

export default function DashboardCard({
  eyebrow,
  title,
  children,
  className = "",
}: DashboardCardProps) {
  return (
    <div
      className={`rounded-[2rem] border border-slate-200 bg-white p-7 text-[#111827] shadow-sm ${className}`}
    >
      {eyebrow ? (
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">
          {eyebrow}
        </p>
      ) : null}

      {title ? (
        <h2 className="mt-3 text-2xl font-black text-slate-950">
          {title}
        </h2>
      ) : null}

      {children}
    </div>
  );
}
