import { useNavigate } from "react-router-dom";
import { HOME } from "../routes";
import styled from "styled-components";

const StyledHeader = styled.header`
  display: flex;
  justify-content: center;
  background: #111;
  color: #fff;
  padding: 8px 0;
  text-align: center;
  height: 70px;
  align-items: center;
`;

const TextHeader = styled.h1`
  margin: 0;
  font-size: 35.2px;
  letter-spacing: 2px;
  font-weight: 900;

  @media (max-width: 900px) {
    margin: 0;
    font-size: 25px;
    letter-spacing: 2px;
    font-weight: 900;
  }
`;

export const Header = () => {
  const navigate = useNavigate();

  return (
    <StyledHeader>
      <TextHeader style={{ cursor: "pointer" }} onClick={() => navigate(HOME)}>
        FANTAGAZZETTA DEL CIRCO
      </TextHeader>
    </StyledHeader>
  );
};
