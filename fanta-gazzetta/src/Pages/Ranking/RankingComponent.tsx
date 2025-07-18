import { Header } from "../../components/Header";
import { MenuComponents } from "../HomePage/MenuComponents";
import { NewsType } from "../HomePage/types";
import { StyledFooter } from "../../globalStyle";
import {
  StyledBreakingNews,
  StyledMain,
  StyledSection,
  StyledArticle,
  StyledAside,
} from "../HomePage/styling";

type HomePageComponentProps = {
  news: NewsType[];
};

export const RankingComponent = ({ news }: HomePageComponentProps) => {
  return (
    <>
      <Header />
      <MenuComponents />
      <StyledBreakingNews>
        Ultim'ora: Wimbledon, Sinner in semifinale! | Calciomercato: Osimhen
        verso il Galatasaray | Fognini annuncia il ritiro
      </StyledBreakingNews>
      <StyledMain>
        <StyledSection>
          {news.map((n, i) => (
            <StyledArticle key={i}>
              <img src={n.image} alt={n.title} />
              <div style={{ padding: "1rem" }}>
                <a href={n.url}>{n.title}</a>
                <p>{n.description}</p>
              </div>
            </StyledArticle>
          ))}
          <StyledAside>
            <h3>In evidenza</h3>
            <ul>
              <li>• Calciomercato: tutte le trattative</li>
              <li>• Tour de France: Evenepoel vince la crono</li>
              <li>• Nations League: Italia alle Final Eight</li>
              <li>• MotoGP: Martin ok per Brno</li>
            </ul>
          </StyledAside>
        </StyledSection>
      </StyledMain>
      <StyledFooter>
        © 2025 FANTAGAZZETTA Circo - dove i clown possono avere credibilità
      </StyledFooter>
    </>
  );
};
