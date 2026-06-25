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

  
