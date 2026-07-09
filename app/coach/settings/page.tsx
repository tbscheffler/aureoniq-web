import Link from "next/link";
import CoachShell from "@/components/coach/CoachShell";

const SETTINGS = [
  {
    title: "Organization",
    description:
      "Update your coaching organization details and workspace identity.",
    status: "Coming Soon",
  },
  {
    title: "Team",
    description: "Invite teammates and manage who can access client workspaces.",
    href: "/coach/team",
    status: "Open",
  },
  {
    title: "Security",
    description:
      "Review sign-in, access, and account protection settings.",
    status: "Coming Soon",
  },
];

export default function CoachSettingsPage() {
  return (
    <CoachShell>
      <section className="rounded-[2rem] bg-[#F8FAFC] p-4 text-[#111827] md:p-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#B8872A]">
            WORKSPACE SETTINGS
          </p>
          <h1 className="mt-3 text-4xl font-black md:text-5xl">Settings</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
            Manage your account, team access, subscription, and workspace preferences from one place.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <SummaryCard
            label="Workspace"
            value="Coach"
            description="Your coaching workspace"
          />
          <SummaryCard
            label="Access"
            value="Protected"
            description="Only approved members can enter"
          />
          <SummaryCard
            label="Billing"
            value="Stripe"
            description="Plan and payments managed securely"
          />
        </div>

        <div className="mt-7 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">
                Billing & Subscription
              </p>
              <h2 className="mt-3 text-2xl font-black">
                Plan, seats, and payments
              </h2>
              <p className="mt-2 max-w-3xl leading-7 text-slate-600">
                Manage your plan, client seats, invoices, and payment details.
              </p>
            </div>

            <Link
              href="/coach/billing"
              className="inline-flex items-center justify-center rounded-2xl bg-[#4C1D95] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#3B147B]"
            >
              Manage Billing
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[1.5rem] border border-[#E8D49B] bg-[#FFF8E7] p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9A6A12]">
                Plan
              </p>
              <p className="mt-2 text-xl font-black text-slate-950">
                Coach subscription
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                See your current AureonIQ coach plan and subscription status.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Seats
              </p>
              <p className="mt-2 text-xl font-black text-slate-950">
                Client capacity
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                Track how many client workspaces your plan supports.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                Portal
              </p>
              <p className="mt-2 text-xl font-black text-slate-950">
                Secure payments
              </p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                Open the secure billing portal to update payments, invoices, or plan details.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-7 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">
            Settings Areas
          </p>
          <h2 className="mt-3 text-2xl font-black">
            Configure your coach workspace
          </h2>
          <p className="mt-2 max-w-3xl leading-7 text-slate-600">
            Choose what you want to update, from your organization setup to team access and security.
          </p>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {SETTINGS.map((setting) => (
              <SettingsCard key={setting.title} {...setting} />
            ))}
          </div>
        </div>
      </section>
    </CoachShell>
  );
}

function SummaryCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-[#B8872A]">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">
        {description}
      </p>
    </div>
  );
}

function SettingsCard({
  title,
  description,
  href,
  status,
}: {
  title: string;
  description: string;
  href?: string;
  status: string;
}) {
  const content = (
    <div className="h-full rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 transition hover:border-violet-200 hover:bg-white">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-2xl font-black text-slate-950">{title}</h3>
        <span
          className={[
            "rounded-full border px-3 py-1 text-xs font-black",
            href
              ? "border-emerald-100 bg-emerald-50 text-emerald-800"
              : "border-[#E8D49B] bg-[#FFF8E7] text-[#9A6A12]",
          ].join(" ")}
        >
          {status}
        </span>
      </div>

      <p className="mt-4 leading-7 text-slate-600">{description}</p>

      <div className="mt-8">
        {href ? (
          <span className="inline-block rounded-2xl bg-[#4C1D95] px-5 py-3 font-black text-white shadow-sm">
            Open
          </span>
        ) : (
          <span className="inline-block rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-400">
            Coming Soon
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
