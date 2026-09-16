import React from 'react';
import styled from 'styled-components';
import { theme } from '../../GlobalStyle'

const Box = styled.aside`
  border: 1px solid ${theme.colors.line};
  border-top: 3px solid ${theme.colors.pitch};
  background: ${theme.colors.white};
`;
const Head = styled.div`
  padding: 14px 16px 10px;
`;
const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.pitchDark};
  letter-spacing: 0.2px;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${theme.fonts.ui};
`;
const Td = styled.td`
  padding: 7px 16px;
  font-size: 13.5px;
  border-top: 1px solid ${theme.colors.line};
  &:first-child { color: ${theme.colors.inkSoft}; width: 26px; }
  &:last-child { text-align: right; font-weight: 600; color: ${theme.colors.pitchDark}; font-variant-numeric: tabular-nums; }
`;
const Empty = styled.td`
  color: ${theme.colors.inkSoft};
  text-align: center;
  padding: 16px;
`;
const Foot = styled.div`
  padding: 10px 16px 14px;
`;
const FootLink = styled.a`
  font-size: 12.5px;
  color: ${theme.colors.pitch};
  font-weight: 600;
  cursor: pointer;
  &:hover { text-decoration: underline; }
`;

export default function MiniClassifica({ standings, onGoToClassifica }) {
  const sorted = [...standings]
    .sort((a, b) => (b.pt !== a.pt ? b.pt - a.pt : b.gf - b.gs - (a.gf - a.gs)))
    .slice(0, 6);

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
}
