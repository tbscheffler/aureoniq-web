import { supabase } from "@/lib/supabaseClient";

/**
 * Returns the active organization for the current coach.
 */
export async function getCurrentOrganization() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not signed in.");
  }

  const { data, error } = await supabase
    .from("organization_members")
    .select(
      `
      organization_id,
      role,
      organizations (*)
      `
    )
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Returns the active plan for an organization.
 */
export async function getOrganizationPlan(organizationId: string) {
    const { data, error } = await supabase
      .from("organization_plans")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("status", "active")
      .maybeSingle();
  
    if (error) {
      throw error;
    }
  
    return data;
  }
  
  /**
   * Returns active clients for an organization.
   */
  export async function getOrganizationClients(organizationId: string) {
    const { data, error } = await supabase
      .from("organization_clients")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("status", "active");
  
    if (error) {
      throw error;
    }
  
    return data || [];
  }
  
  /**
   * Returns pending invitations for an organization.
   */
  export async function getPendingInvitations(organizationId: string) {
    const { data, error } = await supabase
      .from("organization_invitations")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("status", "pending")
      .order("created_at", { ascending: false });
  
    if (error) {
      throw error;
    }
  
    return data || [];
  }

  /**
 * Sends an organization invitation through a secure Supabase Edge Function.
 * This creates the invitation and sends the email from the backend.
 */
  export async function sendOrganizationInvitation(
    organizationId: string,
    clientEmail: string
  ) {
    const { data, error } = await supabase.functions.invoke(
      "send-organization-invitation",
      {
        body: {
          organization_id: organizationId,
          client_email: clientEmail,
        },
      }
    );
  
    if (error) {
      console.log("SEND INVITATION FUNCTION ERROR:", error);
      throw error;
    }
  
    return data;
  }