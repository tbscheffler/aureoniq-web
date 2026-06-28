// @ts-nocheck

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: any, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return jsonResponse({ error: "Missing authorization" }, 401);
    }

    const { organization_id, client_email } = await req.json();

    if (!organization_id || !client_email) {
      return jsonResponse(
        { error: "Missing organization_id or client_email" },
        400
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const siteUrl = Deno.env.get("PUBLIC_SITE_URL") || "http://localhost:3000";

    if (!supabaseUrl || !serviceRoleKey || !resendApiKey) {
      return jsonResponse({ error: "Missing server secrets" }, 500);
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const token = authHeader.replace("Bearer ", "");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const { data: membership, error: membershipError } = await supabase
      .from("organization_members")
      .select("organization_id, role, status")
      .eq("organization_id", organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (membershipError || !membership) {
      return jsonResponse({ error: "Not an organization member" }, 403);
    }

    if (!["owner", "admin", "coach"].includes(membership.role)) {
      return jsonResponse({ error: "Not allowed" }, 403);
    }

    const { data: activePlan, error: planError } = await supabase
      .from("organization_plans")
      .select("managed_client_limit")
      .eq("organization_id", organization_id)
      .eq("status", "active")
      .maybeSingle();

    if (planError) {
      return jsonResponse({ error: planError.message }, 400);
    }

    const clientLimit = Number(activePlan?.managed_client_limit ?? 4);

    const { count: activeClientCount, error: clientCountError } = await supabase
      .from("organization_clients")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organization_id)
      .eq("status", "active");

    if (clientCountError) {
      return jsonResponse({ error: clientCountError.message }, 400);
    }

    if ((activeClientCount ?? 0) >= clientLimit) {
      return jsonResponse(
        {
          error: `This organization has reached its active client limit of ${clientLimit}.`,
        },
        403
      );
    }

    const { data: org } = await supabase
      .from("organizations")
      .select("name")
      .eq("id", organization_id)
      .single();

    const { data: invitation, error: inviteError } = await supabase
      .from("organization_invitations")
      .insert({
        organization_id,
        invited_by: user.id,
        client_email: client_email.trim().toLowerCase(),
        status: "pending",
      })
      .select("id, token")
      .single();

    if (inviteError) {
      return jsonResponse({ error: inviteError.message }, 400);
    }

    const acceptUrl = `${siteUrl}/accept-invite?token=${invitation.token}`;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AureonIQ <support@aureoniq.com>",
        to: [client_email],
        subject: `${org?.name || "Your coach"} invited you to AureonIQ`,
        html: `
          <h2>You have been invited to connect with your career coach</h2>
          <p>${org?.name || "Your coach"} invited you to collaborate inside AureonIQ.</p>
          <p>If you accept, your coach can view your Career Discovery Reports and AIQ Reports.</p>
          <p>Your password, billing, and account settings remain private.</p>
          <p>
            <a href="${acceptUrl}" style="background:#FBBF24;color:#020617;padding:12px 18px;text-decoration:none;border-radius:10px;font-weight:bold;">
              Accept Invitation
            </a>
          </p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const resendText = await emailResponse.text();
      return jsonResponse(
        {
          error: "Invitation created, but email failed.",
          detail: resendText,
        },
        500
      );
    }

    await supabase.from("access_audit_log").insert({
      actor_user_id: user.id,
      organization_id,
      action: "organization_invitation_sent",
      metadata: {
        invitation_id: invitation.id,
        client_email: client_email.trim().toLowerCase(),
      },
    });

    const normalizedClientEmail = client_email.trim().toLowerCase();

    await supabase.from("organization_notifications").insert({
      organization_id,
      actor_user_id: user.id,
      type: "client_invitation_sent",
      title: "Client invitation sent",
      message: `An invitation was sent to ${normalizedClientEmail}.`,
      metadata: {
        invitation_id: invitation.id,
        client_email: normalizedClientEmail,
      },
    });

    return jsonResponse({ success: true });
  } catch (error) {
    return jsonResponse(
      { error: error?.message || "Server error" },
      500
    );
  }
});