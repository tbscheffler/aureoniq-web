// @ts-nocheck

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return new Response("Missing authorization", { status: 401 });
    }

    const { organization_id, client_email } = await req.json();

    if (!organization_id || !client_email) {
      return new Response("Missing organization_id or client_email", {
        status: 400,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;
    const siteUrl = Deno.env.get("PUBLIC_SITE_URL") || "http://localhost:3000";

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (userError || !user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { data: membership } = await supabase
      .from("organization_members")
      .select("organization_id, role, status")
      .eq("organization_id", organization_id)
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!membership || !["owner", "admin", "coach"].includes(membership.role)) {
      return new Response("Not allowed", { status: 403 });
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
      return new Response(inviteError.message, { status: 400 });
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
      return new Response("Invitation created, but email failed.", {
        status: 500,
      });
    }

    await supabase.from("access_audit_log").insert({
      actor_user_id: user.id,
      organization_id,
      action: "coach_invitation_sent",
      metadata: {
        invitation_id: invitation.id,
        client_email: client_email.trim().toLowerCase(),
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    return new Response(error.message || "Server error", { status: 500 });
  }
});