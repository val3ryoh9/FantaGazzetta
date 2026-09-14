import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Button, Input, InputNumber, App as AntdApp } from "antd";
import { uid } from "../../utils";

const Head = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 10px;
`;
const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 28px;
  margin: 0;
  color: ${({ theme }) => theme.colors.pitchDark};
`;
const Tools = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;
const Section = styled.section`
  margin-top: 26px;
`;
const SectionTitle = styled.h2`
  margin: 0 0 12px;
  color: ${({ theme }) => theme.colors.pitchDark};
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 21px;
`;
const Matchday = styled.div`
  margin-bottom: 22px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.white};
`;
const MatchdayTitle = styled.h3`
  margin: 0;
  padding: 10px 12px;
  background: ${({ theme }) => theme.colors.pitchDark};
  color: ${({ theme }) => theme.colors.paper};
  font: 600 14px ${({ theme }) => theme.fonts.ui};
`;
const TableWrap = styled.div`
  overflow-x: auto;
`;
const Table = styled.table`
  width: 100%;
  min-width: 650px;
  border-collapse: collapse;
  font-family: ${({ theme }) => theme.fonts.ui};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.line};
`;
const Th = styled.th`
  background: ${({ theme }) => theme.colors.pitchDark};
  color: ${({ theme }) => theme.colors.paper};
  font-size: 12px;
  font-weight: 500;
  padding: 10px 8px;
  text-align: center;
  &:nth-child(2) {
    text-align: left;
    padding-left: 14px;
  }
`;
const Td = styled.td`
  padding: 7px 8px;
  text-align: center;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  font-size: 14px;
  font-variant-numeric: tabular-nums;
`;
const TeamTd = styled(Td)`
  text-align: left;
  padding-left: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.pitchDark};
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 15px;
`;
const PtTd = styled(Td)`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.goldDeep};
  background: rgba(199, 154, 61, 0.08);
`;
const Match = styled.div`
  display: grid;
  grid-template-columns: minmax(150px, 1fr) 64px minmax(150px, 1fr);
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.fonts.ui};
`;
const MatchTeam = styled.span`
  text-align: ${({ $away }) => ($away ? "left" : "right")};
  font-weight: 600;
`;
const Score = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
`;
const Hint = styled.p`
  color: ${({ theme }) => theme.colors.inkSoft};
  font: 12px ${({ theme }) => theme.fonts.ui};
  margin: 12px 0 0;
