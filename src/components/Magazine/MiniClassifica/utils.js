export const getTopStandings = (standings, limit = 6) =>
  [...standings]
    .sort((a, b) => (b.pt !== a.pt ? b.pt - a.pt : b.gf - b.gs - (a.gf - a.gs)))
    .slice(0, limit);
