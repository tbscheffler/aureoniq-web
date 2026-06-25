import ReadableReport from "@/components/coach/ReadableReport";

export default function ReportSection({
  title,
  reports,
}: {
  title: string;
  reports: any[];
}) {
  return (
    <div className="mt-8 rounded-3xl border border-slate-800 bg-[#111827] p-8">
      <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
        {title.toUpperCase()}
      </p>

      {reports.length === 0 ? (
        <p className="mt-4 text-slate-400">No reports shared yet.</p>
      ) : (
        <div className="mt-6 grid gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="rounded-2xl border border-slate-700 bg-[#020617] p-5"
            >
              <p className="font-black text-white">
                {report.title || "Career Report"}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Created:{" "}
                {report.created_at
                  ? new Date(report.created_at).toLocaleString()
                  : "Unknown"}
              </p>

              <ReadableReport report={report} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}