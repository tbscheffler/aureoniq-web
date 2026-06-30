import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { PLANS } from "@/config/plans";

export async function POST(request: Request) {
  try {
    const { planKey = "coach_starter" } = await request.json().catch(() => ({
      planKey: "coach_starter",
    }));

    if (
      !["coach_starter", "coach_professional", "coach_growth"].includes(planKey)
    ) {
      return NextResponse.json(
        { error: "Invalid coach plan selected." },
        { status: 400 }
      );
    }

    const plan = PLANS[planKey as keyof typeof PLANS];

    const priceId = plan.stripePriceId;

    if (!priceId) {
      return NextResponse.json(
        { error: `Missing Stripe Price ID for ${plan.displayName}.` },
        { status: 500 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Missing Supabase environment variables." },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Missing authorization." },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Unable to verify signed-in user." },
        { status: 401 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email || undefined,
      client_reference_id: user.id,
      metadata: {
        supabase_user_id: user.id,
        plan_key: plan.key,
      },
      subscription_data: {
        trial_period_days: plan.trialDays,
        metadata: {
          supabase_user_id: user.id,
          plan_key: plan.key,
        },
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/coach?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/start-trial?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unable to create checkout session." },
      { status: 500 }
    );
  }
}