import { Header } from "../../components/Header";
import {
  StyledBreakingNews,
  StyledMain,
  StyledSection,
  StyledArticle,
  StyledAside,
  MenuContainer,
} from "./styling";
import { MenuComponents } from "./MenuComponents";
import { NewsType } from "./types";
import { StyledFooter } from "../../globalStyle";

type HomePageComponentProps = {
  news: NewsType[];
};

export const HomeMobileView = ({ news }: HomePageComponentProps) => {
  return (
    <>
      <Header />
      <MenuContainer>
        <MenuComponents />
      </MenuContainer>
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
