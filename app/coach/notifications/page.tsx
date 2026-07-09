"use client";

import { useEffect, useState } from "react";
import CoachShell from "@/components/coach/CoachShell";
import {
  getCurrentOrganization,
  getOrganizationNotifications,
  markOrganizationNotificationRead,
} from "@/services/coachService";

export default function CoachNotificationsPage() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  async function loadNotifications() {
    try {
      const membership = await getCurrentOrganization();
      const data = await getOrganizationNotifications(membership.organization_id);
      setNotifications(data || []);
    } catch (error: any) {
      alert(error.message || "Unable to load notifications.");
      window.location.href = "/coach";
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleMarkRead(notificationId: string) {
    await markOrganizationNotificationRead(notificationId);
    await loadNotifications();
  }

  const unreadCount = notifications.filter((notification) => !notification.read_at).length;
  const readCount = notifications.length - unreadCount;

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read_at;
    if (filter === "read") return Boolean(notification.read_at);
    return true;
  });

  return (
    <CoachShell>
      <section className="rounded-[2rem] bg-[#F8FAFC] p-4 text-[#111827] md:p-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#B8872A]">
            NOTIFICATION CENTER
          </p>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">Notifications</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Review client activity, accepted invites, shared reports, meetings, notes, and growth items in one focused workspace.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <SummaryCard label="All Notifications" value={notifications.length} description="Total workspace activity" />
          <SummaryCard label="Unread" value={unreadCount} description="Needs review" />
          <SummaryCard label="Read" value={readCount} description="Already handled" />
        </div>

        <div className="mt-7 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">Activity</p>
              <h2 className="mt-2 text-2xl font-black">What needs attention</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>All</FilterButton>
              <FilterButton active={filter === "unread"} onClick={() => setFilter("unread")}>Unread</FilterButton>
              <FilterButton active={filter === "read"} onClick={() => setFilter("read")}>Read</FilterButton>
            </div>
          </div>

          <div className="mt-7">
            {loading ? (
              <p className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 font-black text-[#B8872A]">Loading notifications...</p>
            ) : filteredNotifications.length === 0 ? (
              <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50 p-8 text-center">
                <p className="text-xl font-black text-slate-950">No notifications here.</p>
                <p className="mt-2 text-sm font-semibold text-slate-500">When client activity needs attention, it will appear in this feed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div key={notification.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-black text-slate-950">{notification.title}</p>
                          {notification.read_at ? (
                            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-black text-slate-500">Read</span>
                          ) : (
                            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-800">New</span>
                          )}
                        </div>

                        {notification.message ? (
                          <p className="mt-2 leading-7 text-slate-600">{notification.message}</p>
                        ) : null}

                        <p className="mt-3 text-xs font-semibold text-slate-400">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>

                      {!notification.read_at ? (
                        <button
                          onClick={() => handleMarkRead(notification.id)}
                          className="rounded-2xl bg-[#4C1D95] px-4 py-2 text-sm font-black text-white shadow-sm transition hover:bg-[#3B147B]"
                        >
                          Mark read
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </CoachShell>
  );
}

function SummaryCard({ label, value, description }: { label: string; value: number; description: string }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black text-[#B8872A]">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{description}</p>
    </div>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-4 py-2 text-sm font-black transition",
        active ? "bg-[#4C1D95] text-white" : "border border-slate-200 bg-white text-slate-600 hover:text-[#4C1D95]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
