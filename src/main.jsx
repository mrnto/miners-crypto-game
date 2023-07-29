import React from 'react';
import ReactDOM from 'react-dom/client';
import { GlobalContextProvider } from './contexts/useGlobalContext';
import App from './App.jsx';
import './assets/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GlobalContextProvider>
    <App />
  </GlobalContextProvider>,
);