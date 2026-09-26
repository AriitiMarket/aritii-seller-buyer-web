import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import '@/styles/globals.css';

/**
 * Application entry point.
 *
 * main.jsx  → App.jsx  → routes/AppRoutes.jsx  → <Domain>Routes.jsx
 * Store/context providers are composed in App.jsx.
 */
const container = document.getElementById('root');

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
