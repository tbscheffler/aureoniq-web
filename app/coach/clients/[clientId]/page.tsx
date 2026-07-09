"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getCoachClientSummary,
  getOpenOrganizationClientActionItemCount,
  getNextOrganizationClientMeeting,
  getClientHealth,
  createOrganizationClientNote,
  getOrganizationClientNotes,
} from "@/services/coachService";
import { ActionPlanSection } from "@/components/coach";
import ClientWorkspaceHeader from "@/components/coach/ClientWorkspaceHeader";
import CoachShell from "@/components/coach/CoachShell";
import CoachReportViewer from "@/components/coach/CoachReportViewer";
import CoachAIQViewer from "@/components/coach/CoachAIQViewer";
import { buildCareerIntelligenceSummary } from "@/services/careerIntelligenceEngine";
import CoachNotesWorkspace from "@/components/coach/CoachNotesWorkspace";
import CoachNotesHistory from "@/components/coach/CoachNotesHistory";
import CoachingSessionsSection from "@/components/coach/CoachingSessionsSection";
import ClientIntelligenceHome from "@/components/coach/ClientIntelligenceHome";
import ClientProgressTab from "@/components/coach/ClientProgressTab";
import ResumeIntelligenceTab from "@/components/coach/ResumeIntelligenceTab";
import { buildCareerProfile } from "@/lib/career-intelligence/buildCareerProfile";
import { createMockCoachBriefing } from "@/lib/career-intelligence/coachBriefing";
import { buildMockOpportunityIntelligence } from "@/lib/opportunity-intelligence/buildOpportunityIntelligence";
import type { OpportunityIntelligence } from "@/lib/opportunity-intelligence/opportunityIntelligence";

