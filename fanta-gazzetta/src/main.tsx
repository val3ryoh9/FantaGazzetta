import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { HashRouter } from "react-router-dom";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
