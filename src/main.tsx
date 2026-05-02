import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { LocaleProvider } from './i18n.tsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <LocaleProvider>
    <App />
  </LocaleProvider>
);
