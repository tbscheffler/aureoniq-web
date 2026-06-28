import DashboardCard from "@/components/coach/DashboardCard";
import { getResumeSignedUrl } from "@/services/coachService";

type ResumeReviewProps = {
  resumeProfile: any;
};

export default function ResumeReview({ resumeProfile }: ResumeReviewProps) {
  if (!resumeProfile) {
    return (
      <DashboardCard eyebrow="RESUME REVIEW" title="No Resume Available">
        <p className="mt-6 text-slate-400">
          This client does not have a resume profile available yet.
        </p>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard eyebrow="RESUME REVIEW" title="Current Resume">
      <div className="mt-6 rounded-2xl border border-slate-700 bg-[#020617] p-6">
        <p className="text-sm font-black tracking-[0.2em] text-slate-500">
          RESUME PROFILE
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <ResumeField label="Name" value={resumeProfile.full_name} />
          <ResumeField label="Current Title" value={resumeProfile.current_title} />
          <ResumeField label="Company" value={resumeProfile.current_company} />
          <ResumeField
            label="Experience"
            value={
              resumeProfile.years_experience
                ? `${resumeProfile.years_experience} years`
                : "Not available"
            }
          />
        </div>

        <div className="mt-6">
          <p className="text-sm font-bold text-slate-400">Skills</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {(resumeProfile.skills || []).slice(0, 20).map((skill: string) => (
              <span
                key={skill}
                className="rounded-full border border-[#FBBF24]/30 bg-[#FBBF24]/10 px-3 py-1 text-xs font-bold text-[#FBBF24]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
            onClick={async () => {
            try {
                const signedUrl = await getResumeSignedUrl(
                resumeProfile.resume_file_path
                );

                window.open(signedUrl, "_blank");
            } catch (error: any) {
                alert(error.message || "Unable to open resume.");
            }
            }}
            className="rounded-2xl bg-[#FBBF24] px-5 py-3 font-black text-[#020617]"
        >
            View Original Resume
        </button>

        <button
            disabled
            className="rounded-2xl border border-slate-700 px-5 py-3 font-black text-slate-400"
        >
            Request Profile Update Coming Soon
        </button>
        </div>

      <div className="mt-6 rounded-2xl border border-slate-700 bg-[#020617] p-6">
        <p className="text-sm font-black tracking-[0.2em] text-slate-500">
          AI RESUME REVIEW
        </p>

        <p className="mt-4 leading-7 text-slate-300">
          AI resume analysis will appear here. The first version will review the
          existing resume profile and highlight strengths, improvement areas,
          ATS concerns, and suggested coach edits.
        </p>

        

        <button
          disabled
          className="mt-6 rounded-2xl bg-[#FBBF24]/20 px-5 py-3 font-black text-[#FBBF24]"
        >
          Analyze Resume Coming Soon
        </button>
      </div>
    </DashboardCard>
  );
}

function ResumeField({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-[#111827] p-5">
      <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-black text-white">{value || "Not available"}</p>
    </div>
  );
}