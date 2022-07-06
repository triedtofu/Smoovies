import React from 'react';
import { useCookies } from 'react-cookie';

import Navbar from './Navbar';
import NavbarLoggedIn from './NavbarLoggedIn';

import { parseJwt } from '../util/helper';

// const Nav = (token) => {
//   if (token)
//     return <NavbarLoggedIn />
//   else
// }

const MakePage = (Component: React.ElementType) => {
  const page = () => {
    const [cookies, , removeCookie] = useCookies();

    const logout = () => {
      removeCookie('token', { path: '/' });
      removeCookie('name', { path: '/' });
      window.location.reload();
    }
    
    return (
      <>
        {cookies.token ?
          <NavbarLoggedIn
            name={cookies.name}
            logout={logout}
            id={parseInt(parseJwt(cookies.token).jti)}
          /> :
          <Navbar />
        }
        <Component />
      </>
    )
  }

  return page;
};

export default MakePage;
