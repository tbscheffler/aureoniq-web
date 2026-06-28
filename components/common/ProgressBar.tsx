type ProgressBarProps = {
    value: number;
    max?: number;
  };
  
  export default function ProgressBar({
    value,
    max = 100,
  }: ProgressBarProps) {
    const percentage = Math.max(0, Math.min((value / max) * 100, 100));
  
    return (
      <div className="mt-4">
        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-[#FBBF24] transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
  
        <p className="mt-2 text-sm text-slate-400">
          {value} / {max}
        </p>
      </div>
    );
  }