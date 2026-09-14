begin;

create table if not exists public.league_coppa_teams (
  league_id uuid not null references public.leagues(id) on delete cascade,
  team_id text not null,
  name text not null,
  team_order integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (league_id, team_id)
);

-- Migra le squadre già salvate nel JSON di league_data, se la tabella è vuota.
insert into public.league_coppa_teams (league_id, team_id, name, team_order)
select
  leagues.id,
  team_data.item->>'id',
  team_data.item->>'name',
  (team_data.position - 1)::integer
from public.leagues as leagues
join public.league_data as league_data on league_data.league_id = leagues.id
cross join lateral jsonb_array_elements(
  coalesce(league_data.coppa_teams, '[]'::jsonb)
) with ordinality as team_data(item, position)
where leagues.name = 'FantaCirco'
  and team_data.item->>'id' is not null
  and team_data.item->>'name' is not null
on conflict (league_id, team_id) do nothing;

-- Se il vecchio JSON delle squadre era vuoto, recupera gli ID dalle partite.
insert into public.league_coppa_teams (league_id, team_id, name, team_order)
select
  leagues.id,
  source.team_id,
  'Squadra ' || (source.team_order + 1),
  source.team_order
from public.leagues as leagues
join public.league_data as league_data on league_data.league_id = leagues.id
cross join lateral (
  select team_id,
    row_number() over (order by min(first_seen))::integer - 1 as team_order
  from (
    select
      match_data.item->>'homeId' as team_id,
      min(match_data.position::integer) as first_seen
    from jsonb_array_elements(
      coalesce(league_data.coppa_matches, '[]'::jsonb)
    ) with ordinality as match_data(item, position)
    where match_data.item->>'homeId' is not null
    group by match_data.item->>'homeId'
    union all
    select
      match_data.item->>'awayId' as team_id,
      min(match_data.position::integer) as first_seen
    from jsonb_array_elements(
      coalesce(league_data.coppa_matches, '[]'::jsonb)
    ) with ordinality as match_data(item, position)
    where match_data.item->>'awayId' is not null
    group by match_data.item->>'awayId'
  ) as match_teams
  group by team_id
  order by min(first_seen)
  limit 10
) as source
where leagues.name = 'FantaCirco'
  and source.team_id is not null
on conflict (league_id, team_id) do nothing;

-- Ultimo fallback: crea le righe mancanti se la Coppa non aveva ancora dati.
insert into public.league_coppa_teams (league_id, team_id, name, team_order)
select leagues.id, 'manual-team-' || numbers.number,
  'Squadra ' || numbers.number, numbers.number - 1
from public.leagues as leagues
cross join generate_series(1, 10) as numbers(number)
where leagues.name = 'FantaCirco'
  and not exists (
    select 1 from public.league_coppa_teams as teams
    where teams.league_id = leagues.id
      and teams.team_order = numbers.number - 1
  )
on conflict (league_id, team_id) do nothing;

-- Sostituisci i 10 nomi qui sotto. team_order va da 0 a 9.
with nuovi_nomi(team_order, nuovo_nome) as (
  values
    (0, 'SCOPENAGHEN'),
    (1, 'FC VATUSSI CLAN'),
    (2, 'SOULERNITANA'),
    (3, 'GAMBERETTO FC'),
    (4, 'MANCELIAC UNITED'),
    (5, 'FRATTESI DITALIA'),
    (6, 'KA AL-HIARI'),
    (7, 'NOT SELLING DREAMS FC'),
    (8, 'TOTONA FC'),
    (9, 'LONGOBARDA')
)
update public.league_coppa_teams as teams
set name = nuovi_nomi.nuovo_nome
from nuovi_nomi
join public.leagues as leagues on leagues.name = 'FantaCirco'
where teams.league_id = leagues.id
  and teams.team_order = nuovi_nomi.team_order;

-- Controllo: la lega deve contenere esattamente 10 squadre.
do $$
declare
  squadre_aggiornate integer;
begin
  select count(*) into squadre_aggiornate
  from public.league_coppa_teams as teams
  join public.leagues as leagues on leagues.id = teams.league_id
  where leagues.name = 'FantaCirco';

  if squadre_aggiornate <> 10 then
    raise exception 'FantaCirco contiene % squadre invece di 10', squadre_aggiornate;
  end if;
end $$;

commit;
