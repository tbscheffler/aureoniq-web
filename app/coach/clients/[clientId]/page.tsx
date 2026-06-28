"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getCoachClientSummary,
  getOpenOrganizationClientActionItemCount,
  getNextOrganizationClientMeeting,
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
import ClientTimeline from "@/components/coach/ClientTimeline";
import ClientOverview from "@/components/coach/ClientOverview";
import { getCareerIntelligenceSummary } from "@/services/careerIntelligenceService";
import CoachReportViewer from "@/components/coach/CoachReportViewer";

export default function CoachClientWorkspacePage() {
    const params = useParams();
    const clientId = params.clientId as string;
  
    const [loading, setLoading] = useState(true);
    const [workspace, setWorkspace] = useState<any>(null);
    const [error, setError] = useState("");
    const [activeSection, setActiveSection] = useState("overview");
    const [openActionItems, setOpenActionItems] = useState(0);
    const [nextMeeting, setNextMeeting] = useState<any>(null);

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const data = await getCoachClientSummary(clientId);
        setWorkspace(data);
        const actionCount = await getOpenOrganizationClientActionItemCount(clientId);
        setOpenActionItems(actionCount);
        const nextMeetingData = await getNextOrganizationClientMeeting(clientId);
        setNextMeeting(nextMeetingData);
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

  return (
    <CoachShell>
    <section>
      <ClientWorkspaceHeader client={workspace?.client} />

        {/* <div className="mt-10 grid gap-6 md:grid-cols-3">
          <MetricCard title="Discovery Reports" value={careerReports.length} />
          <MetricCard title="AIQ Reports" value={aiqReports.length} />
          <MetricCard
            title="Access Level"
            value={workspace?.client?.access_level || "shared"}
          />
        </div> */}

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          <ClientWorkspaceSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />

          <div className="space-y-8">
          {activeSection === "overview" ? (
          <ClientOverview
                clientName={
                  workspace?.client?.client_profile?.display_name ||
                  workspace?.client?.client_email ||
                  "Client"
                }
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
                intelligence={getCareerIntelligenceSummary({
                  hasDiscoveryReport: careerReports.length > 0,
                  hasAIQReport: aiqReports.length > 0,
                  openActionItems,
                  hasNextMeeting: Boolean(nextMeeting),
                })}
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
              <ReportSection title="AIQ Reports" reports={aiqReports} />
            ) : null}

            {activeSection === "timeline" ? (
              <ClientTimeline events={[]} />
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





  