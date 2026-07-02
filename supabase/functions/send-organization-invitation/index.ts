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
            <div style="background:#0F172A;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#E5E7EB;">
              <div style="max-width:640px;margin:0 auto;background:#111827;border:1px solid #334155;border-radius:20px;overflow:hidden;">

                <div style="padding:36px 40px;border-bottom:1px solid #1E293B;text-align:center;">
                  <div style="font-size:30px;font-weight:800;color:#FBBF24;letter-spacing:3px;">
                    AUREONIQ
                  </div>

                  <div style="margin-top:10px;font-size:14px;color:#94A3B8;letter-spacing:2px;text-transform:uppercase;">
                    Career Intelligence Platform
                  </div>
                </div>

                <div style="padding:40px;">

                  <h1 style="margin:0;font-size:28px;color:white;">
                    You're invited to work with your career coach.
                  </h1>

                  <p style="margin-top:24px;font-size:16px;line-height:1.7;color:#CBD5E1;">
                    <strong>${org?.name || "Your coach"}</strong> has invited you to collaborate inside AureonIQ.
                  </p>

                  <p style="margin-top:20px;font-size:16px;line-height:1.7;color:#CBD5E1;">
                    AureonIQ helps you and your coach organize your career journey, discover opportunities, review Career Intelligence, and track progress together.
                  </p>

                  <div style="margin-top:32px;padding:24px;border-radius:16px;background:#0F172A;border:1px solid #334155;">

                    <div style="font-weight:700;color:white;margin-bottom:16px;">
                      What happens when you accept?
                    </div>

                    <div style="color:#CBD5E1;line-height:2;">
                      ✓ Connect securely with your coach<br>
                      ✓ Share Career Discovery and AIQ reports<br>
                      ✓ Collaborate on coaching sessions<br>
                      ✓ Track goals and action items together
                    </div>

                  </div>

                  <div style="margin-top:36px;text-align:center;">
                    <a
                      href="${acceptUrl}"
                      style="
                        display:inline-block;
                        background:#2563EB;
                        color:white;
                        padding:16px 30px;
                        border-radius:14px;
                        text-decoration:none;
                        font-weight:700;
                        font-size:16px;
                      "
                    >
                      Accept Invitation
                    </a>
                  </div>

                  <div style="margin-top:40px;padding-top:28px;border-top:1px solid #1E293B;">

                    <div style="font-weight:700;color:white;margin-bottom:12px;">
                      Your privacy matters
                    </div>

                    <div style="font-size:14px;line-height:1.8;color:#94A3B8;">
                      • Your password is never shared with your coach.<br>
                      • Billing information remains private.<br>
                      • You control your AureonIQ account.
                    </div>

                  </div>

                </div>

              </div>

              <div style="text-align:center;margin-top:20px;font-size:13px;color:#64748B;">
                AureonIQ • Career Intelligence Platform
              </div>

            </div>
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