import styled from "styled-components";
import { theme } from "../../../GlobalStyle";

export const Box = styled.aside`
  border: 1px solid ${theme.colors.line};
  border-top: 3px solid ${theme.colors.pitch};
  background: ${theme.colors.white};
`;

export const Head = styled.div`
  padding: 14px 16px 10px;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.pitchDark};
  letter-spacing: 0.2px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${theme.fonts.ui};
`;

export const Td = styled.td`
  padding: 7px 16px;
  font-size: 13.5px;
  border-top: 1px solid ${theme.colors.line};
  &:first-child { color: ${theme.colors.inkSoft}; width: 26px; }
  &:last-child { text-align: right; font-weight: 600; color: ${theme.colors.pitchDark}; font-variant-numeric: tabular-nums; }
`;

export const Empty = styled.td`
  color: ${theme.colors.inkSoft};
  text-align: center;
  padding: 16px;
`;

export const Foot = styled.div`
  padding: 10px 16px 14px;
`;

export const FootLink = styled.a`
  font-size: 12.5px;
  color: ${theme.colors.pitch};
  font-weight: 600;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;
