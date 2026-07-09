"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    loadSessions();
  }, [organizationClientId]);

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
    <section className="rounded-[2rem] border border-slate-200 bg-white p-7 text-[#111827] shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#B8872A]">
            SESSION TIMELINE
          </p>
          <h2 className="mt-3 text-3xl font-black">Past and upcoming conversations</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Review coaching sessions in context. Each conversation can add new
            evidence that makes future Career Intelligence Briefs more useful.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateSession}
          disabled={saving}
          className="rounded-2xl bg-[#4C1D95] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#3B147B] disabled:opacity-60"
        >
          {saving ? "Creating..." : "+ New Session"}
        </button>
      </div>

      <div className="mt-7 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
        {sessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-6">
            <p className="font-black text-slate-800">No coaching sessions yet.</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
              Create a session when you are ready to capture the next coaching conversation.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-black text-slate-950">
                      {session.title || "Coaching Session"}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2 text-sm font-semibold text-slate-500">
                      <span>Status: {session.status || "planned"}</span>
                      <span>•</span>
                      <span>
                        {session.scheduled_for
                          ? new Date(session.scheduled_for).toLocaleDateString()
                          : "No date set"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        `/coach/clients/${organizationClientId}/sessions/${session.id}`
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-black text-[#4C1D95] shadow-sm transition hover:border-[#4C1D95]"
                  >
                    Open Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {message ? (
          <p className="mt-4 text-sm font-semibold text-slate-500">{message}</p>
        ) : null}
      </div>
    </section>
  );
}
