import React from 'react';
import AppProviders from '@/app/providers/AppProviders';
import AppRoutes from '@/app/routes/AppRoutes';
import '@/App.css';

/**
 * App — root component.
 *
 * App.jsx          → providers (store + layout context)
 * routes/AppRoutes → route composition root + session bootstrap, one subtree per domain
 */
const App = () => {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
};

export default App;