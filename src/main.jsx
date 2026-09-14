import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, App as AntApp } from 'antd';
import { ThemeProvider } from 'styled-components';
import 'antd/dist/reset.css';
import { theme, antdTheme } from './theme';
import GlobalStyle from './GlobalStyle';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={antdTheme}>
      {/* AntApp fornisce il contesto per message/Modal/notification di antd v5 */}
      <AntApp>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <App />
        </ThemeProvider>
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>
);
