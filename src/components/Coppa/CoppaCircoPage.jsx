import React, { useEffect, useMemo, useState } from "react";
import { Button, InputNumber, App as AntdApp } from "antd";
import { uid } from "../../utils";
import {
  Head,
  BracketMatch,
  BracketTeam,
  Title,
  Tools,
  Hint,
  Section,
  SectionTitle,
  TableWrap,
  Table,
  Th,
  Td,
  TeamTd,
  PtTd,
  Matchday,
  MatchdayTitle,
  Match,
  Score,
  ScoreValue,
  MatchTeam,
  BracketPlayIn,
  MobileBracketNav,
  BracketTabButton,
  Bracket,
  BracketColumn,
  BracketColumnTitle,
} from "./styled";

export const TEAM_COUNT = 10;

export function createTeams() {
  return Array.from({ length: TEAM_COUNT }, (_, index) => ({
    id: uid(),
    name: `Squadra ${index + 1}`,
  }));
}

export function createMatches(teams, previousMatches = []) {
  const previousByDirection = new Map(
    previousMatches.map((match) => [`${match.homeId}:${match.awayId}`, match]),
  );
  const matches = [];

  for (let leg = 0; leg < 2; leg += 1) {
    const rotation = [...teams];
    for (let round = 0; round < teams.length - 1; round += 1) {
      for (let index = 0; index < teams.length / 2; index += 1) {
        const first = rotation[index];
        const second = rotation[teams.length - 1 - index];
        const firstHome = round % 2 === 0 ? first : second;
        const firstAway = round % 2 === 0 ? second : first;
        const home = leg === 0 ? firstHome : firstAway;
        const away = leg === 0 ? firstAway : firstHome;
        const previous = previousByDirection.get(`${home.id}:${away.id}`);

        matches.push({
          id: uid(),
          matchday: leg * (teams.length - 1) + round + 1,
          homeId: home.id,
          awayId: away.id,
          homeGoals: previous?.homeGoals ?? null,
          awayGoals: previous?.awayGoals ?? null,
        });
      }

      rotation.splice(1, 0, rotation.pop());
    }
  }

  return matches;
}

export function buildTable(teams, matches) {
  const table = teams.map((team) => ({
    ...team,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
  }));
  const byId = new Map(table.map((team) => [team.id, team]));

  matches.forEach((match) => {
    if (match.stage) return;
    if (match.homeGoals === null || match.awayGoals === null) return;
    const home = byId.get(match.homeId);
    const away = byId.get(match.awayId);
    if (!home || !away) return;
    const homeGoals = Number(match.homeGoals) || 0;
    const awayGoals = Number(match.awayGoals) || 0;
    home.played += 1;
    away.played += 1;
    home.goalsFor += homeGoals;
    home.goalsAgainst += awayGoals;
    away.goalsFor += awayGoals;
    away.goalsAgainst += homeGoals;
    if (homeGoals > awayGoals) {
      home.wins += 1;
      away.losses += 1;
      home.points += 3;
    } else if (homeGoals < awayGoals) {
      away.wins += 1;
      home.losses += 1;
      away.points += 3;
    } else {
      home.draws += 1;
      away.draws += 1;
      home.points += 1;
      away.points += 1;
    }
  });

  return table.sort(
    (a, b) =>
      b.points - a.points ||
      b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst) ||
      b.goalsFor - a.goalsFor ||
      a.name.localeCompare(b.name),
  );
}

export function getBracketTeams(table) {
  const qualified = table;
  return {
    playIn: [
      [qualified[6], qualified[9]],
      [qualified[7], qualified[8]],
    ],
    quarterfinals: [
      [qualified[0], { name: "Vincente 8a vs 9a", placeholder: true }],
      [qualified[3], qualified[4]],
      [qualified[1], { name: "Vincente 7a vs 10a", placeholder: true }],
      [qualified[2], qualified[5]],
    ],
  };
}

