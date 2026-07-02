"use client";

import { useState } from "react";

interface CoachNotesWorkspaceProps {
  initialNotes: string;
  onSave: (notes: string) => Promise<void>;
}

export default function CoachNotesWorkspace({
  initialNotes,
  onSave,
}: CoachNotesWorkspaceProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    try {
      setSaving(true);
      await onSave(notes);
      alert("Coach notes saved.");
    } catch (error: any) {
      alert(error.message || "Unable to save coach notes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-700 bg-[#111827] p-8">
      <p className="text-sm font-black uppercase tracking-[0.25em] text-[#FBBF24]">
        COACH NOTES
      </p>

      <h2 className="mt-3 text-3xl font-black text-white">
        Session Notes
      </h2>

      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        rows={14}
        className="mt-6 w-full rounded-2xl border border-slate-700 bg-[#020617] p-5 text-slate-200 outline-none focus:border-[#FBBF24]"
        placeholder="Capture coaching observations, client goals, barriers, breakthroughs, and next steps..."
      />

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl bg-[#FBBF24] px-6 py-3 font-bold text-black disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Notes"}
        </button>
      </div>
    </div>
  );
}