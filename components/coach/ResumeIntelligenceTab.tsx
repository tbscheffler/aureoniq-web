import type { CareerIntelligenceProfile } from "@/lib/career-intelligence/careerIntelligenceProfile";

type ResumeIntelligenceTabProps = {
  clientName: string;
  resumeProfile?: any;
  careerProfile: CareerIntelligenceProfile;
  careerReport?: any;
  aiqReport?: any;
  setActiveSection: (section: string) => void;
};

function compactList(values: any[] | undefined, fallback: string[] = []) {
  const items = (values || [])
    .map((value) => {
      if (!value) return "";
      if (typeof value === "string") return value;
      return value.title || value.name || value.skill || value.label || "";
    })
    .filter(Boolean);

  return items.length > 0 ? items : fallback;
}

function getCurrentRole(profile: CareerIntelligenceProfile, resumeProfile?: any) {
  return (
    profile.client.currentRole ||
    resumeProfile?.current_title ||
    resumeProfile?.currentTitle ||
    resumeProfile?.current_role ||
    resumeProfile?.currentRole ||
    "Current role not identified"
  );
}

function getTargetDirection(profile: CareerIntelligenceProfile) {
  const topMatch = profile.discovery.careerMatches?.[0];
  const hidden = profile.discovery.hiddenOpportunities?.[0];
  const unexpected = profile.discovery.unexpectedCareer;

  return (
    topMatch?.title ||
    topMatch?.career ||
    hidden?.title ||
    hidden?.career ||
    unexpected?.title ||
    unexpected?.career ||
    "the client’s strongest career direction"
  );
}

function getResumeScore(profile: CareerIntelligenceProfile, resumeProfile?: any) {
  let score = 0;

  if (resumeProfile) score += 25;
  if (profile.story.executiveSummary) score += 20;
  if ((profile.evidence.transferableSkills || []).length >= 3) score += 20;
  if ((profile.evidence.skills || []).length >= 5) score += 15;
  if ((profile.discovery.careerMatches || []).length > 0) score += 10;
  if ((profile.aiq.topStrengths || []).length > 0) score += 10;

  return Math.min(score, 100);
}

function strengthLabel(score: number) {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Promising";
  if (score >= 40) return "Developing";
  return "Needs evidence";
}

