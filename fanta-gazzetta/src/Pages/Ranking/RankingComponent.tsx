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
} from "../HomePage/styled";
import { NewsType } from "../HomePage/types";
import { Header } from "../../Header";

type RankingComponentProps = {
  news: NewsType[];
};

export const RankingComponent = ({ news }: RankingComponentProps) => (
  <>
    <Header />
    <StyledMenu>
      <ul>
        <li>Calcio</li>
        <li>Motori</li>
        <li>Tennis</li>
        <li>Basket</li>
        <li>Ciclismo</li>
        <li>Altri Sport</li>
        <li>Scommesse</li>
      </ul>
    </StyledMenu>
    <StyledBreakingNews>
      Ultim'ora: Wimbledon, Sinner in semifinale! | Calciomercato: Osimhen verso
      il Galatasaray | Fognini annuncia il ritiro
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
    </StyledMain>
    <StyledFooter>
      © 2025 La Gazzetta dello Sport (clone) - Powered by React
    </StyledFooter>
  </>
);
