create table if not exists organization_client_coaching_sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  organization_client_id uuid not null references organization_clients(id) on delete cascade,
  created_by_member_id uuid not null references organization_members(id) on delete restrict,

  title text not null default 'Coaching Session',
  status text not null default 'planned',
  scheduled_for timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  meeting_type text,
  location text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table organization_client_coaching_sessions enable row level security;

create index if not exists idx_coaching_sessions_org_client
on organization_client_coaching_sessions(organization_client_id);

create index if not exists idx_coaching_sessions_org
on organization_client_coaching_sessions(organization_id);

create index if not exists idx_coaching_sessions_scheduled_for
on organization_client_coaching_sessions(scheduled_for);

create or replace function public.create_organization_client_coaching_session(
  p_organization_client_id uuid,
  p_title text default 'Coaching Session',
  p_scheduled_for timestamptz default null,
  p_meeting_type text default null,
  p_location text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client organization_clients;
  v_member organization_members;
  v_session_id uuid;
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

  insert into organization_client_coaching_sessions (
    organization_id,
    organization_client_id,
    created_by_member_id,
    title,
    scheduled_for,
    meeting_type,
    location
  )
  values (
    v_client.organization_id,
    v_client.id,
    v_member.id,
    coalesce(nullif(trim(p_title), ''), 'Coaching Session'),
    p_scheduled_for,
    nullif(trim(p_meeting_type), ''),
    nullif(trim(p_location), '')
  )
  returning id into v_session_id;

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
    'organization_client_coaching_session_created',
    jsonb_build_object(
      'organization_client_id', v_client.id,
      'coaching_session_id', v_session_id
    )
  );

  return v_session_id;
end;
$$;

create or replace function public.get_organization_client_coaching_sessions(
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
  v_sessions jsonb;
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
        'id', s.id,
        'title', s.title,
        'status', s.status,
        'scheduled_for', s.scheduled_for,
        'started_at', s.started_at,
        'completed_at', s.completed_at,
        'meeting_type', s.meeting_type,
        'location', s.location,
        'created_at', s.created_at,
        'updated_at', s.updated_at
      )
      order by coalesce(s.scheduled_for, s.created_at) desc
    ),
    '[]'::jsonb
  )
  into v_sessions
  from organization_client_coaching_sessions s
  where s.organization_client_id = v_client.id;

  return v_sessions;
end;
$$;