export default function ResumeIntelligenceTab({
  clientName,
  resumeProfile,
  careerProfile,
  setActiveSection,
}: ResumeIntelligenceTabProps) {
  const firstName = clientName.split(" ")[0] || "this client";
  const hasResume = Boolean(resumeProfile);
  const score = getResumeScore(careerProfile, resumeProfile);
  const currentRole = getCurrentRole(careerProfile, resumeProfile);
  const targetDirection = getTargetDirection(careerProfile);

  const transferableSkills = compactList(
    careerProfile.evidence.transferableSkills,
    careerProfile.aiq.topStrengths?.slice(0, 5) || []
  );

  const visibleSkills = compactList(careerProfile.evidence.skills, [
    "Leadership",
    "Communication",
    "Organization",
    "Problem solving",
  ]);

  const careerMatches = compactList(careerProfile.discovery.careerMatches, [
    targetDirection,
  ]);

  const gaps = compactList(careerProfile.discovery.skillGaps, [
    "Add measurable outcomes where possible.",
    "Strengthen keywords for the target direction.",
    "Make transferable leadership evidence easier to find.",
  ]);

  const coachSuggestions = [
    `Clarify how ${firstName}'s current experience translates toward ${targetDirection}.`,
    "Move strongest transferable skills closer to the top of the resume.",
    "Rewrite responsibility-heavy bullets into accomplishment-focused statements.",
    "Add evidence that supports the next career direction, not only the current job title.",
  ];

  if (!hasResume) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-[#111827] shadow-sm">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">
          RESUME INTELLIGENCE
        </p>
        <h2 className="mt-3 text-3xl font-black">Resume review starts here</h2>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600">
          Upload or connect a resume to help AureonIQ identify story clarity,
          transferable skills, career positioning, ATS signals, and practical
          revision priorities for this client.
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <PlaceholderCard
            title="Story clarity"
            description="How clearly the resume explains the client’s direction."
          />
          <PlaceholderCard
            title="Transferable skills"
            description="Where prior experience supports future opportunities."
          />
          <PlaceholderCard
            title="Coach suggestions"
            description="Practical changes a coach can review with the client."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white text-[#111827] shadow-sm">
        <div className="grid gap-0 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="p-8 md:p-10">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">
              RESUME INTELLIGENCE
            </p>
            <h2 className="mt-3 max-w-4xl text-4xl font-black leading-tight">
              Does the resume support {firstName}&apos;s next career direction?
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Review how the resume communicates career story, transferable
              strengths, accomplishment evidence, and positioning for {targetDirection}.
              This is coach-supportive guidance, not an automatic rewrite.
            </p>
          </div>

          <div className="border-t border-slate-100 bg-[#F8FAFC] p-8 xl:border-l xl:border-t-0">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              Resume readiness
            </p>
            <div className="mt-4 rounded-[1.5rem] border border-[#E8D49B] bg-[#FFF8E7] p-5">
              <p className="text-4xl font-black text-[#B8872A]">{score}</p>
              <p className="mt-1 text-sm font-bold text-[#7C4A03]">
                {strengthLabel(score)} positioning signal
              </p>
            </div>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-600">
              Current resume position: <span className="font-black text-slate-900">{currentRole}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-7 xl:grid-cols-4">
        <SignalCard
          eyebrow="Story"
          title={careerProfile.story.executiveSummary ? "Narrative visible" : "Narrative developing"}
          description="The resume should quickly explain who this client is becoming, not only what they have done."
        />
        <SignalCard
          eyebrow="Skills"
          title={`${transferableSkills.length} signals`}
          description="Transferable skills are the bridge between past work and future opportunities."
        />
        <SignalCard
          eyebrow="Positioning"
          title={targetDirection}
          description="The strongest target direction currently visible from Career Intelligence."
        />
        <SignalCard
          eyebrow="ATS"
          title="Keyword alignment"
          description="Review whether the resume language matches the roles being explored."
        />
      </section>

      <section className="grid gap-7 xl:grid-cols-[1fr_1fr]">
        <IntelligencePanel
          eyebrow="TRANSFERABLE SKILLS"
          title="What the resume should make easier to see"
          description="These strengths should be visible in the summary, experience bullets, and skills section."
          items={transferableSkills.slice(0, 6)}
          tone="green"
        />

        <IntelligencePanel
          eyebrow="TARGET POSITIONING"
          title="Directions the resume may need to support"
          description="Use these as positioning signals, not fixed instructions."
          items={careerMatches.slice(0, 6)}
          tone="purple"
        />
      </section>

      <section className="grid gap-7 xl:grid-cols-[0.95fr_1.05fr]">
        <IntelligencePanel
          eyebrow="REVISION PRIORITIES"
          title="What may need strengthening"
          description="These are practical areas for a coach to review before the client applies."
          items={gaps.slice(0, 5)}
          tone="gold"
        />

        <IntelligencePanel
          eyebrow="COACH SUGGESTIONS"
          title="Conversation-ready resume guidance"
          description="Use these as review prompts while preserving the coach's judgment."
          items={coachSuggestions}
          tone="slate"
        />
      </section>

      <section className="rounded-[2rem] border border-slate-200 bg-white p-7 text-[#111827] shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">
              KEYWORD & EVIDENCE CHECK
            </p>
            <h3 className="mt-3 text-2xl font-black">Evidence to make visible</h3>
            <p className="mt-2 max-w-3xl leading-7 text-slate-600">
              A strong resume should help employers quickly connect the client’s
              evidence to the role they want next.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveSection("evaluate")}
            className="rounded-2xl bg-[#4C1D95] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#3B147B]"
          >
            Analyze a role
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {visibleSkills.slice(0, 8).map((skill) => (
            <div
              key={skill}
              className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4"
            >
              <p className="text-sm font-black leading-6 text-slate-800">{skill}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PlaceholderCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <p className="font-black text-slate-950">{title}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function SignalCard({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 text-[#111827] shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
        {eyebrow}
      </p>
      <p className="mt-3 text-xl font-black leading-tight text-slate-950">
        {title}
      </p>
      <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function IntelligencePanel({
  eyebrow,
  title,
  description,
  items,
  tone = "slate",
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
  tone?: "slate" | "green" | "gold" | "purple";
}) {
  const toneClass = {
    slate: "border-slate-100 bg-slate-50 text-slate-700",
    green: "border-emerald-100 bg-emerald-50 text-emerald-900",
    gold: "border-[#E8D49B] bg-[#FFF8E7] text-[#7C4A03]",
    purple: "border-violet-100 bg-[#F8F5FF] text-[#4C1D95]",
  }[tone];

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-7 text-[#111827] shadow-sm">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#B8872A]">
        {eyebrow}
      </p>
      <h3 className="mt-3 text-2xl font-black">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
        {description}
      </p>
      <div className="mt-6 space-y-3">
        {(items.length > 0
          ? items
          : ["More resume evidence is needed before AureonIQ can identify this clearly."]
        ).map((item) => (
          <div
            key={item}
            className={["rounded-2xl border px-5 py-4", toneClass].join(" ")}
          >
            <p className="text-sm font-bold leading-6">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
