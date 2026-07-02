create or replace function public.create_organization_client_action_item(
  p_organization_client_id uuid,
  p_title text,
  p_description text default null,
  p_due_date date default null,
  p_coaching_session_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client organization_clients;
  v_member organization_members;
  v_action_item_id uuid;
begin
  select *
  into v_client
  from organization_clients
  where id = p_organization_client_id
    and status = 'active';

  if v_client.id is null then
    raise exception 'Client relationship not found.';
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
    raise exception 'Not allowed.';
  end if;

  insert into organization_client_action_items (
    organization_id,
    organization_client_id,
    created_by_member_id,
    title,
    description,
    due_date,
    status,
    coaching_session_id
  )
  values (
    v_client.organization_id,
    v_client.id,
    v_member.id,
    p_title,
    p_description,
    p_due_date,
    'open',
    p_coaching_session_id
  )
  returning id into v_action_item_id;

  return v_action_item_id;
end;
$$;