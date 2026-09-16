import React, { useState } from "react";
import styled from "styled-components";
import { supabase } from "../supabase/supabaseClient";
import {
  loginWithUsername,
  saveUsername,
  usernameExists,
} from "../supabase/supabaseApi";
import { theme } from '../GlobalStyle';

const Screen = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 20px;
  background: linear-gradient(rgba(22, 48, 42, 0.94), rgba(35, 75, 61, 0.9));
`;
const Panel = styled.section`
  width: min(100%, 440px);
  padding: 40px;
  background: ${theme.colors.paper};
  border-top: 5px solid ${theme.colors.gold};
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.24);
  @media (max-width: 520px) {
    padding: 30px 24px;
  }
`;
const Kicker = styled.p`
  margin: 0 0 8px;
  color: ${theme.colors.goldDeep};
  font: 700 12px ${theme.fonts.ui};
  letter-spacing: 1.4px;
  text-transform: uppercase;
`;
const Title = styled.h1`
  margin: 0;
  color: ${theme.colors.pitchDark};
  font-size: 36px;
  line-height: 1.05;
`;
const Intro = styled.p`
  margin: 14px 0 26px;
  color: ${theme.colors.inkSoft};
  font-size: 16px;
  line-height: 1.5;
`;
const Field = styled.input`
  width: 100%;
  margin-bottom: 12px;
  padding: 12px 14px;
  border: 1px solid ${theme.colors.line};
  border-radius: 2px;
  font: 16px ${theme.fonts.ui};
  &:focus {
    outline: 2px solid ${theme.colors.gold};
  }
`;
const Actions = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;
const Submit = styled.button`
  width: 100%;
  margin-top: 8px;
  padding: 13px 16px;
  border: 0;
  border-radius: 2px;
  background: ${({ $secondary }) =>
    $secondary ? theme.colors.pitch : theme.colors.gold};
  color: ${theme.colors.paper};
  cursor: pointer;
  font: 700 15px ${theme.fonts.ui};
  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }
`;
const ErrorMessage = styled.p`
  margin: 12px 0 0;
  color: ${theme.colors.red};
  font: 14px ${theme.fonts.ui};
`;

export default function AuthGate() {
  const [mode, setMode] = useState("register");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!supabase) {
    return (
      <Screen>
        <Panel>
          <Kicker>Fantagazzetta</Kicker>
          <Title>Backend non configurato</Title>
          <Intro>
            Inserisci nel file .env i valori reali di VITE_SUPABASE_URL e
            VITE_SUPABASE_ANON_KEY, poi riavvia il server.
          </Intro>
        </Panel>
      </Screen>
    );
  }

  const submit = async (event) => {
    event.preventDefault();
    const name = username.trim();
    if (name.length < 2) {
      setError("Inserisci un nome utente di almeno 2 caratteri.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      sessionStorage.setItem(
        "Fantagazzetta_auth_mode",
        mode === "register" ? "register" : "login",
      );
      if (mode === "register") {
        const alreadyUsed = await usernameExists(name);
        if (alreadyUsed) throw new Error("Questo nome utente è già in uso.");
        const result = await supabase.auth.signInAnonymously();
        if (result.error) throw result.error;
        await saveUsername(name);
      } else {
        const result = await supabase.auth.signInAnonymously();
        if (result.error) throw result.error;
        const loggedIn = await loginWithUsername(name);
        if (!loggedIn) {
          await supabase.auth.signOut();
          throw new Error("Nome utente non trovato. Registrati prima.");
        }
      }
    } catch (submitError) {
      await supabase.auth.signOut();
      setError(submitError.message || "Impossibile completare l’operazione.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Panel>
        <Kicker>Fantagazzetta</Kicker>
        <Title>{mode === "register" ? "Registrati" : "Accedi"}</Title>
        <Intro>
          {mode === "register"
            ? "Crea il tuo profilo con un nome utente unico."
            : "Accedi con il nome utente già registrato."}
        </Intro>
        <form onSubmit={submit}>
          <Field
            type="text"
            placeholder="Nome utente"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
              setError("");
            }}
            required
          />
          <Actions>
            <Submit type="submit" disabled={busy}>
              {busy
                ? "Attendi..."
                : mode === "register"
                  ? "Registrati"
                  : "Accedi"}
            </Submit>
            <Submit
              type="button"
              $secondary
              disabled={busy}
              onClick={() => {
                setMode((current) =>
                  current === "register" ? "login" : "register",
                );
                setError("");
              }}
            >
              {mode === "register" ? "Ho già un account" : "Crea account"}
            </Submit>
          </Actions>
          {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
        </form>
      </Panel>
    </Screen>
  );
}
