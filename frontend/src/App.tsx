import React from 'react';
import { HashRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

import { Context } from './context';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import Router from './Router';

const App = () => {
  const ColorModeContext = Context;

  const [mode, setMode] = React.useState<'light' | 'dark'>('light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <CookiesProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <HashRouter>
            <Router />
          </HashRouter>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </CookiesProvider>
  );
};

export default App;
