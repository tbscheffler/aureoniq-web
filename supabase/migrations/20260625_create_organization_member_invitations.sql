create table if not exists organization_member_invitations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  invited_by uuid not null references auth.users(id) on delete cascade,
  invite_email text not null,
  role text not null default 'coach',
  status text not null default 'pending',
  token text not null default encode(gen_random_bytes(32), 'hex'),
  expires_at timestamptz not null default now() + interval '7 days',
  accepted_at timestamptz,
  accepted_user_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table organization_member_invitations enable row level security;

create unique index if not exists organization_member_invitations_token_idx
on organization_member_invitations(token);