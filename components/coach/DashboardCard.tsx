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
        className={`rounded-3xl border border-slate-800 bg-[#111827] p-8 ${className}`}
      >
        {eyebrow ? (
          <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            {eyebrow}
          </p>
        ) : null}
  
        {title ? (
          <h2 className="mt-3 text-2xl font-black text-white">
            {title}
          </h2>
        ) : null}
  
        {children}
      </div>
    );
  }