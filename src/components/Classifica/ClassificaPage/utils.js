import { uid } from "../../../utils/utils";

export const NUM_FIELDS = ["g", "v", "n", "p", "gf", "gs"];

export const sortStandings = (standings) =>
  [...standings].sort((a, b) =>
    b.pt !== a.pt ? b.pt - a.pt : b.gf - b.gs - (a.gf - a.gs),
  );

export const createStandingRow = (name) => ({
  id: uid(),
  team: name.trim(),
  pt: 0,
  g: 0,
  v: 0,
  n: 0,
  p: 0,
  gf: 0,
  gs: 0,
});
