import { uid } from "../../../utils/utils";

export const TEAM_COUNT = 10;

export const createTeams = () => {
  return Array.from({ length: TEAM_COUNT }, (_, index) => ({
    id: uid(),
    name: `Squadra ${index + 1}`,
  }));
};

export const createMatches = (teams, previousMatches = []) => {
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
};

export const buildTable = (teams, matches) => {
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
};

export const getBracketTeams = (table) => {
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
};

export const getInitialTeams = (coppaTeams) =>
  coppaTeams?.length === TEAM_COUNT ? coppaTeams : createTeams();

export const hasCompleteSchedule = (coppaMatches) =>
  coppaMatches?.length === TEAM_COUNT * (TEAM_COUNT - 1) &&
  coppaMatches.every((match) => match.matchday);

export const getInitialMatches = (teams, coppaMatches) =>
  hasCompleteSchedule(coppaMatches)
    ? coppaMatches
    : createMatches(teams, coppaMatches || []);

export const groupMatchesByMatchday = (matches) =>
  matches.reduce((groups, match) => {
    const matchday = match.matchday || 1;
    if (!groups[matchday]) groups[matchday] = [];
    groups[matchday].push(match);
    return groups;
  }, {});
