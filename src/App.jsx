import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "./components/Header";
import MagazinePage from "./components/Magazine/MagazinePage";
import CoppaCircoPage from "./components/Coppa/CoppaCircoPage";
import AuthGate from "./components/AuthGate";
import LeagueGate from "./components/LeagueGate";
import { supabase } from "./supabase/supabaseClient";
import {
  getLeagues,
  getCurrentProfile,
  joinLeague,
  enterExistingLeague,
  loadLeagueData,
  saveLeagueData,
  signOut,
} from "./supabase/supabaseApi";
import { theme } from './GlobalStyle'

const SELECTED_LEAGUE_KEY = "Fantagazzetta_selected_league";
const LAST_PAGE_KEY = "Fantagazzetta_last_page";

const Main = styled.main`
  max-width: 1180px;
  margin: 0 auto;
  padding: 28px 20px 80px;
`;
const LoadingScreen = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: ${theme.colors.paper};
`;
const Spinner = styled.div`
  width: 42px;
  height: 42px;
  border: 4px solid ${theme.colors.line};
  border-top-color: ${theme.colors.gold};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default function App() {
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
      if (!nextSession) {
        setLeague(null);
        setRole(null);
        setIsGlobalAdmin(false);
        setReady(false);
        sessionStorage.removeItem(SELECTED_LEAGUE_KEY);
        sessionStorage.removeItem(LAST_PAGE_KEY);
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
          const result = await enterExistingLeague(savedLeague.id);
          const membership = Array.isArray(result) ? result[0] : result;
          setRole(globalAdmin ? "admin" : membership.role);
          const savedPage = sessionStorage.getItem(LAST_PAGE_KEY);
          setPage(savedPage === "coppaCirco" ? savedPage : "magazine");
          setLeague(savedLeague);
        } catch {
          sessionStorage.removeItem(SELECTED_LEAGUE_KEY);
          sessionStorage.removeItem(LAST_PAGE_KEY);
        }
      })
      .catch((loadError) => setError(loadError.message))
      .finally(() => setIsRestoring(false));
  }, [session]);

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
    const requiresPassword =
      !isGlobalAdmin &&
      sessionStorage.getItem("Fantagazzetta_auth_mode") !== "login";
    const result = requiresPassword
      ? await joinLeague(nextLeague.id, password)
      : await enterExistingLeague(nextLeague.id);
    const membership = Array.isArray(result) ? result[0] : result;
    setRole(membership.role);
    const savedPage = sessionStorage.getItem(LAST_PAGE_KEY);
    setPage(savedPage === "coppaCirco" ? savedPage : "magazine");
    setLeague(nextLeague);
    sessionStorage.setItem(SELECTED_LEAGUE_KEY, nextLeague.id);
  };

  const exitLeague = () => {
    setPage("magazine");
    setLeague(null);
    setRole(null);
    setReady(false);
    setError("");
    sessionStorage.removeItem(SELECTED_LEAGUE_KEY);
    sessionStorage.removeItem(LAST_PAGE_KEY);
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
    setArticles(next);
    return updateLeagueData({ articles: next, rosters, standings });
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
  const requiresPassword =
    !isGlobalAdmin &&
    sessionStorage.getItem("Fantagazzetta_auth_mode") !== "login";
  if (!league)
    return (
      <LeagueGate
        leagues={leagues}
        onSelect={enterLeague}
        onExit={signOut}
        requiresPassword={requiresPassword}
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
}
