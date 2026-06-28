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
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return jsonResponse({ error: "Missing authorization" }, 401);
    }

    const { organization_client_id } = await req.json();

    if (!organization_client_id) {
      return jsonResponse({ error: "Missing organization_client_id" }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const openAiKey = Deno.env.get("OPENAI_API_KEY");

    if (!supabaseUrl || !serviceRoleKey || !openAiKey) {
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

    const { data: organizationClient, error: clientError } = await supabase
    .from("organization_clients")
    .select("*")
    .eq("id", organization_client_id)
    .eq("status", "active")
    .single();
  
  if (clientError || !organizationClient) {
    return jsonResponse({ error: "Client relationship not found" }, 404);
  }
  
  const { data: membership, error: membershipError } = await supabase
    .from("organization_members")
    .select("*")
    .eq("organization_id", organizationClient.organization_id)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();
  
  if (membershipError || !membership) {
    return jsonResponse({ error: "Not allowed" }, 403);
  }
  
  const { data: resumeProfile, error: resumeError } = await supabase
    .from("resume_profiles")
    .select("*")
    .eq("user_id", organizationClient.client_user_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  
  if (resumeError) {
    return jsonResponse({ error: resumeError.message }, 400);
  }
  
  if (!resumeProfile) {
    return jsonResponse({ error: "No resume profile found for this client" }, 404);
  }
  
  const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: `
  You are AureonIQ's Resume Review Engine.
  
  Analyze this parsed resume profile for a career coach.
  
  Important:
  - Do not pretend to know the client personally.
  - Do not make coaching decisions.
  - Do not tell the coach what they must do.
  - Surface factual strengths, gaps, and improvement opportunities.
  - Keep the coach in control.
  
  RESUME PROFILE:
  ${JSON.stringify(resumeProfile)}
  
  Return ONLY valid JSON with this shape:
  
  {
    "overallScore": 0,
    "summary": "",
    "strengths": [
      {
        "title": "",
        "evidence": ""
      }
    ],
    "improvementAreas": [
      {
        "title": "",
        "whyItMatters": ""
      }
    ],
    "atsConcerns": [
      {
        "title": "",
        "details": ""
      }
    ],
    "suggestedEdits": [
      {
        "section": "",
        "currentIssue": "",
        "suggestedDirection": ""
      }
    ]
  }
      `,
    }),
  });
  
  const openAiResult = await openAiResponse.json();
  
  if (!openAiResponse.ok) {
    return jsonResponse(
      {
        error: "OpenAI resume review failed",
        detail: openAiResult.error?.message,
      },
      500
    );
  }
  
  const outputText =
    openAiResult.output_text ||
    openAiResult.output?.[0]?.content?.[0]?.text;
  
  if (!outputText) {
    return jsonResponse({ error: "OpenAI returned no resume review" }, 500);
  }
  
  const cleanedText = outputText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
  
  const reviewJson = JSON.parse(cleanedText);
  
  const { data: savedReview, error: saveError } = await supabase
    .from("organization_client_resume_reviews")
    .insert({
      organization_id: organizationClient.organization_id,
      organization_client_id,
      resume_profile_id: resumeProfile.id,
      created_by_member_id: membership.id,
      status: "completed",
      review_json: reviewJson,
    })
    .select("*")
    .single();
  
  if (saveError) {
    return jsonResponse({ error: saveError.message }, 400);
  }
  
  return jsonResponse({
    success: true,
    review: savedReview,
  });
  } catch (error) {
    return jsonResponse({ error: error?.message || "Server error" }, 500);
  }
});