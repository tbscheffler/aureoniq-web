create table if not exists regional_labor_profiles (
  id text primary key,
  profile_name text not null,
  state_code text not null,
  covered_region text,
  dominant_industries jsonb not null default '[]'::jsonb,
  emerging_industries jsonb not null default '[]'::jsonb,
  common_transition_roles jsonb not null default '[]'::jsonb,
  limited_local_opportunities jsonb not null default '[]'::jsonb,
  nearby_growth_markets jsonb not null default '[]'::jsonb,
  remote_friendliness_score numeric,
  industry_weights jsonb not null default '{}'::jsonb,
  advisor_notes text,
  last_reviewed date default current_date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);




alter table location_regions
add column if not exists regional_labor_profile_id text;

alter table location_regions
add constraint location_regions_regional_labor_profile_fk
foreign key (regional_labor_profile_id)
references regional_labor_profiles(id);