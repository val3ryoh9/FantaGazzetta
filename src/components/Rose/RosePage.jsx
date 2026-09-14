import React, { useState } from "react";
import styled from "styled-components";
import {
  Input,
  Select,
  InputNumber,
  Button,
  Popconfirm,
  App as AntdApp,
} from "antd";
import { PlusOutlined, DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import { uid } from "../../utils";

const Head = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 10px;
`;
const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 28px;
  margin: 0;
  color: ${({ theme }) => theme.colors.pitchDark};
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 22px;
`;
const Card = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
`;
const CardHead = styled.div`
  background: ${({ theme }) => theme.colors.pitch};
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  .ant-input {
    background: transparent;
    border: none;
    border-bottom: 1px solid transparent;
    color: ${({ theme }) => theme.colors.paper};
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 18px;
    font-weight: 600;
    padding: 2px 0;
  }
  .ant-input:focus,
  .ant-input:hover {
    border-bottom-color: ${({ theme }) => theme.colors.gold};
    box-shadow: none;
  }
`;
const PlayerList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 6px 0;
`;
const PlayerRow = styled.li`
  display: grid;
  grid-template-columns: 30px 1fr 120px 90px 28px;
  gap: 8px;
  align-items: center;
  padding: 6px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.paperDim};
  &:first-child {
    border-top: none;
  }
`;
const RoleBadge = styled.span`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.ui};
  background: ${({ $role }) =>
    $role === "P"
      ? "#4C7A5E"
      : $role === "D"
        ? "#3E6C9E"
        : $role === "C"
          ? "#9C7A2C"
          : "#8C3B32"};
`;
const CardFoot = styled.div`
  padding: 10px 16px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  border-top: 1px solid ${({ theme }) => theme.colors.paperDim};
  margin-top: auto;
`;
const AddTeamCard = styled.div`
  border: 1.5px dashed ${({ theme }) => theme.colors.line};
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  color: ${({ theme }) => theme.colors.inkSoft};
  font-family: ${({ theme }) => theme.fonts.ui};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    border-color: ${({ theme }) => theme.colors.pitch};
    color: ${({ theme }) => theme.colors.pitch};
  }
`;
const Hint = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.inkSoft};
  font-family: ${({ theme }) => theme.fonts.ui};
  margin-top: 14px;
`;

const ROLES = ["P", "D", "C", "A"];

export default function RosePage({ rosters, onSaveRosters, canManage }) {
  const { message } = AntdApp.useApp();
  const [local, setLocal] = useState(rosters);

  // se cambiano i dati esterni (es. al primo caricamento) sincronizza la copia locale
  React.useEffect(() => setLocal(rosters), [rosters]);

  const updateTeamName = (teamId, name) => {
    setLocal((prev) => prev.map((t) => (t.id === teamId ? { ...t, name } : t)));
  };
  const updatePlayer = (teamId, playerId, field, value) => {
    setLocal((prev) =>
      prev.map((t) =>
        t.id !== teamId
          ? t
          : {
              ...t,
              players: t.players.map((p) =>
                p.id === playerId ? { ...p, [field]: value } : p,
              ),
            },
      ),
    );
  };
  const addPlayer = (teamId) => {
    setLocal((prev) =>
      prev.map((t) =>
        t.id !== teamId
          ? t
          : {
              ...t,
              players: [
                ...t.players,
                { id: uid(), name: "", role: "C", price: 0 },
              ],
            },
      ),
    );
  };
  const removePlayer = (teamId, playerId) => {
    setLocal((prev) =>
      prev.map((t) =>
        t.id !== teamId
          ? t
          : { ...t, players: t.players.filter((p) => p.id !== playerId) },
      ),
    );
  };
  const removeTeam = (teamId) => {
    setLocal((prev) => prev.filter((t) => t.id !== teamId));
  };
  const addTeam = () => {
    const name = window.prompt("Nome della nuova squadra:");
    if (!name) return;
    setLocal((prev) => [
      ...prev,
      { id: uid(), name: name.trim(), players: [] },
    ]);
  };
  const handleSave = async () => {
    const ok = await onSaveRosters(local);
    message.success(ok ? "Rose salvate" : "Errore nel salvataggio");
  };

  return (
    <div>
      <Head>
        <Title>Rose della lega</Title>
        {canManage && (
          <Button type="primary" onClick={handleSave}>
            Salva rose
          </Button>
        )}
      </Head>

      <Grid>
        {local.map((team) => (
          <Card key={team.id}>
            <CardHead>
              <Input
                disabled={!canManage}
                value={team.name}
                onChange={(e) => updateTeamName(team.id, e.target.value)}
                variant="borderless"
              />
            </CardHead>

            <PlayerList>
              {team.players.map((p) => (
                <PlayerRow key={p.id}>
                  <RoleBadge $role={p.role}>{p.role}</RoleBadge>
                  <Input
                    disabled={!canManage}
                    size="small"
                    placeholder="Nome giocatore"
                    value={p.name}
                    onChange={(e) =>
                      updatePlayer(team.id, p.id, "name", e.target.value)
                    }
                    variant="borderless"
                  />
                  <Select
                    disabled={!canManage}
                    size="small"
                    value={p.role}
                    onChange={(val) => updatePlayer(team.id, p.id, "role", val)}
                    options={ROLES.map((r) => ({ value: r, label: r }))}
                    variant="borderless"
                  />
                  <InputNumber
                    disabled={!canManage}
                    size="small"
                    min={0}
                    value={p.price}
                    onChange={(val) =>
                      updatePlayer(team.id, p.id, "price", val || 0)
                    }
                    style={{ width: "100%" }}
                  />
                  {canManage && (
                    <Button
                      size="small"
                      type="text"
                      icon={<CloseOutlined />}
                      onClick={() => removePlayer(team.id, p.id)}
                    />
                  )}
                </PlayerRow>
              ))}
            </PlayerList>

            <CardFoot>
              {canManage && (
                <Button
                  size="small"
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => addPlayer(team.id)}
                >
                  Aggiungi giocatore
                </Button>
              )}
              {canManage && (
                <Popconfirm
                  title="Eliminare questa squadra e la sua rosa?"
                  okText="Elimina"
                  cancelText="Annulla"
                  onConfirm={() => removeTeam(team.id)}
                >
                  <Button
                    size="small"
                    danger
                    type="text"
                    icon={<DeleteOutlined />}
                  >
                    Elimina squadra
                  </Button>
                </Popconfirm>
              )}
            </CardFoot>
          </Card>
        ))}

        {canManage && (
          <AddTeamCard onClick={addTeam}>+ Aggiungi squadra</AddTeamCard>
        )}
      </Grid>

      <Hint>
        Modifica nomi, ruoli e prezzi nei campi, poi premi &quot;Salva
        rose&quot; per confermare.
      </Hint>
    </div>
  );
}
