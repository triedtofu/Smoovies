import React from 'react';
import { HashRouter, Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { CookiesProvider, useCookies } from 'react-cookie';
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

const bodyOverride = {
  styleOverrides: {
    body: {
      background: 'linear-gradient(45deg,#ffe5b4, #c7c7da)'
    }
  }
}

const appBarOverride = {
  styleOverrides: {
    root: {
      background: 'linear-gradient(to right, #bff2f8, #c8a2c8);'
    }
  }
}

const App = () => {
  const ColorModeContext = Context;
  const [cookies, setCookie] = useCookies();

  const [mode, setMode] = React.useState<'light' | 'dark'>('light');

  React.useEffect(() => {
    if (cookies.mode) setMode(cookies.mode);
  }, []);

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(prevMode => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          setCookie("mode", newMode, { path: '/' });
          return newMode;
        });
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
          MuiCssBaseline: (mode === "light") ? bodyOverride : {},
          MuiAppBar: (mode === "light") ? appBarOverride : {},
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
