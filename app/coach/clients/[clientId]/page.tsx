"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getCoachClientSummary,
  getOpenOrganizationClientActionItemCount,
  getNextOrganizationClientMeeting,
  getClientHealth,
} from "@/services/coachService";
import {
  MetricCard,
  ClientWorkspaceSidebar,
  ReportSection,
  CoachNotesSection,
  MeetingHistorySection,
  ActionPlanSection,
} from "@/components/coach";
import ClientWorkspaceHeader from "@/components/coach/ClientWorkspaceHeader";
import CoachShell from "@/components/coach/CoachShell";
import CareerJourneyTimeline from "@/components/coach/CareerJourneyTimeline";
import ClientOverview from "@/components/coach/ClientOverview";
import { getCareerIntelligenceSummary } from "@/services/careerIntelligenceService";
import CoachReportViewer from "@/components/coach/CoachReportViewer";
import CoachAIQViewer from "@/components/coach/CoachAIQViewer";
import ResumeReview from "@/components/coach/ResumeReview";
import { buildCareerIntelligenceSummary } from "@/services/careerIntelligenceEngine";
import CoachBriefing from "@/components/coach/CoachBriefing";

export default function CoachClientWorkspacePage() {
    const params = useParams();
    const clientId = params.clientId as string;
  
    const [loading, setLoading] = useState(true);
    const [workspace, setWorkspace] = useState<any>(null);
    const [error, setError] = useState("");
    const [activeSection, setActiveSection] = useState("overview");
    const [openActionItems, setOpenActionItems] = useState(0);
    const [nextMeeting, setNextMeeting] = useState<any>(null);
    const [clientHealth, setClientHealth] = useState<any>(null);

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const data = await getCoachClientSummary(clientId);
        setWorkspace(data);

        const [actionCount, nextMeetingData, healthData] = await Promise.all([
          getOpenOrganizationClientActionItemCount(clientId),
          getNextOrganizationClientMeeting(clientId),
          getClientHealth(clientId),
        ]);

        setOpenActionItems(actionCount);
        setNextMeeting(nextMeetingData);
        setClientHealth(healthData);
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

  const careerJourneyEvents = [
  ...(workspace?.resume_profile
    ? [
        {
          id: `resume-${workspace.resume_profile.id}`,
          title: "Resume profile created",
          description: "The client’s resume was parsed into their AureonIQ career profile.",
          date: formatJourneyDate(workspace.resume_profile.created_at),
          type: "resume" as const,
        },
      ]
    : []),

  ...careerReports.map((report: any) => ({
    id: `career-report-${report.id}`,
    title: "Career Assessment completed",
    description: "Career paths, transferable skills, and opportunities were generated.",
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
          description: nextMeeting.title || "A coaching session is scheduled.",
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

  return (
    <CoachShell>
    <section>
    <ClientWorkspaceHeader
      client={workspace?.client}
      hasDiscoveryReport={careerReports.length > 0}
      hasAIQReport={aiqReports.length > 0}
      openActionItems={openActionItems}
      nextMeeting={nextMeeting}
      clientHealth={clientHealth}
    />

        {/* <div className="mt-10 grid gap-6 md:grid-cols-3">
          <MetricCard title="Discovery Reports" value={careerReports.length} />
          <MetricCard title="AIQ Reports" value={aiqReports.length} />
          <MetricCard
            title="Access Level"
            value={workspace?.client?.access_level || "shared"}
          />
        </div> */}

        <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
          <div className="lg:sticky lg:top-6 lg:self-start">
            <ClientWorkspaceSidebar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </div>



  <div className="space-y-8">

              <CoachBriefing
            summary={careerIntelligence.summary}
            recommendedNextStep={careerIntelligence.recommendedNextStep}
          />

          {activeSection === "overview" ? (
          <ClientOverview
            clientName={clientName}
            hasDiscoveryReport={careerReports.length > 0}
            hasAIQReport={aiqReports.length > 0}
            openActionItems={openActionItems}
            nextMeeting={
              nextMeeting
                ? {
                    title: nextMeeting.title,
                    meetingDate: nextMeeting.meeting_date,
                  }
                : null
            }
            intelligence={{
              careerHealth: clientHealth?.score ?? 0,
              riskLevel:
                clientHealth?.status === "Excellent" ||
                clientHealth?.status === "Strong"
                  ? "Low"
                  : clientHealth?.status === "Needs Attention"
                  ? "Medium"
                  : "High",
              careerMomentum: clientHealth?.status || "Not Scored",
              nextRecommendedAction: careerIntelligence.recommendedNextStep,
            }}
            careerInsights={careerIntelligence.insights}
          />
            ) : null}

            {activeSection === "discovery" ? (
              <CoachReportViewer
                title="Career Assessment"
                summary="This report highlights the client's strongest career paths, transferable skills, hidden opportunities, and recommended areas for growth."
                reports={careerReports}
              />
            ) : null}

            {activeSection === "aiq" ? (
              <CoachAIQViewer reports={aiqReports} />
            ) : null}

            {activeSection === "resume" ? (
              <ResumeReview
              resumeProfile={workspace?.resume_profile}
              organizationClientId={clientId}
            />
            ) : null}

            {activeSection === "timeline" ? (
              <CareerJourneyTimeline events={careerJourneyEvents} />
            ) : null}

            {activeSection === "notes" ? (
              <CoachNotesSection organizationClientId={clientId} />
            ) : null}

            {activeSection === "meetings" ? (
              <MeetingHistorySection organizationClientId={clientId} />
            ) : null}

            {activeSection === "actions" ? (
              <ActionPlanSection organizationClientId={clientId} />
            ) : null}
          </div>
        </div>
        </section>
        </CoachShell>
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