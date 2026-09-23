import styled from "styled-components";
import { theme } from "../../GlobalStyle";

export const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 40;
  background: ${theme.colors.pitchDark};
  border-bottom: 3px solid ${theme.colors.gold};
`;

export const Inner = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 14px 20px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 16px;

  @media (max-width: 880px) {
    grid-template-columns: minmax(0, 1fr) auto;
    row-gap: 6px;
  }
`;

export const Wordmark = styled.div`
  font-family: ${theme.fonts.display};
  color: ${theme.colors.paper};
  font-weight: 700;
  font-size: 26px;
  letter-spacing: 0.3px;
  span {
    color: ${theme.colors.gold};
  }
`;

export const Nav = styled.nav`
  display: flex;
  gap: 4px;
  justify-self: end;

  @media (max-width: 880px) {
    display: ${({ $open }) => ($open ? "flex" : "none")};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${theme.colors.pitchDark};
    flex-direction: column;
    padding: 8px 20px 16px;
    border-bottom: 3px solid ${theme.colors.gold};
  }
`;

export const CurrentLeague = styled.div`
  min-width: 0;
  color: ${theme.colors.gold};
  font-family: ${theme.fonts.display};
  font-size: 17px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  /* su mobile va su una riga sua sotto logo e Menu */
  @media (max-width: 880px) {
    grid-column: 1 / -1;
    grid-row: 2;
    font-size: 15px;
    text-align: left;
  }
`;

export const NavLink = styled.a`
  font-family: ${theme.fonts.display};
  color: ${({ $active, $exit }) => {
    if ($exit) return theme.colors.red;
    if ($active) {
      return theme.colors.paper;
    } else {
      return "rgba(244,241,230,0.75)";
    }
  }};
  font-size: 15px;
  font-weight: 500;
  padding: 8px 14px;
  border-bottom: 2px solid
    ${({ $active }) => ($active ? theme.colors.gold : "transparent")};
  cursor: pointer;
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
  &:hover {
    color: ${({ $exit }) => ($exit ? "#BA3D2B" : theme.colors.paper)};
  }
`;

export const Toggle = styled.button`
  display: none;
  background: none;
  border: 1px solid rgba(244, 241, 230, 0.4);
  color: ${theme.colors.paper};
  padding: 6px 10px;
  border-radius: 3px;
  font-family: ${theme.fonts.ui};

  @media (max-width: 880px) {
    display: block;
  }
`;
