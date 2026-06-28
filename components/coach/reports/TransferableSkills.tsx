type Props = {
    report: any;
  };
  
  export default function TransferableSkills({ report }: Props) {
    const skills =
      report.transferableSkills ||
      report.keySkills ||
      report.skills ||
      [];
  
    return (
      <div className="mt-8 rounded-2xl border border-slate-700 bg-[#020617] p-8">
        <p className="text-sm font-black tracking-[0.2em] text-slate-500">
          TRANSFERABLE SKILLS
        </p>
  
        {skills.length === 0 ? (
          <p className="mt-6 text-slate-400">
            No transferable skills available.
          </p>
        ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
            {skills.map((skill: any, index: number) => {
                const skillName =
                typeof skill === "string"
                    ? skill
                    : skill.skill || skill.name || skill.title || "Skill";

                const whyItMatters =
                typeof skill === "string"
                    ? null
                    : skill.whyItMatters || skill.description || skill.reason || null;

                return (
                <div
                    key={index}
                    className="rounded-2xl border border-slate-700 bg-[#111827] p-5"
                >
                    <p className="font-black text-white">{skillName}</p>

                    {whyItMatters ? (
                    <p className="mt-3 text-sm leading-6 text-slate-400">
                        {whyItMatters}
                    </p>
                    ) : null}
                </div>
                );
            })}
            </div>
        )}
      </div>
    );
  }