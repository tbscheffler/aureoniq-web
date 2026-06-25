create table if not exists organization_client_meetings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  organization_client_id uuid not null references organization_clients(id) on delete cascade,
  created_by_member_id uuid not null references organization_members(id) on delete restrict,
  meeting_date timestamptz not null,
  title text not null default 'Coaching Session',
  summary text,
  follow_up text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table organization_client_meetings enable row level security;


create or replace function public.create_organization_client_meeting(
  p_organization_client_id uuid,
  p_meeting_date timestamptz,
  p_title text,
  p_summary text default null,
  p_follow_up text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client organization_clients;
  v_member organization_members;
  v_meeting_id uuid;
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

  insert into organization_client_meetings (
    organization_id,
    organization_client_id,
    created_by_member_id,
    meeting_date,
    title,
    summary,
    follow_up
  )
  values (
    v_client.organization_id,
    v_client.id,
    v_member.id,
    p_meeting_date,
    coalesce(nullif(trim(p_title), ''), 'Coaching Session'),
    nullif(trim(p_summary), ''),
    nullif(trim(p_follow_up), '')
  )
  returning id into v_meeting_id;

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
    'organization_client_meeting_created',
    jsonb_build_object(
      'organization_client_id', v_client.id,
      'meeting_id', v_meeting_id
    )
  );

  return v_meeting_id;
end;
$$;