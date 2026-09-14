alter table public.league_data
  add column if not exists coppa_teams jsonb not null default '[]'::jsonb;

alter table public.league_data
  add column if not exists coppa_matches jsonb not null default '[]'::jsonb;

create table if not exists public.league_coppa_teams (
  league_id uuid not null references public.leagues(id) on delete cascade,
  team_id text not null,
  name text not null,
  team_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (league_id, team_id)
);

alter table public.league_coppa_teams enable row level security;

drop policy if exists "members can read coppa teams" on public.league_coppa_teams;
create policy "members can read coppa teams"
on public.league_coppa_teams for select to authenticated
using (exists (
  select 1 from public.league_members m
  where m.league_id = league_coppa_teams.league_id and m.user_id = auth.uid()
));

drop policy if exists "admins can manage coppa teams" on public.league_coppa_teams;
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

notify pgrst, 'reload schema';
