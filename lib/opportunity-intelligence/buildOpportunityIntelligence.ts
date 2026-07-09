import {
  BuildOpportunityIntelligenceInput,
  OpportunityIntelligence,
} from "./opportunityIntelligence";

export function buildMockOpportunityIntelligence(
  input: BuildOpportunityIntelligenceInput
): OpportunityIntelligence {
  const { profile, opportunity } = input;

  const clientName = profile.client.name || "this person";
  const currentRole = profile.client.currentRole || "Current role";
  const roleTitle = opportunity.title || "Opportunity under review";

  const transferableSkills = profile.evidence.transferableSkills || [];
  const topStrengths = profile.aiq.topStrengths || [];
  const skills = profile.evidence.skills || [];

  const strongestSignals = [
    ...transferableSkills,
    ...topStrengths,
    ...skills,
  ].slice(0, 5);

  return {
    profileVersion: "v1",

    opportunity,

    summary: `${roleTitle} appears worth exploring for ${clientName} because it may connect with demonstrated strengths, transferable experience, and the broader career direction identified in their Career Intelligence Profile.`,

    alignment: {
      label: strongestSignals.length >= 3 ? "Worth Exploring" : "Limited Evidence",
      explanation:
        strongestSignals.length >= 3
          ? "Several existing strengths appear relevant to this opportunity."
          : "More role detail or career evidence would help clarify the strongest fit signals.",
    },

    whyItFits:
      strongestSignals.length > 0
        ? strongestSignals.map((signal) => `${signal} may support this role.`)
        : [
            "The opportunity may connect with the client's broader career experience.",
            "More detail would help clarify the strongest alignment points.",
          ],

    growthStretch: [
      "Clarify which responsibilities would be new or unfamiliar.",
      "Identify any skills that may need development before pursuing this role.",
      "Explore whether the day-to-day work fits the person's values and goals.",
    ],

    careerBridge: {
      currentRole,
      targetRole: roleTitle,
      bridgeSummary:
        "AureonIQ can map a practical bridge from the person's current experience toward this opportunity by identifying transferable strengths, intermediate steps, and skills to build.",
      steps: [
        {
          title: currentRole,
          rationale:
            "Start with the career evidence already present in the profile.",
          strengthsToCarry: strongestSignals.slice(0, 3),
          skillsToBuild: [],
        },
        {
          title: "Bridge Role or Skill-Building Step",
          rationale:
            "Use a transition step to make the target opportunity feel more believable and actionable.",
          strengthsToCarry: strongestSignals.slice(0, 2),
          skillsToBuild: ["Role-specific tools", "Industry language"],
        },
        {
          title: roleTitle,
          rationale:
            "Evaluate whether the target role fits the person's goals, values, and circumstances.",
          strengthsToCarry: strongestSignals.slice(0, 3),
          skillsToBuild: ["Advanced role-specific experience"],
        },
      ],
    },

    conversationStarters: [
      "What part of this role feels most energizing?",
      "Which responsibilities already feel familiar?",
      "What part of this opportunity feels uncertain or worth exploring further?",
    ],

    decisionPerspective:
      "This analysis is designed to support career decision-making, not replace professional judgment. The strongest next step is to explore whether the opportunity fits the person's goals, values, and circumstances.",

    metadata: {
      generatedAt: new Date().toISOString(),
      source: "aureoniq",
    },
  };
}
