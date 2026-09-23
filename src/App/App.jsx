import React, { useEffect, useState } from "react";
import OneSignal from "react-onesignal";
import { Header } from "../components/Header/Header";
import { MagazinePage } from "../components/Magazine/MagazinePage/MagazinePage";
import { CoppaCircoPage } from "../components/Coppa/CoppaCircoPage/CoppaCircoPage";
import { AuthGate } from "../components/AuthGate/AuthGate";
import { LeagueGate } from "../components/LeagueGate/LeagueGate";
import { supabase } from "../supabase/supabaseClient";
import {
  getLeagues,
  getCurrentProfile,
  joinLeague,
  enterExistingLeague,
  loadLeagueData,
  saveLeagueData,
  signOut,
} from "../supabase/supabaseApi";
import { Main, LoadingScreen, Spinner } from "./styled";
import {
  SELECTED_LEAGUE_KEY,
  LAST_PAGE_KEY,
  oneSignalReady,
  getRequiresPassword,
  getSavedPage,
  clearSavedNavigation,
  getMembership,
  notifyLeague,
} from "./utils";

export const App = () => {
  const [session, setSession] = useState(undefined);
  const [leagues, setLeagues] = useState([]);
  const [page, setPage] = useState("magazine");
  const [league, setLeague] = useState(null);
  const [role, setRole] = useState(null);
  const [articles, setArticles] = useState([]);
  const [rosters, setRosters] = useState([]);
  const [standings, setStandings] = useState([]);
  const [coppaTeams, setCoppaTeams] = useState([]);
  const [coppaMatches, setCoppaMatches] = useState([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [isGlobalAdmin, setIsGlobalAdmin] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setSession(null);
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);

      if (!nextSession?.user?.id) {
        oneSignalReady.then(() => OneSignal.logout()).catch(() => {});
        setLeague(null);
        setRole(null);
        setIsGlobalAdmin(false);
        setReady(false);
        clearSavedNavigation();
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    setError("");
    Promise.all([getLeagues(), getCurrentProfile()])
      .then(async ([availableLeagues, profile]) => {
        setLeagues(availableLeagues);
        const globalAdmin = Boolean(profile?.is_admin);
        setIsGlobalAdmin(globalAdmin);

        const savedLeagueId = sessionStorage.getItem(SELECTED_LEAGUE_KEY);
        const savedLeague = availableLeagues.find(
          (availableLeague) => availableLeague.id === savedLeagueId,
        );
        if (!savedLeague) return;

        try {
          const membership = getMembership(
            await enterExistingLeague(savedLeague.id),
          );
          setRole(globalAdmin ? "admin" : membership.role);
          setPage(getSavedPage());
          setLeague(savedLeague);
        } catch {
          clearSavedNavigation();
        }
      })
      .catch((loadError) => setError(loadError.message))
      .finally(() => setIsRestoring(false));
  }, [session]);

  const userId = session?.user?.id;
  const leagueId = league?.id;
  useEffect(() => {
    if (!userId || !leagueId) return;
    oneSignalReady
      .then(() => OneSignal.login(userId))
      .then(() => OneSignal.User.addTag(`league_${leagueId}`, "1"))
      .catch((tagError) => console.error("Tag OneSignal fallito:", tagError));
  }, [userId, leagueId]);

  useEffect(() => {
    if (!league) return;
    setReady(false);
    loadLeagueData(league.id)
      .then((data) => {
        setArticles(data.articles || []);
        setRosters(data.rosters || []);
        setStandings(data.standings || []);
        setCoppaTeams(data.coppa_teams || []);
        setCoppaMatches(data.coppa_matches || []);
        setReady(true);
      })
      .catch((loadError) => setError(loadError.message));
  }, [league]);

  const enterLeague = async (nextLeague, password) => {
    const result = getRequiresPassword(isGlobalAdmin)
      ? await joinLeague(nextLeague.id, password)
      : await enterExistingLeague(nextLeague.id);
    setRole(getMembership(result).role);
    setPage(getSavedPage());
    setLeague(nextLeague);
    sessionStorage.setItem(SELECTED_LEAGUE_KEY, nextLeague.id);

    // Chiedi il permesso notifiche dopo che l'utente è entrato in una lega
    oneSignalReady
      .then(() => OneSignal.Notifications.requestPermission())
      .catch(() => {});
  };

  const exitLeague = () => {
    setPage("magazine");
    setLeague(null);
    setRole(null);
    setReady(false);
    setError("");
    clearSavedNavigation();
  };

  const navigate = (nextPage) => {
    setPage(nextPage);
    sessionStorage.setItem(LAST_PAGE_KEY, nextPage);
  };

  const updateLeagueData = async (nextData) => {
    if (!league || role !== "admin") return false;
    try {
      await saveLeagueData(league.id, {
        articles,
        rosters,
        standings,
        coppaTeams,
        coppaMatches,
        ...nextData,
      });
      return true;
    } catch (saveError) {
      setError(saveError.message);
      return false;
    }
  };

  const saveArticles = async (next) => {
    const publishedArticle =
      next.length > articles.length ? next[0] : null;
    setArticles(next);
    const ok = await updateLeagueData({ articles: next, rosters, standings });
    if (ok && publishedArticle) {
      notifyLeague({
        leagueId: league?.id,
        accessToken: session?.access_token,
        title: "Nuovo articolo",
        message: `Un nuovo articolo è stato caricato su '${league.name}'`,
      });
    }
    return ok;
  };
  const saveCoppa = async ({ teams, matches }) => {
    setCoppaTeams(teams);
    setCoppaMatches(matches);
    return updateLeagueData({ coppaTeams: teams, coppaMatches: matches });
  };

  if (session === undefined) return null;
  if (!session) return <AuthGate />;
  if (isRestoring)
    return (
      <LoadingScreen aria-label="Caricamento">
        <Spinner />
      </LoadingScreen>
    );
  if (!league)
    return (
      <LeagueGate
        leagues={leagues}
        onSelect={enterLeague}
        onExit={signOut}
        requiresPassword={getRequiresPassword(isGlobalAdmin)}
        initialLeagueId={sessionStorage.getItem(SELECTED_LEAGUE_KEY)}
      />
    );
  if (!ready) return null;

  const canManage = role === "admin";

  return (
    <>
      <Header
        page={page}
        onNavigate={navigate}
        onExit={exitLeague}
        onSignOut={signOut}
        currentLeague={league.name}
      />
      {error && <p role="alert">{error}</p>}
      <Main>
        {page === "magazine" && (
          <MagazinePage
            articles={articles}
            onSaveArticles={saveArticles}
            canManage={canManage}
          />
        )}
        {page === "coppaCirco" && (
          <CoppaCircoPage
            coppaTeams={coppaTeams}
            coppaMatches={coppaMatches}
            onSaveCoppa={saveCoppa}
            canManage={canManage}
          />
        )}
      </Main>
    </>
  );
};
