create table if not exists profiles (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null unique
        references auth.users(id)
        on delete cascade,

    display_name text,

    avatar_url text,

    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

alter table profiles enable row level security;




create policy "users can view profiles"
on profiles
for select
using (true);

create policy "users can insert own profile"
on profiles
for insert
with check (auth.uid() = user_id);

create policy "users can update own profile"
on profiles
for update
using (auth.uid() = user_id);



create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "users can view profiles"
on profiles
for select
using (true);

create policy "users can insert own profile"
on profiles
for insert
with check (auth.uid() = user_id);

create policy "users can update own profile"
on profiles
for update
using (auth.uid() = user_id);

insert into profiles (user_id, display_name)
select
  id,
  case
    when lower(email) = lower('thomasbscheffler@gmail.com')
      then 'Tommy Scheffler'
    when lower(email) = lower('oliverfluffytail@gmail.com')
      then 'Oliver Test'
  end
from auth.users
where lower(email) in (
  lower('thomasbscheffler@gmail.com'),
  lower('oliverfluffytail@gmail.com')
)
on conflict (user_id)
do update
set display_name = excluded.display_name;