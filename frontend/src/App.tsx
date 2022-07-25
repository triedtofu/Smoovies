import React from 'react';
import { HashRouter, Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { HelmetProvider } from 'react-helmet-async';

import { Context } from './context';

import CssBaseline from '@mui/material/CssBaseline';
import { StyledEngineProvider, ThemeProvider, createTheme } from '@mui/material/styles';

import { LinkProps } from '@mui/material/Link';

import Router from './Router';

const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

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
        components: {
          MuiLink: {
            defaultProps: {
              component: LinkBehavior,
            } as LinkProps,
          },
          MuiButtonBase: {
            defaultProps: {
              LinkComponent: LinkBehavior,
            },
          },
        }
      }),
    [mode],
  );

  return (
    <CookiesProvider>
      <StyledEngineProvider injectFirst>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <HashRouter>
              <HelmetProvider>
                <Router />
              </HelmetProvider>
            </HashRouter>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </StyledEngineProvider>
    </CookiesProvider>
  );
};

export default App;
