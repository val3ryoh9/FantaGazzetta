import styled from "styled-components";
import { theme } from "../../../GlobalStyle";

export const Head = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 10px;
`;

export const Title = styled.h1`
  font-family: ${theme.fonts.serif};
  font-size: 28px;
  margin: 0;
  color: ${theme.colors.pitchDark};
`;

export const Tools = styled.div`
  display: flex;
  gap: 10px;
`;

export const TableWrap = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${theme.fonts.ui};
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.line};
`;

export const Th = styled.th`
  background: ${theme.colors.pitchDark};
  color: ${theme.colors.paper};
  font-size: 12px;
  font-weight: 500;
  padding: 10px 8px;
  text-align: center;
  letter-spacing: 0.3px;
  &:nth-child(2) {
    text-align: left;
    padding-left: 14px;
  }
`;

export const Td = styled.td`
  padding: 7px 8px;
  text-align: center;
  border-top: 1px solid ${theme.colors.line};
  font-size: 14px;
  font-variant-numeric: tabular-nums;
`;

export const TeamTd = styled(Td)`
  text-align: left;
  padding-left: 14px;
  font-weight: 600;
  color: ${theme.colors.pitchDark};
  font-family: ${theme.fonts.serif};
  font-size: 15px;
`;

export const PtTd = styled(Td)`
  font-weight: 700;
  color: ${theme.colors.goldDeep};
  background: rgba(199, 154, 61, 0.08);
`;

export const Hint = styled.p`
  font-size: 12px;
  color: ${theme.colors.inkSoft};
  font-family: ${theme.fonts.ui};
  margin-top: 16px;
`;
