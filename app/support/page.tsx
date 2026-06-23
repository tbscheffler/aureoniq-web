export default function SupportPage() {
    return (
      <main className="min-h-screen bg-[#020617] text-white">
        <section className="mx-auto max-w-3xl px-6 py-20">
          <a href="/" className="text-sm font-bold text-[#FBBF24]">
            ← Back to AureonIQ
          </a>
  
          <h1 className="mt-8 text-4xl font-black">
            AureonIQ Support
          </h1>
  
          <p className="mt-4 text-slate-400">
            We're here to help.
          </p>
  
          <div className="mt-10 space-y-8">
            <div className="rounded-2xl bg-[#111827] p-6">
              <h2 className="text-2xl font-bold">
                Contact Support
              </h2>
  
              <p className="mt-4 text-slate-300">
                For account issues, billing questions, feature requests,
                subscription support, or technical assistance, contact:
              </p>
  
              <p className="mt-4 text-lg font-bold text-[#FBBF24]">
                support@aureoniq.com
              </p>
            </div>
  
            <div className="rounded-2xl bg-[#111827] p-6">
              <h2 className="text-2xl font-bold">
                Common Topics
              </h2>
  
              <ul className="mt-4 space-y-3 text-slate-300">
                <li>• Account access and login issues</li>
                <li>• Resume upload assistance</li>
                <li>• Subscription management</li>
                <li>• Discovery Pro questions</li>
                <li>• AIQ Pro questions</li>
                <li>• Billing and purchase restoration</li>
              </ul>
            </div>
  
            <div className="rounded-2xl bg-[#111827] p-6">
              <h2 className="text-2xl font-bold">
                Response Time
              </h2>
  
              <p className="mt-4 text-slate-300">
                We aim to respond to support requests within 1–2 business days.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }