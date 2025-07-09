import { useNavigate } from "react-router-dom";
import { HOME } from "./routes";
import styled from "styled-components";

const StyledHeader = styled.header`
  background: #111;
  color: #fff;
  padding: 0.5rem 0;
  text-align: center;
  h1 {
    margin: 0;
    font-size: 2.2rem;
    letter-spacing: 2px;
    font-weight: 900;
  }
`;

export const Header = () => {
  const navigate = useNavigate();

  return (
    <StyledHeader>
      <h1 style={{ cursor: "pointer" }} onClick={() => navigate(HOME)}>
        LA GAZZETTA DELLO SPORT
      </h1>
    </StyledHeader>
  );
};
