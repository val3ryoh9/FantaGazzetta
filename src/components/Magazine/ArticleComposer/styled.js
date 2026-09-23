import { Button } from "antd";
import styled from "styled-components";
import { theme } from "../../../GlobalStyle";

export const Wrap = styled.div`
  margin-bottom: 26px;
`;

export const ToggleBtn = styled(Button)`
  && {
    background: ${theme.colors.pitch};
    border-color: ${theme.colors.pitch};
    color: ${theme.colors.paper};
    font-family: ${theme.fonts.display};
    font-weight: 600;
    height: auto;
    padding: 9px 18px;
    &:hover {
      background: ${theme.colors.pitchDark} !important;
      color: ${theme.colors.paper} !important;
    }
  }
`;

export const Panel = styled.div`
  margin-top: 14px;
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.line};
  border-top: 3px solid ${theme.colors.gold};
  padding: 22px;
`;

export const PanelTitle = styled.h3`
  margin: 0 0 16px;
  font-size: 20px;
  font-weight: 600;
  color: ${theme.colors.pitchDark};
`;

export const Preview = styled.div`
  margin-top: 10px;
  max-height: 180px;
  overflow: hidden;
  border: 1px solid ${theme.colors.line};
  img {
    width: 100%;
    object-fit: cover;
  }
`;
