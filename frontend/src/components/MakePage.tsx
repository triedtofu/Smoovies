import React from 'react';
import { useCookies } from 'react-cookie';

import Navbar from './Navbar';
import NavbarLoggedIn from './NavbarLoggedIn';
import NavbarAdmin from './NavbarAdmin';

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
        <Nav cookies={cookies} />
        <Component />
      </>
    )
  }

  return page;
};

export default MakePage;
