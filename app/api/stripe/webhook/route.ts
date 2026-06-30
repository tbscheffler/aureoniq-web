import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { PLANS } from "@/config/plans";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing Stripe signature." },
        { status: 400 }
      );
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return NextResponse.json(
        { error: "Missing STRIPE_WEBHOOK_SECRET." },
        { status: 500 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
    }

    if (event.type === "customer.subscription.updated") {
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
    }

    if (event.type === "customer.subscription.deleted") {
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("STRIPE WEBHOOK ERROR:", error.message);

    return NextResponse.json(
      { error: error.message || "Webhook error." },
      { status: 400 }
    );
  }
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase server environment variables.");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabaseUserId =
    session.client_reference_id || session.metadata?.supabase_user_id;

  if (!supabaseUserId) {
    throw new Error("Missing Supabase user ID from checkout session.");
  }

  const supabaseAdmin = getSupabaseAdmin();
  const planKey =
  (session.metadata?.plan_key as keyof typeof PLANS) || "coach_starter";

  const plan = PLANS[planKey];

  if (!plan || plan.audience !== "coach") {
    throw new Error(`Invalid coach plan key: ${planKey}`);
  }

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  if (!subscriptionId || !customerId) {
    throw new Error("Missing Stripe subscription or customer ID.");
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const { data: existingMember } = await supabaseAdmin
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", supabaseUserId)
    .eq("status", "active")
    .maybeSingle();

  let organizationId = existingMember?.organization_id;

  if (!organizationId) {
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(
      supabaseUserId
    );

    const businessName =
      userData.user?.user_metadata?.business_name || "Coach Workspace";

    const { data: organization, error: organizationError } = await supabaseAdmin
      .from("organizations")
      .insert({
        name: businessName,
        type: "coach",
      })
      .select("id")
      .single();

    if (organizationError) throw organizationError;

    organizationId = organization.id;

    const { error: memberError } = await supabaseAdmin
      .from("organization_members")
      .insert({
        organization_id: organizationId,
        user_id: supabaseUserId,
        role: "owner",
        status: "active",
      });

    if (memberError) throw memberError;
  }

  await upsertOrganizationPlan({
    organizationId,
    planType: plan.key,
    managedClientLimit: plan.activeClientLimit ?? 4,
    status: subscription.status,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    trialEndsAt: subscription.trial_end
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null,
    currentPeriodEndsAt: (subscription as any).current_period_end
      ? new Date((subscription as any).current_period_end * 1000).toISOString()
      : null,
  });

  await supabaseAdmin.from("user_roles").upsert(
    {
      user_id: supabaseUserId,
      role: "coach",
    },
    {
      onConflict: "user_id",
    }
  );
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  await updatePlanFromSubscription(subscription);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await updatePlanFromSubscription(subscription, "canceled");
}

async function updatePlanFromSubscription(
  subscription: Stripe.Subscription,
  forcedStatus?: string
) {
  const supabaseAdmin = getSupabaseAdmin();

  const { data: plan, error } = await supabaseAdmin
    .from("organization_plans")
    .select("organization_id")
    .eq("stripe_subscription_id", subscription.id)
    .maybeSingle();

  if (error) throw error;

  if (!plan) {
    console.log("No organization plan found for subscription:", subscription.id);
    return;
  }

  const status = forcedStatus || subscription.status;

  const { error: updateError } = await supabaseAdmin
    .from("organization_plans")
    .update({
      status,
      trial_ends_at: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      current_period_ends_at: (subscription as any).current_period_end
        ? new Date((subscription as any).current_period_end * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscription.id);

  if (updateError) throw updateError;
}

async function upsertOrganizationPlan({
  organizationId,
  planType,
  managedClientLimit,
  status,
  stripeCustomerId,
  stripeSubscriptionId,
  trialEndsAt,
  currentPeriodEndsAt,
}: {
  organizationId: string;
  planType: string;
  managedClientLimit: number;
  status: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  trialEndsAt: string | null;
  currentPeriodEndsAt: string | null;
}) {
  const supabaseAdmin = getSupabaseAdmin();

  const { error } = await supabaseAdmin.from("organization_plans").upsert(
    {
      organization_id: organizationId,
      plan_type: planType,
      managed_client_limit: managedClientLimit,
      sponsored_tier: "aiq_pro",
      status,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      trial_ends_at: trialEndsAt,
      current_period_ends_at: currentPeriodEndsAt,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "organization_id",
    }
  );

  if (error) throw error;
}