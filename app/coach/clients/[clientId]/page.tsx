"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getCoachClientSummary,
} from "@/services/coachService";
import {
  MetricCard,
  ClientWorkspaceSidebar,
  ReportSection,
  CoachNotesSection,
  MeetingHistorySection,
  ActionPlanSection,
} from "@/components/coach";

export default function CoachClientWorkspacePage() {
    const params = useParams();
    const clientId = params.clientId as string;
  
    const [loading, setLoading] = useState(true);
    const [workspace, setWorkspace] = useState<any>(null);
    const [error, setError] = useState("");
    const [activeSection, setActiveSection] = useState("discovery");

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const data = await getCoachClientSummary(clientId);
        setWorkspace(data);
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
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto max-w-7xl px-6 py-12">
        <a href="/coach" className="text-sm font-bold text-[#FBBF24]">
          ← Back to Coach Workspace
        </a>

        <div className="mt-10">
          <p className="mb-4 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            CLIENT WORKSPACE
          </p>

          <h1 className="text-5xl font-black">Client Career Intelligence</h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
            Review this client’s shared AureonIQ reports. Reports are read-only.
            Coaching notes and action plans will live here next.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <MetricCard title="Discovery Reports" value={careerReports.length} />
          <MetricCard title="AIQ Reports" value={aiqReports.length} />
          <MetricCard
            title="Access Level"
            value={workspace?.client?.access_level || "shared"}
          />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          <ClientWorkspaceSidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />

          <div className="space-y-8">
            {activeSection === "discovery" ? (
              <ReportSection title="Career Discovery Reports" reports={careerReports} />
            ) : null}

            {activeSection === "aiq" ? (
              <ReportSection title="AIQ Reports" reports={aiqReports} />
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
    </main>
  );
}





  