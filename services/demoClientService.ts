export const SARAH_DEMO_CLIENT_ID = "demo-sarah-mitchell";

export const SARAH_DEMO_RESUME_PROFILE_ID =
  "b76a026a-dc33-4711-aaf4-262dca465e30";

export const SARAH_DEMO_CAREER_REPORT_ID =
  "9b54ae14-f3e1-493e-96b2-1353c8e50f1e";

export const SARAH_DEMO_AIQ_REPORT_ID =
  "92a3730d-2fb3-4724-9d3d-b638ddba9f3b";

export function isDemoClient(clientId: string) {
  return clientId === SARAH_DEMO_CLIENT_ID;
}

export function getSarahDemoClientCard() {
  return {
    id: SARAH_DEMO_CLIENT_ID,
    client_display_name: "Sarah Mitchell",
    client_email: "sarah.demo@aureoniq.com",
    status: "active",
    access_level: "demo",
    sponsored_tier: "aiq_pro",
    is_sample: true,
    client_profile: {
      display_name: "Sarah Mitchell",
      avatar_url: null,
    },
    health: {
      score: 87,
      status: "Strong",
    },
  };
}

export function getSarahDemoReportIds() {
  return {
    resumeProfileId: SARAH_DEMO_RESUME_PROFILE_ID,
    careerReportId: SARAH_DEMO_CAREER_REPORT_ID,
    aiqReportId: SARAH_DEMO_AIQ_REPORT_ID,
  };
}