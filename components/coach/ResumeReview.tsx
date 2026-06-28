"use client";

import { useState } from "react";
import DashboardCard from "@/components/coach/DashboardCard";
import {
  getResumeSignedUrl,
  generateOrganizationClientResumeReview,
} from "@/services/coachService";

type ResumeReviewProps = {
    resumeProfile: any;
    organizationClientId: string;
  };

  export default function ResumeReview({
    resumeProfile,
    organizationClientId,
  }: ResumeReviewProps) {
    const [analyzing, setAnalyzing] = useState(false);
    const [reviewResult, setReviewResult] = useState<any>(null);
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
            onClick={async () => {
                try {
                setAnalyzing(true);

                const result = await generateOrganizationClientResumeReview(
                    organizationClientId
                );

                setReviewResult(result.review?.review_json || result.review || result);
                alert("Resume review test completed.");
                } catch (error: any) {
                alert(error.message || "Unable to analyze resume.");
                } finally {
                setAnalyzing(false);
                }
            }}
            disabled={analyzing}
            className="mt-6 rounded-2xl bg-[#FBBF24] px-5 py-3 font-black text-[#020617] disabled:opacity-60"
            >
            {analyzing ? "Analyzing..." : "Analyze Resume"}
            </button>

            {reviewResult ? (
            <div className="mt-6 space-y-6">
                <div className="rounded-2xl border border-slate-700 bg-[#111827] p-5">
                <p className="text-sm font-bold text-slate-400">Overall Score</p>
                <p className="mt-2 text-4xl font-black text-[#FBBF24]">
                    {reviewResult.overallScore ?? "N/A"}
                </p>
                <p className="mt-4 leading-7 text-slate-300">
                    {reviewResult.summary}
                </p>
                </div>

                <ResumeReviewList title="Strengths" items={reviewResult.strengths} />
                <ResumeReviewList title="Improvement Areas" items={reviewResult.improvementAreas} />
                <ResumeReviewList title="ATS Concerns" items={reviewResult.atsConcerns} />
                <ResumeReviewList title="Suggested Edits" items={reviewResult.suggestedEdits} />
            </div>
            ) : null}
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

function ResumeReviewList({ title, items }: { title: string; items?: any[] }) {
    if (!items || items.length === 0) return null;
  
    return (
      <div className="rounded-2xl border border-slate-700 bg-[#111827] p-5">
        <p className="text-sm font-black tracking-[0.2em] text-slate-500">
          {title.toUpperCase()}
        </p>
  
        <div className="mt-4 space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-700 bg-[#020617] p-4"
            >
              <p className="font-black text-white">
                {item.title || item.section || `Item ${index + 1}`}
              </p>
  
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {item.evidence ||
                  item.whyItMatters ||
                  item.details ||
                  item.currentIssue ||
                  ""}
              </p>
  
              {item.suggestedDirection ? (
                <p className="mt-3 text-sm leading-6 text-[#FBBF24]">
                  Suggested direction: {item.suggestedDirection}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    );
  }