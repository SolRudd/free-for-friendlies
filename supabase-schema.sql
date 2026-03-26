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
  bio text,
  city text,
  area text,
  age_group text,
  skill_level text,
  preferred_match_day text,
  contact_email text,
  whatsapp_number text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
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
  preferred_date date,
  preferred_time text,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.match_requests enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "teams_public_read" on public.teams for select to anon, authenticated using (is_active = true);
create policy "teams_owner_insert" on public.teams for insert to authenticated with check (owner_id = auth.uid());
create policy "teams_owner_update" on public.teams for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "match_requests_public_read" on public.match_requests for select to anon, authenticated using (status = 'open');
create policy "match_requests_owner_insert" on public.match_requests for insert to authenticated with check (
  exists (select 1 from public.teams where teams.id = match_requests.team_id and teams.owner_id = auth.uid())
);
create policy "match_requests_owner_update" on public.match_requests for update to authenticated using (
  exists (select 1 from public.teams where teams.id = match_requests.team_id and teams.owner_id = auth.uid())
) with check (
  exists (select 1 from public.teams where teams.id = match_requests.team_id and teams.owner_id = auth.uid())
);
