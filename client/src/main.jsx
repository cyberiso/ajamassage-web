import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { HelmetProvider } from 'react-helmet-async'; // HelmetProvider eklendi
import theme from './theme'; // Tema dosyan
import App from './App';
import './i18n'; // i18n konfigürasyonunu import et

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider> {/* HelmetProvider ile sarmala */}
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);
