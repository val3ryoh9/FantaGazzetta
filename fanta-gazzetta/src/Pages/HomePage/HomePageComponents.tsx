import React from "react";
import {
  StyledMenu,
  StyledBreakingNews,
  StyledMain,
  StyledSection,
  StyledNewsGrid,
  StyledArticle,
  StyledAside,
  StyledFooter,
} from "./styled";
import { NewsType } from "./types";
import { useNavigate } from "react-router-dom";
import { HOME, RANKING } from "../../routes";
import { Header } from "../../Header";

type HomePageComponentProps = {
  news: NewsType[];
};

export const HomePageComponent = ({ news }: HomePageComponentProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <StyledMenu>
        <ul>
          <li style={{ cursor: "pointer" }} onClick={() => navigate(RANKING)}>
            Calcio
          </li>
        </ul>
      </StyledMenu>
      <StyledBreakingNews>
        Ultim'ora: Wimbledon, Sinner in semifinale! | Calciomercato: Osimhen
        verso il Galatasaray | Fognini annuncia il ritiro
      </StyledBreakingNews>
      <StyledMain>
        <StyledSection>
          <StyledNewsGrid>
            {news.map((n, i) => (
              <StyledArticle key={i}>
                <img src={n.image} alt={n.title} />
                <div style={{ padding: "1rem" }}>
                  <a href={n.url}>{n.title}</a>
                  <p>{n.description}</p>
                </div>
              </StyledArticle>
            ))}
          </StyledNewsGrid>
        </StyledSection>
        <StyledAside>
          <h3>In evidenza</h3>
          <ul>
            <li>• Calciomercato: tutte le trattative</li>
            <li>• Tour de France: Evenepoel vince la crono</li>
            <li>• Nations League: Italia alle Final Eight</li>
            <li>• MotoGP: Martin ok per Brno</li>
          </ul>
        </StyledAside>
      </StyledMain>
      <StyledFooter>
        © 2025 La Gazzetta dello Sport (clone) - Powered by React
      </StyledFooter>
    </>
  );
};
