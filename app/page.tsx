import FAQSection from "@/components/FAQSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <a href="/" className="flex items-center gap-3">
          <img src="/icon.png" alt="AureonIQ" className="h-10 w-10 rounded-xl" />
          <span className="text-lg font-black">AureonIQ</span>
        </a>

        <div className="hidden items-center gap-8 text-sm font-bold text-slate-300 md:flex">
          <a href="#how-it-works" className="hover:text-[#FBBF24]">How It Works</a>
          <a href="#pricing" className="hover:text-[#FBBF24]">Pricing</a>
          <a href="/support" className="hover:text-[#FBBF24]">Support</a>
        </div>

        <a
          href="#download"
          className="rounded-xl bg-[#FBBF24] px-5 py-3 text-sm font-black text-[#020617]"
        >
          Download
        </a>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <p className="mb-5 text-sm font-black tracking-[0.3em] text-[#FBBF24]">
            CAREER INTELLIGENCE PLATFORM
          </p>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            Discover opportunities you didn&apos;t know you qualified for.
          </h1>

          <p className="mt-6 max-w-xl text-xl leading-8 text-slate-300">
            AureonIQ analyzes your experience to uncover hidden career paths,
            market value, career mobility, and future growth opportunities.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a
              id="download"
              href="#"
              className="rounded-2xl bg-[#2563EB] px-7 py-4 text-center font-black text-white transition hover:bg-blue-500"
            >
              Download on the App Store
            </a>

            <a
              href="#how-it-works"
              className="rounded-2xl border border-slate-700 px-7 py-4 text-center font-black text-white transition hover:border-[#FBBF24]"
            >
              See How It Works
            </a>
          </div>

          <p className="mt-4 text-sm text-slate-400">
            AureonIQ for iOS is currently in Apple review.
          </p>
        </div>

        <div className="relative mx-auto max-w-sm">
          <div className="absolute inset-0 rounded-[3rem] bg-[#FBBF24]/20 blur-3xl" />
          <img
            src="/screenshots/home.png"
            alt="AureonIQ mobile app home screen"
            className="relative rounded-[2.5rem] border border-slate-700 shadow-2xl"
          />
        </div>
      </section>

      <section className="border-y border-slate-800 bg-[#07111f]">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h2 className="text-4xl font-black md:text-5xl">
            Most people don&apos;t have a resume problem.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-xl leading-8 text-slate-300">
            They have an opportunity visibility problem. Job boards only show
            what you search for. AureonIQ reveals the paths hiding inside your
            actual experience.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-black tracking-[0.3em] text-[#FBBF24]">
              DISCOVERY REPORT
            </p>
            <h2 className="text-4xl font-black md:text-5xl">
              Turn your experience into a career map.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              See your Career Opportunity Score, market value, expected paths,
              adjacent paths, hidden opportunities, and the career you didn&apos;t
              expect.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <img
              src="/screenshots/discovery-report.png"
              alt="Discovery report screen"
              className="rounded-[2rem] border border-slate-700 shadow-2xl"
            />
            <img
              src="/screenshots/featured-opportunity.png"
              alt="Featured opportunity screen"
              className="rounded-[2rem] border border-slate-700 shadow-2xl sm:mt-12"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#0b1220]">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 md:grid-cols-2">
          <div className="mx-auto max-w-sm md:order-1">
            <img
              src="/screenshots/aiq-report.png"
              alt="AIQ report screen"
              className="rounded-[2rem] border border-slate-700 shadow-2xl"
            />
          </div>

          <div>
            <p className="mb-4 text-sm font-black tracking-[0.3em] text-[#FBBF24]">
              AIQ PRO
            </p>
            <h2 className="text-4xl font-black md:text-5xl">
              Forecast your future paths.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              AIQ Report measures career mobility, growth potential, alternative
              futures, and the accelerators that can move your career forward.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <p className="mb-4 text-sm font-black tracking-[0.3em] text-[#FBBF24]">
            HOW IT WORKS
          </p>
          <h2 className="text-4xl font-black md:text-5xl">
            Career intelligence in minutes.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-4">
          {[
            ["1", "Upload Resume", "Start with your real work history."],
            ["2", "AI Analyzes", "AureonIQ translates skills and experience."],
            ["3", "Discover Paths", "See expected, adjacent, and hidden careers."],
            ["4", "Plan Growth", "Use AIQ to forecast your next move."],
          ].map(([num, title, text]) => (
            <div key={num} className="rounded-3xl border border-slate-800 bg-[#111827] p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FBBF24] text-xl font-black text-[#020617]">
                {num}
              </div>
              <h3 className="text-xl font-black">{title}</h3>
              <p className="mt-3 leading-7 text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="bg-[#07111f]">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center">
            <p className="mb-4 text-sm font-black tracking-[0.3em] text-[#FBBF24]">
              PRICING
            </p>
            <h2 className="text-4xl font-black md:text-5xl">
              Start free. Upgrade when you want deeper intelligence.
            </h2>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              ["Free", "$0", "Career snapshot and basic discovery."],
              ["Professional", "$9.99/mo", "Full Discovery Report and job matches."],
              ["AIQ Pro", "$14.99/mo", "AIQ Report, forecasting, and growth accelerators."],
            ].map(([plan, price, text]) => (
              <div key={plan} className="rounded-3xl border border-slate-800 bg-[#111827] p-8">
                <h3 className="text-2xl font-black">{plan}</h3>
                <p className="mt-5 text-4xl font-black text-[#FBBF24]">{price}</p>
                <p className="mt-5 leading-7 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <p className="mb-4 text-sm font-black tracking-[0.3em] text-[#FBBF24]">
          COMING SOON
        </p>
        <h2 className="text-4xl font-black md:text-5xl">
          Built for professionals today. Expanding for Coaches and Universities next.
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-300">
          AureonIQ is growing into a career intelligence platform for individuals,
          career coaches, students, and institutions.
        </p>
      </section>
      <FAQSection />
      <footer className="border-t border-slate-800 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 text-sm text-slate-400 md:flex-row md:justify-between">
          <p>© 2026 AureonIQ. All rights reserved.</p>

          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-[#FBBF24]">Privacy</a>
            <a href="/support" className="hover:text-[#FBBF24]">Support</a>
            <a href="/terms" className="hover:text-[#FBBF24]">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}