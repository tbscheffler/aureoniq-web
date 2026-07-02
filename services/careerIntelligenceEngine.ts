export type CareerIntelligenceInput = {
  clientName: string;
  careerHealth?: {
    score: number;
    status: string;
  } | null;
  hasDiscoveryReport: boolean;
  hasAIQReport: boolean;
  hasResumeProfile: boolean;
  hasNextMeeting: boolean;
  openActionItems: number;
};

export type CareerIntelligenceInsight = {
  label: string;
  status: "positive" | "warning" | "critical" | "neutral";
  message: string;
};

export type CareerIntelligenceResult = {
  summary: string;
  recommendedNextStep: string;
  insights: CareerIntelligenceInsight[];
};

export function buildCareerIntelligenceSummary({
  clientName,
  careerHealth,
  hasDiscoveryReport,
  hasAIQReport,
  hasResumeProfile,
  hasNextMeeting,
  openActionItems,
}: CareerIntelligenceInput): CareerIntelligenceResult {
  const insights: CareerIntelligenceInsight[] = [];

  if (careerHealth) {
    insights.push({
      label: "Career Health",
      status:
        careerHealth.score >= 80
          ? "positive"
          : careerHealth.score >= 60
          ? "warning"
          : "critical",
      message: `${careerHealth.score} · ${careerHealth.status}`,
    });
  }

  insights.push({
    label: "Resume Profile",
    status: hasResumeProfile ? "positive" : "warning",
    message: hasResumeProfile
      ? "Resume profile is available."
      : "Resume profile is missing.",
  });

  insights.push({
    label: "Career Assessment",
    status: hasDiscoveryReport ? "positive" : "warning",
    message: hasDiscoveryReport
      ? "Career Assessment is complete."
      : "Career Assessment has not been completed.",
  });

  insights.push({
    label: "AIQ",
    status: hasAIQReport ? "positive" : "neutral",
    message: hasAIQReport
      ? "AIQ report is complete."
      : "AIQ report has not been generated yet.",
  });

  insights.push({
    label: "Action Items",
    status:
      openActionItems === 0
        ? "positive"
        : openActionItems >= 3
        ? "critical"
        : "warning",
    message:
      openActionItems === 0
        ? "No open action items."
        : `${openActionItems} open action item${openActionItems === 1 ? "" : "s"}.`,
  });

  insights.push({
    label: "Next Meeting",
    status: hasNextMeeting ? "positive" : "warning",
    message: hasNextMeeting
      ? "Next coaching session is scheduled."
      : "No upcoming coaching session is scheduled.",
  });

const completedSignals = [
  hasResumeProfile ? "resume profile" : null,
  hasDiscoveryReport ? "Career Assessment" : null,
  hasAIQReport ? "AIQ report" : null,
].filter(Boolean);

const openItemsText =
  openActionItems === 0
    ? "There are no open action items."
    : `There ${openActionItems === 1 ? "is" : "are"} ${openActionItems} open action item${
        openActionItems === 1 ? "" : "s"
      }.`;

  const meetingText = hasNextMeeting
    ? "A next coaching session is scheduled."
    : "No upcoming coaching session is scheduled.";

  const summary = `${clientName}'s career intelligence profile is ${
    careerHealth?.status?.toLowerCase() || "still developing"
  }. ${
    completedSignals.length > 0
      ? `Completed signals include ${completedSignals.join(", ")}.`
      : "Foundational career signals are still missing."
  } ${openItemsText} ${meetingText}`;

  const recommendedNextStep = getRecommendedNextStep({
    hasResumeProfile,
    hasDiscoveryReport,
    hasAIQReport,
    hasNextMeeting,
    openActionItems,
    careerHealth,
  });

  return {
    summary,
    recommendedNextStep,
    insights,
  };
}

function getRecommendedNextStep({
  hasResumeProfile,
  hasDiscoveryReport,
  hasAIQReport,
  hasNextMeeting,
  openActionItems,
  careerHealth,
}: Omit<CareerIntelligenceInput, "clientName">) {
  if (!hasResumeProfile) {
    return "Start by helping this client complete their resume profile.";
  }

  if (!hasDiscoveryReport) {
    return "Run the Career Assessment to establish this client's opportunity map.";
  }

  if (!hasAIQReport) {
    return "Generate the AIQ report to understand this client's future career potential.";
  }

  if (openActionItems >= 3) {
    return "Review open action items and reduce the client’s active workload.";
  }

  if (!hasNextMeeting) {
    return "Schedule the next coaching session to keep momentum active.";
  }

  if ((careerHealth?.score ?? 0) < 60) {
    return "Review this client’s workspace and identify the highest-impact coaching intervention.";
  }

  return "Continue reinforcing the current coaching plan and monitor progress.";
}