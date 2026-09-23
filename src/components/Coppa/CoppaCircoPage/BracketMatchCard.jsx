import React from "react";
import { BracketMatch, BracketTeam } from "./styled";

export const BracketMatchCard = ({ teams }) => (
  <BracketMatch>
    {teams.map((team, index) => (
      <BracketTeam
        key={`${team?.id || team?.name || "empty"}-${index}`}
        $placeholder={!team || team.placeholder}
      >
        <span>{team?.name || "Da definire"}</span>
        <span>-</span>
      </BracketTeam>
    ))}
  </BracketMatch>
);
