type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: SearchBarProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 focus-within:border-[#4C1D95] focus-within:ring-4 focus-within:ring-violet-100">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
      />
    </div>
  );
}
