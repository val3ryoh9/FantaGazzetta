import React from 'react';
import {
  Box,
  Head,
  Title,
  Table,
  Td,
  Empty,
  Foot,
  FootLink,
} from "./styled";
import { getTopStandings } from "./utils";

export const MiniClassifica = ({ standings, onGoToClassifica }) => {
  const sorted = getTopStandings(standings);

  return (
    <Box>
      <Head><Title>Classifica</Title></Head>
      <Table>
        <tbody>
          {sorted.length === 0 && (
            <tr><Empty colSpan={3}>Nessun dato</Empty></tr>
          )}
          {sorted.map((row, i) => (
            <tr key={row.id}>
              <Td>{i + 1}</Td>
              <Td>{row.team}</Td>
              <Td>{row.pt}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Foot>
        <FootLink onClick={onGoToClassifica}>Vedi la classifica completa &rarr;</FootLink>
      </Foot>
    </Box>
  );
};
