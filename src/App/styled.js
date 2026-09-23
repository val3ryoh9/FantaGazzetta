import styled from "styled-components";
import { theme } from "../GlobalStyle";

export const Main = styled.main`
  max-width: 1180px;
  margin: 0 auto;
  padding: 28px 20px 80px;
`;

export const LoadingScreen = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: ${theme.colors.paper};
`;

export const Spinner = styled.div`
  width: 42px;
  height: 42px;
  border: 4px solid ${theme.colors.line};
  border-top-color: ${theme.colors.gold};
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
