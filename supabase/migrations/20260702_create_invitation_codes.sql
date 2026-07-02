create table if not exists invitation_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  purpose text not null default 'founding_coach',
  plan_type text not null default 'coach_professional',
  managed_client_limit integer not null default 25,
  max_redemptions integer not null default 10,
  redemptions integer not null default 0,
  active boolean not null default true,
  expires_at timestamptz,
  beta_expires_after_days integer not null default 90,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists invitation_code_redemptions (
  id uuid primary key default gen_random_uuid(),
  invitation_code_id uuid not null references invitation_codes(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  redeemed_by uuid not null references auth.users(id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  beta_access_expires_at timestamptz,
  unique(invitation_code_id, organization_id)
);

alter table invitation_codes enable row level security;
alter table invitation_code_redemptions enable row level security;