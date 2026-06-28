"use client";

import { useEffect, useState } from "react";
import DashboardCard from "@/components/coach/DashboardCard";
import {
  getResumeSignedUrl,
  generateOrganizationClientResumeReview,
  getLatestOrganizationClientResumeReview,
  saveResumeReviewFindingNote,
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
    const [loadingReview, setLoadingReview] = useState(true);
    const [resumeReviewId, setResumeReviewId] = useState<string | null>(null);
    useEffect(() => {
        async function loadLatestReview() {
          try {
            const latestReview =
              await getLatestOrganizationClientResumeReview(
                organizationClientId
              );
      
              if (latestReview) {
                setReviewResult(latestReview.review_json);
                setResumeReviewId(latestReview.id);
              }
          } catch (error) {
            console.log("LOAD RESUME REVIEW ERROR:", error);
          } finally {
            setLoadingReview(false);
          }
        }
      
        loadLatestReview();
      }, [organizationClientId]);
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

        {loadingReview ? (
        <p className="mt-4 text-slate-400">
            Loading latest resume review...
        </p>
        ) : null}

        <p className="mt-4 leading-7 text-slate-300">
        This AI-prepared review helps coaches quickly scan resume strengths,
        improvement areas, ATS concerns, and suggested edit directions before a
        client session.
        </p>

        

        <button
            onClick={async () => {
                try {
                setAnalyzing(true);

                const result = await generateOrganizationClientResumeReview(
                    organizationClientId
                );

                setReviewResult(result.review?.review_json || result.review || result);
                setResumeReviewId(result.review?.id || null);
                } catch (error: any) {
                alert(error.message || "Unable to analyze resume.");
                } finally {
                setAnalyzing(false);
                }
            }}
            disabled={analyzing || loadingReview}
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

                <ResumeReviewList
                title="Strengths"
                type="strength"
                items={reviewResult.strengths}
                resumeReviewId={resumeReviewId}
                />

                <ResumeReviewList
                title="Improvement Areas"
                type="improvement"
                items={reviewResult.improvementAreas}
                resumeReviewId={resumeReviewId}
                />

                <ResumeReviewList
                title="ATS Concerns"
                type="ats"
                items={reviewResult.atsConcerns}
                resumeReviewId={resumeReviewId}
                />

                <ResumeReviewList
                title="Coaching Opportunities"
                type="edit"
                items={reviewResult.suggestedEdits}
                resumeReviewId={resumeReviewId}
                />
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

function ResumeReviewList({
    title,
    type,
    items,
    resumeReviewId,
  }: {
    title: string;
    type: string;
    items?: any[];
    resumeReviewId: string | null;
  }) {
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
              <CoachFindingNote
                resumeReviewId={resumeReviewId}
                findingKey={`${type}-${index}`}
                />
            </div>
          ))}
        </div>
      </div>
    );
  }

  function CoachFindingNote({
    resumeReviewId,
    findingKey,
  }: {
    resumeReviewId: string | null;
    findingKey: string;
  }) {
    const [note, setNote] = useState("");
    const [saving, setSaving] = useState(false);
    const [open, setOpen] = useState(false);
  
    if (!resumeReviewId) return null;
  
    async function handleSaveNote() {
        if (!resumeReviewId) return;
      
        try {
          setSaving(true);
  
        await saveResumeReviewFindingNote({
          resumeReviewId,
          findingKey,
          coachNote: note,
        });
  
        alert("Coach note saved.");
      } catch (error: any) {
        alert(error.message || "Unable to save coach note.");
      } finally {
        setSaving(false);
      }
    }
  
    return (
            <div className="mt-4">
              {!open ? (
                <button
                  onClick={() => setOpen(true)}
                  className="rounded-2xl border border-slate-700 px-4 py-2 text-sm font-black text-slate-300 hover:border-[#FBBF24] hover:text-[#FBBF24]"
                >
                  Add Coach Note
                </button>
              ) : (
                <div className="rounded-2xl border border-slate-700 bg-[#111827] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                      Coach Note
                    </p>
          
                    <button
                      onClick={() => setOpen(false)}
                      className="text-sm font-bold text-slate-400 hover:text-white"
                    >
                      Collapse
                    </button>
                  </div>
          
                  <textarea
                    className="mt-3 min-h-[90px] w-full rounded-2xl border border-slate-700 bg-[#020617] p-4 text-sm text-white outline-none focus:border-[#FBBF24]"
                    placeholder="Add your coaching context..."
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                  />
          
                  <button
                    onClick={handleSaveNote}
                    disabled={saving || !note.trim()}
                    className="mt-3 rounded-2xl bg-[#FBBF24] px-4 py-2 text-sm font-black text-[#020617] disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Note"}
                  </button>
                </div>
              )}
            </div>
          );
  }