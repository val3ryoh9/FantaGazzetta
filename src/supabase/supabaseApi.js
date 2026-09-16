import { supabase } from "./supabaseClient";

function requireClient() {
  if (!supabase) {
    throw new Error(
      "Configura VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY nel file .env",
    );
  }
  return supabase;
}

export async function saveUsername(username) {
  const { data: userData } = await requireClient().auth.getUser();
  if (!userData.user) throw new Error("Sessione utente non disponibile");

  const { error } = await requireClient().from("profiles").upsert({
    id: userData.user.id,
    username,
  });
  if (error) throw error;
}

export async function getCurrentProfile() {
  const { data: userData } = await requireClient().auth.getUser();
  if (!userData.user) return null;

  const { data, error } = await requireClient()
    .from("profiles")
    .select("is_admin")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function usernameExists(username) {
  const { data, error } = await requireClient().rpc("username_exists", {
    requested_username: username,
  });
  if (error) throw error;
  return Boolean(data);
}

export async function loginWithUsername(username) {
  const { data, error } = await requireClient().rpc("login_with_username", {
    requested_username: username,
  });
  if (error) throw error;
  return Boolean(data);
}

export async function getLeagues() {
  const { data, error } = await requireClient()
    .from("leagues")
    .select("id, name")
    .eq("active", true)
    .order("name");
  if (error) throw error;
  return data;
}

export async function joinLeague(leagueId, password) {
  const { data, error } = await requireClient().rpc("join_league", {
    target_league_id: leagueId,
    league_password: password,
  });
  if (error) throw error;
  return data;
}

export async function enterExistingLeague(leagueId) {
  const { data, error } = await requireClient().rpc("enter_league_existing", {
    target_league_id: leagueId,
  });
  if (error) throw error;
  return data;
}

export async function loadLeagueData(leagueId) {
  const client = requireClient();
  const [{ data, error }, { data: teamRows, error: teamsError }] =
    await Promise.all([
      client
        .from("league_data")
        .select("articles, rosters, standings, coppa_teams, coppa_matches")
        .eq("league_id", leagueId)
        .maybeSingle(),
      client
        .from("league_coppa_teams")
        .select("team_id, name, team_order")
        .eq("league_id", leagueId)
        .order("team_order"),
    ]);
  if (error) throw error;
  if (teamsError) throw teamsError;
  return data
    ? {
        ...data,
        coppa_teams: teamRows?.length
          ? teamRows.map((team) => ({ id: team.team_id, name: team.name }))
          : data.coppa_teams || [],
      }
    : {
        articles: [],
        rosters: [],
        standings: [],
        coppa_teams:
          teamRows?.map((team) => ({ id: team.team_id, name: team.name })) ||
          [],
        coppa_matches: [],
      };
}

export async function saveLeagueData(leagueId, data) {
  const client = requireClient();
  const { error } = await client.from("league_data").upsert({
    league_id: leagueId,
    articles: data.articles,
    rosters: data.rosters,
    standings: data.standings,
    coppa_teams: data.coppaTeams,
    coppa_matches: data.coppaMatches,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;

  const { error: deleteError } = await client
    .from("league_coppa_teams")
    .delete()
    .eq("league_id", leagueId);
  if (deleteError) throw deleteError;

  if (data.coppaTeams?.length) {
    const { error: insertError } = await client
      .from("league_coppa_teams")
      .insert(
        data.coppaTeams.map((team, index) => ({
          league_id: leagueId,
          team_id: team.id,
          name: team.name,
          team_order: index,
        })),
      );
    if (insertError) throw insertError;
  }
  return true;
}

export async function signOut() {
  const { error } = await requireClient().auth.signOut();
  if (error) throw error;
}
