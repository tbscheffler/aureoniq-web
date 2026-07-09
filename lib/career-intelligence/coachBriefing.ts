import { CareerIntelligenceProfile } from "./careerIntelligenceProfile";

export type CoachBriefing = {
  headline: string;
  briefing: string;
  opportunitySummary: string;
  emergingPattern: string;
  coachingPerspective: string;
  potentialFocusAreas: string[];
  celebrateProgress: string[];
  conversationSparks: string[];
  generatedAt: string;
};

function getFirstString(...values: Array<unknown>): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function getFirstListItemText(items?: any[]): string | undefined {
  if (!items || items.length === 0) return undefined;

  const first = items[0];

  if (typeof first === "string") return first;

  return getFirstString(
    first?.title,
    first?.career,
    first?.role,
    first?.name,
    first?.label
  );
}

function getClientFirstName(profile: CareerIntelligenceProfile) {
  const name = profile.client.name || "The client";
  return name.split(" ")[0] || "The client";
}

export function createMockCoachBriefing(
  profile: CareerIntelligenceProfile
): CoachBriefing {
  const clientName = profile.client.name || "The client";
  const firstName = getClientFirstName(profile);

  const hiddenOpportunity =
    getFirstListItemText(profile.discovery.hiddenOpportunities) ||
    getFirstListItemText(profile.discovery.careerMatches) ||
    "a new career direction";

  const topStrength =
    profile.aiq.topStrengths?.[0] ||
    profile.evidence.transferableSkills?.[0] ||
    profile.evidence.skills?.[0] ||
    "transferable strengths";

  const hasStrongOpportunityIndex =
    typeof profile.aiq.opportunityIndex === "number" &&
    profile.aiq.opportunityIndex >= 75;

  const hasHiddenOpportunities =
    Boolean(profile.discovery.hiddenOpportunities?.length);

  const headline = hasStrongOpportunityIndex
    ? `${firstName}'s career readiness may be stronger than their confidence suggests.`
    : hasHiddenOpportunities
      ? `${firstName}'s professional identity may be narrower than their experience suggests.`
      : `${firstName}'s career strengths appear broader than their current role suggests.`;

  const briefing = `${clientName}'s career evidence highlights ${topStrength.toLowerCase()} along with experience that may translate beyond previous job titles. ${hiddenOpportunity} appears to be one possible direction, but the larger coaching opportunity may be helping ${firstName} connect existing strengths to a future-facing career narrative. These observations are intended to support preparation while leaving coaching decisions to your professional judgment.`;

  const opportunitySummary = `${hiddenOpportunity} may be worth exploring as one possible direction, based on demonstrated transferable strengths rather than job-title matching alone.`;

  const emergingPattern = `${firstName} may be undervaluing experience that was built in one setting but could translate into a broader professional identity.`;

  const coachingPerspective = `Career Intelligence highlights possibilities. Your understanding of the client's goals, values, and circumstances is essential when deciding which conversations are most meaningful.`;

  const potentialFocusAreas = [
    "Translate previous accomplishments into broader career language.",
    `Explore whether ${hiddenOpportunity} feels aligned with the client's goals and circumstances.`,
    "Identify the work that feels energizing rather than simply familiar.",
  ];

  const celebrateProgress = [
    `${firstName} has enough career evidence available to support a meaningful coaching conversation.`,
    "Transferable strengths are visible across the current Career Intelligence Profile.",
    hasStrongOpportunityIndex
      ? "Career readiness signals appear strong enough to reinforce confidence."
      : "Career exploration has created a clearer foundation for next-step discussion.",
  ];

  const conversationSparks = [
    "When have you felt most effective in your work?",
    "Which accomplishments do you rarely give yourself credit for?",
    "What kind of work feels both exciting and believable for your next chapter?",
  ];

  return {
    headline,
    briefing,
    opportunitySummary,
    emergingPattern,
    coachingPerspective,
    potentialFocusAreas,
    celebrateProgress,
    conversationSparks,
    generatedAt: new Date().toISOString(),
  };
}
