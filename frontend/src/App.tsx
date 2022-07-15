import React from 'react';
import { HashRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

import Router from './Router';

const App = () => {
  return (
    <CookiesProvider>
      <HashRouter>
        <Router />
      </HashRouter>
    </CookiesProvider>
  );
};

export default App;
