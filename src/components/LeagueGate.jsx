import React, { useState } from "react";
import styled from "styled-components";

const Screen = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 20px;
  background:
    linear-gradient(rgba(22, 48, 42, 0.94), rgba(35, 75, 61, 0.9)),
    ${({ theme }) => theme.colors.pitch};
`;

const Panel = styled.section`
  width: min(100%, 480px);
  padding: 42px 40px;
  background: ${({ theme }) => theme.colors.paper};
  border-top: 5px solid ${({ theme }) => theme.colors.gold};
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.24);

  @media (max-width: 520px) {
    padding: 32px 24px;
  }
`;

const Kicker = styled.p`
  margin: 0 0 8px;
  color: ${({ theme }) => theme.colors.goldDeep};
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
`;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.pitchDark};
  font-size: clamp(30px, 7vw, 42px);
  line-height: 1.05;
`;

const Intro = styled.p`
  margin: 14px 0 28px;
  color: ${({ theme }) => theme.colors.inkSoft};
  font-size: 17px;
  line-height: 1.5;
`;

const FieldLabel = styled.label`
  display: block;
  margin: 0 0 8px;
  color: ${({ theme }) => theme.colors.ink};
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: 13px;
  font-weight: 700;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.ink};
  font: 16px ${({ theme }) => theme.fonts.ui};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.gold};
  }
`;

const Password = styled.input`
  width: 100%;
  margin-top: 18px;
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.ink};
  font: 16px ${({ theme }) => theme.fonts.ui};

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.gold};
  }
`;

const Submit = styled.button`
  width: 100%;
  margin-top: 22px;
  padding: 13px 16px;
  border: 0;
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.gold};
  color: ${({ theme }) => theme.colors.pitchDark};
  cursor: pointer;
  font: 700 15px ${({ theme }) => theme.fonts.ui};

  &:hover {
    background: ${({ theme }) => theme.colors.goldDeep};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

const ExitButton = styled.button`
  display: block;
  margin: 18px auto 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.red};
  cursor: pointer;
  font: 700 14px ${({ theme }) => theme.fonts.ui};

  &:hover {
    color: #ba3d2b;
  }
`;

const ErrorMessage = styled.p`
  margin: 12px 0 0;
  color: ${({ theme }) => theme.colors.red};
  font: 14px ${({ theme }) => theme.fonts.ui};
`;

export default function LeagueGate({
  leagues,
  onSelect,
  onExit,
  requiresPassword,
  initialLeagueId,
}) {
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
}
