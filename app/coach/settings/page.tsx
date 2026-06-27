import CoachShell from "@/components/coach/CoachShell";

export default function CoachSettingsPage() {
    return (
      <CoachShell>
      <section>
  
          <p className="mt-10 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            ORGANIZATION SETTINGS
          </p>
  
          <h1 className="mt-4 text-5xl font-black">
            Organization Settings
          </h1>
  
          <p className="mt-6 max-w-2xl leading-8 text-slate-300">
            Manage your organization, subscription, team members,
            branding, and future billing settings.
          </p>
  
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <SettingsCard
              title="Organization"
              description="Organization profile and branding."
            />
  
            <SettingsCard
              title="Team"
              description="Invite and manage coaches."
            />
  
              <SettingsCard
              title="Subscription"
              description="Billing, seats, and plan management."
              href="/coach/billing"
            />
  
            <SettingsCard
              title="Security"
              description="Audit log and access settings."
            />
          </div>
          </section>
          </CoachShell>
    );
  }
  
  function SettingsCard({
    title,
    description,
    href,
  }: {
    title: string;
    description: string;
    href?: string;
  }) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
        <h2 className="text-2xl font-black text-white">
          {title}
        </h2>
  
        <p className="mt-4 leading-7 text-slate-400">
          {description}
        </p>
  
        {href ? (
          <a
            href={href}
            className="mt-8 inline-block rounded-2xl bg-[#FBBF24] px-5 py-3 font-black text-[#020617]"
          >
            Open
          </a>
        ) : (
          <button
            disabled
            className="mt-8 rounded-2xl bg-[#FBBF24]/20 px-5 py-3 font-black text-[#FBBF24]"
          >
            Coming Soon
          </button>
        )}
      </div>
    );
  }