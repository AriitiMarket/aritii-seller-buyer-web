import { createContext, useContext, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

import themeTokens from '@/styles/theme';

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const value = useMemo(() => ({ theme, setTheme, colors: themeTokens.colors }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
