"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CoachShell from "@/components/coach/CoachShell";
import {
  getOrganizationClientCoachingSession,
  updateOrganizationClientCoachingSessionNotes,
} from "@/services/coachService";

export default function CoachingSessionWorkspacePage() {
  const params = useParams();

  const clientId = params.clientId as string;
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");
    const [savingNotes, setSavingNotes] = useState(false);
    const [notesMessage, setNotesMessage] = useState("");

  useEffect(() => {
    async function loadSession() {
      try {
        const data = await getOrganizationClientCoachingSession(sessionId);
        setSession(data);
        setSessionNotes(data?.session_notes || "");
      } catch (err: any) {
        setError(err.message || "Unable to load session.");
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, [sessionId]);

    async function handleSaveSessionNotes() {
    try {
        setSavingNotes(true);
        setNotesMessage("");

        const updatedSession = await updateOrganizationClientCoachingSessionNotes({
        sessionId,
        sessionNotes,
        });

        setSession(updatedSession);
        setNotesMessage("Notes saved.");
    } catch (err: any) {
        setNotesMessage(err.message || "Unable to save notes.");
    } finally {
        setSavingNotes(false);
    }
    }


  return (
    <CoachShell>
      <section className="rounded-3xl border border-slate-800 bg-[#111827] p-6 text-white">
        <Link
          href={`/coach/clients/${clientId}`}
          className="inline-block text-sm font-bold text-[#FBBF24] hover:text-yellow-300"
        >
          ← Back to Client Workspace
        </Link>

        <p className="mt-3 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
          SESSION WORKSPACE
        </p>

        {loading ? (
          <p className="mt-6 text-slate-400">Loading session...</p>
        ) : error ? (
          <p className="mt-6 text-red-300">{error}</p>
        ) : (
          <>
            <h1 className="mt-3 text-3xl font-black">
              {session?.title || "Coaching Session"}
            </h1>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-[#020617] p-5">
              <p className="text-sm text-slate-500">Status</p>
              <p className="mt-1 text-slate-300">{session?.status || "planned"}</p>

              <p className="mt-4 text-sm text-slate-500">Scheduled For</p>
              <p className="mt-1 text-slate-300">
                {session?.scheduled_for
                  ? new Date(session.scheduled_for).toLocaleString()
                  : "No date set"}
              </p>

              <p className="mt-4 text-sm text-slate-500">Meeting Type</p>
              <p className="mt-1 text-slate-300">
                {session?.meeting_type || "Not set"}
              </p>

              <p className="mt-4 text-sm text-slate-500">Location</p>
              <p className="mt-1 text-slate-300">
                {session?.location || "Not set"}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-[#020617] p-5">
            <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
                SESSION NOTES
            </p>

            <h2 className="mt-3 text-xl font-black">Notes for this session</h2>

            <textarea
            value={sessionNotes}
            onChange={(event) => setSessionNotes(event.target.value)}
            className="mt-4 min-h-[180px] w-full rounded-2xl border border-slate-800 bg-[#111827] p-4 text-sm text-white outline-none focus:border-[#FBBF24]"
            placeholder="Capture coaching notes, observations, client goals, blockers, and follow-up themes..."
            />

            <button
            type="button"
            onClick={handleSaveSessionNotes}
            disabled={savingNotes}
            className="mt-4 rounded-xl bg-[#FBBF24] px-5 py-3 text-sm font-black text-[#020617] disabled:opacity-60"
            >
            {savingNotes ? "Saving..." : "Save Session Notes"}
            </button>

            {notesMessage ? (
            <p className="mt-3 text-sm text-slate-400">{notesMessage}</p>
            ) : null}
            </div>
          </>
        )}
      </section>
    </CoachShell>
  );
}