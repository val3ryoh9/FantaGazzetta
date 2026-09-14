import { uid } from "./utils";

// Elenco gestito dall'amministratore: gli utenti possono solo scegliere una lega esistente.
export const leagues = [
  { id: "fanta-circo", name: "FantaCirco" },
  { id: "federazione-italiana-pippe", name: "Federazione Italiana Pippe" },
];

export function seedArticles() {
  return [
    {
      id: uid(),
      title: "Benvenuti su Fantagazzetta",
      author: "Admin",
      excerpt:
        "Il magazine della nostra lega: notizie, rose e classifica in un unico posto.",
      body: 'Da qui puoi pubblicare articoli con foto, tenere aggiornate le rose di tutte le squadre e la classifica del campionato. Usa il pulsante "Scrivi un articolo" per iniziare, oppure vai nelle sezioni Rose e Classifica dal menu in alto per inserire i dati della lega.\n\nQuesto articolo di esempio puoi eliminarlo quando vuoi.',
      image: "",
      date: new Date().toISOString(),
    },
  ];
}

export function seedRosters() {
  return [
    {
      id: uid(),
      name: "I Bomber di Quartiere",
      players: [{ id: uid(), name: "Da definire", role: "P", price: 0 }],
    },
    {
      id: uid(),
      name: "Fantacampioni FC",
      players: [{ id: uid(), name: "Da definire", role: "P", price: 0 }],
    },
  ];
}

export function seedStandings() {
  return [
    {
      id: uid(),
      team: "I Bomber di Quartiere",
      pt: 0,
      g: 0,
      v: 0,
      n: 0,
      p: 0,
      gf: 0,
      gs: 0,
    },
    {
      id: uid(),
      team: "Fantacampioni FC",
      pt: 0,
      g: 0,
      v: 0,
      n: 0,
      p: 0,
      gf: 0,
      gs: 0,
    },
  ];
}
