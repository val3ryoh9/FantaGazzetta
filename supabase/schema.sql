create extension if not exists pgcrypto;

create table if not exists public.leagues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  password_hash text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists is_admin boolean not null default false;

create unique index if not exists profiles_username_unique
on public.profiles (lower(username));

create table if not exists public.league_members (
  league_id uuid not null references public.leagues(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (league_id, user_id)
);

create table if not exists public.league_data (
  league_id uuid primary key references public.leagues(id) on delete cascade,
  articles jsonb not null default '[]'::jsonb,
  rosters jsonb not null default '[]'::jsonb,
  standings jsonb not null default '[]'::jsonb,
  coppa_teams jsonb not null default '[]'::jsonb,
  coppa_matches jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.league_coppa_teams (
  league_id uuid not null references public.leagues(id) on delete cascade,
  team_id text not null,
  name text not null,
  team_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (league_id, team_id)
);

alter table public.leagues enable row level security;
alter table public.profiles enable row level security;
alter table public.league_members enable row level security;
alter table public.league_data enable row level security;
alter table public.league_coppa_teams enable row level security;

create policy "authenticated users can list active leagues"
on public.leagues for select to authenticated using (active = true);

create policy "users can manage their own profile"
on public.profiles for all to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "members can view their memberships"
on public.league_members for select to authenticated
using (user_id = auth.uid());

create policy "members can read their league data"
on public.league_data for select to authenticated
using (exists (
  select 1 from public.league_members m
  where m.league_id = league_data.league_id and m.user_id = auth.uid()
));

create policy "admins can write their league data"
on public.league_data for all to authenticated
using ((exists (
  select 1 from public.league_members m
  where m.league_id = league_data.league_id and m.user_id = auth.uid() and m.role = 'admin'
)) or exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_admin = true
))
with check (exists (
  select 1 from public.league_members m
  where m.league_id = league_data.league_id and m.user_id = auth.uid() and m.role = 'admin'
)) or exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_admin = true
));

create policy "members can read coppa teams"
on public.league_coppa_teams for select to authenticated
using (exists (
  select 1 from public.league_members m
  where m.league_id = league_coppa_teams.league_id and m.user_id = auth.uid()
));

create policy "admins can manage coppa teams"
on public.league_coppa_teams for all to authenticated
using ((exists (
  select 1 from public.league_members m
  where m.league_id = league_coppa_teams.league_id
    and m.user_id = auth.uid() and m.role = 'admin'
)) or exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_admin = true
))
with check ((exists (
  select 1 from public.league_members m
  where m.league_id = league_coppa_teams.league_id
    and m.user_id = auth.uid() and m.role = 'admin'
)) or exists (
  select 1 from public.profiles p
  where p.id = auth.uid() and p.is_admin = true
));

create or replace function public.join_league(target_league_id uuid, league_password text)
returns table (league_id uuid, role text)
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_league public.leagues;
  member_role text;
  global_admin boolean;
begin
  select p.is_admin into global_admin
  from public.profiles as p
  where p.id = auth.uid();

  select l.* into selected_league
  from public.leagues as l
  where l.id = target_league_id and l.active = true
    and l.password_hash = extensions.crypt(league_password, l.password_hash);

  if selected_league.id is null then
    raise exception 'Password della lega non valida';
  end if;

  insert into public.league_members (league_id, user_id)
  values (target_league_id, auth.uid())
  on conflict on constraint league_members_pkey do nothing;

  select lm.role into member_role
  from public.league_members as lm
  where lm.league_id = target_league_id and lm.user_id = auth.uid();

  return query select target_league_id as league_id,
    case when coalesce(global_admin, false) then 'admin' else member_role end as role;
end;
$$;

grant execute on function public.join_league(uuid, text) to authenticated;

create or replace function public.username_exists(requested_username text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where lower(username) = lower(trim(requested_username))
  );
$$;

create or replace function public.login_with_username(requested_username text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_registered_user uuid;
  v_is_admin boolean;
begin
  select p.id, p.is_admin into v_registered_user, v_is_admin
  from public.profiles
  where lower(username) = lower(trim(requested_username));

  if v_registered_user is null then return false; end if;
    return false;
  end if;

  insert into public.league_members (league_id, user_id, role)
  select l.id, auth.uid(), 'admin'
  from public.leagues as l
  where v_is_admin
  on conflict (league_id, user_id) do update set role = excluded.role;

  insert into public.league_members (league_id, user_id, role)
  select lm.league_id, auth.uid(), lm.role
  from public.league_members as lm
  where lm.user_id = v_registered_user and not coalesce(v_is_admin, false)
  on conflict (league_id, user_id) do update set role = excluded.role;

  return true;
end;
$$;

grant execute on function public.username_exists(text) to anon, authenticated;
grant execute on function public.login_with_username(text) to authenticated;

insert into public.leagues (name, password_hash, active)
select 'FantaCirco', extensions.crypt('DonniniLeague', extensions.gen_salt('bf')), true
where not exists (select 1 from public.leagues where name = 'FantaCirco');

insert into public.leagues (name, password_hash, active)
select 'Federazione Italiana Pippe', extensions.crypt('Pippepompe', extensions.gen_salt('bf')), true
where not exists (select 1 from public.leagues where name = 'Federazione Italiana Pippe');

-- Dopo aver creato il tuo account con Supabase Auth, esegui:
-- insert into public.league_members (league_id, user_id, role)
-- select l.id, 'IL_TUO_USER_ID', 'admin'
-- from public.leagues l where l.name = 'FantaCirco';
