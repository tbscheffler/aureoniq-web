export default function FAQSection() {
    const faqs = [
      {
        question: "How is AureonIQ different from LinkedIn?",
        answer:
          "LinkedIn focuses on professional networking, job discovery, and recruiting. AureonIQ focuses on helping you understand the full value of your experience by identifying hidden opportunities, transferable skills, career mobility, and future growth paths.",
      },
      {
        question: "How is AureonIQ different from a resume builder?",
        answer:
          "Resume builders help format your resume. AureonIQ helps you understand the value of your experience, uncover hidden career paths, and identify future growth opportunities.",
      },
      {
        question: "Do I need to be actively job searching?",
        answer:
          "No. Many users use AureonIQ to better understand their market value, career trajectory, growth opportunities, and long-term career options.",
      },
      {
        question: "Can AureonIQ help me change industries?",
        answer:
          "Yes. One of AureonIQ's strengths is identifying transferable skills and adjacent career paths that may exist outside your current industry.",
      },
      {
        question: "How does AureonIQ protect my data?",
        answer:
          "Your information is securely stored and processed using modern cloud infrastructure. AureonIQ is designed with privacy and security in mind.",
      },
      {
        question: "What is the AIQ Report?",
        answer:
          "The AIQ Report provides deeper career intelligence, including career mobility, growth potential, future career forecasting, alternative career scenarios, and growth accelerators.",
      },
    ];
  
    return (
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center">
            <p className="mb-3 text-sm font-black tracking-[0.25em] text-[#FBBF24]">
              FAQ
            </p>
  
            <h2 className="text-4xl font-black text-white">
              Frequently Asked Questions
            </h2>
          </div>
  
          <div className="mt-12 space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-3xl border border-slate-800 bg-[#111827] p-6"
              >
                <h3 className="text-lg font-bold text-white">
                  {faq.question}
                </h3>
  
                <p className="mt-3 text-slate-300 leading-7">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }