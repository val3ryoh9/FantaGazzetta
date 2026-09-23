import React, { useState } from "react";
import {
  Bar,
  Inner,
  Wordmark,
  Nav,
  CurrentLeague,
  NavLink,
  Toggle,
} from "./styled";
import { PAGES } from "./utils";

export const Header = ({ page, onNavigate, onExit, currentLeague }) => {
  const [open, setOpen] = useState(false);

  return (
    <Bar>
      <Inner>
        <Wordmark>
          Fanta<span>Gazzetta</span>
        </Wordmark>
        <CurrentLeague title={currentLeague}>{currentLeague}</CurrentLeague>
        <Toggle onClick={() => setOpen((o) => !o)}>Menu</Toggle>
        <Nav $open={open}>
          {PAGES.map((p) => (
            <NavLink
              key={p.key}
              $active={page === p.key}
              $exit={p.key === "EXIT"}
              onClick={() => {
                if (p.key === "EXIT") onExit();
                else onNavigate(p.key);
                setOpen(false);
              }}
            >
              {p.label}
            </NavLink>
          ))}
        </Nav>
      </Inner>
    </Bar>
  );
};
