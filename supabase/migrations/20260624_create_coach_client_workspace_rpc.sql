create or replace function public.get_coach_client_workspace(
  p_organization_client_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client organization_clients;
  v_member organization_members;
  v_result jsonb;
begin
  select *
  into v_client
  from organization_clients
  where id = p_organization_client_id
    and status = 'active';

  if v_client.id is null then
    raise exception 'Client relationship not found';
  end if;

  select *
  into v_member
  from organization_members
  where organization_id = v_client.organization_id
    and user_id = auth.uid()
    and status = 'active'
    and (
      id = v_client.assigned_member_id
      or role in ('owner', 'admin')
    );

  if v_member.id is null then
    raise exception 'Not allowed';
  end if;

  insert into access_audit_log (
    actor_user_id,
    organization_id,
    target_user_id,
    action,
    metadata
  )
  values (
    auth.uid(),
    v_client.organization_id,
    v_client.client_user_id,
    'coach_client_workspace_viewed',
    jsonb_build_object(
      'organization_client_id', v_client.id
    )
  );

  select jsonb_build_object(
    'client', to_jsonb(v_client),
    'career_reports', coalesce((
      select jsonb_agg(cr order by cr.created_at desc)
      from career_reports cr
      where cr.user_id = v_client.client_user_id
    ), '[]'::jsonb),
    'aiq_reports', coalesce((
      select jsonb_agg(ar order by ar.created_at desc)
      from aiq_reports ar
      where ar.user_id = v_client.client_user_id
    ), '[]'::jsonb)
  )
  into v_result;

  return v_result;
end;
$$;