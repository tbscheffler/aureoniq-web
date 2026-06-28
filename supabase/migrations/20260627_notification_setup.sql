create table if not exists organization_notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  target_user_id uuid references auth.users(id) on delete set null,
  type text not null,
  title text not null,
  message text,
  metadata jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table organization_notifications enable row level security;

create policy "Organization members can view organization notifications"
on organization_notifications
for select
using (
  exists (
    select 1
    from organization_members om
    where om.organization_id = organization_notifications.organization_id
      and om.user_id = auth.uid()
      and om.status = 'active'
  )
);

create policy "Organization members can update notification read status"
on organization_notifications
for update
using (
  exists (
    select 1
    from organization_members om
    where om.organization_id = organization_notifications.organization_id
      and om.user_id = auth.uid()
      and om.status = 'active'
  )
)
with check (
  exists (
    select 1
    from organization_members om
    where om.organization_id = organization_notifications.organization_id
      and om.user_id = auth.uid()
      and om.status = 'active'
  )
);

create index if not exists organization_notifications_org_created_idx
on organization_notifications (organization_id, created_at desc);

create index if not exists organization_notifications_org_read_idx
on organization_notifications (organization_id, read_at);