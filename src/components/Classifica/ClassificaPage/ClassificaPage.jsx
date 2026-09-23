import React, { useState } from "react";
import { InputNumber, Button, Popconfirm, App as AntdApp } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import {
  Head,
  Title,
  Tools,
  TableWrap,
  Table,
  Th,
  Td,
  TeamTd,
  PtTd,
  Hint,
} from "./styled";
import { NUM_FIELDS, sortStandings, createStandingRow } from "./utils";

export const ClassificaPage = ({
  standings,
  onSaveStandings,
  canManage,
}) => {
  const { message } = AntdApp.useApp();
  const [local, setLocal] = useState(standings);

  React.useEffect(() => setLocal(standings), [standings]);

  const sorted = sortStandings(local);

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
    setLocal((prev) => [...prev, createStandingRow(name)]);
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
};
