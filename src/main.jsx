import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, App as AntApp } from 'antd';
import { ThemeProvider } from 'styled-components';
import 'antd/dist/reset.css';
import GlobalStyle, { theme, antdTheme } from './GlobalStyle';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfigProvider theme={antdTheme}>
      <AntApp>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <App />
        </ThemeProvider>
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>
);
