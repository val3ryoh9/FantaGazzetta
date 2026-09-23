import React, { useState } from "react";
import { supabase } from "../../supabase/supabaseClient";
import {
  loginWithUsername,
  saveUsername,
  usernameExists,
} from "../../supabase/supabaseApi";
import {
  Screen,
  Panel,
  Kicker,
  Title,
  Intro,
  Field,
  Actions,
  Submit,
  ErrorMessage,
} from "./styled";

export const AuthGate = () => {
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
};
