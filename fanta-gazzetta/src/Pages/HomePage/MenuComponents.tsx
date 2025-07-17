import { useNavigate } from "react-router-dom";
import { RANKING } from "../../routes";
import _ from "lodash";
import styled from "styled-components";

const StyledListItem = styled.li`
  cursor: pointer;
`;

const StyledUl = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const menuData = [
  {
    title: "Calcio",
  },
];

export const MenuComponents = () => {
  const navigate = useNavigate();

  return (
    <StyledUl>
      {_.map(menuData, (item) => (
        <StyledListItem onClick={() => navigate(RANKING)}>
          {item.title}
        </StyledListItem>
      ))}
    </StyledUl>
  );
};
