export default function ContactPage() {
    return (
      <main className="min-h-screen bg-[#020617] text-white">
        <section className="mx-auto max-w-4xl px-6 py-20">
          <a href="/" className="text-sm font-bold text-[#FBBF24]">
            ← Back to AureonIQ
          </a>
  
          <h1 className="mt-8 text-4xl font-black">
            Contact AureonIQ
          </h1>
  
          <p className="mt-4 max-w-2xl text-lg text-slate-400">
            We'd love to hear from you. Whether you're a professional exploring
            career opportunities, a career coach, university partner, or simply
            have feedback, reach out anytime.
          </p>
  
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-[#111827] p-8">
              <p className="mb-3 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
                SUPPORT
              </p>
  
              <h2 className="text-2xl font-black">
                Customer Support
              </h2>
  
              <p className="mt-4 text-slate-300">
                Questions about your account, subscriptions, reports, resume
                uploads, or technical issues.
              </p>
  
              <p className="mt-6 text-lg font-bold text-[#FBBF24]">
                support@aureoniq.com
              </p>
            </div>
  
            <div className="rounded-3xl bg-[#111827] p-8">
              <p className="mb-3 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
                PARTNERSHIPS
              </p>
  
              <h2 className="text-2xl font-black">
                Business & Partnerships
              </h2>
  
              <p className="mt-4 text-slate-300">
                Interested in AureonIQ for career coaching, universities,
                workforce development, or future enterprise solutions?
              </p>
  
              <p className="mt-6 text-lg font-bold text-[#FBBF24]">
                support@aureoniq.com
              </p>
            </div>
          </div>
  
          <div className="mt-8 rounded-3xl bg-[#111827] p-8">
            <p className="mb-3 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
              RESPONSE TIMES
            </p>
  
            <h2 className="text-2xl font-black">
              We'll get back to you.
            </h2>
  
            <p className="mt-4 leading-8 text-slate-300">
              We aim to respond to support and partnership inquiries within
              1–2 business days.
            </p>
          </div>
        </section>
      </main>
    );
  }