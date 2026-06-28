type Props = {
    label: string;
    value: string | number;
  };
  
  export default function SummaryMetric({
    label,
    value,
  }: Props) {
    return (
      <div className="rounded-2xl border border-slate-700 bg-[#111827] p-5">
        <p className="text-xs font-black tracking-[0.15em] text-slate-500 uppercase">
          {label}
        </p>
  
        <p className="mt-3 text-3xl font-black text-[#FBBF24]">
          {value}
        </p>
      </div>
    );
  }