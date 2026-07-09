import { CareerIntelligenceProfile } from "@/lib/career-intelligence/careerIntelligenceProfile";

export type OpportunityInput = {
  title?: string;
  company?: string;
  description?: string;
  url?: string;
  location?: string;
  salary?: string;
};

export type OpportunityAlignmentLabel =
  | "Strong Alignment"
  | "Worth Exploring"
  | "Significant Stretch"
  | "Limited Evidence";

export type CareerBridgeStep = {
  title: string;
  rationale: string;
  strengthsToCarry?: string[];
  skillsToBuild?: string[];
};

export type CareerBridge = {
  currentRole?: string;
  targetRole?: string;
  bridgeSummary: string;
  steps: CareerBridgeStep[];
};

export type OpportunityIntelligence = {
  profileVersion: "v1";

  opportunity: OpportunityInput;

  summary: string;

  alignment: {
    label: OpportunityAlignmentLabel;
    explanation: string;
  };

  whyItFits: string[];

  growthStretch: string[];

  careerBridge: CareerBridge;

  conversationStarters: string[];

  decisionPerspective: string;

  metadata: {
    generatedAt: string;
    source: "aureoniq";
  };
};

export type BuildOpportunityIntelligenceInput = {
  profile: CareerIntelligenceProfile;
  opportunity: OpportunityInput;
};
