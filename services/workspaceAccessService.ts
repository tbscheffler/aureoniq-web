import { supabase } from "@/lib/supabaseClient";

export type WorkspaceAccess = {
  key: "founder" | "coach" | "professional";
  label: string;
  description: string;
  href: string;
};

export async function getUserWorkspaceAccess(): Promise<WorkspaceAccess[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const workspaces: WorkspaceAccess[] = [];

  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);

  if (roleError) {
    throw roleError;
  }

  const roles = roleData?.map((item) => item.role) || [];

  if (roles.includes("founder")) {
    workspaces.push({
      key: "founder",
      label: "Founder Dashboard",
      description: "View business metrics, platform activity, and growth signals.",
      href: "/founder",
    });
  }

  if (roles.includes("coach")) {
    workspaces.push({
      key: "coach",
      label: "Coach Workspace",
      description: "Manage clients, meetings, notes, reports, and action items.",
      href: "/coach",
    });
  }

  if (roles.includes("professional")) {
    workspaces.push({
      key: "professional",
      label: "Professional Dashboard",
      description: "View career discovery, AIQ reports, and career intelligence.",
      href: "/dashboard",
    });
  }

  return workspaces;
}

export async function hasWorkspaceAccess(
  workspaceKey: WorkspaceAccess["key"]
): Promise<boolean> {
  const workspaces = await getUserWorkspaceAccess();

  return workspaces.some((workspace) => workspace.key === workspaceKey);
}