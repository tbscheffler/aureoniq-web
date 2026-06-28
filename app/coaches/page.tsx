import Image from "next/image";
import Link from "next/link";

const trialDetails = [
  "14-day free trial",
  "Up to 4 active clients",
  "Full coach workspace access",
  "Starter plan is $49/month after trial",
];

const productSections = [
  {
    eyebrow: "COACH WORKSPACE",
    title: "Run every client from one clean command center.",
    text: "Track clients, meetings, action items, notes, shared reports, and plan limits without adding admin clutter.",
    image: "/coach/coach-dashboard.png",
  },
  {
    eyebrow: "CLIENT WORKSPACE",
    title: "Give every client a dedicated coaching workspace.",
    text: "Career Assessment, Future Potential, Resume Review, Coach Notes, meetings, and action plans stay organized in one place.",
    image: "/coach/client-workspace.png",
  },
  {
    eyebrow: "AI RESUME REVIEW",
    title: "AI prepares the review. The coach leads the conversation.",
    text: "AureonIQ highlights strengths, ATS concerns, improvement areas, and coaching opportunities without rewriting for the client.",
    image: "/coach/resume-review.png",
  },
  {
    eyebrow: "FUTURE POTENTIAL",
    title: "Help clients see where their career can go next.",
    text: "AIQ reports surface growth paths, market position, career trajectory, and hidden opportunities.",
    image: "/coach/aiq-report.png",
  },
];

export default function CoachesPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-sm font-black tracking-[0.3em] text-[#FBBF24]">
          AUREONIQ FOR CAREER COACHES
        </p>

        <h1 className="mt-6 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          Spend less time preparing. More time coaching.
        </h1>

        <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-300">
          AureonIQ gives coaches an AI-prepared client workspace for resume
          reviews, career intelligence, coaching notes, meetings, and action
          items. AI prepares. Coach decides. Client succeeds.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/coach"
            className="rounded-2xl bg-[#FBBF24] px-7 py-4 font-black text-[#020617] shadow-lg shadow-[#FBBF24]/10 transition hover:scale-[1.02]"
          >
            Start Your 14-Day Trial
          </Link>

          <Link
            href="/contact"
            className="rounded-2xl border border-slate-700 px-7 py-4 font-black text-white transition hover:border-[#FBBF24] hover:text-[#FBBF24]"
          >
            Talk to Us
          </Link>
        </div>

        <p className="mt-5 text-sm font-bold text-slate-500">
          14-day trial · 4 active clients · $49/month after trial
        </p>

        <div className="mt-14 overflow-hidden rounded-3xl border border-slate-800 bg-[#111827] p-3 shadow-2xl shadow-black/40">
          <Image
            src="/coach/coach-dashboard.png"
            alt="AureonIQ coach dashboard"
            width={1600}
            height={900}
            className="rounded-2xl"
            priority
          />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-20 md:grid-cols-3">
        <ValueCard
          title="AI prepares"
          text="AureonIQ organizes resume reviews, reports, client context, and next steps before the session."
        />

        <ValueCard
          title="Coach decides"
          text="AI findings become coaching context, not automatic rewrites or replacement advice."
        />

        <ValueCard
          title="Client succeeds"
          text="Clients get clearer direction, stronger documents, and a more prepared coaching experience."
        />
      </section>

      <section className="mx-auto max-w-7xl space-y-20 px-6 pb-24">
        {productSections.map((section) => (
          <div
            key={section.title}
            className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]"
          >
            <div>
              <p className="text-sm font-black tracking-[0.3em] text-[#FBBF24]">
                {section.eyebrow}
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight">
                {section.title}
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-400">
                {section.text}
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#111827] p-3 shadow-2xl shadow-black/30">
              <Image
                src={section.image}
                alt={section.title}
                width={1400}
                height={850}
                className="rounded-2xl"
              />
            </div>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl border border-[#FBBF24]/30 bg-[#FBBF24]/10 p-8 md:p-10">
          <p className="text-sm font-black tracking-[0.25em] text-[#FBBF24]">
            14-DAY COACH TRIAL
          </p>

          <h2 className="mt-4 text-4xl font-black">Try AureonIQ free</h2>

          <p className="mt-4 max-w-2xl leading-8 text-slate-300">
            Start with up to 4 active clients and experience the full coach
            workspace before choosing a paid plan.
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {trialDetails.map((detail) => (
              <div
                key={detail}
                className="rounded-2xl border border-[#FBBF24]/20 bg-[#020617]/70 p-4"
              >
                <p className="font-black text-white">✓ {detail}</p>
              </div>
            ))}
          </div>

          <Link
            href="/coach"
            className="mt-8 inline-block rounded-2xl bg-[#FBBF24] px-7 py-4 font-black text-[#020617] transition hover:scale-[1.02]"
          >
            Start Your 14-Day Trial
          </Link>
        </div>
      </section>
    </main>
  );
}

function ValueCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
      <h2 className="text-2xl font-black text-white">{title}</h2>
      <p className="mt-4 leading-7 text-slate-400">{text}</p>
    </div>
  );
}