export function BracketMatchCard({ teams }) {
  return (
    <BracketMatch>
      {teams.map((team, index) => (
        <BracketTeam
          key={`${team?.id || team?.name || "empty"}-${index}`}
          $placeholder={!team || team.placeholder}
        >
          <span>{team?.name || "Da definire"}</span>
          <span>-</span>
        </BracketTeam>
      ))}
    </BracketMatch>
  );
}

export default function CoppaCircoPage({
  coppaTeams,
  coppaMatches,
  onSaveCoppa,
  canManage,
}) {
  const { message } = AntdApp.useApp();
  const [mobileTab, setMobileTab] = useState("quarti");
  const [teams, setTeams] = useState(() =>
    coppaTeams?.length === TEAM_COUNT ? coppaTeams : createTeams(),
  );
  const [matches, setMatches] = useState(() => {
    const initialTeams =
      coppaTeams?.length === TEAM_COUNT ? coppaTeams : createTeams();
    return coppaMatches?.length === TEAM_COUNT * (TEAM_COUNT - 1) &&
      coppaMatches.every((match) => match.matchday)
      ? coppaMatches
      : createMatches(initialTeams, coppaMatches || []);
  });

  useEffect(() => {
    const nextTeams =
      coppaTeams?.length === TEAM_COUNT ? coppaTeams : createTeams();
    setTeams(nextTeams);
    const hasCompleteSchedule =
      coppaMatches?.length === TEAM_COUNT * (TEAM_COUNT - 1) &&
      coppaMatches.every((match) => match.matchday);
    setMatches(
      hasCompleteSchedule
        ? coppaMatches
        : createMatches(nextTeams, coppaMatches || []),
    );
  }, [coppaTeams, coppaMatches]);

  const table = useMemo(() => buildTable(teams, matches), [teams, matches]);
  const teamById = useMemo(
    () => new Map(teams.map((team) => [team.id, team])),
    [teams],
  );
  const matchesByMatchday = useMemo(
    () =>
      matches.reduce((groups, match) => {
        const matchday = match.matchday || 1;
        if (!groups[matchday]) groups[matchday] = [];
        groups[matchday].push(match);
        return groups;
      }, {}),
    [matches],
  );
  const bracketTeams = useMemo(() => getBracketTeams(table), [table]);

  const updateScore = (id, field, value) => {
    setMatches((current) =>
      current.map((match) =>
        match.id === id ? { ...match, [field]: value ?? null } : match,
      ),
    );
  };

  const save = async () => {
    const ok = await onSaveCoppa({ teams, matches });
    message[ok ? "success" : "error"](
      ok ? "Coppa Circo salvata" : "Errore nel salvataggio",
    );
  };

  return (
    <div>
      <Head>
        <Title>Coppa Circo</Title>
        {canManage && (
          <Tools>
            <Button type="primary" onClick={save}>
              Salva coppa
            </Button>
          </Tools>
        )}
      </Head>
      <Hint>
        Dieci squadre, girone unico di andata e ritorno: ogni squadra affronta
        tutte le altre due volte, una in casa e una in trasferta.
      </Hint>

      <Section>
        <SectionTitle>Classifica</SectionTitle>
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th>#</Th>
                <Th>Squadra</Th>
                <Th>Pt</Th>
                <Th>G</Th>
                <Th>V</Th>
                <Th>N</Th>
                <Th>P</Th>
                <Th>GF</Th>
                <Th>GS</Th>
                <Th>DR</Th>
              </tr>
            </thead>
            <tbody>
              {table.map((team, index) => (
                <tr key={team.id}>
                  <Td>{index + 1}</Td>
                  <TeamTd>{team.name}</TeamTd>
                  <PtTd>{team.points}</PtTd>
                  <Td>{team.played}</Td>
                  <Td>{team.wins}</Td>
                  <Td>{team.draws}</Td>
                  <Td>{team.losses}</Td>
                  <Td>{team.goalsFor}</Td>
                  <Td>{team.goalsAgainst}</Td>
                  <Td>{team.goalsFor - team.goalsAgainst}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      </Section>

      <Section>
        <SectionTitle>Giornate</SectionTitle>
        {Object.entries(matchesByMatchday).map(([matchday, dayMatches]) => (
          <Matchday key={matchday}>
            <MatchdayTitle>Giornata {matchday}</MatchdayTitle>
            {dayMatches.map((match) => (
              <Match key={match.id}>
                <MatchTeam>
                  {teamById.get(match.homeId)?.name || "Squadra"}
                </MatchTeam>
                <Score>
                  {canManage ? (
                    <>
                      <InputNumber
                        min={0}
                        value={match.homeGoals}
                        onChange={(value) =>
                          updateScore(match.id, "homeGoals", value)
                        }
                      />
                      <InputNumber
                        min={0}
                        value={match.awayGoals}
                        onChange={(value) =>
                          updateScore(match.id, "awayGoals", value)
                        }
                      />
                    </>
                  ) : (
                    <>
                      <ScoreValue>{match.homeGoals ?? "-"}</ScoreValue>
                      <ScoreValue>{match.awayGoals ?? "-"}</ScoreValue>
                    </>
                  )}
                </Score>
                <MatchTeam $away>
                  {teamById.get(match.awayId)?.name || "Squadra"}
                </MatchTeam>
              </Match>
            ))}
          </Matchday>
        ))}
      </Section>

      <Section>
        <SectionTitle>Gara secca</SectionTitle>
        <Hint>
          La 7a sfida la 10a e la 8a sfida la 9a. Le due vincitrici completano
          le otto squadre del tabellone principale.
        </Hint>
        <BracketPlayIn>
          {bracketTeams.playIn.map((teams, index) => (
            <BracketMatchCard key={`play-in-${index}`} teams={teams} />
          ))}
        </BracketPlayIn>
      </Section>

      <Section>
        <SectionTitle>Tabellone principale</SectionTitle>

        <MobileBracketNav>
          <BracketTabButton
            $active={mobileTab === "quarti"}
            onClick={() => setMobileTab("quarti")}
          >
            Quarti di finale
          </BracketTabButton>
          <BracketTabButton
            $active={mobileTab === "semifinali"}
            onClick={() => setMobileTab("semifinali")}
          >
            Semifinali
          </BracketTabButton>
          <BracketTabButton
            $active={mobileTab === "finale"}
            onClick={() => setMobileTab("finale")}
          >
            Finale
          </BracketTabButton>
        </MobileBracketNav>

        <Bracket>
          {/* QUARTI SX */}
          <BracketColumn $showMobile={mobileTab === "quarti"}>
            <BracketColumnTitle>Quarti</BracketColumnTitle>
            <BracketMatchCard teams={bracketTeams.quarterfinals[0]} />
            <BracketMatchCard teams={bracketTeams.quarterfinals[1]} />
          </BracketColumn>

          {/* SEMIFINALE SX */}
          <BracketColumn $showMobile={mobileTab === "semifinali"}>
            <BracketColumnTitle>Semifinale 1</BracketColumnTitle>
            <BracketMatchCard teams={[null, null]} />
          </BracketColumn>

          {/* FINALE */}
          <BracketColumn $showMobile={mobileTab === "finale"}>
            <BracketColumnTitle>Finale</BracketColumnTitle>
            <BracketMatchCard teams={[null, null]} />
          </BracketColumn>

          {/* SEMIFINALE DX */}
          <BracketColumn $showMobile={mobileTab === "semifinali"}>
            <BracketColumnTitle>Semifinale 2</BracketColumnTitle>
            <BracketMatchCard teams={[null, null]} />
          </BracketColumn>

          {/* QUARTI DX */}
          <BracketColumn $showMobile={mobileTab === "quarti"}>
            <BracketColumnTitle>Quarti</BracketColumnTitle>
            <BracketMatchCard teams={bracketTeams.quarterfinals[2]} />
            <BracketMatchCard teams={bracketTeams.quarterfinals[3]} />
          </BracketColumn>
        </Bracket>
      </Section>
    </div>
  );
}