`;

const TEAM_COUNT = 10;

function createTeams() {
  return Array.from({ length: TEAM_COUNT }, (_, index) => ({
    id: uid(),
    name: `Squadra ${index + 1}`,
  }));
}

function pairKey(firstId, secondId) {
  return [firstId, secondId].sort().join(":");
}

function createMatches(teams, previousMatches = []) {
  const previousByPair = new Map(
    previousMatches.map((match) => [
      pairKey(match.homeId, match.awayId),
      match,
    ]),
  );
  const rotation = [...teams];
  const matches = [];

  for (let round = 0; round < teams.length - 1; round += 1) {
    for (let index = 0; index < teams.length / 2; index += 1) {
      const first = rotation[index];
      const second = rotation[teams.length - 1 - index];
      const home = round % 2 === 0 ? first : second;
      const away = round % 2 === 0 ? second : first;
      const previous = previousByPair.get(pairKey(home.id, away.id));
      const sameDirection = previous?.homeId === home.id;

      matches.push({
        id: uid(),
        matchday: round + 1,
        homeId: home.id,
        awayId: away.id,
        homeGoals: previous
          ? sameDirection
            ? previous.homeGoals
            : previous.awayGoals
          : null,
        awayGoals: previous
          ? sameDirection
            ? previous.awayGoals
            : previous.homeGoals
          : null,
      });
    }

    rotation.splice(1, 0, rotation.pop());
  }

  return matches;
}

function buildTable(teams, matches) {
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

export default function CoppaCircoPage({
  coppaTeams,
  coppaMatches,
  onSaveCoppa,
  canManage,
}) {
  const { message } = AntdApp.useApp();
  const [teams, setTeams] = useState(() =>
    coppaTeams?.length === TEAM_COUNT ? coppaTeams : createTeams(),
  );
  const [matches, setMatches] = useState(() => {
    if (coppaMatches?.length) return coppaMatches;
    const initialTeams =
      coppaTeams?.length === TEAM_COUNT ? coppaTeams : createTeams();
    return createMatches(initialTeams);
  });

  useEffect(() => {
    const nextTeams =
      coppaTeams?.length === TEAM_COUNT ? coppaTeams : createTeams();
    setTeams(nextTeams);
    const hasMatchdays = coppaMatches?.every((match) => match.matchday);
    setMatches(
      coppaMatches?.length && hasMatchdays
        ? coppaMatches
        : createMatches(nextTeams, coppaMatches || []),
    );
  }, [coppaTeams, coppaMatches]);

  const table = useMemo(() => buildTable(teams, matches), [teams, matches]);
  const teamById = useMemo(
    () => new Map(teams.map((team) => [team.id, team])),
    [teams],
  );
  const completeMatches =
    matches.length === (TEAM_COUNT * (TEAM_COUNT - 1)) / 2;
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

  const updateScore = (id, field, value) => {
    setMatches((current) =>
      current.map((match) =>
        match.id === id ? { ...match, [field]: value ?? null } : match,
      ),
    );
  };

  const updateTeamName = (id, name) => {
    setTeams((current) =>
      current.map((team) => (team.id === id ? { ...team, name } : team)),
    );
  };

  const save = async () => {
    const ok = await onSaveCoppa({ teams, matches });
    message[ok ? "success" : "error"](
      ok ? "Coppa Circo salvata" : "Errore nel salvataggio",
    );
  };

  const generateMatches = () => {
    setMatches(createMatches(teams, matches));
  };

  return (
    <div>
      <Head>
        <Title>Coppa Circo</Title>
        {canManage && (
          <Tools>
            <Button onClick={generateMatches}>Genera calendario</Button>
            <Button type="primary" onClick={save}>
              Salva coppa
            </Button>
          </Tools>
        )}
      </Head>
      <Hint>
        Dieci squadre, girone unico: ogni squadra affronta tutte le altre una
        volta. Inserisci i risultati nelle giornate: vittoria = 3 punti,
        pareggio = 1 punto, sconfitta = 0 punti. Pt, G, V, N, P, GF, GS e DR
        vengono aggiornati automaticamente e la classifica si ordina per punti,
        differenza reti e gol segnati.
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
                  <TeamTd>
                    {canManage ? (
                      <Input
                        size="small"
                        bordered={false}
                        value={team.name}
                        onChange={(event) =>
                          updateTeamName(team.id, event.target.value)
                        }
                      />
                    ) : (
                      team.name
                    )}
                  </TeamTd>
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
        <SectionTitle>Giornate ({matches.length}/45 partite)</SectionTitle>
        {!completeMatches && canManage && (
          <Button onClick={generateMatches}>Crea le 45 sfide</Button>
        )}
        {Object.entries(matchesByMatchday).map(([matchday, dayMatches]) => (
          <Matchday key={matchday}>
            <MatchdayTitle>Giornata {matchday}</MatchdayTitle>
            {dayMatches.map((match) => (
              <Match key={match.id}>
                <MatchTeam>
                  {teamById.get(match.homeId)?.name || "Squadra"}
                </MatchTeam>
                <Score>
                  <InputNumber
                    min={0}
                    disabled={!canManage}
                    value={match.homeGoals}
                    onChange={(value) =>
                      updateScore(match.id, "homeGoals", value)
                    }
                  />
                  <InputNumber
                    min={0}
                    disabled={!canManage}
                    value={match.awayGoals}
                    onChange={(value) =>
                      updateScore(match.id, "awayGoals", value)
                    }
                  />
                </Score>
                <MatchTeam $away>
                  {teamById.get(match.awayId)?.name || "Squadra"}
                </MatchTeam>
              </Match>
            ))}
          </Matchday>
        ))}
      </Section>
    </div>
  );
}
