import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *{ box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body{
    background: ${({ theme }) => theme.colors.paper};
    color: ${({ theme }) => theme.colors.ink};
    font-family: ${({ theme }) => theme.fonts.serif};
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3 { font-family: ${({ theme }) => theme.fonts.display}; }
  a { color: inherit; text-decoration: none; }
  img { max-width: 100%; display: block; }

  /* antd usa Inter per i propri componenti, coerente col resto della UI */
  .ant-form, .ant-input, .ant-select, .ant-btn, .ant-table, .ant-upload {
    font-family: ${({ theme }) => theme.fonts.ui};
  }
`;

export default GlobalStyle;

export const theme = {
  colors: {
    pitchDark: '#16302A',
    pitch: '#234B3D',
    paper: '#F4F1E6',
    paperDim: '#ECE7D6',
    ink: '#1B211D',
    inkSoft: '#4B554E',
    gold: '#C79A3D',
    goldDeep: '#9C7A2C',
    white: '#FFFFFF',
    red: '#8C3B32',
    line: 'rgba(27,33,29,0.14)'
  },
  fonts: {
    display: "'Oswald', 'Inter', sans-serif",
    serif: "'Source Serif 4', Georgia, serif",
    ui: "'Inter', sans-serif"
  }
};

export const antdTheme = {
  token: {
    colorPrimary: theme.colors.gold,
    colorLink: theme.colors.pitch,
    colorText: theme.colors.ink,
    fontFamily: theme.fonts.ui,
    borderRadius: 2,
    colorBorder: theme.colors.line
  },
  components: {
    Button: {
      colorPrimary: theme.colors.gold,
      algorithm: true
    },
    Table: {
      headerBg: theme.colors.pitchDark,
      headerColor: theme.colors.paper
    }
  }
};