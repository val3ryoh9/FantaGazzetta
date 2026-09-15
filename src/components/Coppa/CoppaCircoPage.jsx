import React, { useEffect, useMemo, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { Button, InputNumber, App as AntdApp } from "antd";
import { uid } from "../../utils";

const fadeInSlide = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

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

/* MATCH & LAYOUT FIX PER IL TESTO LUNGO */
const Match = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  padding: 9px 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.fonts.ui};

  @media (max-width: 480px) {
    padding: 8px 6px;
    gap: 4px;
  }
`;

const MatchTeam = styled.span`
  text-align: ${({ $away }) => ($away ? "left" : "right")};
  font-weight: 600;
  font-size: 13px;
  line-height: 1.2;
  word-break: break-word;
  overflow-wrap: anywhere;

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const Score = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;

  /* Ridimensiona gli InputNumber di Antd su schermi piccoli */
  .ant-input-number {
    width: 36px !important;

    @media (max-width: 480px) {
      width: 30px !important;
    }
  }

  .ant-input-number-input {
    padding: 0 2px !important;
    text-align: center;
    font-size: 13px;

    @media (max-width: 480px) {
      font-size: 11px;
    }
  }

  .ant-input-number-handler-wrap {
    display: none; /* Nasconde le freccette per guadagnare spazio su mobile */
  }
`;

const ScoreValue = styled.span`
  width: 28px;
  padding: 4px 0;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 2px;
  color: ${({ theme }) => theme.colors.ink};
  text-align: center;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  pointer-events: none;

  @media (max-width: 480px) {
    width: 22px;
    font-size: 11px;
  }
`;

const Hint = styled.p`
  color: ${({ theme }) => theme.colors.inkSoft};
  font: 12px ${({ theme }) => theme.fonts.ui};
  margin: 12px 0 0;
`;
const Bracket = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(180px, 1fr));
  gap: 16px;
  align-items: center;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;
const MobileBracketNav = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    overflow-x: auto;
    padding-bottom: 4px;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
const BracketTabButton = styled.button`
  background: ${({ $active, theme }) =>
    $active ? theme.colors.pitchDark : theme.colors.paper};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.paper : theme.colors.pitchDark};
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${({ $active }) =>
    $active ? "0 2px 8px rgba(0, 0, 0, 0.15)" : "none"};

  &:active {
    transform: scale(0.95);
  }
`;

const BracketPlayIn = styled.div`
  display: grid;
  margin-top: 16px;
  grid-template-columns: repeat(2, minmax(190px, 1fr));
  gap: 16px;
  overflow-x: auto;

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, 220px);
  }
`;
const BracketColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;

  @media (max-width: 768px) {
    display: ${({ $showMobile }) => ($showMobile ? "flex" : "none")};
    gap: 12px;
    width: 100%;
    ${({ $showMobile }) =>
      $showMobile &&
      css`
        animation: ${fadeInSlide} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      `}
  }
`;
const BracketColumnTitle = styled.h3`
  margin: 0 0 4px;
  color: ${({ theme }) => theme.colors.pitchDark};
  font: 600 14px ${({ theme }) => theme.fonts.ui};
  text-align: center;
`;
const BracketMatch = styled.div`
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 4px 12px rgba(22, 48, 42, 0.06);
`;
const BracketTeam = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 5px 0;
  color: ${({ $placeholder, theme }) =>
    $placeholder ? theme.colors.inkSoft : theme.colors.pitchDark};
  font: 600 13px ${({ theme }) => theme.fonts.ui};
  border-bottom: 1px solid ${({ theme }) => theme.colors.paperDim};
  &:last-child {
    border-bottom: 0;
  }
`;

const TEAM_COUNT = 10;

function createTeams() {
  return Array.from({ length: TEAM_COUNT }, (_, index) => ({
    id: uid(),
    name: `Squadra ${index + 1}`,
  }));
}

function createMatches(teams, previousMatches = []) {
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

function getBracketTeams(table) {
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

function BracketMatchCard({ teams }) {
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