export default function CoachClientWorkspacePage() {
  const params = useParams();
  const clientId = params.clientId as string;

  const [loading, setLoading] = useState(true);
  const [workspace, setWorkspace] = useState<any>(null);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("understand");
  const [opportunityInput, setOpportunityInput] = useState("");
  const [opportunityAnalysis, setOpportunityAnalysis] =
    useState<OpportunityIntelligence | null>(null);
  const [analyzingOpportunity, setAnalyzingOpportunity] = useState(false);
  const [opportunityError, setOpportunityError] = useState("");
  const [openActionItems, setOpenActionItems] = useState(0);
  const [nextMeeting, setNextMeeting] = useState<any>(null);
  const [clientHealth, setClientHealth] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const data = await getCoachClientSummary(clientId);
        setWorkspace(data);

        const [actionCount, nextMeetingData, healthData, notesData] =
          await Promise.all([
            getOpenOrganizationClientActionItemCount(clientId),
            getNextOrganizationClientMeeting(clientId),
            getClientHealth(clientId),
            getOrganizationClientNotes(clientId),
          ]);

        setOpenActionItems(actionCount);
        setNextMeeting(nextMeetingData);
        setClientHealth(healthData);
        setNotes(notesData || []);
        setLoadingNotes(false);
      } catch (err: any) {
        setError(err.message || "Unable to load client workspace.");
      } finally {
        setLoading(false);
      }
    }

    loadWorkspace();
  }, [clientId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#020617] p-8 text-white">
        <p className="font-black text-[#FBBF24]">Loading client workspace...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#020617] p-8 text-white">
        <p className="font-black text-red-300">{error}</p>
        <a href="/coach" className="mt-6 inline-block text-[#FBBF24]">
          ← Back to Coach Workspace
        </a>
      </main>
    );
  }

  const careerReports = workspace?.career_reports || [];
  const aiqReports = workspace?.aiq_reports || [];
  const latestCareerReport = careerReports[0]?.report_json || careerReports[0];
  const latestAIQReport = aiqReports[0]?.report_json || aiqReports[0];

  const careerJourneyEvents = [
    ...(workspace?.resume_profile
      ? [
          {
            id: `resume-${workspace.resume_profile.id}`,
            title: "Resume profile created",
            description:
              "The client’s resume was parsed into their AureonIQ career profile.",
            date: formatJourneyDate(workspace.resume_profile.created_at),
            type: "resume" as const,
          },
        ]
      : []),

    ...careerReports.map((report: any) => ({
      id: `career-report-${report.id}`,
      title: "Career Assessment completed",
      description:
        "Career paths, transferable skills, and opportunities were generated.",
      date: formatJourneyDate(report.created_at),
      type: "assessment" as const,
    })),

    ...aiqReports.map((report: any) => ({
      id: `aiq-${report.id}`,
      title: "Future Potential report completed",
      description: "AIQ career intelligence was generated for this client.",
      date: formatJourneyDate(report.created_at),
      type: "aiq" as const,
    })),

    ...(nextMeeting
      ? [
          {
            id: `meeting-${nextMeeting.id}`,
            title: "Next coaching session scheduled",
            description:
              nextMeeting.title || "A coaching session is scheduled.",
            date: formatJourneyDate(nextMeeting.meeting_date),
            type: "meeting" as const,
          },
        ]
      : []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const clientName =
    workspace?.client?.client_profile?.display_name ||
    workspace?.client?.client_email ||
    "Client";

  const careerIntelligence = buildCareerIntelligenceSummary({
    clientName,
    careerHealth: clientHealth,
    hasDiscoveryReport: careerReports.length > 0,
    hasAIQReport: aiqReports.length > 0,
    hasResumeProfile: Boolean(workspace?.resume_profile),
    hasNextMeeting: Boolean(nextMeeting),
    openActionItems,
  });

  const careerProfile = buildCareerProfile({
    resume: workspace?.resume_profile,
    discovery: latestCareerReport,
    aiq: latestAIQReport,
    regional:
      latestCareerReport?.regional_context ||
      latestCareerReport?.regionalContext ||
      latestCareerReport?.regional,
  });

  careerProfile.client.name = clientName;

  const opportunityPreview = buildMockOpportunityIntelligence({
    profile: careerProfile,
    opportunity: {
      title: "Opportunity under review",
      description: opportunityInput,
    },
  });

  const opportunityIntelligence = opportunityAnalysis || opportunityPreview;

  const coachBriefing = createMockCoachBriefing(careerProfile);

  async function handleAnalyzeOpportunity() {
    const trimmedInput = opportunityInput.trim();

    if (!trimmedInput) {
      setOpportunityError("Paste a job description or role summary first.");
      return;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      setOpportunityError(
        "Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
      return;
    }

    setAnalyzingOpportunity(true);
    setOpportunityError("");

    try {
      const response = await fetch(
        `${supabaseUrl}/functions/v1/opportunity-intelligence`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseAnonKey}`,
            apikey: supabaseAnonKey,
          },
          body: JSON.stringify({
            profile: careerProfile,
            opportunity: {
              title: "Opportunity under review",
              description: trimmedInput,
            },
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Unable to analyze opportunity.");
      }

      setOpportunityAnalysis(result as OpportunityIntelligence);
    } catch (err: any) {
      setOpportunityError(
        err?.message || "Unable to analyze this opportunity right now."
      );
    } finally {
      setAnalyzingOpportunity(false);
    }
  }

  return (
    <CoachShell>
      <section className="rounded-[2rem] bg-[#F8FAFC] p-4 md:p-6">
        <ClientWorkspaceHeader
          client={workspace?.client}
          hasDiscoveryReport={careerReports.length > 0}
          hasAIQReport={aiqReports.length > 0}
          openActionItems={openActionItems}
          nextMeeting={nextMeeting}
          clientHealth={clientHealth}
          resumeProfile={workspace?.resume_profile}
          careerReport={latestCareerReport}
          aiqReport={latestAIQReport}
        />

        {/* <div className="mt-10 grid gap-6 md:grid-cols-3">
          <MetricCard title="Discovery Reports" value={careerReports.length} />
          <MetricCard title="AIQ Reports" value={aiqReports.length} />
          <MetricCard
            title="Access Level"
            value={workspace?.client?.access_level || "shared"}
          />
        </div> */}

        <div className="mt-6 space-y-7">
          <ClientWorkspaceNav
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />

          <div className="space-y-7">
            {activeSection === "understand" ? (
              <>
                <ClientIntelligenceHome
                  clientName={clientName}
                  resumeProfile={workspace?.resume_profile}
                  careerReport={latestCareerReport}
                  aiqReport={latestAIQReport}
                  clientHealth={clientHealth}
                  careerSummary={careerIntelligence.summary}
                  recommendedNextStep={careerIntelligence.recommendedNextStep}
                  setActiveSection={setActiveSection}
                />

                <div className="grid gap-8 xl:grid-cols-2">
                  <CoachReportViewer
                    title="Discovery Intelligence"
                    summary="This report highlights the client's strongest career paths, transferable skills, hidden opportunities, and recommended areas for growth."
                    reports={careerReports}
                  />
                  <CoachAIQViewer reports={aiqReports} />
                </div>
              </>
            ) : null}

            {activeSection === "evaluate" ? (
              <div className="space-y-7">
                <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-[#111827] shadow-sm">
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">
                        OPPORTUNITY INTELLIGENCE
                      </p>
                      <h2 className="mt-3 text-3xl font-black">
                        Analyze a role for {clientName}
                      </h2>
                      <p className="mt-4 max-w-3xl leading-7 text-slate-600">
                        Paste a job description or role summary and AureonIQ will
                        compare it against this client&apos;s Career Intelligence Profile.
                        The analysis will connect fit, stretch areas, career bridge,
                        and decision context in one place.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#B8872A]/20 bg-[#FFF8E7] px-4 py-3 text-sm font-black text-[#9A6A12]">
                      Evaluate before applying
                    </div>
                  </div>

                  <div className="mt-8 rounded-[1.5rem] border border-dashed border-[#8B5CF6]/40 bg-gradient-to-br from-[#F8F5FF] to-white p-5">
                    <label className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
                      Job description or role URL
                    </label>
                    <textarea
                      value={opportunityInput}
                      onChange={(event) => {
                        setOpportunityInput(event.target.value);
                        setOpportunityAnalysis(null);
                        setOpportunityError("");
                      }}
                      placeholder="Paste the role description here. AureonIQ will analyze it against this client’s Career Intelligence Profile."
                      className={[
                        "mt-4 w-full resize-none rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#6D28D9] focus:ring-4 focus:ring-violet-100",
                        opportunityAnalysis ? "min-h-[120px]" : "min-h-[220px]",
                      ].join(" ")}
                    />

                    <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <p className="max-w-2xl text-sm leading-6 text-slate-500">
                        Full analysis reads Career Story, Evidence, AIQ, Discovery,
                        and Regional Intelligence. The Career Bridge is designed to
                        show a pathway, not a shortcut.
                      </p>
                      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center lg:justify-end">
                        {opportunityAnalysis ? (
                          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-800">
                            Analysis ready
                          </div>
                        ) : null}
                        <button
                          type="button"
                          onClick={handleAnalyzeOpportunity}
                          disabled={
                            analyzingOpportunity || !opportunityInput.trim()
                          }
                          className={[
                            "rounded-2xl px-5 py-3 text-sm font-black text-white shadow-sm transition",
                            analyzingOpportunity || !opportunityInput.trim()
                              ? "cursor-not-allowed bg-[#4C1D95]/60"
                              : "bg-[#4C1D95] hover:bg-[#3B147B]",
                          ].join(" ")}
                        >
                          {analyzingOpportunity
                            ? "Analyzing..."
                            : opportunityAnalysis
                              ? "Analyze Again"
                              : "Analyze Opportunity"}
                        </button>
                      </div>
                    </div>

                    {opportunityError ? (
                      <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
                        {opportunityError}
                      </div>
                    ) : null}
                  </div>
                </div>

                <OpportunityIntelligenceReport
                  intelligence={opportunityIntelligence}
                  hasAnalysis={Boolean(opportunityAnalysis)}
                />
              </div>
            ) : null}

            {activeSection === "grow" ? (
              <div className="space-y-7">
                <BeforeSessionBriefing
                  clientName={clientName}
                  briefing={coachBriefing}
                />

                <div className="grid gap-7 xl:grid-cols-[1.1fr_0.9fr]">
                  <ConversationSparks
                    sparks={coachBriefing.conversationSparks}
                  />
                  <GrowthPriorities
                    priorities={coachBriefing.potentialFocusAreas}
                  />
                </div>

                <div className="grid gap-7 xl:grid-cols-[0.95fr_1.05fr]">
                  <CelebrateProgress items={coachBriefing.celebrateProgress} />

                  <CoachReflectionPreview />
                </div>

                <CoachWorkspacePanel
                  organizationClientId={clientId}
                  setActiveSection={setActiveSection}
                />
              </div>
            ) : null}

            {activeSection === "progress" ? (
              <ClientProgressTab
                organizationClientId={clientId}
                clientName={clientName}
                events={careerJourneyEvents}
                careerReportsCount={careerReports.length}
                aiqReportsCount={aiqReports.length}
                latestAIQScore={
                  latestAIQReport?.aiqScore ||
                  latestAIQReport?.aiq_score ||
                  latestAIQReport?.score ||
                  null
                }
                openActionItems={openActionItems}
                nextMeeting={nextMeeting}
                clientHealth={clientHealth}
                setActiveSection={setActiveSection}
              />
            ) : null}

            {activeSection === "resume" ? (
              <ResumeIntelligenceTab
                clientName={clientName}
                resumeProfile={workspace?.resume_profile}
                careerProfile={careerProfile}
                careerReport={latestCareerReport}
                aiqReport={latestAIQReport}
                setActiveSection={setActiveSection}
              />
            ) : null}

            {activeSection === "notes" ? (
              <div>
                <CoachNotesWorkspace
                  initialNotes=""
                  onSave={async (notes) => {
                    await createOrganizationClientNote(clientId, notes);
                    const updatedNotes =
                      await getOrganizationClientNotes(clientId);
                    setNotes(updatedNotes || []);
                  }}
                />

                <CoachNotesHistory notes={notes} loading={loadingNotes} />
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </CoachShell>
  );
}

function OpportunityIntelligenceReport({
  intelligence,
  hasAnalysis,
}: {
  intelligence: OpportunityIntelligence;
  hasAnalysis: boolean;
}) {
  const fitItems =
    intelligence.whyItFits && intelligence.whyItFits.length > 0
      ? intelligence.whyItFits
      : [
          "AureonIQ did not find strong direct-fit evidence yet. This may still be useful as a stretch opportunity if the client is interested in building the missing skills.",
        ];

  const fitTitle =
    intelligence.whyItFits && intelligence.whyItFits.length > 0
      ? "Why it may fit"
      : "Why this opportunity may still matter";

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-[#111827] shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">
            OPPORTUNITY PREVIEW
          </p>
          <h3 className="mt-3 max-w-3xl text-3xl font-black">
            Opportunity Intelligence
          </h3>
          <p className="mt-3 max-w-4xl text-base font-semibold leading-7 text-slate-500">
            Understand how this opportunity aligns with the client&apos;s Career Intelligence Profile.
          </p>
        </div>
        <div
          className={[
            "rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em]",
            hasAnalysis
              ? "border-emerald-100 bg-emerald-50 text-emerald-800"
              : "border-[#B8872A]/20 bg-[#FFF8E7] text-[#9A6A12]",
          ].join(" ")}
        >
          {hasAnalysis ? "Career Intelligence" : "Live preview"}
        </div>
      </div>

      <p className="mt-5 max-w-5xl text-lg leading-8 text-slate-600">
        {intelligence.summary}
      </p>

      <div className="mt-7 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-[1.5rem] border border-violet-100 bg-[#F8F5FF] p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6D28D9]">
            Alignment
          </p>
          <p className="mt-3 text-2xl font-black text-slate-950">
            {intelligence.alignment.label}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {intelligence.alignment.explanation}
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#B8872A]">
            Career Perspective
          </p>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
            {intelligence.decisionPerspective}
          </p>
        </div>
      </div>

      <CareerBridgeCard bridge={intelligence.careerBridge} />

      <div className="mt-7 grid gap-7 xl:grid-cols-2">
        <OpportunityInsightList
          title={fitTitle}
          items={fitItems}
        />

        <OpportunityInsightList
          title="Growth stretch"
          items={intelligence.growthStretch}
          tone="gold"
        />
      </div>

      <OpportunityInsightList
        title="Conversation starters"
        items={intelligence.conversationStarters}
      />
    </div>
  );
}

function CareerBridgeCard({
  bridge,
}: {
  bridge: OpportunityIntelligence["careerBridge"];
}) {
  const steps = bridge?.steps || [];

  if (!bridge || steps.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 rounded-[1.5rem] border border-violet-100 bg-gradient-to-br from-[#F8F5FF] to-white p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#6D28D9]">
            Career Bridge
          </p>
          <h4 className="mt-2 text-xl font-black text-slate-950">
            How the path could make sense
          </h4>
        </div>
        <div className="rounded-full border border-[#B8872A]/20 bg-[#FFF8E7] px-4 py-2 text-xs font-black text-[#9A6A12]">
          Pathway, not a shortcut
        </div>
      </div>

      <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">
        {bridge.bridgeSummary}
      </p>

      <div className="mt-5 space-y-4">
        {steps.map((step, index) => (
          <div key={`${step.title}-${index}`} className="relative rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4C1D95] text-sm font-black text-white">
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-black text-slate-950">{step.title}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                  {step.rationale}
                </p>

                {(step.strengthsToCarry?.length || step.skillsToBuild?.length) ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {step.strengthsToCarry?.length ? (
                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
                          Carries Forward
                        </p>
                        <p className="mt-2 text-sm font-semibold leading-6 text-emerald-950">
                          {step.strengthsToCarry.slice(0, 3).join(", ")}
                        </p>
                      </div>
                    ) : null}

                    {step.skillsToBuild?.length ? (
                      <div className="rounded-2xl border border-[#E8D49B] bg-[#FFF8E7] px-4 py-3">
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#9A6A12]">
                          Build Next
                        </p>
                        <p className="mt-2 text-sm font-semibold leading-6 text-[#7C4A03]">
                          {step.skillsToBuild.slice(0, 3).join(", ")}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OpportunityInsightList({
  title,
  items,
  tone = "slate",
}: {
  title: string;
  items: string[];
  tone?: "slate" | "gold";
}) {
  const cardClass =
    tone === "gold"
      ? "border-[#E8D49B] bg-[#FFF8E7] text-[#7C4A03]"
      : "border-slate-100 bg-slate-50 text-slate-700";

  return (
    <div className="mt-6">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#B8872A]">
        {title}
      </p>
      <div className="mt-3 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className={["rounded-2xl border px-5 py-4", cardClass].join(" ")}
          >
            <p className="text-sm font-bold leading-6">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClientWorkspaceNav({
  activeSection,
  setActiveSection,
}: {
  activeSection: string;
  setActiveSection: (section: string) => void;
}) {
  const sections = [
    {
      id: "understand",
      label: "Understand",
      description: "Career story and intelligence",
    },
    {
      id: "evaluate",
      label: "Evaluate",
      description: "Opportunity intelligence",
    },
    {
      id: "grow",
      label: "Grow",
      description: "Briefing and growth plan",
    },
    {
      id: "progress",
      label: "Progress",
      description: "Journey and milestones",
    },
    {
      id: "resume",
      label: "Resume",
      description: "Resume intelligence",
    },
  ];

  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-1.5 shadow-sm">
      <div className="grid gap-2 md:grid-cols-5">
        {sections.map((section) => {
          const isActive = activeSection === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={[
                "rounded-[1.1rem] px-4 py-2.5 text-left transition",
                isActive
                  ? "bg-[#4C1D95] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-[#4C1D95]",
              ].join(" ")}
            >
              <span className="block text-sm font-black">{section.label}</span>
              <span
                className={[
                  "mt-1 block text-xs font-semibold leading-4",
                  isActive ? "text-violet-100" : "text-slate-400",
                ].join(" ")}
              >
                {section.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BeforeSessionBriefing({
  clientName,
  briefing,
}: {
  clientName: string;
  briefing: ReturnType<typeof createMockCoachBriefing>;
}) {
  const firstName = clientName.split(" ")[0] || "this client";

  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#E8D49B] bg-gradient-to-br from-[#201033] via-[#351B5F] to-[#4C1D95] text-white shadow-sm">
      <div className="grid gap-0 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="p-8 md:p-10">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#FBBF24]">
            CAREER INTELLIGENCE BRIEF
          </p>
          <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight md:text-5xl">
            {briefing.headline}
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-violet-100">
            {briefing.briefing}
          </p>

          <p className="mt-5 text-sm font-semibold leading-6 text-violet-200">
            Prepared to support your upcoming coaching conversation. AI
            prepares; people decide.
          </p>
        </div>

        <div className="border-t border-white/10 bg-white/8 p-8 xl:border-l xl:border-t-0">
          <div className="rounded-[1.5rem] border border-white/10 bg-[#12081F]/35 p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FBBF24]">
              Today's Opportunity
            </p>
            <p className="mt-3 text-base leading-7 text-violet-50">
              {briefing.opportunitySummary}
            </p>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-[#12081F]/35 p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FBBF24]">
              Emerging Pattern
            </p>
            <p className="mt-3 text-base leading-7 text-violet-50">
              {briefing.emergingPattern}
            </p>
          </div>

          <div className="mt-5 rounded-[1.5rem] border border-[#FBBF24]/25 bg-[#FBBF24]/10 p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FBBF24]">
              Coaching Perspective
            </p>
            <p className="mt-3 text-base leading-7 text-violet-50">
              {briefing.coachingPerspective.replace("the client", firstName)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversationSparks({ sparks }: { sparks: string[] }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-7 text-[#111827] shadow-sm">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">
        CONVERSATION SPARKS
      </p>
      <h3 className="mt-3 text-2xl font-black">
        Ways to begin the conversation
      </h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
        Ideas for meaningful discussion, not scripts to follow.
      </p>
      <div className="mt-6 space-y-4">
        {sparks.map((spark) => (
          <div
            key={spark}
            className="rounded-2xl border border-violet-100 bg-[#F8F5FF] px-5 py-4"
          >
            <p className="text-sm font-bold leading-6 text-[#4C1D95]">
              “{spark}”
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function GrowthPriorities({ priorities }: { priorities: string[] }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-7 text-[#111827] shadow-sm">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">
        POTENTIAL FOCUS AREAS
      </p>
      <h3 className="mt-3 text-2xl font-black">What may be worth exploring</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
        Use these as preparation signals, then apply your coaching judgment.
      </p>
      <div className="mt-6 space-y-4">
        {priorities.map((priority, index) => (
          <div
            key={priority}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-5"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4C1D95] text-sm font-black text-white">
                {index + 1}
              </div>
              <p className="text-sm font-bold leading-6 text-slate-700">
                {priority}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CelebrateProgress({ items }: { items: string[] }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-7 text-[#111827] shadow-sm">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">
        STRENGTHS TO REINFORCE
      </p>
      <h3 className="mt-3 text-2xl font-black">What may build momentum</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
        Positive signals that may help strengthen confidence and direction.
      </p>
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4"
          >
            <p className="text-sm font-bold leading-6 text-emerald-900">
              ✓ {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoachReflectionPreview() {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-7 text-[#111827] shadow-sm">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">
        SESSION REFLECTION
      </p>
      <h3 className="mt-3 text-2xl font-black">Capture what mattered</h3>
      <p className="mt-3 leading-7 text-slate-600">
        Use Reflections after the session to record what changed, what surprised
        you, and what AureonIQ should remember before the next conversation.
      </p>
      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-5 text-sm font-semibold text-slate-500">
        What changed your understanding of this client?
      </div>
    </div>
  );
}

function CoachWorkspacePanel({
  organizationClientId,
  setActiveSection,
}: {
  organizationClientId: string;
  setActiveSection: (section: string) => void;
}) {
  const [activeTool, setActiveTool] = useState<
    "growthPlan" | "sessions" | "reflection"
  >("growthPlan");

  const tools = [
    {
      id: "growthPlan" as const,
      label: "Growth Plan",
      description: "Practical next steps",
    },
    {
      id: "sessions" as const,
      label: "Session Timeline",
      description: "Past and upcoming conversations",
    },
    {
      id: "reflection" as const,
      label: "Session Reflection",
      description: "What AureonIQ should remember",
    },
  ];

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-7 text-[#111827] shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">
            COACH WORKSPACE
          </p>
          <h3 className="mt-2 text-2xl font-black">What happens next</h3>
          <p className="mt-2 max-w-4xl leading-7 text-slate-600">
            The Career Intelligence Brief prepares the conversation. This
            workspace captures what happens next, so future briefings become
            more useful.
          </p>
        </div>
      </div>

      <div className="mt-7 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-1.5">
        <div className="grid gap-2 md:grid-cols-3">
          {tools.map((tool) => {
            const isActive = activeTool === tool.id;

            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => setActiveTool(tool.id)}
                className={[
                  "rounded-[1.1rem] px-4 py-3 text-left transition",
                  isActive
                    ? "bg-[#4C1D95] text-white shadow-sm"
                    : "bg-white text-slate-600 hover:text-[#4C1D95]",
                ].join(" ")}
              >
                <span className="block text-sm font-black">{tool.label}</span>
                <span
                  className={[
                    "mt-1 block text-xs font-semibold leading-4",
                    isActive ? "text-violet-100" : "text-slate-400",
                  ].join(" ")}
                >
                  {tool.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-7">
        {activeTool === "growthPlan" ? (
          <ActionPlanSection organizationClientId={organizationClientId} />
        ) : null}

        {activeTool === "sessions" ? (
          <CoachingSessionsSection
            organizationClientId={organizationClientId}
          />
        ) : null}

        {activeTool === "reflection" ? (
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">
              SESSION REFLECTION
            </p>
            <h4 className="mt-3 text-2xl font-black text-slate-950">
              Turn the session into better intelligence
            </h4>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">
              Capture only what would improve the next Career Intelligence
              Brief. This keeps reflection useful without turning AureonIQ into
              another notes system.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                "What changed your understanding of this client?",
                "What strengths became more apparent?",
                "What should AureonIQ remember before the next conversation?",
              ].map((prompt) => (
                <div
                  key={prompt}
                  className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-5 text-sm font-semibold leading-6 text-slate-500"
                >
                  {prompt}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActiveSection("notes")}
              className="mt-6 rounded-2xl bg-[#4C1D95] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#3B147B]"
            >
              Open Notes
            </button>
          </div>
        ) : null}
      </div>

      <p className="mt-6 text-center text-sm font-semibold text-slate-500">
        Career Intelligence evolves with every coaching conversation.
      </p>
    </div>
  );
}

function formatJourneyDate(dateValue: string) {
  if (!dateValue) return "Unknown date";

  return new Date(dateValue).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
