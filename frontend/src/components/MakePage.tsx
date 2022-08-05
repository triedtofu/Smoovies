import React from 'react';
import { useCookies } from 'react-cookie';
import { Helmet } from 'react-helmet-async';

import Navbar from './NewNavbar';
import NavbarLoggedIn from './NewNavbarLoggedIn';
import NavbarAdmin from './NewNavbarAdmin';

import { parseJwt } from '../util/helper';

const MakePage = (Component: React.ElementType) => {
  const page = () => {
    const [cookies, , removeCookie] = useCookies();

    const logout = () => {
      removeCookie('token', { path: '/' });
      removeCookie('name', { path: '/' });
      removeCookie('admin', { path: '/' });
      window.location.reload();
    }

    const Nav = ({ cookies }: { cookies: {[x: string]: any }}) => {
      if (cookies.token && cookies.admin) {
        return (
          <NavbarAdmin
            name={cookies.name}
            logout={logout}
          />
        );
      } else if (cookies.token) {
        return (
          <NavbarLoggedIn
            name={cookies.name}
            logout={logout}
            id={parseInt(parseJwt(cookies.token).jti)}
          />
        )
      } else {
        return <Navbar />;
      }
    }
    
    return (
      <>
        <Helmet>
          <title>Smoovies</title>
        </Helmet>
        <Nav cookies={cookies} />
        <Component />
      </>
    )
  }

  return page;
};

export default MakePage;
