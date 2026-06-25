export default function MetricCard({
    title,
    value,
  }: {
    title: string;
    value: any;
  }) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
        <p className="text-sm font-bold text-slate-400">{title}</p>
        <p className="mt-4 text-3xl font-black text-[#FBBF24]">{value}</p>
      </div>
    );
  }