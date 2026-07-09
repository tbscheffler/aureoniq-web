"use client";

import { useEffect, useState } from "react";
import {
  createOrganizationClientActionItem,
  getOrganizationClientActionItems,
} from "@/services/coachService";

export default function ActionPlanSection({
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
      alert("Add a growth step title first.");
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
      alert("Growth step saved.");
    } catch (error: any) {
      alert(error.message || "Failed to save growth step.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-7 text-[#111827] shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#B8872A]">
            GROWTH PLAN
          </p>
          <h2 className="mt-3 text-3xl font-black">Next steps that came from coaching</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            Capture practical follow-up steps that emerge from the coaching conversation.
            Keep the plan simple, clear, and tied to the client&apos;s career direction.
          </p>
        </div>
      </div>

      <div className="mt-7 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          Add growth step
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_180px]">
          <input
            className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#6D28D9] focus:ring-4 focus:ring-violet-100"
            placeholder="Growth step title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="date"
            className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 outline-none transition focus:border-[#6D28D9] focus:ring-4 focus:ring-violet-100"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <textarea
          className="mt-4 min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#6D28D9] focus:ring-4 focus:ring-violet-100"
          placeholder="Context from the coaching conversation..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={handleSaveActionItem}
          disabled={saving}
          className="mt-4 rounded-2xl bg-[#4C1D95] px-6 py-4 font-black text-white shadow-sm transition hover:bg-[#3B147B] disabled:opacity-60"
        >
          {saving ? "Saving..." : "+ Add Growth Step"}
        </button>
      </div>

      <div className="mt-8">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-[#B8872A]">
          CURRENT GROWTH PLAN
        </p>

        {loadingItems ? (
          <p className="mt-4 text-slate-500">Loading growth steps...</p>
        ) : items.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-6">
            <p className="font-bold text-slate-600">
              No growth steps yet. Add one after the next coaching conversation.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-lg font-black text-slate-950">{item.title}</p>

                    {item.description ? (
                      <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-600">
                        {item.description}
                      </p>
                    ) : null}
                  </div>

                  <span className="w-fit rounded-full border border-[#B8872A]/30 bg-[#FFF8E7] px-3 py-1 text-xs font-bold text-[#9A6A12]">
                    {item.status || "open"}
                  </span>
                </div>

                {item.due_date ? (
                  <p className="mt-4 text-sm font-semibold text-slate-500">
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
