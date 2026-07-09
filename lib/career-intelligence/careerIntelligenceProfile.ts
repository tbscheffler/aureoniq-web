export type CareerIntelligenceProfile = {
  profileVersion: "v1";

  client: {
    id?: string;
    name?: string;
    currentRole?: string;
    careerStage?: string;
    location?: string;
    salaryGoal?: string | number;
  };

  story: {
    executiveSummary?: string;
    careerIdentity?: string;
    careerGoals?: string[];
    motivations?: string[];
  };

  evidence: {
    workHistory?: string[];
    education?: string[];
    certifications?: string[];
    skills?: string[];
    transferableSkills?: string[];
    leadershipIndicators?: string[];
    communicationIndicators?: string[];
  };

  discovery: {
    careerOpportunityScore?: number;
    careerMatches?: any[];
    hiddenOpportunities?: any[];
    unexpectedCareer?: any;
    careerTranslation?: string;
    marketValue?: string;
    skillGaps?: string[];
    actionPlan?: string[];
  };

  aiq: {
    score?: number;
    opportunityIndex?: number;
    careerValue?: string;
    transferability?: string;
    growthPotential?: string;
    hiddenPotential?: string;
    topStrengths?: string[];
    growthAccelerators?: string[];
    futureScenarios?: any[];
    summary?: string;
  };

  regional: {
    regionName?: string;
    outlook?: string;
    localDemand?: string;
    nearbyMarkets?: string[];
    remoteContext?: string;
    relocationGuidance?: string;
    salaryContext?: string;
  };

  metadata: {
    generatedAt: string;
    source: "aureoniq";
  };
};

export function createEmptyCareerIntelligenceProfile(): CareerIntelligenceProfile {
  return {
    profileVersion: "v1",
    client: {},
    story: {},
    evidence: {},
    discovery: {},
    aiq: {},
    regional: {},
    metadata: {
      generatedAt: new Date().toISOString(),
      source: "aureoniq",
    },
  };
}
