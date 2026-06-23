export default function Home() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="mb-4 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
          AUREONIQ
        </p>

        <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
          Career intelligence for your next move.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-blue-100">
          Discover opportunities you didn&apos;t know you qualified for.
        </p>

        <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-300">
          AureonIQ uses AI to analyze your experience, uncover hidden career
          paths, explain your transferable skills, and help you understand where
          your career could go next.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="/privacy"
            className="rounded-xl bg-[#2563EB] px-6 py-4 font-bold text-white transition hover:bg-blue-500"
          >
            Privacy Policy
          </a>

          <a
            href="/support"
            className="rounded-xl border border-slate-700 px-6 py-4 font-bold text-white transition hover:border-[#FBBF24]"
          >
            Support
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-[#111827] p-7">
            <p className="mb-3 text-sm font-black tracking-widest text-[#FBBF24]">
              DISCOVERY
            </p>
            <h2 className="mb-3 text-2xl font-black">Career Discovery</h2>
            <p className="leading-7 text-slate-300">
              Explore expected paths, adjacent opportunities, and hidden career
              options based on your real experience.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#111827] p-7">
            <p className="mb-3 text-sm font-black tracking-widest text-[#FBBF24]">
              AIQ PRO
            </p>
            <h2 className="mb-3 text-2xl font-black">Future Forecasting</h2>
            <p className="leading-7 text-slate-300">
              Understand your career mobility, growth potential, opportunity
              index, and alternative futures.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#111827] p-7">
            <p className="mb-3 text-sm font-black tracking-widest text-[#FBBF24]">
              MATCHING
            </p>
            <h2 className="mb-3 text-2xl font-black">Live Job Matches</h2>
            <p className="leading-7 text-slate-300">
              Connect your skills to real opportunities with personalized match
              explanations.
            </p>
          </div>
        </div>
      </section>
      <footer className="border-t border-slate-800 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-sm text-slate-400 md:flex-row md:justify-between">
        
        <p>© 2026 AureonIQ. All rights reserved.</p>

        <div className="flex gap-6">
          <a
            href="/privacy"
            className="hover:text-[#FBBF24]"
          >
            Privacy Policy
          </a>

          <a
            href="/support"
            className="hover:text-[#FBBF24]"
          >
            Support
          </a>
        </div>

      </div>
    </footer>
    </main>
  );
}