import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { PLANS } from "@/config/plans";

export async function POST(request: Request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Missing Supabase server environment variables." },
        { status: 500 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription", "customer"],
    });

    const supabaseUserId =
      checkoutSession.client_reference_id ||
      checkoutSession.metadata?.supabase_user_id;

    if (!supabaseUserId) {
      return NextResponse.json(
        { error: "Missing Supabase user ID from Stripe session." },
        { status: 400 }
      );
    }

    const subscription: any = checkoutSession.subscription;
    const customer: any = checkoutSession.customer;
    const plan = PLANS.coach_starter;

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

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

      const { data: organization, error: organizationError } =
        await supabaseAdmin
          .from("organizations")
          .insert({
            name: businessName,
            type: "coach",
          })
          .select("id")
          .single();

      if (organizationError) {
        throw organizationError;
      }

      organizationId = organization.id;

      const { error: memberError } = await supabaseAdmin
        .from("organization_members")
        .insert({
          organization_id: organizationId,
          user_id: supabaseUserId,
          role: "owner",
          status: "active",
        });

      if (memberError) {
        throw memberError;
      }
    }

    const trialEnd = subscription?.trial_end
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null;

    const currentPeriodEnd = subscription?.current_period_end
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : null;

    const stripeCustomerId =
      typeof customer === "string" ? customer : customer?.id;

    const stripeSubscriptionId =
      typeof subscription === "string" ? subscription : subscription?.id;

    const { error: planError } = await supabaseAdmin
      .from("organization_plans")
      .upsert(
        {
          organization_id: organizationId,
          plan_type: plan.key,
          managed_client_limit: plan.activeClientLimit,
          sponsored_tier: "aiq_pro",
          status: "active",
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubscriptionId,
          trial_ends_at: trialEnd,
          current_period_ends_at: currentPeriodEnd,
        },
        {
          onConflict: "organization_id",
        }
      );

    if (planError) {
      throw planError;
    }

    await supabaseAdmin.from("user_roles").upsert(
      {
        user_id: supabaseUserId,
        role: "coach",
      },
      {
        onConflict: "user_id",
      }
    );

    return NextResponse.json({
      success: true,
      organizationId,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unable to provision coach workspace." },
      { status: 500 }
    );
  }
}