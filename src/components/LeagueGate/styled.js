import styled from "styled-components";
import { theme } from "../../GlobalStyle";

export const Screen = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 20px;
  background:
    linear-gradient(rgba(22, 48, 42, 0.94), rgba(35, 75, 61, 0.9)),
    ${theme.colors.pitch};
`;

export const Panel = styled.section`
  width: min(100%, 480px);
  padding: 42px 40px;
  background: ${theme.colors.paper};
  border-top: 5px solid ${theme.colors.gold};
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.24);

  @media (max-width: 520px) {
    padding: 32px 24px;
  }
`;

export const Kicker = styled.p`
  margin: 0 0 8px;
  color: ${theme.colors.goldDeep};
  font-family: ${theme.fonts.ui};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  margin: 0;
  color: ${theme.colors.pitchDark};
  font-size: clamp(30px, 7vw, 42px);
  line-height: 1.05;
`;

export const Intro = styled.p`
  margin: 14px 0 28px;
  color: ${theme.colors.inkSoft};
  font-size: 17px;
  line-height: 1.5;
`;

export const FieldLabel = styled.label`
  display: block;
  margin: 0 0 8px;
  color: ${theme.colors.ink};
  font-family: ${theme.fonts.ui};
  font-size: 13px;
  font-weight: 700;
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid ${theme.colors.line};
  border-radius: 2px;
  background: ${theme.colors.white};
  color: ${theme.colors.ink};
  font: 16px ${theme.fonts.ui};

  &:focus {
    outline: 2px solid ${theme.colors.gold};
  }
`;

export const Password = styled.input`
  width: 100%;
  margin-top: 18px;
  padding: 12px 14px;
  border: 1px solid ${theme.colors.line};
  border-radius: 2px;
  background: ${theme.colors.white};
  color: ${theme.colors.ink};
  font: 16px ${theme.fonts.ui};

  &:focus {
    outline: 2px solid ${theme.colors.gold};
  }
`;

export const Submit = styled.button`
  width: 100%;
  margin-top: 22px;
  padding: 13px 16px;
  border: 0;
  border-radius: 2px;
  background: ${theme.colors.gold};
  color: ${theme.colors.pitchDark};
  cursor: pointer;
  font: 700 15px ${theme.fonts.ui};

  &:hover {
    background: ${theme.colors.goldDeep};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

export const ExitButton = styled.button`
  display: block;
  margin: 18px auto 0;
  border: 0;
  background: transparent;
  color: ${theme.colors.red};
  cursor: pointer;
  font: 700 14px ${theme.fonts.ui};

  &:hover {
    color: #ba3d2b;
  }
`;

export const ErrorMessage = styled.p`
  margin: 12px 0 0;
  color: ${theme.colors.red};
  font: 14px ${theme.fonts.ui};
`;
