const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type OpportunityInput = {
  title?: string;
  company?: string;
  description?: string;
  url?: string;
  location?: string;
  salary?: string;
};

type OpportunityAlignmentLabel =
  | "Strong Alignment"
  | "Worth Exploring"
  | "Significant Stretch"
  | "Limited Evidence";

type CareerBridgeStep = {
  title: string;
  rationale: string;
  strengthsToCarry?: string[];
  skillsToBuild?: string[];
};

type CareerBridge = {
  currentRole?: string;
  targetRole?: string;
  bridgeSummary: string;
  steps: CareerBridgeStep[];
};

type OpportunityIntelligence = {
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

function fallbackOpportunityIntelligence(
  opportunity: OpportunityInput,
  reason?: string,
): OpportunityIntelligence {
  return {
    profileVersion: "v1",
    opportunity,
    summary:
      "This opportunity needs more analysis against the Career Intelligence Profile before drawing a strong conclusion.",
    alignment: {
      label: "Limited Evidence",
      explanation:
        reason ||
        "AureonIQ could not complete the full analysis. More role detail or profile context may be needed.",
    },
    whyItFits: [
      "AureonIQ did not find strong direct-fit evidence yet. This may still be useful as a stretch opportunity if the client is interested in building the missing skills.",
    ],
    growthStretch: [
      "Clarify which responsibilities would be new or unfamiliar.",
      "Identify skills that may need development before pursuing this role.",
    ],
    careerBridge: {
      currentRole: "Current role",
      targetRole: opportunity.title || "Target opportunity",
      bridgeSummary:
        "AureonIQ could not complete a full career bridge, but this opportunity can still be reviewed against the person's current career evidence.",
      steps: [
        {
          title: "Current role",
          rationale: "Start with the career evidence already available.",
          strengthsToCarry: [],
          skillsToBuild: [],
        },
        {
          title: opportunity.title || "Target opportunity",
          rationale:
            "Clarify what additional experience, tools, or industry language would make this role more realistic.",
          strengthsToCarry: [],
          skillsToBuild: ["Role-specific requirements"],
        },
      ],
    },
    conversationStarters: [
      "What part of this role feels most energizing?",
      "Which responsibilities already feel familiar?",
      "What part of this opportunity feels uncertain?",
    ],
    decisionPerspective:
      "This analysis supports career decision-making and does not replace professional judgment.",
    metadata: {
      generatedAt: new Date().toISOString(),
      source: "aureoniq",
    },
  };
}

function extractJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON object returned by model.");
    return JSON.parse(match[0]);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    const model = Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini";

    if (!openAiKey) {
      return new Response(
        JSON.stringify({ error: "Missing OPENAI_API_KEY Supabase secret." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const body = await req.json();
    const profile = body?.profile;
    const opportunity = body?.opportunity as OpportunityInput | undefined;

    if (!profile || !opportunity) {
      return new Response(
        JSON.stringify({ error: "Missing profile or opportunity." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    if (!opportunity.description && !opportunity.url) {
      return new Response(
        JSON.stringify({ error: "Paste a job description or role summary first." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const systemPrompt = `
You are AureonIQ Opportunity Intelligence.

You support career decision-making. You do not replace the coach, professional, advisor, or organization leader.

Evaluate the supplied opportunity against the person's Career Intelligence Profile.

Important style rules:
- Present observations, not commands.
- Use supportive, professional language.
- Do not guarantee hiring outcomes.
- Do not say the person is definitely qualified.
- Prefer words like appears, may, suggests, indicates, highlights, could.
- Avoid should, must, tell, guarantee, certainly.
- Do not mention CRM. This is user-facing Opportunity Intelligence, not internal positioning.
- Write from the coach/workspace perspective. Refer to the person as "the client" or by name when available.
- Do not use second-person language like "your current role" or "your skills" except inside conversationStarters, where questions may speak directly to the client.
- Focus on career alignment, transferable strengths, growth stretch, career bridge, and useful coaching conversation.
- Treat the Career Intelligence Profile as the source of truth.
- Let the engines talk to each other: use discovery career matches, hidden opportunities, AIQ strengths, evidence, and regional context when creating the analysis.
- The careerBridge should show a practical path from the person's current role/identity toward the target opportunity.
- When the Career Intelligence Profile already contains adjacent roles, hidden opportunities, or recommended paths that relate to the target role, use those as bridge steps before inventing new ones.
- Career bridge steps should explain how skills carry forward and what may need to be built.
- Do not imply the person can jump directly into a senior role if the evidence suggests intermediate steps are needed.
- For significant stretches, the careerBridge should include at least one realistic intermediate role, skill-building step, project, certification, or lower-risk transition step.
- Keep content concise and human-readable.

Return ONLY valid JSON matching this exact TypeScript shape:
{
  "profileVersion": "v1",
  "opportunity": {
    "title": string,
    "company": string | undefined,
    "description": string | undefined,
    "url": string | undefined,
    "location": string | undefined,
    "salary": string | undefined
  },
  "summary": string,
  "alignment": {
    "label": "Strong Alignment" | "Worth Exploring" | "Significant Stretch" | "Limited Evidence",
    "explanation": string
  },
  "whyItFits": string[],
  "growthStretch": string[],
  "careerBridge": {
    "currentRole": string,
    "targetRole": string,
    "bridgeSummary": string,
    "steps": [
      {
        "title": string,
        "rationale": string,
        "strengthsToCarry": string[],
        "skillsToBuild": string[]
      }
    ]
  },
  "conversationStarters": string[],
  "decisionPerspective": string,
  "metadata": {
    "generatedAt": string,
    "source": "aureoniq"
  }
}

Array limits:
- whyItFits: 1 to 5 items. Never return an empty array.
- growthStretch: 2 to 4 items
- conversationStarters: 3 items
- careerBridge.steps: 2 to 4 items

Career Bridge quality rules:
- The first step should usually reflect the person's current role, strongest current identity, or strongest existing evidence.
- Middle steps should be realistic bridges, not generic advice.
- The final step should be the opportunity or target role.
- Each step should clearly separate what carries forward from what may need to be built.
- If the opportunity is a major stretch, be honest and supportive. Show the bridge rather than forcing a false match.
`;

    const userPrompt = JSON.stringify(
      {
        careerIntelligenceProfile: profile,
        opportunity,
      },
      null,
      2,
    );

    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    const openAiJson = await openAiResponse.json();

    if (!openAiResponse.ok) {
      console.error("OpenAI error", openAiJson);
      return new Response(
        JSON.stringify(
          fallbackOpportunityIntelligence(
            opportunity,
            openAiJson?.error?.message || "OpenAI analysis failed.",
          ),
        ),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const content = openAiJson?.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(
        JSON.stringify(
          fallbackOpportunityIntelligence(opportunity, "No model content returned."),
        ),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const parsed = extractJson(content) as OpportunityIntelligence;

    const result: OpportunityIntelligence = {
      profileVersion: "v1",
      opportunity: parsed.opportunity || opportunity,
      summary: parsed.summary || fallbackOpportunityIntelligence(opportunity).summary,
      alignment: parsed.alignment || fallbackOpportunityIntelligence(opportunity).alignment,
      whyItFits:
        Array.isArray(parsed.whyItFits) && parsed.whyItFits.length > 0
          ? parsed.whyItFits.slice(0, 5)
          : [
              "AureonIQ did not find strong direct-fit evidence yet. This may still be useful as a stretch opportunity if the client is interested in building the missing skills.",
            ],
      growthStretch: Array.isArray(parsed.growthStretch)
        ? parsed.growthStretch.slice(0, 4)
        : [],
      careerBridge: parsed.careerBridge || fallbackOpportunityIntelligence(opportunity).careerBridge,
      conversationStarters: Array.isArray(parsed.conversationStarters)
        ? parsed.conversationStarters.slice(0, 3)
        : [],
      decisionPerspective:
        parsed.decisionPerspective ||
        "This analysis supports career decision-making and does not replace professional judgment.",
      metadata: {
        generatedAt: new Date().toISOString(),
        source: "aureoniq",
      },
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error." }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
