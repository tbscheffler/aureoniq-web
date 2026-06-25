create table if not exists organization_client_action_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  organization_client_id uuid not null references organization_clients(id) on delete cascade,
  created_by_member_id uuid not null references organization_members(id) on delete restrict,
  title text not null,
  description text,
  status text not null default 'open',
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table organization_client_action_items enable row level security;

create or replace function public.create_organization_client_action_item(
  p_organization_client_id uuid,
  p_title text,
  p_description text default null,
  p_due_date date default null
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
  if nullif(trim(p_title), '') is null then
    raise exception 'Action item title cannot be empty.';
  end if;

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
    due_date
  )
  values (
    v_client.organization_id,
    v_client.id,
    v_member.id,
    trim(p_title),
    nullif(trim(p_description), ''),
    p_due_date
  )
  returning id into v_action_item_id;

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
    'organization_client_action_item_created',
    jsonb_build_object(
      'organization_client_id', v_client.id,
      'action_item_id', v_action_item_id
    )
  );

  return v_action_item_id;
end;
$$;

create or replace function public.get_organization_client_action_items(
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
  v_items jsonb;
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

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', a.id,
        'title', a.title,
        'description', a.description,
        'status', a.status,
        'due_date', a.due_date,
        'created_at', a.created_at,
        'updated_at', a.updated_at
      )
      order by
        case when a.status = 'open' then 0 else 1 end,
        a.due_date asc nulls last,
        a.created_at desc
    ),
    '[]'::jsonb
  )
  into v_items
  from organization_client_action_items a
  where a.organization_client_id = v_client.id;

  return v_items;
end;
$$;