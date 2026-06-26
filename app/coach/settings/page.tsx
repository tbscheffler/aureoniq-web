export default function CoachSettingsPage() {
    return (
      <main className="min-h-screen bg-[#020617] text-white">
        <section className="mx-auto max-w-5xl px-6 py-12">
          <a
            href="/coach"
            className="text-sm font-bold text-[#FBBF24]"
          >
            ← Back to Coach Workspace
          </a>
  
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
            />
  
            <SettingsCard
              title="Security"
              description="Audit log and access settings."
            />
          </div>
        </section>
      </main>
    );
  }
  
  function SettingsCard({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
        <h2 className="text-2xl font-black text-white">
          {title}
        </h2>
  
        <p className="mt-4 leading-7 text-slate-400">
          {description}
        </p>
  
        <button
          disabled
          className="mt-8 rounded-2xl bg-[#FBBF24]/20 px-5 py-3 font-black text-[#FBBF24]"
        >
          Coming Soon
        </button>
      </div>
    );
  }