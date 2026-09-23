import React, { useEffect, useMemo, useState } from "react";
import { Button, InputNumber, App as AntdApp } from "antd";
import {
  Head,
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
import {
  buildTable,
  getBracketTeams,
  getInitialTeams,
  getInitialMatches,
  groupMatchesByMatchday,
} from "./utils";
import { BracketMatchCard } from "./BracketMatchCard";

export const CoppaCircoPage = ({
  coppaTeams,
  coppaMatches,
  onSaveCoppa,
  canManage,
}) => {
  const { message } = AntdApp.useApp();
  const [mobileTab, setMobileTab] = useState("quarti");
  const [teams, setTeams] = useState(() => getInitialTeams(coppaTeams));
  const [matches, setMatches] = useState(() =>
    getInitialMatches(getInitialTeams(coppaTeams), coppaMatches),
  );

  useEffect(() => {
    const nextTeams = getInitialTeams(coppaTeams);
    setTeams(nextTeams);
    setMatches(getInitialMatches(nextTeams, coppaMatches));
  }, [coppaTeams, coppaMatches]);

  const table = useMemo(() => buildTable(teams, matches), [teams, matches]);
  const teamById = useMemo(
    () => new Map(teams.map((team) => [team.id, team])),
    [teams],
  );
  const matchesByMatchday = useMemo(
    () => groupMatchesByMatchday(matches),
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
};
