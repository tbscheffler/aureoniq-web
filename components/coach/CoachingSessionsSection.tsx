"use client";

import { useEffect, useState } from "react";
import {
  createOrganizationClientCoachingSession,
  getOrganizationClientCoachingSessions,
} from "@/services/coachService";

type CoachingSessionsSectionProps = {
  organizationClientId: string;
};

export default function CoachingSessionsSection({
  organizationClientId,
}: CoachingSessionsSectionProps) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
  loadSessions();
    }, []);

    async function loadSessions() {
    const data = await getOrganizationClientCoachingSessions(
        organizationClientId
    );

    setSessions(data || []);
    }

  async function handleCreateSession() {
    try {
      setSaving(true);
      setMessage("");

      await createOrganizationClientCoachingSession({
        organizationClientId,
        title: "Coaching Session",
        scheduledFor: new Date().toISOString(),
      });

      await loadSessions();
    } catch (err: any) {
      setMessage(err.message || "Unable to create session.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-[#111827] p-6 text-white">
      <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
        COACHING SESSIONS
      </p>

      <h2 className="mt-3 text-2xl font-black">Coaching Sessions</h2>

      <p className="mt-3 max-w-2xl text-sm text-slate-400">
        Plan, conduct, and review structured coaching sessions for this client.
      </p>

      <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-[#020617] p-6">
        {sessions.length === 0 ? (
  <p className="font-black text-slate-200">No coaching sessions yet.</p>
) : (
  <div className="space-y-3">
    {sessions.map((session) => (
      <div
        key={session.id}
        className="rounded-2xl border border-slate-800 bg-[#111827] p-4"
      >
        <p className="font-black text-white">
          {session.title || "Coaching Session"}
        </p>

        <p className="mt-1 text-sm text-slate-400">
          Status: {session.status || "planned"}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {session.scheduled_for
            ? new Date(session.scheduled_for).toLocaleDateString()
            : "No date set"}
        </p>
      </div>
    ))}
  </div>
)}

        <button
          type="button"
          onClick={handleCreateSession}
          disabled={saving}
          className="mt-5 rounded-xl bg-[#FBBF24] px-5 py-3 text-sm font-black text-[#020617] disabled:opacity-60"
        >
          {saving ? "Creating..." : "New Session"}
        </button>

        {message ? <p className="mt-4 text-sm text-slate-400">{message}</p> : null}
      </div>
    </section>
  );
}