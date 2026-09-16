import React, { useState } from "react";
import styled from "styled-components";
import { InputNumber, Button, Popconfirm, App as AntdApp } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { uid } from "../../utils";
import { theme } from '../../GlobalStyle'

const Head = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 18px;
  flex-wrap: wrap;
  gap: 10px;
`;
const Title = styled.h1`
  font-family: ${theme.fonts.serif};
  font-size: 28px;
  margin: 0;
  color: ${theme.colors.pitchDark};
`;
const Tools = styled.div`
  display: flex;
  gap: 10px;
`;
const TableWrap = styled.div`
  overflow-x: auto;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${theme.fonts.ui};
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.line};
`;
const Th = styled.th`
  background: ${theme.colors.pitchDark};
  color: ${theme.colors.paper};
  font-size: 12px;
  font-weight: 500;
  padding: 10px 8px;
  text-align: center;
  letter-spacing: 0.3px;
  &:nth-child(2) {
    text-align: left;
    padding-left: 14px;
  }
`;
const Td = styled.td`
  padding: 7px 8px;
  text-align: center;
  border-top: 1px solid ${theme.colors.line};
  font-size: 14px;
  font-variant-numeric: tabular-nums;
`;
const TeamTd = styled(Td)`
  text-align: left;
  padding-left: 14px;
  font-weight: 600;
  color: ${theme.colors.pitchDark};
  font-family: ${theme.fonts.serif};
  font-size: 15px;
`;
const PtTd = styled(Td)`
  font-weight: 700;
  color: ${theme.colors.goldDeep};
  background: rgba(199, 154, 61, 0.08);
`;
const Hint = styled.p`
  font-size: 12px;
  color: ${theme.colors.inkSoft};
  font-family: ${theme.fonts.ui};
  margin-top: 16px;
`;

const NUM_FIELDS = ["g", "v", "n", "p", "gf", "gs"];

export default function ClassificaPage({
  standings,
  onSaveStandings,
  canManage,
}) {
  const { message } = AntdApp.useApp();
  const [local, setLocal] = useState(standings);

  React.useEffect(() => setLocal(standings), [standings]);

  const sorted = [...local].sort((a, b) =>
    b.pt !== a.pt ? b.pt - a.pt : b.gf - b.gs - (a.gf - a.gs),
  );

  const updateField = (id, field, value) => {
    setLocal((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };
  const removeRow = (id) => {
    setLocal((prev) => prev.filter((r) => r.id !== id));
  };
  const addRow = () => {
    const name = window.prompt("Nome della squadra:");
    if (!name) return;
    setLocal((prev) => [
      ...prev,
      {
        id: uid(),
        team: name.trim(),
        pt: 0,
        g: 0,
        v: 0,
        n: 0,
        p: 0,
        gf: 0,
        gs: 0,
      },
    ]);
  };
  const handleSave = async () => {
    const ok = await onSaveStandings(local);
    message.success(
      ok ? "Classifica salvata e riordinata" : "Errore nel salvataggio",
    );
  };

  return (
    <div>
      <Head>
        <Title>Classifica</Title>
        <Tools>
          {canManage && <Button onClick={addRow}>+ Aggiungi squadra</Button>}
          {canManage && (
            <Button type="primary" onClick={handleSave}>
              Salva classifica
            </Button>
          )}
        </Tools>
      </Head>

      <TableWrap>
        <Table>
          <thead>
            <tr>
              <Th>#</Th>
              <Th>Squadra</Th>
              <Th>Pt</Th>
              <Th>G</Th>
              <Th>V</Th>
              <Th>N</Th>
              <Th>P</Th>
              <Th>Gf</Th>
              <Th>Gs</Th>
              <Th>Dr</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const dr = (row.gf || 0) - (row.gs || 0);
              return (
                <tr key={row.id}>
                  <Td>{i + 1}</Td>
                  <TeamTd>{row.team}</TeamTd>
                  <PtTd>
                    <InputNumber
                      disabled={!canManage}
                      size="small"
                      min={0}
                      value={row.pt}
                      onChange={(v) => updateField(row.id, "pt", v || 0)}
                      style={{ width: 56 }}
                    />
                  </PtTd>
                  {NUM_FIELDS.map((f) => (
                    <Td key={f}>
                      <InputNumber
                        disabled={!canManage}
                        size="small"
                        min={0}
                        value={row[f]}
                        onChange={(v) => updateField(row.id, f, v || 0)}
                        style={{ width: 56 }}
                      />
                    </Td>
                  ))}
                  <Td>{dr > 0 ? `+${dr}` : dr}</Td>
                  {canManage && (
                    <Td>
                      <Popconfirm
                        title="Rimuovere questa squadra dalla classifica?"
                        okText="Rimuovi"
                        cancelText="Annulla"
                        onConfirm={() => removeRow(row.id)}
                      >
                        <Button
                          size="small"
                          type="text"
                          danger
                          icon={<CloseOutlined />}
                        />
                      </Popconfirm>
                    </Td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableWrap>

      <Hint>
        I punti determinano l&apos;ordine: alla pressione di &quot;Salva
        classifica&quot; le squadre vengono riordinate automaticamente.
      </Hint>
    </div>
  );
}
