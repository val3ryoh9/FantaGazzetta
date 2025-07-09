import { NewsType } from "../Pages/HomePage/types";
import frontEndShark from "../assets/images/FrontEnd_Shark_Clean.png";

export const newsData: NewsType[] = [
  {
    title: "Bravo Cobolli, ma Djokovic lo batte e sfida Jannik in semifinale",
    url: "#",
    image: frontEndShark,
    description:
      "Nole perde il primo set, ma gestisce meglio i momenti chiave e vince in quattro.",
  },
  {
    title: "Bravo Cobolli, ma Djokovic lo batte e sfida Jannik in semifinale",
    url: "#",
    image: frontEndShark,
    description:
      "Nole perde il primo set, ma gestisce meglio i momenti chiave e vince in quattro.",
  },
  {
    title: "Bravo Cobolli, ma Djokovic lo batte e sfida Jannik in semifinale",
    url: "#",
    image: frontEndShark,
    description:
      "Nole perde il primo set, ma gestisce meglio i momenti chiave e vince in quattro.",
  },
  {
    title: "Bravo Cobolli, ma Djokovic lo batte e sfida Jannik in semifinale",
    url: "#",
    image: frontEndShark,
    description:
      "Nole perde il primo set, ma gestisce meglio i momenti chiave e vince in quattro.",
  },
];

export function useNews(): NewsType[] {
  return newsData;
}
