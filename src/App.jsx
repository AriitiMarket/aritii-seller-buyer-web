import React from 'react';
import AppProviders from '@/app/providers/AppProviders';
import AppRoutes from '@/app/routes/AppRoutes';
import { useAppBootstrap } from '@/shared/hooks/useAppBootstrap';
import '@/App.css';

/**
 * App — root component.
 *
 * App.jsx          → providers (store + layout context) + session bootstrap
 * routes/AppRoutes → route composition root, one subtree per domain
 */
const App = () => {
  useAppBootstrap();

  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
};

export default App;