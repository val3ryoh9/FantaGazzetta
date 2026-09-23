import styled from "styled-components";
import { theme } from "../../GlobalStyle";

export const Screen = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 20px;
  background: linear-gradient(rgba(22, 48, 42, 0.94), rgba(35, 75, 61, 0.9));
`;

export const Panel = styled.section`
  width: min(100%, 440px);
  padding: 40px;
  background: ${theme.colors.paper};
  border-top: 5px solid ${theme.colors.gold};
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.24);
  @media (max-width: 520px) {
    padding: 30px 24px;
  }
`;

export const Kicker = styled.p`
  margin: 0 0 8px;
  color: ${theme.colors.goldDeep};
  font: 700 12px ${theme.fonts.ui};
  letter-spacing: 1.4px;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  margin: 0;
  color: ${theme.colors.pitchDark};
  font-size: 36px;
  line-height: 1.05;
`;

export const Intro = styled.p`
  margin: 14px 0 26px;
  color: ${theme.colors.inkSoft};
  font-size: 16px;
  line-height: 1.5;
`;

export const Field = styled.input`
  width: 100%;
  margin-bottom: 12px;
  padding: 12px 14px;
  border: 1px solid ${theme.colors.line};
  border-radius: 2px;
  font: 16px ${theme.fonts.ui};
  &:focus {
    outline: 2px solid ${theme.colors.gold};
  }
`;

export const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

export const Submit = styled.button`
  width: 100%;
  margin-top: 8px;
  padding: 13px 16px;
  border: 0;
  border-radius: 2px;
  background: ${({ $secondary }) =>
    $secondary ? theme.colors.pitch : theme.colors.gold};
  color: ${theme.colors.paper};
  cursor: pointer;
  font: 700 15px ${theme.fonts.ui};
  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }
`;

export const ErrorMessage = styled.p`
  margin: 12px 0 0;
  color: ${theme.colors.red};
  font: 14px ${theme.fonts.ui};
`;
