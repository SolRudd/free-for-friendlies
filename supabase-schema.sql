create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  phone text,
  location text,
  role_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  slug text not null unique,
  logo_url text,
  bio text,
  city text,
  area text,
  age_group text,
  skill_level text,
  team_format text,
  preferred_match_day text,
  pitch_status text,
  travel_willingness text,
  contact_email text,
  whatsapp_number text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  request_message text,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (team_id, user_id)
);

create table if not exists public.match_requests (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.teams(id) on delete cascade,
  title text not null,
  description text,
  city text,
  area text,
  age_group text,
  skill_level text,
  match_format text,
  venue_status text,
  travel_willingness text,
  preferred_date date,
  preferred_time text,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists location text;
alter table public.profiles add column if not exists role_label text;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

alter table public.teams add column if not exists slug text;
alter table public.teams add column if not exists logo_url text;
alter table public.teams add column if not exists bio text;
alter table public.teams add column if not exists city text;
alter table public.teams add column if not exists area text;
alter table public.teams add column if not exists age_group text;
alter table public.teams add column if not exists skill_level text;
alter table public.teams add column if not exists team_format text;
alter table public.teams add column if not exists preferred_match_day text;
alter table public.teams add column if not exists pitch_status text;
alter table public.teams add column if not exists travel_willingness text;
alter table public.teams add column if not exists contact_email text;
alter table public.teams add column if not exists whatsapp_number text;
alter table public.teams add column if not exists is_active boolean not null default true;
alter table public.teams add column if not exists created_at timestamptz not null default now();
alter table public.teams add column if not exists updated_at timestamptz not null default now();

alter table public.team_members add column if not exists status text not null default 'pending';
alter table public.team_members add column if not exists request_message text;
alter table public.team_members add column if not exists approved_at timestamptz;
alter table public.team_members add column if not exists created_at timestamptz not null default now();
alter table public.team_members add column if not exists updated_at timestamptz not null default now();

alter table public.match_requests add column if not exists description text;
alter table public.match_requests add column if not exists city text;
alter table public.match_requests add column if not exists area text;
alter table public.match_requests add column if not exists age_group text;
alter table public.match_requests add column if not exists skill_level text;
alter table public.match_requests add column if not exists match_format text;
alter table public.match_requests add column if not exists venue_status text;
alter table public.match_requests add column if not exists travel_willingness text;
alter table public.match_requests add column if not exists preferred_date date;
alter table public.match_requests add column if not exists preferred_time text;
alter table public.match_requests add column if not exists status text not null default 'open';
alter table public.match_requests add column if not exists created_at timestamptz not null default now();
alter table public.match_requests add column if not exists updated_at timestamptz not null default now();

alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.match_requests enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "teams_public_read" on public.teams;
drop policy if exists "teams_owner_insert" on public.teams;
drop policy if exists "teams_owner_update" on public.teams;
drop policy if exists "team_members_self_read" on public.team_members;
drop policy if exists "team_members_owner_read" on public.team_members;
drop policy if exists "team_members_public_read_approved" on public.team_members;
drop policy if exists "team_members_self_insert" on public.team_members;
drop policy if exists "team_members_owner_update" on public.team_members;
drop policy if exists "match_requests_public_read" on public.match_requests;
drop policy if exists "match_requests_owner_insert" on public.match_requests;
drop policy if exists "match_requests_owner_update" on public.match_requests;

create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "teams_public_read" on public.teams for select to anon, authenticated using (is_active = true);
create policy "teams_owner_insert" on public.teams for insert to authenticated with check (owner_id = auth.uid());
create policy "teams_owner_update" on public.teams for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "team_members_self_read" on public.team_members for select to authenticated using (user_id = auth.uid());
create policy "team_members_owner_read" on public.team_members for select to authenticated using (
  exists (select 1 from public.teams where teams.id = team_members.team_id and teams.owner_id = auth.uid())
);
create policy "team_members_public_read_approved" on public.team_members for select to anon, authenticated using (
  status = 'approved'
);
create policy "team_members_self_insert" on public.team_members for insert to authenticated with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.teams
    where teams.id = team_members.team_id
      and teams.owner_id <> auth.uid()
      and teams.is_active = true
  )
);
create policy "team_members_owner_update" on public.team_members for update to authenticated using (
  exists (select 1 from public.teams where teams.id = team_members.team_id and teams.owner_id = auth.uid())
) with check (
  exists (select 1 from public.teams where teams.id = team_members.team_id and teams.owner_id = auth.uid())
);

create policy "match_requests_public_read" on public.match_requests for select to anon, authenticated using (status = 'open');
create policy "match_requests_owner_insert" on public.match_requests for insert to authenticated with check (
  exists (select 1 from public.teams where teams.id = match_requests.team_id and teams.owner_id = auth.uid())
);
create policy "match_requests_owner_update" on public.match_requests for update to authenticated using (
  exists (select 1 from public.teams where teams.id = match_requests.team_id and teams.owner_id = auth.uid())
) with check (
  exists (select 1 from public.teams where teams.id = match_requests.team_id and teams.owner_id = auth.uid())
);
