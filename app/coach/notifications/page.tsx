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

  return (
    <CoachShell>
      <section>
        <p className="mb-4 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
          NOTIFICATIONS
        </p>

        <h1 className="text-5xl font-black">Notifications</h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          Review client activity, accepted invites, shared reports, meetings,
          notes, and action items.
        </p>

        <div className="mt-10 rounded-3xl border border-slate-800 bg-[#111827] p-8">
          {loading ? (
            <p className="font-black text-[#FBBF24]">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p className="text-slate-400">No notifications yet.</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-2xl border border-slate-700 bg-[#020617] p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="font-black text-white">
                        {notification.title}
                      </p>

                      {notification.message ? (
                        <p className="mt-2 leading-7 text-slate-400">
                          {notification.message}
                        </p>
                      ) : null}

                      <p className="mt-3 text-xs text-slate-500">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>

                    {notification.read_at ? (
                      <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-bold text-slate-400">
                        Read
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMarkRead(notification.id)}
                        className="rounded-2xl bg-[#FBBF24] px-4 py-2 text-sm font-black text-[#020617]"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </CoachShell>
  );
}