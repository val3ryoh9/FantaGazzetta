import { theme } from "../../../GlobalStyle";
import styled, { keyframes, css } from "styled-components";

export const fadeInSlide = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

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
  flex-wrap: wrap;
`;

export const Section = styled.section`
  margin-top: 26px;
`;

export const SectionTitle = styled.h2`
  margin: 0 0 12px;
  color: ${theme.colors.pitchDark};
  font-family: ${theme.fonts.serif};
  font-size: 21px;
`;

export const Matchday = styled.div`
  margin-bottom: 22px;
  border: 1px solid ${theme.colors.line};
  background: ${theme.colors.white};
`;

export const MatchdayTitle = styled.h3`
  margin: 0;
  padding: 10px 12px;
  background: ${theme.colors.pitchDark};
  color: ${theme.colors.paper};
  font: 600 14px ${theme.fonts.ui};
`;

export const TableWrap = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  min-width: 650px;
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

/* MATCH & LAYOUT FIX PER IL TESTO LUNGO */
export const Match = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 8px;
  padding: 9px 8px;
  border-top: 1px solid ${theme.colors.line};
  background: ${theme.colors.white};
  font-family: ${theme.fonts.ui};

  @media (max-width: 480px) {
    padding: 8px 6px;
    gap: 4px;
  }
`;

export const MatchTeam = styled.span<{ $away?: boolean }>`
  text-align: ${({ $away }) => ($away ? "left" : "right")};
  font-weight: 600;
  font-size: 13px;
  line-height: 1.2;
  word-break: break-word;
  overflow-wrap: anywhere;

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

export const Score = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;

  /* Ridimensiona gli InputNumber di Antd su schermi piccoli */
  .ant-input-number {
    width: 36px !important;

    @media (max-width: 480px) {
      width: 30px !important;
    }
  }

  .ant-input-number-input {
    padding: 0 2px !important;
    text-align: center;
    font-size: 13px;

    @media (max-width: 480px) {
      font-size: 11px;
    }
  }

  .ant-input-number-handler-wrap {
    display: none; /* Nasconde le freccette per guadagnare spazio su mobile */
  }
`;

export const ScoreValue = styled.span`
  width: 28px;
  padding: 4px 0;
  border: 1px solid ${theme.colors.line};
  border-radius: 2px;
  color: ${theme.colors.ink};
  text-align: center;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  pointer-events: none;

  @media (max-width: 480px) {
    width: 22px;
    font-size: 11px;
  }
`;

export const Hint = styled.p`
  color: ${theme.colors.inkSoft};
  font: 12px ${theme.fonts.ui};
  margin: 12px 0 0;
`;

export const Bracket = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(180px, 1fr));
  gap: 16px;
  align-items: center;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
`;
export const MobileBracketNav = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    overflow-x: auto;
    padding-bottom: 4px;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const BracketTabButton = styled.button<{ $active?: boolean }>`
  background: ${({ $active }) =>
    $active ? theme.colors.pitchDark : theme.colors.paper};
  color: ${({ $active }) =>
    $active ? theme.colors.paper : theme.colors.pitchDark};
  border: 1px solid ${theme.colors.line};
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${({ $active }) =>
    $active ? "0 2px 8px rgba(0, 0, 0, 0.15)" : "none"};

  &:active {
    transform: scale(0.95);
  }
`;

export const BracketPlayIn = styled.div`
  display: grid;
  margin-top: 16px;
  grid-template-columns: repeat(2, minmax(190px, 1fr));
  gap: 16px;
  overflow-x: auto;

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, 220px);
  }
`;
export const BracketColumn = styled.div<{ $showMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;

  @media (max-width: 768px) {
    display: ${({ $showMobile }) => ($showMobile ? "flex" : "none")};
    gap: 12px;
    width: 100%;
    ${({ $showMobile }) =>
      $showMobile &&
      css`
        animation: ${fadeInSlide} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      `}
  }
`;

export const BracketColumnTitle = styled.h3`
  margin: 0 0 4px;
  color: ${theme.colors.pitchDark};
  font: 600 14px ${theme.fonts.ui};
  text-align: center;
`;

export const BracketMatch = styled.div`
  padding: 10px 12px;
  border: 1px solid ${theme.colors.line};
  border-radius: 4px;
  background: ${theme.colors.white};
  box-shadow: 0 4px 12px rgba(22, 48, 42, 0.06);
`;

export const BracketTeam = styled.div<{ $placeholder?: boolean }>`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 5px 0;
  color: ${({ $placeholder }) =>
    $placeholder ? theme.colors.inkSoft : theme.colors.pitchDark};
  font: 600 13px ${theme.fonts.ui};
  border-bottom: 1px solid ${theme.colors.paperDim};
  &:last-child {
    border-bottom: 0;
  }
`;