import { useNavigate } from "react-router-dom";
import { RANKING } from "../../routes";
import _ from "lodash";
import styled from "styled-components";

const StyledListItem = styled.li`
  cursor: pointer;
`;

const menuData = [
  {
    title: "Calcio",
  },
];

export const MenuComponents = () => {
  const navigate = useNavigate();

  return (
    <ul>
      {_.map(menuData, (item) => (
        <StyledListItem onClick={() => navigate(RANKING)}>
          {item.title}
        </StyledListItem>
      ))}
    </ul>
  );
};
