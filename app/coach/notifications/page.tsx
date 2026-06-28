import CoachShell from "@/components/coach/CoachShell";

export default function CoachNotificationsPage() {
  return (
    <CoachShell>
      <section>
        <p className="mb-4 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
          NOTIFICATIONS
        </p>

        <h1 className="text-5xl font-black">Notifications</h1>

        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          This will become the coach inbox for client activity, accepted invites,
          new shared reports, meetings, notes, and action items.
        </p>

        <div className="mt-10 rounded-3xl border border-slate-800 bg-[#111827] p-8">
          <h2 className="text-2xl font-black text-white">
            Notification center coming next
          </h2>

          <p className="mt-4 leading-7 text-slate-400">
            We are creating the page shell first so the navigation and SaaS
            structure stay clean before we wire unread counts and database
            notifications.
          </p>
        </div>
      </section>
    </CoachShell>
  );
}