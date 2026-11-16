import React from 'react';
import { Provider } from 'react-redux';
import Store from '@/store';
import { LayoutProvider } from '@/app/providers/LayoutContext';
import { ThemeProvider } from '@/app/providers/ThemeContext';

const AppProviders = ({ children }) => {
  return (
    <Provider store={Store}>
      <ThemeProvider>
        <LayoutProvider>{children}</LayoutProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default AppProviders;
