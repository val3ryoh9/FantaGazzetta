import { useNavigate } from "react-router-dom";
import { HOME } from "../routes";
import styled from "styled-components";
import FantaLogo from "../assets/images/fantaCircoLogo.png";

const StyledHeader = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 1) 0%,
      rgba(0, 0, 0, 0.4) 50%,
      rgba(0, 0, 0, 1) 100%
    ),
    url(${FantaLogo});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  text-align: center;

  @media (max-width: 900px) {
    height: 100px;
  }
`;

const TextHeader = styled.h1`
  padding: 25px;
  font-size: 100px;
  letter-spacing: 2px;
  cursor: pointer;
  margin: 0;

  text-shadow: 0 0 6px rgba(255, 255, 255, 0.5),
    0 0 12px rgba(255, 255, 255, 0.35);

  @media (max-width: 900px) {
    font-size: 20px;
  }
`;

export const Header = () => {
  const navigate = useNavigate();

  return (
    <StyledHeader onClick={() => navigate(HOME)}>
      <TextHeader>FANTAGAZZETTA DEL CIRCO</TextHeader>
    </StyledHeader>
  );
};
