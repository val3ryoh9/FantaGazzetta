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
