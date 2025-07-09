import styled from "styled-components";

export interface PageWrapperProps {
  $background?: string;
  $textAlign?: string;
}

export const PageWrapper = styled.div<PageWrapperProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
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

export const StyledMenu = styled.nav`
  background: #ff0066;
  color: #fff;
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
`;

export const StyledBreakingNews = styled.section`
  background: #ffe3ef;
  color: #d9006e;
  padding: 11px 0;
  font-weight: 700;
  font-size: 18px;
  border-bottom: 1px solid #ffb3d1;
  text-align: center;
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
  flex: 3;
  margin-right: -15px;
`;

export const StyledNewsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 0 25px 0 25px;
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
`;

export const StyledFooter = styled.footer`
  background: #222;
  color: #fff;
  padding: 24px 0;
  margin-top: 32px;
  font-size: 15px;
  text-align: center;
`;
