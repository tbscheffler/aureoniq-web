type CareerIntelligenceInput = {
    hasDiscoveryReport: boolean;
    hasAIQReport: boolean;
    openActionItems: number;
    hasNextMeeting: boolean;
  };
  
  export type CareerIntelligenceSummary = {
    careerHealth: number;
    riskLevel: "Low" | "Medium" | "High";
    careerMomentum: "Early" | "Building" | "Strong";
    nextRecommendedAction: string;
  };
  
  export function getCareerIntelligenceSummary({
    hasDiscoveryReport,
    hasAIQReport,
    openActionItems,
    hasNextMeeting,
  }: CareerIntelligenceInput): CareerIntelligenceSummary {
    let score = 40;
  
    if (hasDiscoveryReport) score += 20;
    if (hasAIQReport) score += 20;
    if (hasNextMeeting) score += 10;
  
    if (openActionItems >= 5) score -= 15;
    else if (openActionItems >= 3) score -= 8;
  
    const careerHealth = Math.max(0, Math.min(score, 100));
  
    return {
      careerHealth,
      riskLevel: getRiskLevel(careerHealth, openActionItems),
      careerMomentum: getCareerMomentum(careerHealth),
      nextRecommendedAction: getNextRecommendedAction({
        hasDiscoveryReport,
        hasAIQReport,
        openActionItems,
        hasNextMeeting,
      }),
    };
  }
  
  function getRiskLevel(
    careerHealth: number,
    openActionItems: number
  ): "Low" | "Medium" | "High" {
    if (openActionItems >= 5 || careerHealth < 50) return "High";
    if (openActionItems >= 3 || careerHealth < 75) return "Medium";
    return "Low";
  }
  
  function getCareerMomentum(
    careerHealth: number
  ): "Early" | "Building" | "Strong" {
    if (careerHealth >= 85) return "Strong";
    if (careerHealth >= 60) return "Building";
    return "Early";
  }
  
  function getNextRecommendedAction({
    hasDiscoveryReport,
    hasAIQReport,
    openActionItems,
    hasNextMeeting,
  }: CareerIntelligenceInput) {
    if (!hasDiscoveryReport) {
      return "Start with a Career Discovery Report to identify hidden opportunities.";
    }
  
    if (!hasAIQReport) {
      return "Generate an AIQ Report to assess future career potential.";
    }
  
    if (openActionItems > 0) {
      return "Review open action items before the next coaching session.";
    }
  
    if (!hasNextMeeting) {
      return "Schedule the next coaching session to maintain client momentum.";
    }
  
    return "Review progress and prepare the next growth milestone.";
  }