create or replace function public.get_organization_member_invitation_by_token(
  invite_token text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invitation organization_member_invitations;
  v_org_name text;
begin
  select *
  into v_invitation
  from organization_member_invitations
  where token = invite_token
    and status = 'pending'
    and expires_at > now();

  if v_invitation.id is null then
    return null;
  end if;

  select name
  into v_org_name
  from organizations
  where id = v_invitation.organization_id;

  return jsonb_build_object(
    'id', v_invitation.id,
    'invite_email', v_invitation.invite_email,
    'role', v_invitation.role,
    'status', v_invitation.status,
    'expires_at', v_invitation.expires_at,
    'organization_name', v_org_name
  );
end;
$$;