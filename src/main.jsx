import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import '@/styles/globals.css';

/**
 * Auto-recover when a new deployment creates new chunk hashes
 * while an existing browser tab attempts to load a dynamically imported module.
 */
function handleChunkReload() {
  const lastReload = Number(sessionStorage.getItem('chunk_reload') || 0);
  if (Date.now() - lastReload > 10000) {
    sessionStorage.setItem('chunk_reload', String(Date.now()));
    window.location.reload();
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    event?.preventDefault?.();
    handleChunkReload();
  });

  window.addEventListener('error', (event) => {
    const msg = String(event?.message || '');
    if (
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Importing a module script failed') ||
      msg.includes('Expected a JavaScript-or-Wasm module script')
    ) {
      handleChunkReload();
    }
  });
}

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
