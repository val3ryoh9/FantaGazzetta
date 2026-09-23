import React, { useState } from "react";
import {
  Screen,
  Panel,
  Kicker,
  Title,
  Intro,
  FieldLabel,
  Select,
  Password,
  Submit,
  ExitButton,
  ErrorMessage,
} from "./styled";

export const LeagueGate = ({
  leagues,
  onSelect,
  onExit,
  requiresPassword,
  initialLeagueId,
}) => {
  const [selectedId, setSelectedId] = useState(
    initialLeagueId || leagues[0]?.id || "",
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  React.useEffect(() => {
    if (
      leagues.length > 0 &&
      !leagues.some((league) => league.id === selectedId)
    ) {
      setSelectedId(initialLeagueId || leagues[0].id);
    }
  }, [initialLeagueId, leagues, selectedId]);

  const submit = async (event) => {
    event.preventDefault();
    const league = leagues.find((item) => item.id === selectedId);
    if (!league) return;

    setBusy(true);
    setError("");
    try {
      await onSelect(league, requiresPassword ? password : undefined);
    } catch (submitError) {
      setError(submitError.message || "Impossibile entrare nella lega.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Panel>
        <Kicker>Fantagazzetta</Kicker>
        <Title>Scegli la tua lega</Title>
        <Intro>
          {requiresPassword
            ? "Inserisci la password della lega per entrare nel fantacampionato."
            : "Scegli la lega a cui vuoi accedere."}
        </Intro>
        <form onSubmit={submit}>
          <FieldLabel htmlFor="league">Lega</FieldLabel>
          <Select
            id="league"
            value={selectedId}
            onChange={(event) => {
              setSelectedId(event.target.value);
              setError("");
            }}
            required
          >
            {leagues.map((league) => (
              <option key={league.id} value={league.id}>
                {league.name}
              </option>
            ))}
          </Select>
          {requiresPassword && (
            <Password
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              placeholder="Password della lega"
              aria-label="Password della lega"
              required
            />
          )}
          <Submit type="submit" disabled={!selectedId || busy}>
            {busy ? "Verifica..." : "Entra nella lega"}
          </Submit>
          {error && <ErrorMessage role="alert">{error}</ErrorMessage>}
        </form>
        <ExitButton type="button" onClick={onExit}>
          EXIT
        </ExitButton>
      </Panel>
    </Screen>
  );
};
