import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "./components/Header";
import MagazinePage from "./components/Magazine/MagazinePage";
import CoppaCircoPage from "./components/Coppa/CoppaCircoPage";
import AuthGate from "./components/AuthGate";
import LeagueGate from "./components/LeagueGate";
import { supabase } from "./supabaseClient";
import {
  getLeagues,
  getCurrentProfile,
  joinLeague,
  enterExistingLeague,
  loadLeagueData,
  saveLeagueData,
  signOut,
} from "./supabaseApi";

const Main = styled.main`
  max-width: 1180px;
  margin: 0 auto;
  padding: 28px 20px 80px;
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
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    setError("");
    Promise.all([getLeagues(), getCurrentProfile()])
      .then(([availableLeagues, profile]) => {
        setLeagues(availableLeagues);
        setIsGlobalAdmin(Boolean(profile?.is_admin));
      })
      .catch((loadError) => setError(loadError.message));
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
    setPage("magazine");
    setLeague(nextLeague);
  };

  const exitLeague = () => {
    setPage("magazine");
    setLeague(null);
    setRole(null);
    setReady(false);
    setError("");
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
      />
    );
  if (!ready) return null;

  const canManage = role === "admin";

  return (
    <>
      <Header
        page={page}
        onNavigate={setPage}
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
