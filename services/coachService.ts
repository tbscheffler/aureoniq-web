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

export async function sendOrganizationMemberInvitation({
  organizationId,
  inviteEmail,
  role,
}: {
  organizationId: string;
  inviteEmail: string;
  role: "admin" | "coach";
}) {
  const { data, error } = await supabase.functions.invoke(
    "send-organization-member-invitation",
    {
      body: {
        organization_id: organizationId,
        invite_email: inviteEmail,
        role,
      },
    }
  );

  if (error) {
    throw error;
  }

  return data;
}

export async function getPendingOrganizationMemberInvitations(
  organizationId: string
) {
  const { data, error } = await supabase
    .from("organization_member_invitations")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function getOrganizationMembers(organizationId: string) {
  const { data: members, error: membersError } = await supabase
    .from("organization_members")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("status", "active")
    .order("created_at", { ascending: true });

  if (membersError) {
    throw membersError;
  }

  const userIds = (members || []).map((member) => member.user_id);

  if (userIds.length === 0) {
    return [];
  }

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("user_id, display_name, avatar_url")
    .in("user_id", userIds);

  if (profilesError) {
    throw profilesError;
  }

  return (members || []).map((member) => ({
    ...member,
    profile: profiles?.find((profile) => profile.user_id === member.user_id) || null,
  }));
}


export async function getCoachDashboardStats(organizationId: string) {
  const [
    { count: activeClients },
    { count: teamMembers },
    { count: pendingClientInvites },
    { count: pendingTeamInvites },
    { count: notesThisWeek },
    { count: meetingsThisWeek },
  ] = await Promise.all([
    supabase
      .from("organization_clients")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .eq("status", "active"),

    supabase
      .from("organization_members")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .eq("status", "active"),

    supabase
      .from("organization_invitations")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .eq("status", "pending"),

    supabase
      .from("organization_member_invitations")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .eq("status", "pending"),

    supabase
      .from("organization_client_notes")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .gte(
        "created_at",
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      ),

    supabase
      .from("organization_client_meetings")
      .select("*", { count: "exact", head: true })
      .eq("organization_id", organizationId)
      .gte(
        "scheduled_for",
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      ),
  ]);

  return {
    activeClients: activeClients ?? 0,
    teamMembers: teamMembers ?? 0,
    pendingClientInvites: pendingClientInvites ?? 0,
    pendingTeamInvites: pendingTeamInvites ?? 0,
    notesThisWeek: notesThisWeek ?? 0,
    meetingsThisWeek: meetingsThisWeek ?? 0,
  };
}

export async function getCoachRecentActivity(organizationId: string) {
  const { data: activity, error } = await supabase
    .from("access_audit_log")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) {
    throw error;
  }

  const actorUserIds = Array.from(
    new Set((activity || []).map((item) => item.actor_user_id).filter(Boolean))
  );

  if (actorUserIds.length === 0) {
    return activity || [];
  }

  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("user_id, display_name, avatar_url")
    .in("user_id", actorUserIds);

  if (profilesError) {
    throw profilesError;
  }

  return (activity || []).map((item) => ({
    ...item,
    actor_profile:
      profiles?.find((profile) => profile.user_id === item.actor_user_id) ||
      null,
  }));
}

export async function getOrganizationNotifications(organizationId: string) {
  const { data, error } = await supabase
    .from("organization_notifications")
    .select("*")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .limit(25);

  if (error) {
    throw error;
  }

  return data || [];
}

export async function getUnreadOrganizationNotificationCount(
  organizationId: string
) {
  const { count, error } = await supabase
    .from("organization_notifications")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .is("read_at", null);

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function markOrganizationNotificationRead(notificationId: string) {
  const { error } = await supabase
    .from("organization_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .is("read_at", null);

  if (error) {
    throw error;
  }
}

export async function getCoachAgendaStats(organizationId: string) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const { count: meetingsToday, error: meetingsError } = await supabase
    .from("organization_client_meetings")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .gte("meeting_date", todayStart.toISOString())
    .lte("meeting_date", todayEnd.toISOString());

  if (meetingsError) {
    throw meetingsError;
  }

  const todayDate = todayStart.toISOString().slice(0, 10);

  const { count: overdueActions, error: actionsError } = await supabase
    .from("organization_client_action_items")
    .select("*", { count: "exact", head: true })
    .eq("organization_id", organizationId)
    .lt("due_date", todayDate)
    .neq("status", "completed");

  if (actionsError) {
    throw actionsError;
  }

  return {
    meetingsToday: meetingsToday ?? 0,
    overdueActions: overdueActions ?? 0,
  };
}

export async function getTodaysCoachMeetings(organizationId: string) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("organization_client_meetings")
    .select("*")
    .eq("organization_id", organizationId)
    .gte("meeting_date", todayStart.toISOString())
    .lte("meeting_date", todayEnd.toISOString())
    .order("meeting_date", { ascending: true });

  if (error) {
    throw error;
  }

  return data || [];
}