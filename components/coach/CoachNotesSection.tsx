"use client";

import { useEffect, useState } from "react";
import {
  createOrganizationClientNote,
  getOrganizationClientNotes,
} from "@/services/coachService";

export default function CoachNotesSection({
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