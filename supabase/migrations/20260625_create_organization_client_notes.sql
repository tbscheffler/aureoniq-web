create table if not exists organization_client_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  organization_client_id uuid not null references organization_clients(id) on delete cascade,
  author_member_id uuid not null references organization_members(id) on delete restrict,
  note text not null,
  visibility text not null default 'organization_private',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table organization_client_notes enable row level security;



create or replace function public.create_organization_client_note(
  p_organization_client_id uuid,
  p_note text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_client organization_clients;
  v_member organization_members;
  v_note_id uuid;
begin
  if nullif(trim(p_note), '') is null then
    raise exception 'Note cannot be empty.';
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

  insert into organization_client_notes (
    organization_id,
    organization_client_id,
    author_member_id,
    note
  )
  values (
    v_client.organization_id,
    v_client.id,
    v_member.id,
    trim(p_note)
  )
  returning id into v_note_id;

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
    'organization_client_note_created',
    jsonb_build_object(
      'organization_client_id', v_client.id,
      'note_id', v_note_id
    )
  );

  return v_note_id;
end;
$$;