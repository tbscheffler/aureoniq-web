import { supabase } from "@/lib/supabaseClient";

export interface CoachEntitlement {
  hasAccess: boolean;
  reason:
    | "active_subscription"
    | "active_trial"
    | "expired_trial"
    | "no_plan";

  planType?: string;
  trialEndsAt?: string | null;
}

export async function getCoachEntitlement(): Promise<CoachEntitlement> {
const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  return {
    hasAccess: false,
    reason: "no_plan",
  };
}

const { data: memberships, error: membershipError } = await supabase
  .from("organization_members")
  .select("organization_id")
  .eq("user_id", user.id)
  .eq("status", "active");

const membership = memberships?.[0];

  if (membershipError || !membership) {
    return {
      hasAccess: false,
      reason: "no_plan",
    };
  }

  const { data: plan, error: planError } = await supabase
    .from("organization_plans")
    .select(
      `
      plan_type,
      status,
      trial_ends_at
    `
    )
    .eq("organization_id", membership.organization_id)
    .maybeSingle();

  if (planError || !plan) {
    return {
      hasAccess: false,
      reason: "no_plan",
    };
  }

  const now = new Date();

  if (plan.trial_ends_at) {
    const trialEnds = new Date(plan.trial_ends_at);

    if (trialEnds > now) {
      return {
        hasAccess: true,
        reason: "active_trial",
        planType: plan.plan_type,
        trialEndsAt: plan.trial_ends_at,
      };
    }
  }

  if (plan.status === "active") {
    return {
      hasAccess: true,
      reason: "active_subscription",
      planType: plan.plan_type,
      trialEndsAt: plan.trial_ends_at,
    };
  }

  return {
    hasAccess: false,
    reason: "expired_trial",
    planType: plan.plan_type,
    trialEndsAt: plan.trial_ends_at,
  };
}