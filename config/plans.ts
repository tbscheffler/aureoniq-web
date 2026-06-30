export type PlanKey =
  | "coach_starter"
  | "coach_professional"
  | "coach_growth"
  | "aiq_pro";

export interface PlanDefinition {
  key: PlanKey;

  displayName: string;

  audience: "coach" | "professional";

  stripePriceId?: string;

  monthlyPrice: number;

  trialDays: number;

  activeClientLimit?: number;

  features: string[];
}

export const PLANS: Record<PlanKey, PlanDefinition> = {
  coach_starter: {
    key: "coach_starter",

    displayName: "Coach Starter",

    audience: "coach",

    stripePriceId:
      process.env.STRIPE_COACH_STARTER_PRICE_ID,

    monthlyPrice: 49,

    trialDays: 14,

    activeClientLimit: 4,

    features: [
      "Coach Workspace",
      "Resume Review",
      "Career Assessment",
      "Future Potential",
      "Meetings",
      "Action Items",
      "Coach Notes",
    ],
  },

  coach_professional: {
    key: "coach_professional",

    displayName: "Coach Professional",

    audience: "coach",

    monthlyPrice: 99,

    trialDays: 14,

    activeClientLimit: 10,

    features: [],
  },

  coach_growth: {
    key: "coach_growth",

    audience: "coach",

    displayName: "Coach Growth",

    monthlyPrice: 199,

    trialDays: 14,

    activeClientLimit: 25,

    features: [],
  },

  aiq_pro: {
    key: "aiq_pro",

    audience: "professional",

    displayName: "AIQ Pro",

    monthlyPrice: 14.99,

    trialDays: 0,

    features: [],
  },
};