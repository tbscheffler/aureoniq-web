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

  /**
 * Revokes a pending organization invitation.
 * This keeps history but prevents the invitation from being accepted.
 */
export async function revokeOrganizationInvitation(invitationId: string) {
  const { error } = await supabase
    .from("organization_invitations")
    .update({ status: "revoked" })
    .eq("id", invitationId)
    .eq("status", "pending");

  if (error) {
    throw error;
  }
}

export async function getCoachClientWorkspace(organizationClientId: string) {
  const { data, error } = await supabase.rpc("get_coach_client_workspace", {
    p_organization_client_id: organizationClientId,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function getCoachClientSummary(organizationClientId: string) {
  const { data, error } = await supabase.rpc("get_coach_client_summary", {
    p_organization_client_id: organizationClientId,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function createOrganizationClientNote(
  organizationClientId: string,
  note: string
) {
  const { data, error } = await supabase.rpc("create_organization_client_note", {
    p_organization_client_id: organizationClientId,
    p_note: note,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function getOrganizationClientNotes(
  organizationClientId: string
) {
  const { data, error } = await supabase.rpc("get_organization_client_notes", {
    p_organization_client_id: organizationClientId,
  });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function createOrganizationClientMeeting({
  organizationClientId,
  meetingDate,
  title,
  summary,
  followUp,
}: {
  organizationClientId: string;
  meetingDate: string;
  title: string;
  summary?: string;
  followUp?: string;
}) {
  const { data, error } = await supabase.rpc(
    "create_organization_client_meeting",
    {
      p_organization_client_id: organizationClientId,
      p_meeting_date: meetingDate,
      p_title: title,
      p_summary: summary || null,
      p_follow_up: followUp || null,
    }
  );

  if (error) {
    throw error;
  }

  return data;
}

export async function getOrganizationClientMeetings(
  organizationClientId: string
) {
  const { data, error } = await supabase.rpc(
    "get_organization_client_meetings",
    {
      p_organization_client_id: organizationClientId,
    }
  );

  if (error) {
    throw error;
  }

  return data || [];
}

export async function createOrganizationClientActionItem({
  organizationClientId,
  title,
  description,
  dueDate,
}: {
  organizationClientId: string;
  title: string;
  description?: string;
  dueDate?: string;
}) {
  const { data, error } = await supabase.rpc(
    "create_organization_client_action_item",
    {
      p_organization_client_id: organizationClientId,
      p_title: title,
      p_description: description || null,
      p_due_date: dueDate || null,
    }
  );

  if (error) {
    throw error;
  }

  return data;
}

export async function getOrganizationClientActionItems(
  organizationClientId: string
) {
  const { data, error } = await supabase.rpc(
    "get_organization_client_action_items",
    {
      p_organization_client_id: organizationClientId,
    }
  );

  if (error) {
    throw error;
  }

  return data || [];
}