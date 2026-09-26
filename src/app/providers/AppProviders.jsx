import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import Store from '@/store';
import { LayoutProvider } from '@/app/providers/LayoutContext';

const AppProviders = ({ children }) => {
  useEffect(() => {
    try {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  return (
    <Provider store={Store}>
      <LayoutProvider>{children}</LayoutProvider>
    </Provider>
  );
};

export default AppProviders;
