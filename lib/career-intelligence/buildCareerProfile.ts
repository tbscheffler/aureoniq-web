import {
  CareerIntelligenceProfile,
  createEmptyCareerIntelligenceProfile,
} from "./careerIntelligenceProfile";

export type BuildCareerProfileInput = {
  resume?: any;
  discovery?: any;
  aiq?: any;
  regional?: any;
};

function toArray(value: any): any[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function firstDefined<T>(...values: T[]): T | undefined {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

export function buildCareerProfile(
  input: BuildCareerProfileInput
): CareerIntelligenceProfile {
  const profile = createEmptyCareerIntelligenceProfile();

  // =====================================================
  // Evidence / Resume Intelligence
  // =====================================================

  if (input.resume) {
    profile.client.name = firstDefined(
      input.resume.name,
      input.resume.full_name,
      input.resume.fullName,
      input.resume.display_name
    );

    profile.client.currentRole = firstDefined(
      input.resume.currentRole,
      input.resume.current_title,
      input.resume.currentTitle,
      input.resume.current_position
    );

    profile.evidence.skills = toArray(input.resume.skills);
    profile.evidence.workHistory = toArray(
      firstDefined(input.resume.workHistory, input.resume.work_history)
    );
    profile.evidence.education = toArray(input.resume.education);
    profile.evidence.certifications = toArray(input.resume.certifications);
    profile.evidence.transferableSkills = toArray(
      firstDefined(
        input.resume.transferableSkills,
        input.resume.transferable_skills
      )
    );
  }

  // =====================================================
  // Discovery Intelligence
  // =====================================================

  if (input.discovery) {
    profile.discovery.careerOpportunityScore = firstDefined(
      input.discovery.careerOpportunityScore,
      input.discovery.career_opportunity_score,
      input.discovery.opportunityScore,
      input.discovery.opportunity_score
    );

    profile.discovery.careerMatches = toArray(
      firstDefined(
        input.discovery.careerMatches,
        input.discovery.career_matches,
        input.discovery.topCareerMatches,
        input.discovery.top_career_matches
      )
    );

    profile.discovery.hiddenOpportunities = toArray(
      firstDefined(
        input.discovery.hiddenOpportunities,
        input.discovery.hidden_opportunities
      )
    );

    profile.discovery.unexpectedCareer = firstDefined(
      input.discovery.unexpectedCareer,
      input.discovery.careerYouDidntExpect,
      input.discovery.career_you_didnt_expect
    );

    profile.discovery.careerTranslation = firstDefined(
      input.discovery.careerTranslation,
      input.discovery.career_translation
    );

    profile.discovery.marketValue = firstDefined(
      input.discovery.marketValue,
      input.discovery.market_value
    );

    profile.discovery.skillGaps = toArray(
      firstDefined(input.discovery.skillGaps, input.discovery.skill_gaps)
    );

    profile.discovery.actionPlan = toArray(
      firstDefined(input.discovery.actionPlan, input.discovery.action_plan)
    );

    profile.story.executiveSummary = firstDefined(
      input.discovery.executiveSummary,
      input.discovery.executive_summary,
      input.discovery.summary
    );

    profile.story.careerIdentity = firstDefined(
      input.discovery.careerIdentity,
      input.discovery.career_identity
    );
  }

  // =====================================================
  // AIQ Intelligence
  // =====================================================

  if (input.aiq) {
    profile.aiq.score = firstDefined(
      input.aiq.score,
      input.aiq.aiqScore,
      input.aiq.aiq_score
    );

    profile.aiq.opportunityIndex = firstDefined(
      input.aiq.opportunityIndex,
      input.aiq.opportunity_index
    );

    profile.aiq.careerValue = firstDefined(
      input.aiq.careerValue,
      input.aiq.career_value
    );

    profile.aiq.transferability = input.aiq.transferability;
    profile.aiq.growthPotential = firstDefined(
      input.aiq.growthPotential,
      input.aiq.growth_potential
    );
    profile.aiq.hiddenPotential = firstDefined(
      input.aiq.hiddenPotential,
      input.aiq.hidden_potential
    );

    profile.aiq.topStrengths = toArray(
      firstDefined(input.aiq.topStrengths, input.aiq.top_strengths)
    );

    profile.aiq.growthAccelerators = toArray(
      firstDefined(
        input.aiq.growthAccelerators,
        input.aiq.growth_accelerators
      )
    );

    profile.aiq.futureScenarios = toArray(
      firstDefined(input.aiq.futureScenarios, input.aiq.future_scenarios)
    );

    profile.aiq.summary = firstDefined(
      input.aiq.summary,
      input.aiq.aiqSummary,
      input.aiq.aiq_summary,
      input.aiq.executiveSummary,
      input.aiq.executive_summary
    );
  }

  // =====================================================
  // Regional Intelligence
  // =====================================================

  if (input.regional) {
    profile.regional.regionName = firstDefined(
      input.regional.regionName,
      input.regional.region_name,
      input.regional.search_region,
      input.regional.market
    );

    profile.regional.outlook = firstDefined(
      input.regional.outlook,
      input.regional.regionalOutlook,
      input.regional.regional_outlook,
      input.regional.summary
    );

    profile.regional.localDemand = firstDefined(
      input.regional.localDemand,
      input.regional.local_demand
    );

    profile.regional.nearbyMarkets = toArray(
      firstDefined(input.regional.nearbyMarkets, input.regional.nearby_markets)
    );

    profile.regional.remoteContext = firstDefined(
      input.regional.remoteContext,
      input.regional.remote_context
    );

    profile.regional.relocationGuidance = firstDefined(
      input.regional.relocationGuidance,
      input.regional.relocation_guidance
    );

    profile.regional.salaryContext = firstDefined(
      input.regional.salaryContext,
      input.regional.salary_context
    );
  }

  return profile;
}
