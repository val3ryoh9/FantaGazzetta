import styled from "styled-components";

export interface PageWrapperProps {
  $background?: string;
  $textAlign?: string;
}

export const PageWrapper = styled.div<PageWrapperProps>`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.$background || "#f7f7f7"};
  text-align: ${(props) => props.$textAlign || "initial"};
  position: relative;
  overflow-x: hidden;
  z-index: 1;
`;

export const StyledAppWrapper = styled.div`
  background: transparent;
  min-height: 100vh;
`;

export const MenuContainer = styled.nav`
  display: flex;
  justify-content: center;
  height: 65px;
  background: #ff0066;
  color: #fff;
  font-size: 45px;
  font-weight: 700;
  ul {
    display: flex;
    justify-content: center;
    gap: 32px;
    margin: 0;
    padding: 8px 0;
    list-style: none;
    li {
      cursor: pointer;
      transition: color 0.2s;
      &:hover {
        color: #111;
      }
    }
  }

  @media (max-width: 900px) {
    height: 40px;
    font-size: 20px;
  }
`;

export const StyledBreakingNews = styled.section`
  background: #ffe3ef;
  color: #d9006e;
  padding: 11px 0;
  font-weight: 700;
  font-size: 18px;
  border-bottom: 1px solid #ffb3d1;
  text-align: center;

  @media (max-width: 900px) {
    padding: 15px;
  }
`;

export const StyledMain = styled.main`
  display: flex;
  gap: 32px;
  margin: 32px 0;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const StyledSection = styled.section`
  display: grid;
  flex: auto;
  padding-left: 25px;
  gap: 25px;

  @media (max-width: 900px) {
    padding-right: 25px;
  }
`;

export const StyledArticle = styled.article`
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px #eee;
  overflow: hidden;
  text-align: left;
  transition: transform 0.15s;
  &:hover {
    transform: translateY(-4px) scale(1.01);
    box-shadow: 0 4px 16px #eec;
  }
  img {
    width: 100%;
    height: 180px;
    object-fit: cover;
  }
  a {
    color: #d9006e;
    font-weight: 800;
    font-size: 18px;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
  p {
    color: #333;
    margin: 8px 0 0 0;
  }
`;

export const StyledAside = styled.aside`
  flex: 1;
  background: #fff0f6;
  border-radius: 8px;
  padding: 16px;
  min-width: 220px;
  max-width: 260px;
  box-shadow: 0 2px 8px #eee;
  margin: 0 25px 0 0;
  h3 {
    color: #d9006e;
    font-weight: 900;
    font-size: 18px;
  }
  ul {
    padding: 0;
    margin: 0;
    list-style: none;
    color: #222;
    font-weight: 600;
  }

  @media (max-width: 900px) {
    width: 100%;
    box-shadow: 0 2px 8px #eee;
    max-width: 91%;
  }
`;
