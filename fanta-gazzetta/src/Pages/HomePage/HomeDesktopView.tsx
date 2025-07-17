import React from "react";
import {
  MenuContainer,
  StyledBreakingNews,
  StyledMain,
  StyledSection,
  StyledArticle,
  StyledAside,
} from "./styling";
import { NewsType } from "./types";
import { Header } from "../../components/Header";
import { StyledFooter } from "../../globalStyle";
import { MenuComponents } from "./MenuComponents";

type HomePageComponentProps = {
  news: NewsType[];
};

export const HomeDesktopView = ({ news }: HomePageComponentProps) => {
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
        © 2025 FANTAGAZZETTA Circo - dove i clown possono avere credibilità
      </StyledFooter>
    </>
  );
};
