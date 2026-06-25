"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getCoachClientSummary,
  createOrganizationClientNote,
  getOrganizationClientNotes,
  createOrganizationClientMeeting,
  getOrganizationClientMeetings,
  createOrganizationClientActionItem,
  getOrganizationClientActionItems,
} from "@/services/coachService";
import MetricCard from "@/components/coach/MetricCard";
import ClientWorkspaceSidebar from "@/components/coach/ClientWorkspaceSidebar";
import ReportSection from "@/components/coach/ReportSection";

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



function CoachNotesSection({
  organizationClientId,
}: {
  organizationClientId: string;
}) {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadNotes() {
    try {
      setLoadingNotes(true);
      const data = await getOrganizationClientNotes(organizationClientId);
      setNotes(data || []);
    } catch (error: any) {
      alert(error.message || "Failed to load notes.");
    } finally {
      setLoadingNotes(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, [organizationClientId]);

  async function handleSaveNote() {
    if (!note.trim()) {
      alert("Write a note first.");
      return;
    }

    try {
      setSaving(true);
      await createOrganizationClientNote(organizationClientId, note);
      setNote("");
      await loadNotes();
      alert("Note saved.");
    } catch (error: any) {
      alert(error.message || "Failed to save note.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
      <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
        COACH NOTES
      </p>

      <h2 className="mt-4 text-3xl font-black text-white">
        Private organization notes
      </h2>

      <p className="mt-4 max-w-2xl leading-7 text-slate-300">
        Notes belong to the organization, not the client account. They are kept
        separate from the client’s immutable AureonIQ reports.
      </p>

      <textarea
        className="mt-8 min-h-40 w-full rounded-2xl border border-slate-700 bg-[#020617] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
        placeholder="Write a coaching note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button
        onClick={handleSaveNote}
        disabled={saving}
        className="mt-4 rounded-2xl bg-[#FBBF24] px-6 py-4 font-black text-[#020617] disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Note"}
      </button>

      <div className="mt-10">
        <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
          SAVED NOTES
        </p>

        {loadingNotes ? (
          <p className="mt-4 text-slate-400">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="mt-4 text-slate-400">No notes yet.</p>
        ) : (
          <div className="mt-5 space-y-4">
            {notes.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-700 bg-[#020617] p-5"
              >
                <p className="whitespace-pre-wrap leading-7 text-slate-300">
                  {item.note}
                </p>

                <p className="mt-4 text-xs text-slate-500">
                  Created{" "}
                  {item.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : "recently"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



  function ActionPlanSection({
    organizationClientId,
  }: {
    organizationClientId: string;
  }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [items, setItems] = useState<any[]>([]);
    const [loadingItems, setLoadingItems] = useState(true);
    const [saving, setSaving] = useState(false);
  
    async function loadActionItems() {
      try {
        setLoadingItems(true);
        const data = await getOrganizationClientActionItems(organizationClientId);
        setItems(data || []);
      } catch (error: any) {
        alert(error.message || "Failed to load action items.");
      } finally {
        setLoadingItems(false);
      }
    }
  
    useEffect(() => {
      loadActionItems();
    }, [organizationClientId]);
  
    async function handleSaveActionItem() {
      if (!title.trim()) {
        alert("Add an action item title first.");
        return;
      }
  
      try {
        setSaving(true);
  
        await createOrganizationClientActionItem({
          organizationClientId,
          title,
          description,
          dueDate: dueDate || undefined,
        });
  
        setTitle("");
        setDescription("");
        setDueDate("");
  
        await loadActionItems();
        alert("Action item saved.");
      } catch (error: any) {
        alert(error.message || "Failed to save action item.");
      } finally {
        setSaving(false);
      }
    }
  
    return (
      <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
        <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
          ACTION PLAN
        </p>
  
        <h2 className="mt-4 text-3xl font-black text-white">
          Next steps for this client
        </h2>
  
        <p className="mt-4 max-w-2xl leading-7 text-slate-300">
          Create practical follow-up items from reports, meetings, and coaching
          conversations.
        </p>
  
        <div className="mt-8 grid gap-4 md:grid-cols-[1fr_180px]">
          <input
            className="rounded-2xl border border-slate-700 bg-[#020617] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
            placeholder="Action item title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
  
          <input
            type="date"
            className="rounded-2xl border border-slate-700 bg-[#020617] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
  
        <textarea
          className="mt-4 min-h-28 w-full rounded-2xl border border-slate-700 bg-[#020617] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
          placeholder="Description or coaching context..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
  
        <button
          onClick={handleSaveActionItem}
          disabled={saving}
          className="mt-4 rounded-2xl bg-[#FBBF24] px-6 py-4 font-black text-[#020617] disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Action Item"}
        </button>
  
        <div className="mt-10">
          <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            ACTIVE PLAN
          </p>
  
          {loadingItems ? (
            <p className="mt-4 text-slate-400">Loading action items...</p>
          ) : items.length === 0 ? (
            <p className="mt-4 text-slate-400">No action items yet.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-700 bg-[#020617] p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-lg font-black text-white">
                        {item.title}
                      </p>
  
                      {item.description ? (
                        <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-300">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
  
                    <span className="w-fit rounded-full border border-[#FBBF24]/40 bg-[#FBBF24]/10 px-3 py-1 text-xs font-bold text-[#FBBF24]">
                      {item.status || "open"}
                    </span>
                  </div>
  
                  {item.due_date ? (
                    <p className="mt-4 text-sm text-slate-500">
                      Due {new Date(item.due_date).toLocaleDateString()}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  function MeetingHistorySection({
    organizationClientId,
  }: {
    organizationClientId: string;
  }) {
    const [meetingDate, setMeetingDate] = useState("");
    const [meetingTime, setMeetingTime] = useState("");
    const [title, setTitle] = useState("Coaching Session");
    const [summary, setSummary] = useState("");
    const [followUp, setFollowUp] = useState("");
    const [meetings, setMeetings] = useState<any[]>([]);
    const [loadingMeetings, setLoadingMeetings] = useState(true);
    const [saving, setSaving] = useState(false);
  
    async function loadMeetings() {
      try {
        setLoadingMeetings(true);
        const data = await getOrganizationClientMeetings(organizationClientId);
        setMeetings(data || []);
      } catch (error: any) {
        alert(error.message || "Failed to load meetings.");
      } finally {
        setLoadingMeetings(false);
      }
    }
  
    useEffect(() => {
      loadMeetings();
    }, [organizationClientId]);
  
    async function handleSaveMeeting() {
      if (!meetingDate) {
        alert("Choose a meeting date first.");
        return;
      }
  
      try {
        setSaving(true);
  
        await createOrganizationClientMeeting({
          organizationClientId,
          meetingDate: new Date(
            `${meetingDate}T${meetingTime || "12:00"}`
          ).toISOString(),
          title,
          summary,
          followUp,
        });
  
        setMeetingDate("");
        setMeetingTime("");
        setTitle("Coaching Session");
        setSummary("");
        setFollowUp("");
  
        await loadMeetings();
        alert("Meeting saved.");
      } catch (error: any) {
        alert(error.message || "Failed to save meeting.");
      } finally {
        setSaving(false);
      }
    }
  
    return (
      <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
        <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
          MEETING HISTORY
        </p>
  
        <h2 className="mt-4 text-3xl font-black text-white">
          Coaching sessions
        </h2>
  
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <input
            type="date"
            className="rounded-2xl border border-slate-700 bg-[#020617] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
          />

          <input
            type="time"
            className="rounded-2xl border border-slate-700 bg-[#020617] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
            value={meetingTime}
            onChange={(e) => setMeetingTime(e.target.value)}
          />
  
          <input
            className="rounded-2xl border border-slate-700 bg-[#020617] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Meeting title"
          />
        </div>
  
        <textarea
          className="mt-4 min-h-32 w-full rounded-2xl border border-slate-700 bg-[#020617] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
          placeholder="Session summary..."
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
  
        <textarea
          className="mt-4 min-h-24 w-full rounded-2xl border border-slate-700 bg-[#020617] px-5 py-4 text-white outline-none focus:border-[#FBBF24]"
          placeholder="Follow-up items..."
          value={followUp}
          onChange={(e) => setFollowUp(e.target.value)}
        />
  
        <button
          onClick={handleSaveMeeting}
          disabled={saving}
          className="mt-4 rounded-2xl bg-[#FBBF24] px-6 py-4 font-black text-[#020617] disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Meeting"}
        </button>
  
        <div className="mt-10">
          <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            SAVED MEETINGS
          </p>
  
          {loadingMeetings ? (
            <p className="mt-4 text-slate-400">Loading meetings...</p>
          ) : meetings.length === 0 ? (
            <p className="mt-4 text-slate-400">No meetings yet.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="rounded-2xl border border-slate-700 bg-[#020617] p-5"
                >
                  <p className="font-black text-white">{meeting.title}</p>
  
                  <p className="mt-2 text-sm text-slate-500">
                    {meeting.meeting_date
                      ? new Date(meeting.meeting_date).toLocaleString()
                      : "No date"}
                  </p>
  
                  {meeting.summary ? (
                    <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-300">
                      {meeting.summary}
                    </p>
                  ) : null}
  
                  {meeting.follow_up ? (
                    <div className="mt-4 rounded-xl border border-[#FBBF24]/20 bg-[#FBBF24]/5 p-4">
                      <p className="text-sm font-black text-[#FBBF24]">
                        Follow-up
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                        {meeting.follow_up}
                      </p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

